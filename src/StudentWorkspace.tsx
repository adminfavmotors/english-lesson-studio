import { lazy, Suspense, useEffect } from "react";
import { BookOpen, Mail } from "lucide-react";
import AccountControls from "./AccountControls";
import type { AppRoute } from "./app-routes";
import WorkspaceNotice from "./WorkspaceNotice";
const Classroom=lazy(()=>import("./Classroom"));
const StandaloneMaterial=lazy(()=>import("./StandaloneMaterial"));

export default function StudentWorkspace({route}:{route:Extract<AppRoute,{area:"student"}>}) {
  const invitation=new URL(location.href).searchParams.has('session');
  useEffect(()=>{if(!invitation)document.title='Your learning space · Lesson Studio';},[invitation]);
  if(route.page==='classroom'&&!invitation)return <div className="student-home" data-role="student"><header><a className="landing-brand" href="/"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></a><AccountControls/></header><main><span className="landing-eyebrow">YOUR LEARNING SPACE</span><h1>Ready for your<br/>next conversation?</h1><p>This is your space for learning English with your teacher.</p><section className="student-home-card"><Mail size={28}/><h2>Join your next lesson</h2><p>Open the lesson invitation your teacher sent you. If you have not received a link yet, ask your teacher before your lesson.</p><p>Your teacher chooses the lesson and shares access with you.</p></section></main></div>;
  return <Suspense fallback={<WorkspaceNotice title="Loading student classroom…" loading/>}>{route.page==="lesson"&&route.materialId?<StandaloneMaterial id={route.materialId}/>:<Classroom teacher={false}/>}</Suspense>;
}
