import { lazy, Suspense } from "react";
import type { AppRoute } from "./app-routes";
import WorkspaceNotice from "./WorkspaceNotice";
const Classroom=lazy(()=>import("./Classroom"));
const StandaloneMaterial=lazy(()=>import("./StandaloneMaterial"));

export default function StudentWorkspace({route}:{route:Extract<AppRoute,{area:"student"}>}) {
  return <Suspense fallback={<WorkspaceNotice title="Loading student classroom…" loading/>}>{route.page==="lesson"&&route.materialId?<StandaloneMaterial id={route.materialId}/>:<Classroom teacher={false}/>}</Suspense>;
}
