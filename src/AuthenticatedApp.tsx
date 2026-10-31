import { lazy, Suspense, useEffect, useState } from 'react';
import type { AppRoute } from './app-routes';
import { WorkspaceAuth, useWorkspaceAuth } from './workspace-auth';
import { mayOpenWorkspace, workspaceHome } from './workspace-access';
import LoginPage from './LoginPage';
import AccountControls from './AccountControls';
import WorkspaceNotice from './WorkspaceNotice';
import { ClerkProvider } from '@clerk/react';
import { readAccountReturn, clearAccountReturn } from './account-return';

const TeacherWorkspace = lazy(() => import('./TeacherWorkspace'));
const StudentWorkspace = lazy(() => import('./StudentWorkspace'));
type ProtectedRoute = Exclude<AppRoute, { area: 'entry' | 'not-found' }>;
function WorkspaceGate({ route }: { route: ProtectedRoute }) {
  const auth = useWorkspaceAuth();
  const [returnTarget] = useState(() => route.area === 'login' ? readAccountReturn(location.origin) : null);
  const target = auth.status === 'ready' && auth.role && (route.area === 'login' || !mayOpenWorkspace(auth.role, route)) ? returnTarget ?? workspaceHome(auth.role) : null;
  useEffect(() => { if (target) { clearAccountReturn(); location.replace(target); } }, [target]);
  if (auth.status === 'loading' || target) return <WorkspaceNotice title="Opening your workspace…" loading/>;
  if (auth.status === 'signed-out') return <LoginPage invitation={new URL(returnTarget ?? location.href, location.origin).searchParams.has('session')} connectionInvitation={(route.area === 'student' && route.page === 'connect') || !!returnTarget?.startsWith('/student/connect')}/>;
  if (auth.status === 'error') return <><AccountControls/><WorkspaceNotice title="We could not check your access" description="Check your connection, then try again." onRetry={auth.retry}/></>;
  if (!auth.role) return <><AccountControls/><WorkspaceNotice title="Your workspace is not ready yet" description="Contact your teacher to check your account access." href="/"/></>;
  return <Suspense fallback={<WorkspaceNotice title="Loading your workspace…" loading/>}>{route.area === 'teacher' ? <TeacherWorkspace key={auth.user?.id} route={route}/> : route.area === 'student' ? <StudentWorkspace key={auth.user?.id} route={route}/> : null}</Suspense>;
}
export default function AuthenticatedApp({ route }: { route: ProtectedRoute }) {
  const key = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim();
  if (!key) return <WorkspaceNotice title="Account access is temporarily unavailable" description="Please try again later." href="/"/>;
  return <ClerkProvider publishableKey={key}><WorkspaceAuth><WorkspaceGate route={route}/></WorkspaceAuth></ClerkProvider>;
}
