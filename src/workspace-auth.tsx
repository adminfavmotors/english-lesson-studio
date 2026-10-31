import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@clerk/react';
import { platform } from './platform-client';
import { setAccountTokenSource } from './account-token';
import { workspaceRole } from './workspace-access';
import type { WorkspaceRole } from './workspace-access';

export type WorkspaceUser = { id: string; email: string };
type AuthState = { status: 'loading' | 'signed-out' | 'ready' | 'error'; user: WorkspaceUser | null; role: WorkspaceRole | null };
const initial: AuthState = { status: 'loading', user: null, role: null };
const AuthContext = createContext<AuthState & { retry: () => void }>({ ...initial, retry: () => {} });

export function WorkspaceAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, sessionId, getToken } = useAuth();
  const [state, setState] = useState<AuthState>(initial);
  const [checkedSession, setCheckedSession] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    const controller = new AbortController();
    const release = setAccountTokenSource(() => getToken());
    setCheckedSession(sessionId ?? null);
    // Retire only the superseded Auth credentials; keep learner drafts intact.
    try { localStorage.removeItem('lessonstudio.teacher.auth.v1'); } catch { /* storage may be unavailable */ }
    if (!isLoaded) setState(initial);
    else if (!isSignedIn) setState({ status: 'signed-out', user: null, role: null });
    else {
      setState(initial);
      // Supabase verifies Clerk's signature; this RPC binds the stable account
      // UUID and reads the server-managed role. User metadata grants no role.
      void platform.rpc('workspace_account').abortSignal(AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]))
        .then(({ data, error }) => {
          if (controller.signal.aborted || current !== generation.current) return;
          if (error || !data || typeof data.id !== 'string' || typeof data.email !== 'string') {
            setState({ status: 'error', user: null, role: null });
          } else setState({ status: 'ready', user: { id: data.id, email: data.email }, role: workspaceRole(data.role) });
        }, () => {
          if (!controller.signal.aborted && current === generation.current) setState({ status: 'error', user: null, role: null });
        });
    }
    return () => { controller.abort(); release(); };
  }, [isLoaded, isSignedIn, sessionId, getToken, revision]);
  const current = checkedSession === (sessionId ?? null) ? state : initial;
  return <AuthContext value={{ ...current, retry: () => setRevision(value => value + 1) }}>{children}</AuthContext>;
}
export const useWorkspaceAuth = () => useContext(AuthContext);
