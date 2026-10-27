import { BookOpen, ChevronRight, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { teacherPath } from "./app-routes";
import type { TeacherPage } from "./app-routes";

const pages = [{id:"students",label:"Students",Icon:Users},{id:"materials",label:"Materials",Icon:BookOpen}] as const;
export default function TeacherSidebar({page,open=false}:{page:TeacherPage;open?:boolean}) {
  return <aside className={`sidebar ${open?"mobile-open":""}`} id="lesson-sidebar">
    <a className="brand" href={teacherPath("materials")}><span className="brand-mark"><BookOpen size={25}/></span><span>lesson<span className="brand-light">studio</span><small>YOUR ENGLISH CLASSROOM</small></span></a>
    <div className="sidebar-role"><span><ShieldCheck size={15}/>Teacher workspace</span></div>
    <span className="nav-label">WORKSPACE</span>
    <nav className="service-navigation" aria-label="Teacher workspace navigation">{pages.map(({id,label,Icon})=><a key={id} href={teacherPath(id)} className={`service-link ${page===id||(id==="materials"&&page==="classroom")?"active":""}`} aria-current={page===id?"page":undefined}><Icon size={20}/><span>{label}</span><ChevronRight size={16}/></a>)}</nav>
    <div className="service-sidebar-footer"><span className="service-teacher-avatar"><GraduationCap size={20}/></span><div><strong>Teacher workspace</strong><small>Lesson Studio</small></div></div>
  </aside>;
}
