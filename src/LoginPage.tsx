import AppLink from './AppLink';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, LoaderCircle, LockKeyhole } from 'lucide-react';
import { platform } from './platform-client';
import { teacherAccountReturnUrl } from './teacher-auth-url';
import { validateAccountForm } from './account-form';
import type { AccountFormErrors } from './account-form';
import { studentsError } from './students-api';

export function AccountForm({ connectionInvitation = false }: { connectionInvitation?: boolean }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice('');
    const validation = validateAccountForm(email, password, mode === 'signup');
    setErrors(validation);
    const first = Object.keys(validation)[0];
    if (first) { document.getElementById(`account-${first}`)?.focus(); return; }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await platform.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { data, error } = await platform.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: teacherAccountReturnUrl(location.href) } });
        if (error) throw error;
        if (!data.session) {
          setNotice(connectionInvitation ? 'Confirm your email using the link in your inbox, then reopen your teacher’s personal invitation and sign in to accept it.' : 'Check your inbox to confirm your email address, then sign in. If you already have an account, use your existing password.');
          setMode('signin'); setPassword('');
        }
      }
    } catch (error) { setError(studentsError(error)); }
    finally { setBusy(false); }
  };
  return <form className="login-form" noValidate onSubmit={event => void submit(event)}>
    <span className="landing-eyebrow">YOUR LESSON STUDIO ACCOUNT</span>
    <h1>{mode === 'signin' ? 'Welcome back.' : 'Make yourself at home.'}</h1>
    <p>{mode === 'signin' ? 'Sign in to continue your English journey.' : 'Create your account with an email address you can confirm.'}</p>
    <fieldset disabled={busy}>
      <label htmlFor="account-email">Email address</label>
      <input id="account-email" type="email" autoComplete="email" required maxLength={254} value={email} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'account-email-error' : undefined} onChange={event => { setEmail(event.target.value); setErrors(previous => ({ ...previous, email: undefined })); setError(''); }}/>
      {errors.email && <span id="account-email-error" className="field-error">{errors.email}</span>}
      <label htmlFor="account-password">Password</label>
      <input id="account-password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={mode === 'signup' ? 10 : 1} value={password} aria-invalid={!!errors.password} aria-describedby={[errors.password ? 'account-password-error' : '', mode === 'signup' ? 'account-password-hint' : ''].filter(Boolean).join(' ') || undefined} onChange={event => { setPassword(event.target.value); setErrors(previous => ({ ...previous, password: undefined })); setError(''); }}/>
      {errors.password && <span id="account-password-error" className="field-error">{errors.password}</span>}
      {mode === 'signup' && <small id="account-password-hint">Use at least 10 characters.</small>}
      {error && <p className="login-error" role="alert">{error}</p>}
      {notice && <p className="login-notice" role="status"><Check size={18}/>{notice}</p>}
      <button className="primary" type="submit">{busy ? <LoaderCircle className="students-spinner" size={18}/> : <ArrowRight size={18}/>} {busy ? (mode === 'signin' ? 'Signing in…' : 'Creating account…') : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      <button className="login-mode" type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setNotice(''); setErrors({}); setPassword(''); }}>{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
    </fieldset>
    <p className="login-role-note"><LockKeyhole size={15} aria-hidden="true"/>Your account opens the right workspace automatically.</p>
  </form>;
}
export default function LoginPage({ invitation = false, connectionInvitation = false }: { invitation?: boolean; connectionInvitation?: boolean }) {
  useEffect(() => { document.title = 'Sign in · Lesson Studio'; }, []);
  return <div className="login-page">
    <header><AppLink className="landing-brand" href="/" aria-label="Lesson Studio home"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></AppLink><AppLink className="login-home" href="/"><ArrowLeft size={16}/>Back to home</AppLink></header>
    <main className="login-layout"><div className="login-intro"><span className="landing-eyebrow">A SPACE FOR YOUR ENGLISH</span><h2>Let’s pick up<br/>the conversation.</h2><p>Your lessons, your practice and your next step. All in one shared space.</p><span className="login-intro-note"><BookOpen size={20}/>Small steps. Real conversations.</span></div><section className="login-card" aria-label="Account access">{invitation && <p className="login-invitation">Sign in to open your teacher’s lesson invitation.</p>}{connectionInvitation && <p className="login-invitation">Sign in with the email address your teacher invited. After creating an account and confirming your email, reopen this personal invitation to accept it.</p>}<AccountForm connectionInvitation={connectionInvitation}/></section></main>
    <footer>Lesson Studio · English lessons and practice</footer>
  </div>;
}
