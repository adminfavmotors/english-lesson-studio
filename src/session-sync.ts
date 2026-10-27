import { emptyDocument, parseDocument } from './store-model.ts';
import type { Document, Value } from './store-model.ts';
import { readSession, writeSession, SessionError } from './session-api.ts';
import type { SessionCredentials, SessionData, SessionRole, Operation } from './session-api.ts';

export type SyncStatus = 'connecting' | 'online' | 'saving' | 'offline' | 'error';
export type SyncSnapshot = {
  document: Document; role: SessionRole | null; status: SyncStatus; revision: number;
  pendingCount: number; studentToken: string | null; notice: string; storageError: boolean;
};
type Transport = { read: typeof readSession; write: typeof writeSession };
type Cache = { getItem(key: string): string | null; setItem(key: string, value: string): void };
const exOf = (key: string) => key.split('.')[0];

export function overlayOperations(base: Document, epochs: Record<string, number>, operations: Operation[]): Document {
  const fields = { ...base.fields }; const currentEpochs = { ...epochs };
  for (const op of operations) {
    const stamp = (value: Value) => ({value,time:Number.MAX_SAFE_INTEGER,writer:op.id});
    if (op.action !== 'patch') {
      for (let n=1;n<=14;n++) {
        const ex = `ex${n}`;
        if (op.action === 'reset_all' || op.exercise === ex) {
          for (const key of Object.keys(fields)) if (exOf(key) === ex) fields[key] = stamp(null);
          fields[`${ex}.complete`] = stamp(false); currentEpochs[ex] = (currentEpochs[ex] ?? 0) + 1;
        }
      }
    } else for (const [key, value] of Object.entries(op.values)) {
      if ((op.epochs[exOf(key)] ?? 0) !== (currentEpochs[exOf(key)] ?? 0)) continue;
      fields[key] = stamp(value);
      if (key.includes('.answer.') && !key.endsWith('.grade') && !(`${key}.grade` in op.values)) fields[`${key}.grade`] = stamp(null);
    }
  }
  return {version:1,fields};
}

export class SessionSync {
  credentials: SessionCredentials;
  private serverDocument = emptyDocument();
  private epochs: Record<string, number> = {};
  private operations: Operation[] = [];
  private listeners = new Set<() => void>();
  private snapshot: SyncSnapshot = {document:emptyDocument(),role:null,status:'connecting',revision:-1,pendingCount:0,studentToken:null,notice:'',storageError:false};
  private transport: Transport;
  private cache?: Cache;
  private cacheKey: string;
  private timer?: ReturnType<typeof setTimeout>;
  private busy = false;
  private stopped = false;
  private inFlightId: string | null = null;
  private failures = 0;
  private blockedOperation: string | null = null;
  private clockOffset = 0;
  constructor(credentials: SessionCredentials, options: {transport?: Transport; cache?: Cache; clientId?: string} = {}) {
    this.credentials = credentials; this.transport = options.transport ?? {read:readSession,write:writeSession}; this.cache = options.cache;
    if(typeof window!=='undefined' && !this.cache) this.snapshot={...this.snapshot,storageError:true};
    // Per-tab queues survive refresh without mixing unsent work from other tabs.
    this.cacheKey = `lesson-cloud.v1.${credentials.id}.${credentials.token.slice(0,12)}.${options.clientId ?? 'client'}`;
    try {
      const raw = this.cache?.getItem(this.cacheKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.version === 1) {
          this.serverDocument = parseDocument(JSON.stringify(saved.document));
          this.epochs = saved.epochs ?? {};
          this.operations = Array.isArray(saved.operations) ? saved.operations.filter((op: Operation) => op && typeof op.id === 'string' && ['patch','reset_exercise','reset_all'].includes(op.action) && op.epochs && op.values) : [];
          // Cached work survives reload; access is established by the next server response.
          this.snapshot = {...this.snapshot,revision:Number.isSafeInteger(saved.revision) ? saved.revision : -1};
        }
      }
    } catch { this.snapshot = {...this.snapshot,storageError:true}; }
    this.refreshView();
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => {this.listeners.delete(listener);}; };
  getSnapshot = () => this.snapshot;
  now = () => Math.round(Date.now() + this.clockOffset);
  private refreshView(changes: Partial<SyncSnapshot> = {}) {
    const doc = overlayOperations(this.serverDocument, this.epochs, this.operations);
    const document = JSON.stringify(doc) === JSON.stringify(this.snapshot.document) ? this.snapshot.document : doc;
    this.snapshot = {...this.snapshot,...changes,document,pendingCount:this.operations.length};
    this.listeners.forEach(fn=>fn());
  }
  private save() {
    if(!this.cache) return;
    try {
      this.cache?.setItem(this.cacheKey,JSON.stringify({version:1,document:this.serverDocument,epochs:this.epochs,operations:this.operations,role:this.snapshot.role,revision:this.snapshot.revision,studentToken:this.snapshot.studentToken}));
      if(this.snapshot.storageError) this.snapshot={...this.snapshot,storageError:false};
    } catch { this.snapshot={...this.snapshot,storageError:true}; }
  }
  private predictedEpochs() {
    const epochs = {...this.epochs};
    for(const op of this.operations) if(op.action !== 'patch') for(let n=1;n<=14;n++) {
      const ex=`ex${n}`; if(op.action==='reset_all'||op.exercise===ex) epochs[ex]=(epochs[ex]??0)+1;
    }
    return epochs;
  }
  enqueue(values: Record<string,Value>, action: Operation['action'] = 'patch', exercise: string|null = null) {
    if(!this.snapshot.role || this.snapshot.status==='error') return;
    const last=this.operations.at(-1); const epochs=this.predictedEpochs();
    if(action==='patch' && last?.action==='patch' && last.id!==this.inFlightId && JSON.stringify(last.epochs)===JSON.stringify(epochs)) last.values={...last.values,...values};
    else this.operations.push({id:crypto.randomUUID(),action,exercise,values,epochs});
    this.refreshView({status:this.snapshot.status==='offline'?'offline':'saving',notice:''}); this.save(); this.schedule(350);
  }
  private adopt(data: SessionData, started: number) {
    if(data.document && data.revision >= this.snapshot.revision) this.serverDocument=data.document;
    if(data.revision >= this.snapshot.revision) {
      this.epochs=data.epochs;
      this.snapshot={...this.snapshot,role:data.role,revision:data.revision,studentToken:data.role==='teacher'?data.student_token??null:null};
    }
    const offset=data.server_time-(started+Date.now())/2;
    if(this.clockOffset===0 || Math.abs(this.clockOffset-offset)>2000) this.clockOffset=offset;
    if(data.discarded?.length) this.snapshot={...this.snapshot,notice:'This exercise was reset. Older unsaved changes were not applied.'};
  }
  async syncOnce() {
    if(this.busy || this.stopped) return;
    this.busy=true;
    const operation=this.operations[0]; this.inFlightId=operation?.id ?? null;
    const started=Date.now(); const didWrite=!!operation && !!this.snapshot.role;
    try {
      // Always authenticate/load before the first pending write after a reload.
      const data=didWrite ? await this.transport.write(this.credentials,operation!) : await this.transport.read(this.credentials,this.snapshot.revision);
      if(this.stopped) return;
      this.adopt(data,started);
      if(didWrite && operation && this.inFlightId===operation.id && this.operations[0]?.id===operation.id) this.operations.shift();
      this.failures=0; this.refreshView({status:this.operations.length?'saving':'online'}); this.save();
    } catch(error) {
      if(this.stopped) return;
      this.failures++;
      const permanent=error instanceof SessionError && [400,401,403,404,413,429].includes(error.status);
      this.blockedOperation=permanent?operation?.id??null:null;
      this.refreshView({status:permanent?'error':'offline',notice:permanent ? (error as Error).message : 'Connection lost. Your changes are kept in this browser and will be saved when you reconnect.'}); this.save();
    } finally {this.busy=false;this.inFlightId=null;}
  }
  private schedule(delay: number) {
    if(this.stopped) return;
    clearTimeout(this.timer);
    this.timer=setTimeout(async()=>{
      await this.syncOnce();
      if(this.snapshot.status==='error' || this.stopped) return;
      const delay=this.operations.length && this.failures===0 ? 50 : this.failures ? Math.min(30000,1500*2**Math.min(this.failures,4)) : typeof document!=='undefined' && document.hidden ? 4000 : 1000;
      this.schedule(delay);
    },delay);
  }
  start() {this.stopped=false;this.schedule(0);}
  retry = () => {this.failures=0;this.refreshView({status:'connecting'});this.schedule(0);};
  discardBlocked = () => {
    if(this.blockedOperation) this.operations=this.operations.filter(op=>op.id!==this.blockedOperation);
    this.blockedOperation=null;this.save();this.retry();
  };
  stop() {this.stopped=true;clearTimeout(this.timer);}
}
