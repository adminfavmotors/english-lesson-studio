import { useRef, useState } from 'react';
import { Check, Copy, Link, Radio, RefreshCw, Unplug, Users } from 'lucide-react';
import { createSession, sessionLink, writeSession, SessionError } from './session-api';
import type { CreatedSession } from './session-api';
import { sessionUrlError, sharedSession, useLessonStore, useSessionState } from './store';
import { classroomPath } from './app-routes';

export function SessionPanel({ teacher }: {teacher:boolean}) {
  const sync=useSessionState();
  const {doc}=useLessonStore();
  const createdRef=useRef<CreatedSession|null>(null);
  const [creating,setCreating]=useState(false);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState('');
  const [showTeacher,setShowTeacher]=useState(false);
  const start=async()=>{
    setCreating(true);setError('');
    try {
      const created=createdRef.current??await createSession();
      createdRef.current=created;
      const values=Object.fromEntries(Object.entries(doc.fields).filter(([key,entry])=>key.startsWith('lesson.')&&entry.value!==null).map(([key,entry])=>[key,entry.value]));
      if(typeof values['lesson.timer.deadline']==='number') values['lesson.timer.deadline']+=created.server_time-Date.now();
      if(Object.keys(values).length) await writeSession({id:created.id,token:created.teacher_token},{id:crypto.randomUUID(),action:'patch',exercise:null,epochs:{},values});
      location.assign(sessionLink(location.href,{id:created.id,token:created.teacher_token},'teacher'));
    } catch(e) {setError(e instanceof SessionError?e.message:'Could not create a shared lesson. Check your connection and try again.');setCreating(false);}
  };
  const copy=async(value:string,label:string)=>{
    try {await navigator.clipboard.writeText(value);setCopied(label);}
    catch {setError('Select the lesson link and copy it manually.');}
  };
  if(sessionUrlError) return <section className="session-banner session-problem"><Unplug size={21}/><div><h2>Invitation could not be opened</h2><p role="alert">{sessionUrlError}</p><a href={classroomPath(teacher?'teacher':'student')}>Open classroom</a></div></section>;
  if(!sync) return <section className="session-banner"><Users size={22}/><div><h2>{teacher?'Invite your student':'Join your teacher’s lesson'}</h2><p>{teacher?'Your student details, schedule and timer settings are copied to the shared lesson. Exercise answers start blank.':'Open the student link your teacher sent you to join their lesson.'}</p>{error&&<p role="alert" className="session-error">{error}</p>}</div>{teacher&&<button className="primary" disabled={creating} onClick={()=>void start()}><Link size={15}/>{creating?'Creating lesson…':'Create shared lesson'}</button>}</section>;
  const credentials=sharedSession!.credentials;
  const studentLink=sync.studentToken?sessionLink(location.href,{id:credentials.id,token:sync.studentToken},'student'):'';
  const teacherLink=sessionLink(location.href,credentials,'teacher');
  const labels={connecting:'Connecting to shared lesson',online:'Shared lesson · up to date',saving:'Saving shared changes…',offline:'Offline · waiting to save',error:'The lesson connection needs attention'};
  return <section className={`session-banner shared ${sync.status==='error'||sync.status==='offline'?'session-problem':''}`} aria-label="Shared lesson session"><Radio size={21}/><div className="session-content"><h2>{labels[sync.status]}</h2><p>Session {credentials.id.slice(0,8)} · {sync.role==='teacher'?'Teacher access':sync.role==='student'?'Student access':'Checking lesson link…'}{sync.pendingCount>0?` · ${sync.pendingCount} pending ${sync.pendingCount===1?'change':'changes'}`:''}</p>
    {sync.notice&&<p className="session-error" role="status">{sync.notice}</p>}
    {sync.status==='error'&&sync.pendingCount>0&&<button className="text-button" onClick={()=>sharedSession?.discardBlocked()}>Discard unsaved change and reconnect</button>}
    {sync.storageError&&<p className="session-error" role="alert">Browser storage is unavailable. Keep this tab open until all changes are saved online.</p>}
    {sync.role==='teacher'&&studentLink&&<div className="session-invites"><label htmlFor="student-invite">Student lesson link</label><div className="invite-row"><input id="student-invite" readOnly value={studentLink} onFocus={e=>e.target.select()}/><button className="secondary" onClick={()=>void copy(studentLink,'student')}>{copied==='student'?<Check size={14}/>:<Copy size={14}/>} {copied==='student'?'Copied':'Copy link'}</button></div><button className="text-button" aria-expanded={showTeacher} onClick={()=>setShowTeacher(!showTeacher)}>{showTeacher?'Hide':'Show'} my teacher link</button>{showTeacher&&<><p className="helper">Keep this link for yourself. It grants access to teacher controls.</p><div className="invite-row"><input aria-label="Teacher lesson link" readOnly value={teacherLink} onFocus={e=>e.target.select()}/><button className="secondary" onClick={()=>void copy(teacherLink,'teacher')}>{copied==='teacher'?<Check size={14}/>:<Copy size={14}/>} {copied==='teacher'?'Copied':'Copy link'}</button></div></>}</div>}
    {error&&<p role="alert" className="session-error">{error}</p>}
    <p className="session-footnote">Changes sync automatically between devices. Reopen the same lesson link to continue.</p>
    </div>{(sync.status==='error'||sync.status==='offline')&&<button className="secondary" onClick={()=>sharedSession?.retry()}><RefreshCw size={14}/>Retry</button>}</section>;
}
