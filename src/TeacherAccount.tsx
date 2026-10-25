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
        if(!data.session){setNotice('Проверьте почту и подтвердите адрес по ссылке в письме. После подтверждения вернитесь на эту страницу и войдите. Если кабинет уже существует, используйте вход.');setMode('signin');setPassword('');}
      }
    }catch(error){setError(studentsError(error));}finally{setBusy(false);}
  };
  return <section className="teacher-account-gate" aria-labelledby="teacher-account-title">
    <div className="teacher-account-intro"><span className="account-lock"><LockKeyhole size={27}/></span><span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ УЧИТЕЛЯ</span><h2 id="teacher-account-title">Всё начинается<br/>с ваших учеников.</h2><p>Храните контакты, цели и заметки в одном месте. Продолжайте работу с любого компьютера.</p><ul><li><Users size={18}/>Отдельная карточка для каждого ученика</li><li><Target size={18}/>Уровень, цели и статус обучения</li><li><ShieldCheck size={18}/>Доступ к списку только через ваш аккаунт</li></ul></div>
    <form className="teacher-account-form" onSubmit={event=>void submit(event)}><div className="account-form-heading"><span className="eyebrow">ДОБРО ПОЖАЛОВАТЬ</span><h3>{mode==='signin'?'Войти в кабинет':'Создать кабинет'}</h3><p>{mode==='signin'?'Используйте свою почту и пароль.':'Ваш список учеников будет привязан к этому аккаунту.'}</p></div><fieldset disabled={busy}><label htmlFor="teacher-email">Электронная почта<input id="teacher-email" type="email" value={email} required maxLength={254} autoComplete="email" onChange={event=>setEmail(event.target.value)}/></label><label htmlFor="teacher-password">Пароль<input id="teacher-password" type="password" required minLength={mode==='signup'?10:1} autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={event=>setPassword(event.target.value)} aria-describedby={mode==='signup'?'teacher-password-hint':undefined}/></label>{mode==='signup'&&<small id="teacher-password-hint">Не менее 10 символов. Пароль задаёте вы.</small>}{error&&<p className="students-error" role="alert">{error}</p>}{notice&&<p className="students-notice" role="status">{notice}</p>}<button className="primary" type="submit">{busy?<LoaderCircle className="students-spinner" size={18}/>:<ArrowRight size={18}/>} {busy?'Подождите…':mode==='signin'?'Войти':'Создать кабинет'}</button><button type="button" className="text-button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setNotice('');}}>{mode==='signin'?'Первый раз здесь? Создать кабинет':'Уже есть кабинет? Войти'}</button></fieldset></form>
  </section>;
}
