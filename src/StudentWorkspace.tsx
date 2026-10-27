import { lazy, Suspense, useEffect } from 'react';
import type { AppRoute } from './app-routes';
import WorkspaceNotice from './WorkspaceNotice';
const Classroom = lazy(() => import('./Classroom'));
const StandaloneMaterial = lazy(() => import('./StandaloneMaterial'));
const StudentHome = lazy(() => import('./StudentHome'));
const StudentConnectionPage = lazy(() => import('./StudentConnectionPage'));

export default function StudentWorkspace({ route }: { route: Extract<AppRoute, { area: 'student' }> }) {
  const invitation = new URL(location.href).searchParams.has('session');
  useEffect(() => {
    if (route.page === 'classroom' && !invitation) document.title = 'Your learning space · Lesson Studio';
  }, [route.page, invitation]);
  return <Suspense fallback={<WorkspaceNotice title="Loading your learning space…" loading/>}>
    {route.page === 'connect' ? <StudentConnectionPage/> : route.page === 'lesson' && route.materialId ? <StandaloneMaterial id={route.materialId}/> : invitation ? <Classroom teacher={false}/> : <StudentHome/>}
  </Suspense>;
}
