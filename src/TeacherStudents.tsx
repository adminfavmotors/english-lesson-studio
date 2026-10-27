import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Archive, ArrowRight, Check, ChevronLeft, ChevronRight, GraduationCap, LoaderCircle, LogOut, Plus, RefreshCw, Search, ShieldCheck, UserRound, Users } from 'lucide-react';
import { platform } from './platform-client';
import { listStudents, studentCounts, studentsError, STUDENTS_PAGE_SIZE } from './students-api';
import { STUDENT_LEVELS, STUDENT_STATUSES, studentInitials } from './students-model';
import type { Student } from './students-model';
import { TeacherAccount } from './TeacherAccount';
import { StudentEditor } from './StudentEditor';
import { StudentProfile } from './StudentProfile';

function Loading({text='Loading students…'}:{text?:string}) {return <div className="students-loading" role="status"><LoaderCircle className="students-spinner" size={23}/><span>{text}</span></div>;}

function StudentsWorkspace({user}:{user:User}) {
  const [students,setStudents]=useState<Student[]>([]);const [count,setCount]=useState(0);const [counts,setCounts]=useState<number[]|null>(null);
  const [search,setSearch]=useState('');const [query,setQuery]=useState('');const [status,setStatus]=useState('');const [level,setLevel]=useState('');const [page,setPage]=useState(0);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [notice,setNotice]=useState('');const [refresh,setRefresh]=useState(0);const [signingOut,setSigningOut]=useState(false);
  const [editor,setEditor]=useState<Student|'new'|null>(null);const [selected,setSelected]=useState<Student|null>(null);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[]);
  useEffect(()=>{const timer=window.setTimeout(()=>{setQuery(search);setPage(0);},250);return()=>clearTimeout(timer);},[search]);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setError('');
    void listStudents({search:query,status,level,page},controller.signal).then(result=>{if(!controller.signal.aborted){setStudents(result.students);setCount(result.count);if(page>0&&page*STUDENTS_PAGE_SIZE>=result.count)setPage(Math.max(0,Math.ceil(result.count/STUDENTS_PAGE_SIZE)-1));}}).catch(error=>{if(!controller.signal.aborted){setStudents([]);setError(studentsError(error));}}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[query,status,level,page,refresh]);
  useEffect(()=>{
    const controller=new AbortController();void studentCounts(controller.signal).then(result=>{if(!controller.signal.aborted)setCounts(result);}).catch(()=>{if(!controller.signal.aborted)setCounts(null);});
    return()=>controller.abort();
  },[refresh]);
  useEffect(()=>{const reload=()=>setRefresh(value=>value+1);window.addEventListener('focus',reload);return()=>window.removeEventListener('focus',reload);},[]);
  const saved=(student:Student)=>{
    const isNew=editor==='new';setEditor(null);setSelected(student);setRefresh(value=>value+1);setNotice(isNew?'Student added.':'Profile saved.');
    if(isNew){setSearch('');setQuery('');setStatus('');setLevel('');setPage(0);}
  };
  const signOut=async()=>{setSigningOut(true);const{error}=await platform.auth.signOut({scope:'local'});if(error){setError(studentsError(error));setSigningOut(false);}};
  const filtered=!!(search.trim()||status||level);
  return <div className="students-workspace">
    <div className="students-account-bar"><span><ShieldCheck size={16}/><span>{user.email}</span></span><button className="text-button" disabled={signingOut} onClick={()=>void signOut()}><LogOut size={16}/>{signingOut?'Signing out…':'Sign out'}</button></div>
    <div className="students-stat-grid">{[{label:'Total students',Icon:Users},{label:'Active',Icon:GraduationCap},{label:'Trial',Icon:UserRound},{label:'Archived',Icon:Archive}].map(({label,Icon},index)=><div className="students-stat" key={label}><span><Icon size={19}/>{label}</span><strong>{counts?.[index]??'—'}</strong></div>)}</div>
    <div className="students-section-heading"><div><h2>Your students</h2><p>Manage profiles and plan each student’s next steps.</p></div><button className="primary" onClick={()=>{setNotice('');setEditor('new');}}><Plus size={18}/>Add student</button></div>
    <div className="students-toolbar"><label className="students-search"><span className="sr-only">Search students by name</span><Search size={18}/><input value={search} placeholder="Find a student by name" maxLength={120} onChange={event=>setSearch(event.target.value)}/></label><label><span className="sr-only">Filter by status</span><select value={status} onChange={event=>{setStatus(event.target.value);setPage(0);}}><option value="">All statuses</option>{Object.entries(STUDENT_STATUSES).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label><span className="sr-only">Filter by level</span><select value={level} onChange={event=>{setLevel(event.target.value);setPage(0);}}><option value="">All levels</option>{STUDENT_LEVELS.map(value=><option key={value}>{value}</option>)}</select></label><button className="icon-button" disabled={loading} aria-label="Refresh student list" onClick={()=>setRefresh(value=>value+1)}><RefreshCw size={18}/></button></div>
    {notice&&<p className="students-notice" role="status"><Check size={17}/>{notice}</p>}
    {error?<div className="students-load-error" role="alert"><p>{error}</p><button className="secondary" onClick={()=>setRefresh(value=>value+1)}>Try again</button></div>:loading?<Loading/>:students.length===0?<section className="students-empty"><span><Users size={33}/></span><h3>{filtered?'No students found':'Ready to meet your first student?'}</h3><p>{filtered?'Try a different name or clear the filters.':'Add a name, set a level and save learning goals. Every student has a separate profile.'}</p>{filtered?<button className="secondary" onClick={()=>{setSearch('');setQuery('');setStatus('');setLevel('');setPage(0);}}>Clear filters</button>:<button className="primary" onClick={()=>setEditor('new')}><Plus size={17}/>Add your first student</button>}</section>:<>
    <div className="students-table-wrap"><table className="students-table"><thead><tr><th>Student</th><th>English level</th><th>Status</th><th><span className="sr-only">Open profile</span></th></tr></thead><tbody>{students.map(student=><tr key={student.id}><td><button className="student-name-button" onClick={()=>{setNotice('');setSelected(student);}}><span className="roster-avatar">{studentInitials(student.full_name)}</span><span><strong>{student.full_name}</strong><small>{student.email||'No email provided'}</small></span></button></td><td><span className="student-level">{student.level||'Not set'}</span></td><td><span className={`student-status ${student.status}`}>{STUDENT_STATUSES[student.status]}</span></td><td><button className="icon-button" aria-label={`Open profile: ${student.full_name}`} onClick={()=>{setNotice('');setSelected(student);}}><ArrowRight size={18}/></button></td></tr>)}</tbody></table></div>
    <div className="students-pagination"><span>{page*STUDENTS_PAGE_SIZE+1}–{Math.min((page+1)*STUDENTS_PAGE_SIZE,count)} of {count}</span><div><button className="secondary" disabled={page===0} onClick={()=>setPage(value=>value-1)}><ChevronLeft size={17}/>Previous</button><button className="secondary" disabled={(page+1)*STUDENTS_PAGE_SIZE>=count} onClick={()=>setPage(value=>value+1)}>Next<ChevronRight size={17}/></button></div></div></>}
    {selected&&!editor&&<StudentProfile key={selected.id} student={selected} onClose={()=>setSelected(null)} onEdit={()=>setEditor(selected)} onSaved={saved}/>}
    {editor&&<StudentEditor key={editor==='new'?'new':editor.id} student={editor==='new'?undefined:editor} onClose={()=>setEditor(null)} onSaved={saved}/>}
  </div>;
}

export default function TeacherStudents() {
  const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    const {data:{subscription}}=platform.auth.onAuthStateChange((_event,session)=>{if(active){setUser(session?.user??null);setReady(true);if(session)setError('');}});
    void platform.auth.getSession().then(({data,error})=>{if(active){if(error)setError(studentsError(error));setUser(data.session?.user??null);setReady(true);}}).catch(error=>{if(active){setError(studentsError(error));setReady(true);}});
    return()=>{active=false;subscription.unsubscribe();};
  },[]);
  if(!ready)return <Loading text="Loading workspace…"/>;
  return <>{error&&<p className="students-error" role="alert">{error}</p>}{user?<StudentsWorkspace key={user.id} user={user}/>:<TeacherAccount/>}</>;
}
