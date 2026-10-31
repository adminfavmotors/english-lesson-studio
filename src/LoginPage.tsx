import { useEffect } from 'react';
import { SignIn } from '@clerk/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import AppLink from './AppLink';

export default function LoginPage({ invitation = false, connectionInvitation = false }: { invitation?: boolean; connectionInvitation?: boolean }) {
  useEffect(() => { document.title = 'Your account · Lesson Studio'; }, []);
  return <div className="login-page">
    <header><AppLink className="landing-brand" href="/" aria-label="Lesson Studio home"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></AppLink><AppLink className="login-home" href="/"><ArrowLeft size={16}/>Back to home</AppLink></header>
    <main className="login-layout"><div className="login-intro"><span className="landing-eyebrow">A SPACE FOR YOUR ENGLISH</span><h2>Let’s pick up<br/>the conversation.</h2><p>Your lessons, your practice and your next step. All in one shared space.</p><span className="login-intro-note"><BookOpen size={20}/>Small steps. Real conversations.</span></div>
      <section className="login-card" aria-label="Account access">
        {(invitation || connectionInvitation) && <p className="login-invitation">{connectionInvitation ? 'Sign in with the email address your teacher invited. Your invitation will open after you sign in.' : 'Sign in to open your teacher’s lesson invitation.'}</p>}
        <SignIn routing="hash" withSignUp forceRedirectUrl="/login" signUpForceRedirectUrl="/login" />
      </section>
    </main><footer>Lesson Studio · English lessons and practice</footer>
  </div>;
}
