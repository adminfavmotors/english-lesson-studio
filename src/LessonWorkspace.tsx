import { useEffect, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, GraduationCap, Pause, Play, RotateCcw, UserRound } from 'lucide-react';
import { lesson } from './lesson';
import { lessonNow, setFields, useLessonStore } from './store';
import { calendarDays, formatTimer, isoDate, LESSON_TIME_ZONE, lessonTimerState, parseLessonDate, timerChanges } from './lesson-workspace';

function useClassTimer() {
  const {doc}=useLessonStore();const [now,setNow]=useState(lessonNow);
  const deadline=Number(doc.fields['lesson.timer.deadline']?.value)||0;
  useEffect(()=>{
    setNow(lessonNow()); if(!deadline) return;
    const interval=window.setInterval(()=>{const current=lessonNow();setNow(current);if(current>=deadline) clearInterval(interval);},250);
    return ()=>clearInterval(interval);
  },[deadline]);
  return lessonTimerState(doc,now);
}
export function HeaderLessonTimer() {
  const timer=useClassTimer();
  return <div className={`header-class-timer ${timer.running?'running':''} ${timer.finished?'finished':''}`} aria-label={`Lesson timer: ${formatTimer(timer.remaining)}`}><Clock3 size={17}/><span>{timer.finished?'Time is up':timer.running?'Lesson in progress':timer.started?'Lesson paused':'Lesson timer'}</span><strong>{formatTimer(timer.remaining)}</strong></div>;
}
export function LessonTimer({teacher,canEdit}:{teacher:boolean;canEdit:boolean}) {
  const timer=useClassTimer();const [minutes,setMinutes]=useState(String(timer.duration/60));const [error,setError]=useState('');
  useEffect(()=>setMinutes(String(timer.duration/60)),[timer.duration]);
  const applyDuration=(value:number)=>{
    try{setFields(timerChanges('duration',timer,lessonNow(),value));setError('');}catch(e){setError((e as Error).message);}
  };
  return <section className={`class-timer-card ${timer.running?'running':''} ${timer.finished?'finished':''}`} aria-label="Whole lesson timer"><div className="widget-heading"><span><Clock3 size={17}/> LESSON TIMER</span><span className="widget-status">{timer.finished?'Time is up':timer.running?'Running':timer.started?'Paused':'Ready'}</span></div><div className="class-timer-digits" role="timer" aria-label={`${timer.remaining} seconds remaining`}>{formatTimer(timer.remaining)}</div><p className="class-timer-caption">{timer.duration/60} minute lesson{!teacher?' · Set by your teacher':''}</p><progress max={timer.duration} value={timer.duration-timer.remaining} aria-label="Lesson time elapsed"/>
    {teacher?<fieldset disabled={!canEdit} className="timer-controls"><div className="timer-main-actions"><button className="primary" onClick={()=>setFields(timerChanges(timer.running?'pause':'start',timer,lessonNow()))}>{timer.running?<Pause size={17}/>:<Play size={17}/>} {timer.running?'Pause lesson':timer.started&&!timer.finished?'Resume lesson':timer.finished?'Start again':'Start lesson'}</button><button className="icon-button" aria-label="Reset lesson timer" onClick={()=>setFields(timerChanges('reset',timer,lessonNow()))}><RotateCcw size={17}/></button></div><form className="timer-length-form" onSubmit={e=>{e.preventDefault();applyDuration(Number(minutes));}}><label htmlFor="lesson-duration">Lesson length</label><div><input id="lesson-duration" type="number" min={1} max={240} step={1} value={minutes} disabled={timer.running} onChange={e=>setMinutes(e.target.value)} aria-describedby="duration-unit"/><span id="duration-unit">min</span><button className="secondary" type="submit" disabled={timer.running}>Set</button></div></form><div className="duration-presets" aria-label="Preset lesson durations">{[45,60,90].map(value=><button key={value} disabled={timer.running} className={timer.duration===value*60?'selected':''} onClick={()=>applyDuration(value)}>{value} min</button>)}</div>{timer.running&&<p className="helper">Pause the lesson to change its length.</p>}{error&&<p className="field-error" role="alert">{error}</p>}</fieldset>:<p className="timer-student-note">{timer.finished?'Your lesson time has ended. Your answers are saved.':timer.running?'Make the most of your time. You’ve got this.':timer.started?'A quick pause. Your teacher will resume the lesson.':'Your teacher will start the timer when you’re ready.'}</p>}
  </section>;
}

export function LessonDetails({teacher,canEdit}:{teacher:boolean;canEdit:boolean}) {
  const {get,set}=useLessonStore();const [expanded,setExpanded]=useState(true);
  const student=String(get('lesson.studentName')??'');const level=String(get('lesson.studentLevel')??'');const title=String(get('lesson.title')??'');const number=String(get('lesson.number')??'');
  const date=parseLessonDate(String(get('lesson.date')??''));const time=String(get('lesson.time')??'');
  if(!teacher) return <section className="student-lesson-details" aria-label="Your lesson details"><div className="student-welcome"><span className="student-profile-icon"><UserRound size={23}/></span><div><span className="eyebrow">YOUR LEARNING SPACE</span><h2>{student?`Welcome, ${student}`:'Welcome to your lesson'}<span>.</span></h2></div></div><div className="student-detail-items"><span><GraduationCap size={17}/>{level||'English practice'}{number&&` · Lesson ${number}`}</span><span><CalendarDays size={17}/>{date?date.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'Date to be confirmed'}{time&&` · ${time} (${String(get('lesson.timeZone')??LESSON_TIME_ZONE)})`}</span></div>{title&&<p className="student-session-title">Today’s session: <strong>{title}</strong></p>}</section>;
  return <section className="lesson-details-card" aria-label="Student and lesson details"><button className="details-card-toggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded} aria-controls="lesson-details-fields"><span className="details-icon"><UserRound size={19}/></span><span><strong>Student & lesson</strong><small>{expanded?'Prepare the details for this session':`${student||'Student details'}${number?` · Lesson ${number}`:''}`}</small></span><ChevronDown size={18} className={expanded?'expanded':''}/></button>{expanded&&<fieldset id="lesson-details-fields" className="lesson-details-fields" disabled={!canEdit}><label htmlFor="student-name">Student name<input id="student-name" maxLength={120} value={student} placeholder="Student’s name" autoComplete="off" onChange={e=>set('lesson.studentName',e.target.value)}/></label><label htmlFor="student-level">English level<select id="student-level" value={level} onChange={e=>set('lesson.studentLevel',e.target.value)}><option value="">Choose level</option>{['A1 · Beginner','A2 · Elementary','B1 · Intermediate','B2 · Upper intermediate','C1 · Advanced','C2 · Proficiency'].map(value=><option key={value} value={value}>{value}</option>)}</select></label><label htmlFor="session-title">Lesson title<input id="session-title" maxLength={160} value={title} placeholder={lesson.title} onChange={e=>set('lesson.title',e.target.value)}/></label><label htmlFor="lesson-number">Lesson number<input id="lesson-number" maxLength={24} value={number} placeholder="e.g. 12" inputMode="numeric" onChange={e=>set('lesson.number',e.target.value)}/></label><p className="details-sharing-note"><Check size={14}/> Changes save automatically and appear in the student’s lesson.</p></fieldset>}</section>;
}

export function LessonCalendar({canEdit}:{canEdit:boolean}) {
  const {get}=useLessonStore();const value=String(get('lesson.date')??'');const time=String(get('lesson.time')??'');
  const selected=parseLessonDate(value);const today=new Date();const [month,setMonth]=useState(()=>new Date((selected??today).getFullYear(),(selected??today).getMonth(),1));
  const [error,setError]=useState('');
  useEffect(()=>{const date=parseLessonDate(value);if(date)setMonth(new Date(date.getFullYear(),date.getMonth(),1));},[value]);
  const selectDate=(date:string)=>{setFields({'lesson.date':date,'lesson.timeZone':LESSON_TIME_ZONE});setError('');};
  const changeDate=(date:string)=>{
    if(date===''){setFields({'lesson.date':null});setError('');return;}
    const parsed=parseLessonDate(date);if(!parsed){setError('Choose a valid date.');return;}
    selectDate(date);setMonth(new Date(parsed.getFullYear(),parsed.getMonth(),1));
  };
  return <section className="lesson-calendar" aria-label="Lesson calendar"><div className="widget-heading"><span><CalendarDays size={17}/> SCHEDULE LESSON</span></div><div className="calendar-month-navigation"><strong aria-live="polite">{month.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</strong><div><button className="calendar-arrow" aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft size={18}/></button><button className="calendar-arrow" aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight size={18}/></button></div></div><div className="calendar-weekdays" aria-hidden="true">{['M','T','W','T','F','S','S'].map((day,i)=><span key={i}>{day}</span>)}</div><fieldset disabled={!canEdit} className="calendar-grid">{calendarDays(month.getFullYear(),month.getMonth()).map((date,index)=>date?<button key={date} className={`${date===value?'selected':''} ${date===isoDate(today)?'today':''}`} aria-pressed={date===value} aria-label={`Schedule lesson on ${date}`} onClick={()=>selectDate(date)}>{Number(date.slice(-2))}</button>:<span key={`empty-${index}`}/>)}</fieldset><fieldset disabled={!canEdit} className="calendar-inputs"><label htmlFor="lesson-date">Date<input id="lesson-date" type="date" value={value} min="1900-01-01" max="2200-12-31" onInput={e=>changeDate(e.currentTarget.value)}/></label><label htmlFor="lesson-time">Time<input id="lesson-time" type="time" value={time} onInput={e=>setFields({'lesson.time':e.currentTarget.value,'lesson.timeZone':LESSON_TIME_ZONE})}/></label></fieldset><p className="calendar-timezone">Time zone: {String(get('lesson.timeZone')??LESSON_TIME_ZONE)}</p>{error&&<p className="field-error" role="alert">{error}</p>}</section>;
}
