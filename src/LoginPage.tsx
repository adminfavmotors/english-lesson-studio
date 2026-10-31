import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/react';
import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
import AppLink from './AppLink';
import { saveAccountReturn } from './account-return';

export default function LoginPage({ invitation = false, connectionInvitation = false }: { invitation?: boolean; connectionInvitation?: boolean }) {
  const clerk = useClerk();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Sign in · Lesson Studio'; }, []);
  const open = async (create: boolean) => {
    setBusy(true); setError('');
    try {
      saveAccountReturn(location.href);
      const callback = new URL('/login', location.origin).href;
      const options = { redirectUrl: callback, signInForceRedirectUrl: callback, signUpForceRedirectUrl: callback };
      if (create) await clerk.redirectToSignUp(options);
      else await clerk.redirectToSignIn(options);
    } catch { setBusy(false); setError('We could not open account access. Please try again.'); }
  };
  return <div className="login-page">
    <header><AppLink className="landing-brand" href="/" aria-label="Lesson Studio home"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></AppLink><AppLink className="login-home" href="/"><ArrowLeft size={16}/>Back to home</AppLink></header>
    <main className="login-layout"><div className="login-intro"><span className="landing-eyebrow">A SPACE FOR YOUR ENGLISH</span><h2>Let’s pick up<br/>the conversation.</h2><p>Your lessons, your practice and your next step. All in one shared space.</p><span className="login-intro-note"><BookOpen size={20}/>Small steps. Real conversations.</span></div>
      <section className="login-card" aria-label="Account access">
        {(invitation || connectionInvitation) && <p className="login-invitation">{connectionInvitation ? 'Sign in with the email address your teacher invited. Your invitation will stay in this browser.' : 'Sign in to open your teacher’s lesson invitation. Your lesson link will stay in this browser.'}</p>}
        <div className="login-access"><span className="landing-eyebrow">YOUR LESSON STUDIO ACCOUNT</span><h1>Welcome back.</h1><p>Continue to Clerk to sign in or create your account, then return to your workspace.</p>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="primary" disabled={busy} onClick={() => void open(false)}><ArrowRight size={18} aria-hidden="true"/>{busy ? 'Opening account access…' : 'Sign in'}</button>
          <button className="secondary" disabled={busy} onClick={() => void open(true)}>Create account</button>
          <p className="login-role-note"><LockKeyhole size={15} aria-hidden="true"/>Clerk handles your account. Lesson Studio opens the workspace you can access.</p>
        </div>
      </section>
    </main><footer>Lesson Studio · English lessons and practice</footer>
  </div>;
}
