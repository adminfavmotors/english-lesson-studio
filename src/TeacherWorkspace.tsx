import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BookOpen, Menu, ShieldCheck } from "lucide-react";
import TeacherSidebar from "./TeacherSidebar";
import WorkspaceNotice from "./WorkspaceNotice";
import AccountControls from "./AccountControls";
import { teacherPath } from "./app-routes";
import type { AppRoute } from "./app-routes";
const TeacherStudents=lazy(()=>import("./TeacherStudents"));
const AssignmentsLibrary=lazy(()=>import("./AssignmentsLibrary"));
const Classroom=lazy(()=>import("./Classroom"));

export default function TeacherWorkspace({route}:{route:Extract<AppRoute,{area:"teacher"}>}) {
  const [menuOpen,setMenuOpen]=useState(false);
  const main=useRef<HTMLElement>(null);
  useEffect(()=>{document.title=`${route.page==="students"?"Students":route.page==="materials"?"Materials":"Classroom"} · Teacher · Lesson Studio`;},[route.page]);
  useEffect(()=>{
    if(!menuOpen)return;
    const previous=document.activeElement;
    const links=Array.from(document.querySelectorAll<HTMLElement>('#lesson-sidebar a[href]'));
    links[0]?.focus();
    const keyboard=(event:KeyboardEvent)=>{
      if(event.key==="Escape")setMenuOpen(false);
      if(event.key!=="Tab")return;
      const first=links[0],last=links.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    };
    document.addEventListener("keydown",keyboard);
    return()=>{document.removeEventListener("keydown",keyboard);if(previous instanceof HTMLElement)previous.focus();};
  },[menuOpen]);
  if(route.page==="classroom")return <Suspense fallback={<WorkspaceNotice title="Loading teacher classroom…" loading/>}><Classroom teacher/></Suspense>;
  const students=route.page==="students";
  return <div className={`app-shell teacher-workspace service-page ${students?"students-page":"library-page"}`} data-role="teacher">
    <a className="skip-link" href="#lesson-main" onClick={event=>{event.preventDefault();main.current?.focus();}}>Skip to main content</a>
    {menuOpen&&<button className="nav-backdrop" aria-label="Close workspace menu" onClick={()=>setMenuOpen(false)}/>}
    <TeacherSidebar page={route.page} open={menuOpen}/>
    <div className="workspace"><header className="topbar"><div className="topbar-context"><button className="icon-button mobile-nav-toggle" aria-label="Open workspace menu" aria-expanded={menuOpen} aria-controls="lesson-sidebar" onClick={()=>setMenuOpen(!menuOpen)}><Menu size={20}/></button><span className="role-badge"><ShieldCheck size={16}/>TEACHER</span><span className="teacher-page-context">{students?"Students":"Materials"}</span></div><AccountControls/></header>
      <div className="workspace-body"><main id="lesson-main" ref={main} tabIndex={-1}>
        {students&&<div className="lesson-page-heading"><div><div className="lesson-overline">TEACHER WORKSPACE / STUDENTS</div><h1>Students</h1><p>Student profiles, English levels and learning goals.</p></div></div>}
        <Suspense fallback={<p className="students-loading">Loading {students?"students":"library"}…</p>}>{students?<TeacherStudents/>:<AssignmentsLibrary materialId={route.materialId??""} onOpenLegacy={()=>location.assign(teacherPath("classroom"))}/>}</Suspense>
        <footer className="page-footer"><BookOpen size={15}/><span>Lesson Studio</span><span>Your space for teaching.</span></footer>
      </main></div>
    </div>
  </div>;
}
