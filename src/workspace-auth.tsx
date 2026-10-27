import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { platform } from './platform-client';
import { setSessionAuthToken } from './session-api';
import { workspaceRole } from './workspace-access';
import type { WorkspaceRole } from './workspace-access';

type AuthState = { status: 'loading' | 'signed-out' | 'ready' | 'error'; user: User | null; role: WorkspaceRole | null };
const initial: AuthState = { status: 'loading', user: null, role: null };
const AuthContext = createContext<AuthState & { retry: () => void }>({ ...initial, retry: () => {} });

export function WorkspaceAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initial);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  useEffect(() => {
    let active = true;
    const check = async (session: Session | null) => {
      const current = ++generation.current;
      setSessionAuthToken(session?.access_token ?? null);
      if (!session) { setState({ status: 'signed-out', user: null, role: null }); return; }
      setState({ status: 'loading', user: null, role: null });
      try {
        // The RPC verifies the JWT and reads a server-managed membership.
        const { data, error } = await platform.rpc('workspace_role').abortSignal(AbortSignal.timeout(12000));
        if (error) throw error;
        if (active && current === generation.current) setState({ status: 'ready', user: session.user, role: workspaceRole(data) });
      } catch {
        if (active && current === generation.current) setState({ status: 'error', user: session.user, role: null });
      }
    };
    const { data: { subscription } } = platform.auth.onAuthStateChange((_event, session) => {
      // Do not make Supabase requests inside the Auth client's lock.
      queueMicrotask(() => { if (active) void check(session); });
    });
    void platform.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setState({ status: 'error', user: null, role: null });
      else if (generation.current === 0) void check(data.session);
    }).catch(() => { if (active) setState({ status: 'error', user: null, role: null }); });
    return () => { active = false; generation.current = 0; subscription.unsubscribe(); setSessionAuthToken(null); };
  }, [revision]);
  return <AuthContext value={{ ...state, retry: () => setRevision(value => value + 1) }}>{children}</AuthContext>;
}
export const useWorkspaceAuth = () => useContext(AuthContext);
