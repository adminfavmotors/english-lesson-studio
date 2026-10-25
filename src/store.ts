import { useSyncExternalStore } from 'react';
import { emptyDocument, parseDocument, mergeDocuments } from './store-model.ts';
import type { Document, Value } from './store-model.ts';
import { SessionSync } from './session-sync.ts';
import { parseSessionUrl } from './session-api.ts';
export { parseDocument, mergeDocuments } from './store-model.ts';
export type { Document, Entry, Value } from './store-model.ts';

export const STORAGE_KEY = 'lesson-studio.unit14.v1';
let memory = emptyDocument();
let storageError = false;
const writer = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36);
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(fn => fn());
export let sharedSession: SessionSync | null = null;
export let sessionUrlError = '';

function read(): Document {
  try { return parseDocument(localStorage.getItem(STORAGE_KEY)); }
  catch { storageError = true; return emptyDocument(); }
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); storageError = false; }
  catch { storageError = true; }
}
let channel: BroadcastChannel | undefined;
if (typeof window !== 'undefined') {
  try {
    const credentials = parseSessionUrl(location.href);
    if (credentials) {
      let cache: Storage | undefined; let clientId: string=writer;
      try { cache=localStorage; clientId=sessionStorage.getItem('lesson-cloud-tab') ?? writer; sessionStorage.setItem('lesson-cloud-tab',clientId); } catch { /* in-memory sync remains usable */ }
      sharedSession = new SessionSync(credentials,{cache,clientId}); sharedSession.start();
      const retry=()=>sharedSession?.retry(); window.addEventListener('online',retry);
      import.meta.hot?.dispose(()=>{sharedSession?.stop();window.removeEventListener('online',retry);});
    }
  } catch(error) {sessionUrlError=(error as Error).message;}
  if(!sharedSession && !sessionUrlError) {
    memory = read();
    try { channel = new BroadcastChannel(STORAGE_KEY); } catch { /* storage events remain available */ }
    const receive = (incoming: Document) => {
      const next = mergeDocuments(mergeDocuments(memory, read()), incoming);
      if (JSON.stringify(next) !== JSON.stringify(memory)) { memory = next; persist(); emit(); }
    };
    channel?.addEventListener('message', e => receive(parseDocument(JSON.stringify(e.data))));
    const onStorage=(e: StorageEvent)=>{if(e.key===STORAGE_KEY) receive(parseDocument(e.newValue));};
    window.addEventListener('storage',onStorage);
    import.meta.hot?.dispose(()=>{channel?.close();window.removeEventListener('storage',onStorage);});
  }
}
export function setFields(values: Record<string, Value>) {
  if(sharedSession) {sharedSession.enqueue(values);return;}
  if(sessionUrlError) return;
  memory = mergeDocuments(memory, read());
  const time = Math.max(Date.now(), ...Object.values(memory.fields).map(e => e.time + 1));
  const fields={...memory.fields};
  for (const [key, value] of Object.entries(values)) fields[key] = { value, time, writer };
  memory = { version:1, fields };
  persist(); channel?.postMessage(memory); emit();
}
export function resetExercise(id: string) {
  if(sharedSession) {sharedSession.enqueue({},'reset_exercise',id);return;}
  const current = mergeDocuments(memory, read());
  const values: Record<string, Value> = Object.fromEntries(Object.keys(current.fields).filter(key => key.startsWith(`${id}.`)).map(key => [key, null]));
  values[`${id}.complete`] = false; setFields(values);
}
export function resetLesson() {
  if(sharedSession) {sharedSession.enqueue({},'reset_all');return;}
  const current = mergeDocuments(memory, read());
  setFields(Object.fromEntries(Object.keys(current.fields).filter(key=>/^ex([1-9]|1[0-4])\./.test(key)).map(key => [key, null])));
}
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const cloudSubscribe=(fn:()=>void)=>sharedSession?.subscribe(fn)??(()=>{});
const cloudSnapshot=()=>sharedSession?.getSnapshot()??null;
export function useSessionState() {return useSyncExternalStore(cloudSubscribe,cloudSnapshot);}
export const lessonNow=()=>sharedSession?.now()??Date.now();
export function useLessonStore() {
  const doc = useSyncExternalStore(sharedSession ? cloudSubscribe : subscribe, () => sharedSession?.getSnapshot().document ?? memory);
  return { doc, storageError:sharedSession?.getSnapshot().storageError??storageError, get: (key: string): Value => doc.fields[key]?.value ?? null, set: (key: string, value: Value) => setFields({ [key]: value }) };
}
