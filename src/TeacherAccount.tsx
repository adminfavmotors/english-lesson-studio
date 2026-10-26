import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, LoaderCircle, LockKeyhole, ShieldCheck, Target, Users } from 'lucide-react';
import { platform } from './platform-client';
import { studentsError } from './students-api';
import { teacherAccountReturnUrl } from './teacher-auth-url';

export function TeacherAccount() {
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
  const submit=async(event:FormEvent)=>{
    event.preventDefault();setBusy(true);setError('');setNotice('');
    try{
      if(mode==='signin'){
        const {error}=await platform.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;
      }else{
        const {data,error}=await platform.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:teacherAccountReturnUrl(location.href)}});if(error)throw error;
        if(!data.session){setNotice('Check your inbox and confirm your email using the link. Then return to this page and sign in. If you already have an account, use sign in.');setMode('signin');setPassword('');}
      }
    }catch(error){setError(studentsError(error));}finally{setBusy(false);}
  };
  return <section className="teacher-account-gate" aria-labelledby="teacher-account-title">
    <div className="teacher-account-intro"><span className="account-lock"><LockKeyhole size={27}/></span><span className="eyebrow">YOUR TEACHER WORKSPACE</span><h2 id="teacher-account-title">Your teaching,<br/>in one place.</h2><p>Keep students, goals and materials organised. Continue teaching from any computer.</p><ul><li><Users size={18}/>A separate profile for every student</li><li><Target size={18}/>Learning levels, goals and status</li><li><ShieldCheck size={18}/>A private workspace linked to your account</li></ul></div>
    <form className="teacher-account-form" onSubmit={event=>void submit(event)}><div className="account-form-heading"><span className="eyebrow">YOUR WORKSPACE</span><h3>{mode==='signin'?'Sign in':'Create account'}</h3><p>{mode==='signin'?'Use your email address and password.':'Your students and private materials will be linked to this account.'}</p></div><fieldset disabled={busy}><label htmlFor="teacher-email">Email address<input id="teacher-email" type="email" value={email} required maxLength={254} autoComplete="email" onChange={event=>setEmail(event.target.value)}/></label><label htmlFor="teacher-password">Password<input id="teacher-password" type="password" required minLength={mode==='signup'?10:1} autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={event=>setPassword(event.target.value)} aria-describedby={mode==='signup'?'teacher-password-hint':undefined}/></label>{mode==='signup'&&<small id="teacher-password-hint">Use at least 10 characters. Choose your own password.</small>}{error&&<p className="students-error" role="alert">{error}</p>}{notice&&<p className="students-notice" role="status">{notice}</p>}<button className="primary" type="submit">{busy?<LoaderCircle className="students-spinner" size={18}/>:<ArrowRight size={18}/>} {busy?'Please wait…':mode==='signin'?'Sign in':'Create account'}</button><button type="button" className="text-button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setNotice('');}}>{mode==='signin'?'New here? Create an account':'Already have an account? Sign in'}</button></fieldset></form>
  </section>;
}
