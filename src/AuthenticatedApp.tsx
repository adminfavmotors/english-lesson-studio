import { lazy, Suspense, useEffect } from 'react';
import type { AppRoute } from './app-routes';
import { WorkspaceAuth, useWorkspaceAuth } from './workspace-auth';
import { mayOpenWorkspace, workspaceHome } from './workspace-access';
import LoginPage from './LoginPage';
import AccountControls from './AccountControls';
import WorkspaceNotice from './WorkspaceNotice';

const TeacherWorkspace = lazy(() => import('./TeacherWorkspace'));
const StudentWorkspace = lazy(() => import('./StudentWorkspace'));
type ProtectedRoute = Exclude<AppRoute, { area: 'entry' | 'not-found' }>;
function WorkspaceGate({ route }: { route: ProtectedRoute }) {
  const auth = useWorkspaceAuth();
  const target = auth.status === 'ready' && auth.role && (route.area === 'login' || !mayOpenWorkspace(auth.role, route)) ? workspaceHome(auth.role) : null;
  useEffect(() => { if (target) location.replace(target); }, [target]);
  if (auth.status === 'loading' || target) return <WorkspaceNotice title="Opening your workspace…" loading/>;
  if (auth.status === 'signed-out') return <LoginPage invitation={route.area !== 'login' && new URL(location.href).searchParams.has('session')} connectionInvitation={route.area === 'student' && route.page === 'connect'}/>;
  if (auth.status === 'error') return <><AccountControls/><WorkspaceNotice title="We could not check your access" description="Check your connection, then try again." onRetry={auth.retry}/></>;
  if (!auth.role) return <><AccountControls/><WorkspaceNotice title="Your account is not ready yet" description="Confirm your email address, then sign in again. Contact your teacher if you still cannot open your workspace." href="/"/></>;
  return <Suspense fallback={<WorkspaceNotice title="Loading your workspace…" loading/>}>{route.area === 'teacher' ? <TeacherWorkspace route={route}/> : route.area === 'student' ? <StudentWorkspace route={route}/> : null}</Suspense>;
}
export default function AuthenticatedApp({ route }: { route: ProtectedRoute }) {
  return <WorkspaceAuth><WorkspaceGate route={route}/></WorkspaceAuth>;
}
