import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { canonicalAppUrl, resolveAppRoute, studentClassroomPath, teacherPath } from "./app-routes";
import WorkspaceNotice from "./WorkspaceNotice";
import "./workspace-routes.css";

const TeacherWorkspace=lazy(()=>import("./TeacherWorkspace"));
const StudentWorkspace=lazy(()=>import("./StudentWorkspace"));

function EntryPage() {
  useEffect(()=>{document.title="Lesson Studio · Teach and learn English";},[]);
  return <main className="workspace-entry">
    <a className="entry-brand" href="/"><BookOpen size={27}/><span>lesson<strong>studio</strong></span></a>
    <div className="entry-heading"><span className="eyebrow">YOUR ENGLISH LEARNING SPACE</span><h1>A place to teach.<br/>A space to learn.</h1><p>Open the workspace for your role to get started.</p></div>
    <div className="workspace-choices">
      <a className="workspace-choice teacher-choice" href={teacherPath("materials")}><span className="choice-role-icon"><ShieldCheck size={26}/></span><h2>Teacher workspace</h2><p>Manage your students and build your lesson library.</p><span className="workspace-choice-action">Open teacher workspace <ArrowRight size={19}/></span></a>
      <a className="workspace-choice student-choice" href={studentClassroomPath}><span className="choice-role-icon"><GraduationCap size={27}/></span><h2>Student classroom</h2><p>Join your teacher’s lesson and practise English.</p><span className="workspace-choice-action">Open student classroom <ArrowRight size={19}/></span></a>
    </div>
    <p className="entry-footnote">Have a lesson invitation? Open the link your teacher sent you.</p>
  </main>;
}

export default function App() {
  const [address,setAddress]=useState(()=>location.href);
  useEffect(()=>{
    const update=()=>{const url=canonicalAppUrl(location.href);if(url.href!==location.href)history.replaceState(null,"",url);setAddress(url.href);};
    window.addEventListener("popstate",update);
    return()=>window.removeEventListener("popstate",update);
  },[]);
  const route=resolveAppRoute(address);
  if(route.area==="entry")return <EntryPage/>;
  if(route.area==="not-found")return <WorkspaceNotice title="Page not found" description="This page is not available in this workspace." href={route.workspace==="teacher"?teacherPath("materials"):route.workspace==="student"?studentClassroomPath:"/"} label={route.workspace?"Back to your workspace":"Back to Lesson Studio"}/>;
  return <Suspense fallback={<WorkspaceNotice title={route.area==="teacher"?"Loading teacher workspace…":"Loading student classroom…"} loading/>}>{route.area==="teacher"?<TeacherWorkspace route={route}/>:<StudentWorkspace route={route}/>}</Suspense>;
}
