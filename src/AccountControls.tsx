import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { platform } from './platform-client';

export default function AccountControls({ returnTo = '/login' }: { returnTo?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  return <div className="account-controls">{error && <span role="alert">Could not sign out. Try again.</span>}<button className="text-button" disabled={busy} onClick={() => {
    setBusy(true); setError(false);
    void platform.auth.signOut({ scope: 'local' }).then(({ error }) => {
      if (error) { setBusy(false); setError(true); } else location.replace(returnTo);
    }).catch(() => { setBusy(false); setError(true); });
  }}><LogOut size={16} aria-hidden="true"/>{busy ? 'Signing out…' : 'Sign out'}</button></div>;
}
