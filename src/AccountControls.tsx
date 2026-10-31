import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useClerk } from '@clerk/react';
import { clearAccountReturn, saveAccountReturn } from './account-return';

export default function AccountControls({ returnTo = '/login' }: { returnTo?: string }) {
  const clerk = useClerk();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  return <div className="account-controls">{error && <span role="alert">Could not sign out. Try again.</span>}<button className="text-button" disabled={busy} onClick={() => {
    setBusy(true); setError(false);
    try {
      clearAccountReturn();
      saveAccountReturn(new URL(returnTo, location.origin).href);
    } catch { setBusy(false); setError(true); return; }
    void clerk.signOut({ redirectUrl: new URL('/login', location.origin).href })
      .catch(() => { setBusy(false); setError(true); });
  }}><LogOut size={16} aria-hidden="true"/>{busy ? 'Signing out…' : 'Sign out'}</button></div>;
}
