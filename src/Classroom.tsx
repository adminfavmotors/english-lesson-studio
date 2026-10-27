import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, ExternalLink, FileImage, GraduationCap, Headphones, Link, Menu, MessageCircle, PenLine, RotateCcw, ShieldCheck, SlidersHorizontal, Users, X } from 'lucide-react';
import { exercises, sections, lesson } from './lesson';
import type { Section } from './lesson';
import { ExerciseCard } from './Exercises';
import { HeaderLessonTimer, LessonCalendar, LessonDetails, LessonTimer } from './LessonWorkspace';
import { resetLesson, useLessonStore, useSessionState, sharedSession, sessionUrlError } from './store';
import { hashForSection, sectionFromHash, sessionLink } from './session-api';
import { classroomPath, studentClassroomPath } from './app-routes';
import { SessionPanel } from './SessionPanel';
import TeacherSidebar from './TeacherSidebar';
import WorkspaceNotice from './WorkspaceNotice';

const sectionIcons = { Vocabulary: BookOpen, Reading: FileImage, Grammar: PenLine, Speaking: MessageCircle, Listening: Headphones };
function ClassroomContent({teacher}:{teacher:boolean}) {
  const { get, doc, storageError } = useLessonStore();
  const sync = useSessionState();
  const canEdit = !sessionUrlError && (!sync || (!!sync.role && sync.status !== 'error'));
  const [section, setSection] = useState<Section>(() => sections.find(s => s.name.toLowerCase() === sectionFromHash(location.hash))?.name ?? 'Vocabulary');
  const [reset, setReset] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  useEffect(()=>{document.title=lesson.title+" · "+(teacher?"Teacher":"Student")+" · Lesson Studio";},[teacher]);
  const sourceDialog = useRef<HTMLDialogElement>(null);
  const shareDialog = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const current = sections.find(s => s.name === section)!;
  const sectionIndex = sections.indexOf(current);
  const visible = exercises.filter(e => e.section === section);
  const completed = exercises.filter(e => get(`${e.id}.complete`)).length;
  const percent = Math.round(completed / exercises.length * 100);
  const SectionIcon = sectionIcons[section];
  const saveText = storageError ? 'Saving in this browser is unavailable' : sync ? ({online:'Saved to shared lesson',saving:'Saving changes…',offline:'Offline · waiting to save',error:'Connection needs attention',connecting:'Connecting…'}[sync.status]) : 'Saved in this browser';
  const studentLink=sync?.studentToken&&sharedSession?sessionLink(location.href,{id:sharedSession.credentials.id,token:sync.studentToken},'student',section.toLowerCase()):studentClassroomPath+'#'+section.toLowerCase();

  const goSection = (name: Section) => {
    setSection(name);setMenuOpen(false);setPanelOpen(false);
    const url=new URL(location.href);url.hash=hashForSection(location.hash,name.toLowerCase());
    history.replaceState(null, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  };
  useEffect(() => {
    const onHash=()=>{const next=sections.find(s=>s.name.toLowerCase()===sectionFromHash(location.hash));if(next)setSection(next.name);};
    window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);
  },[]);
  useEffect(()=>{
    if(!menuOpen&&!panelOpen)return;
    const panel=document.getElementById(menuOpen?'lesson-sidebar':'session-controls');
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const focusable=()=>Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary')??[]).filter(element=>element.offsetParent!==null);
    const frame=requestAnimationFrame(()=>focusable()[0]?.focus({preventScroll:true}));
    const keyboard=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setMenuOpen(false);setPanelOpen(false);return;}
      if(event.key!=='Tab')return;
      const items=focusable();const first=items[0];const last=items.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    };
    document.addEventListener('keydown',keyboard);
    return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',keyboard);previous?.focus({preventScroll:true});};
  },[menuOpen,panelOpen]);
  const navigateExercise=(id:string,name:Section)=>{goSection(name);requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));};

  return <div className={"app-shell "+(teacher?"teacher-workspace":"student-workspace")} data-role={teacher?"teacher":"student"}>
    <a href={sync?hashForSection(location.hash,section.toLowerCase()):'#lesson-main'} className="skip-link" onClick={event=>{event.preventDefault();mainRef.current?.focus();}}>Skip to main content</a>
    {(menuOpen||panelOpen)&&<button className="nav-backdrop" aria-label="Close open panel" onClick={()=>{setMenuOpen(false);setPanelOpen(false);}}/>}
    {teacher?<TeacherSidebar page="classroom" open={menuOpen}/>:<aside className={"sidebar "+(menuOpen?"mobile-open":"")} id="lesson-sidebar">
      <a className="brand" href={sync&&sharedSession?sessionLink(location.href,sharedSession.credentials,'student'):studentClassroomPath} onClick={event=>{event.preventDefault();goSection('Vocabulary');}}><span className="brand-mark"><BookOpen size={25}/></span><span>lesson<span className="brand-light">studio</span><small>YOUR ENGLISH CLASSROOM</small></span></a>
      <div className="sidebar-role"><span><GraduationCap size={16}/>Student classroom</span></div>
      <div className="sidebar-lesson"><span className="unit-box">{lesson.unit}</span><div><small>CURRENT UNIT</small><strong>{lesson.title}</strong></div></div>
      <span className="nav-label">LESSON CONTENTS</span>
      <nav className="section-navigation" aria-label="Lesson sections">{sections.map(s=>{
        const Icon=sectionIcons[s.name];const items=exercises.filter(e=>e.section===s.name);const count=items.filter(e=>get(`${e.id}.complete`)).length;
        return <div key={s.name}><button className={`section-link ${s.name===section?'active':''}`} aria-current={s.name===section?'page':undefined} onClick={()=>goSection(s.name)}><Icon size={19}/><span>{s.name}</span><small>{count===items.length?<Check size={15}/>:s.range}</small></button>{s.name===section&&<div className="exercise-nav">{visible.map(e=><a key={e.id} href={sync?hashForSection(location.hash,e.section.toLowerCase()):`#${e.id}`} onClick={event=>{event.preventDefault();setMenuOpen(false);document.getElementById(e.id)?.scrollIntoView({behavior:'smooth',block:'start'});}}><span className={`nav-dot ${get(`${e.id}.complete`)?'complete':''}`}/><span className="exercise-nav-number">{String(e.number).padStart(2,'0')}</span><span className="exercise-nav-title">{e.title}</span></a>)}</div>}</div>;
      })}</nav>
      <div className="sidebar-bottom"><button className="source-sidebar" onClick={()=>sourceDialog.current?.showModal()}><FileImage size={19}/><span>Textbook source<small>Pages {lesson.pages}</small></span><ExternalLink size={15}/></button><span className="sidebar-connection"><span/>{sync?'Shared classroom':'Practice in this browser'}</span></div>
    </aside>}

    <div className="workspace">
      <header className="topbar"><div className="topbar-context"><button className="icon-button mobile-nav-toggle" aria-label={teacher?'Open workspace menu':'Open lesson navigation'} aria-expanded={menuOpen} aria-controls="lesson-sidebar" onClick={()=>{setMenuOpen(!menuOpen);setPanelOpen(false);}}><Menu size={20}/></button><span className="role-badge">{teacher?<ShieldCheck size={16}/>:<GraduationCap size={17}/>} {teacher?'TEACHER':'STUDENT'}</span>{teacher?<span className="teacher-page-context">Classroom</span>:<span className="topbar-unit">Unit {lesson.unit}</span>}</div><HeaderLessonTimer/><div className="topbar-actions"><button className="icon-button session-panel-toggle" aria-label={teacher?'Open lesson controls':'Open lesson overview'} aria-expanded={panelOpen} aria-controls="session-controls" onClick={()=>{setPanelOpen(!panelOpen);setMenuOpen(false);}}><SlidersHorizontal size={19}/></button>{!teacher&&!sync&&<button className="primary invite-button" onClick={()=>shareDialog.current?.showModal()}><Users size={17}/>Join lesson</button>}</div></header>

      <div className="workspace-body"><main ref={mainRef} id="lesson-main" tabIndex={-1}>
        <div className="lesson-page-heading"><div><div className="lesson-overline">{teacher?'TEACHER WORKSPACE':'ENGLISH CLASSROOM'} <ChevronRight size={13}/> UNIT {lesson.unit}</div><h1>{teacher?'Classroom':lesson.title}</h1><p>{teacher?'Unit '+lesson.unit+' · '+lesson.title:'A little practice, a new perspective. Let’s begin.'}</p></div><button className="source-button" aria-label="View textbook" onClick={()=>sourceDialog.current?.showModal()}><FileImage size={17}/><span>View textbook</span></button></div>
        <div className={"save-status "+(storageError||sync?.status==='error'||sync?.status==='offline'?'save-error':'')} role="status"><span/>{saveText}{sync&&<small>Session {sharedSession?.credentials.id.slice(0,8)}</small>}</div>
        {(sessionUrlError||(sync&&(sync.status==='offline'||sync.status==='error')))&&<div className="connection-alert" role="status"><p>{sessionUrlError||sync?.notice}</p>{sync&&<button className="secondary" onClick={()=>sharedSession?.retry()}>Retry connection</button>}</div>}
        {!teacher&&<LessonDetails teacher={false} canEdit={canEdit}/>}
        <div className="section-header"><span className="section-icon"><SectionIcon size={23}/></span><div><span className="section-kicker">PART {String(sectionIndex+1).padStart(2,'0')} / 05</span><h2>{section}<span> {current.subtitle}</span></h2></div><span className="section-count">{visible.length} {visible.length===1?'exercise':'exercises'}</span></div>
        <p className="section-description">{current.description}</p>
        <fieldset className="lesson-interaction" disabled={!canEdit}><div className="exercises" key={section}>{visible.map(exercise=><ExerciseCard key={exercise.id} exercise={exercise} teacher={teacher}/>)}</div></fieldset>
        <div className="section-footer">{sectionIndex>0?<button className="text-button" onClick={()=>goSection(sections[sectionIndex-1].name)}><ArrowLeft size={17}/>{sections[sectionIndex-1].name}</button>:<span/>}{sectionIndex<sections.length-1?<button className="secondary" onClick={()=>goSection(sections[sectionIndex+1].name)}>Next: {sections[sectionIndex+1].name}<ArrowRight size={17}/></button>:<span className="helper">{completed===exercises.length?'Lesson complete. Well done.':'You can return to any section to review your work.'}</span>}</div>
        <footer className="page-footer"><BookOpen size={15}/><span>Lesson Studio</span><span>One lesson. A little more confidence.</span></footer>
      </main>

      <aside className={`lesson-panel ${panelOpen?'mobile-open':''}`} id="session-controls" aria-label={teacher?'Teacher panel':'Lesson overview'}>
        <div className="panel-mobile-close"><span>{teacher?'Lesson controls':'Your lesson'}</span><button className="icon-button" aria-label="Close lesson controls" onClick={()=>setPanelOpen(false)}><X size={20}/></button></div>
        <div className="panel-heading">{teacher?'LESSON CONTROLS':'YOUR LESSON'}</div>
        {teacher&&<><div className="teacher-session-actions"><button className="primary" onClick={()=>shareDialog.current?.showModal()}><Users size={17}/>Invite student</button><a className="open-tab" href={studentLink} target="_blank" rel="noopener"><ExternalLink size={16}/>Preview student classroom</a></div><label className="teacher-section-picker" htmlFor="teacher-section">Lesson section<select id="teacher-section" value={section} onChange={event=>goSection(event.target.value as Section)}>{sections.map(s=><option key={s.name} value={s.name}>{s.name} · {s.range}</option>)}</select></label></>}
        <LessonTimer teacher={teacher} canEdit={canEdit}/>
        {teacher&&<><LessonDetails teacher canEdit={canEdit} initiallyExpanded={false}/><details className="teacher-calendar-group"><summary><CalendarDays size={18}/><span>Lesson calendar</span><ChevronDown size={17}/></summary><LessonCalendar canEdit={canEdit}/></details></>}
        <section className="lesson-progress-card" aria-label="Lesson progress"><div className="widget-heading"><span><Check size={17}/> LESSON PROGRESS</span><strong>{percent}%</strong></div><progress value={completed} max={exercises.length} aria-label="Lesson completion"/><p className="progress-caption">{completed} of {exercises.length} exercises completed</p><div className="lesson-path">{sections.map((s,i)=>{
          const items=exercises.filter(e=>e.section===s.name);const count=items.filter(e=>get(`${e.id}.complete`)).length;
          return <button key={s.name} className={`path-step ${s.name===section?'current':''}`} onClick={()=>goSection(s.name)}><span className={`path-number ${count===items.length?'complete':''}`}>{count===items.length?<Check size={13}/>:i+1}</span><strong>{s.name}</strong><small>{count}/{items.length}</small></button>;
        })}</div></section>
        {teacher?<section className="teacher-review-panel"><div className="widget-heading"><span><PenLine size={17}/> REVIEW ANSWERS</span></div><div className="teacher-summary">{visible.map(e=>{
          const answered=Object.entries(doc.fields).filter(([key,entry])=>key.startsWith(`${e.id}.answer.`)&&!key.endsWith('.grade')&&typeof entry.value==='string'&&entry.value.trim()).length;
          return <button key={e.id} onClick={()=>navigateExercise(e.id,e.section)}><span>{String(e.number).padStart(2,'0')}</span><div><strong>{e.title}</strong><small>{get(`${e.id}.complete`)?'Completed':`${answered} written ${answered===1?'answer':'answers'}`}</small></div><ChevronRight size={16}/></button>;
        })}</div><div className="panel-divider"/>{reset?<div className="reset-confirm"><p>Clear answers and progress for this lesson? Student details, the schedule and the lesson timer will be kept.</p><button className="danger-button" disabled={!canEdit} onClick={()=>{resetLesson();setReset(false);}}>Clear exercise answers</button><button className="text-button" onClick={()=>setReset(false)}>Cancel</button></div>:<button className="text-button reset-lesson" disabled={!canEdit} onClick={()=>setReset(true)}><RotateCcw size={15}/>Reset exercise answers</button>}</section>:<section className="student-tip"><span><MessageCircle size={19}/></span><h3>Make it a conversation.</h3><p>Take your time, ask questions and share your own ideas. Your teacher is here to help.</p></section>}
      </aside></div>
    </div>

    <dialog className="share-dialog" ref={shareDialog} aria-labelledby="share-title" onClick={event=>{if(event.target===shareDialog.current)shareDialog.current.close();}}><div className="dialog-heading"><div><span className="eyebrow">SHARED CLASSROOM</span><h2 id="share-title">{teacher?'Invite your student':'Join a shared lesson'}</h2></div><button className="icon-button" aria-label="Close lesson invitation" onClick={()=>shareDialog.current?.close()}><X size={21}/></button></div><SessionPanel teacher={teacher}/>{teacher&&sync&&<p className="helper"><Link size={14}/> Keep your teacher link private. Share only the student link with your student.</p>}</dialog>
    <dialog className="source-dialog" ref={sourceDialog} aria-labelledby="source-title" onClick={event=>{if(event.target===sourceDialog.current)sourceDialog.current.close();}}><div className="dialog-heading"><div><span className="eyebrow">ORIGINAL SOURCE</span><h2 id="source-title">Unit {lesson.unit} · {lesson.title}</h2></div><button className="icon-button" aria-label="Close source image" onClick={()=>sourceDialog.current?.close()}><X size={21}/></button></div><p>Pages {lesson.pages}. {lesson.sourceNote}</p><a href={lesson.image} target="_blank" rel="noopener">Open full-size image <ExternalLink size={14}/></a><img src={lesson.image} alt={`Original textbook pages ${lesson.pages}: ${lesson.title}`}/><form method="dialog"><button className="secondary">Back to lesson</button></form></dialog>
  </div>;
}

export default function Classroom({teacher}:{teacher:boolean}) {
  const sync=useSessionState();
  const area=teacher?'teacher':'student';
  const mismatch=!!sync?.role&&sync.role!==area;
  useEffect(()=>{
    if(mismatch&&sync?.role&&sharedSession)location.replace(sessionLink(location.href,sharedSession.credentials,sync.role,sectionFromHash(location.hash)));
  },[mismatch,sync?.role]);
  if(sessionUrlError)return <WorkspaceNotice title="This lesson link could not be opened" description={sessionUrlError} href={classroomPath(area)} label="Open classroom"/>;
  if(sync&&(!sync.role||mismatch))return <WorkspaceNotice title={sync.status==='error'?'Lesson unavailable':sync.status==='offline'?'Connection lost':'Opening your shared lesson…'} description={sync.notice||'Checking your lesson link before opening the classroom.'} loading={sync.status==='connecting'||mismatch} onRetry={sync.status==='error'||sync.status==='offline'?()=>sharedSession?.retry():undefined} href={sync.status==='error'?classroomPath(area):undefined} label="Open classroom"/>;
  return <ClassroomContent teacher={teacher}/>;
}
