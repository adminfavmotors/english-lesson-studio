import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, LoaderCircle, X } from 'lucide-react';
import { saveStudent, studentsError } from './students-api';
import { emptyStudent, STUDENT_LEVELS, STUDENT_STATUSES, validateStudent } from './students-model';
import type { Student, StudentDraft, StudentErrors } from './students-model';

export function StudentEditor({student,onClose,onSaved}:{student?:Student;onClose:()=>void;onSaved:(student:Student)=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [id]=useState(()=>student?.id??crypto.randomUUID());
  const [draft,setDraft]=useState<StudentDraft>(()=>student?{...student}:emptyStudent());
  const [errors,setErrors]=useState<StudentErrors>({});const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  useEffect(()=>{const element=dialog.current;const previous=document.activeElement;element?.showModal();document.getElementById('roster-full_name')?.focus();return()=>{element?.close();if(previous instanceof HTMLElement&&previous.isConnected)previous.focus();};},[]);
  const update=(key:keyof StudentDraft,value:string)=>{setDraft(previous=>({...previous,[key]:value}));setErrors(previous=>({...previous,[key]:undefined}));setError('');};
  const submit=async(event:FormEvent)=>{
    event.preventDefault();const nextErrors=validateStudent(draft);setErrors(nextErrors);
    const first=Object.keys(nextErrors)[0];if(first){document.getElementById(`roster-${first}`)?.focus();return;}
    setBusy(true);setError('');
    try{onSaved(await saveStudent(id,draft,student?.version));}catch(error){setError(studentsError(error));}finally{setBusy(false);}
  };
  return <dialog ref={dialog} className="student-editor-dialog" aria-labelledby="student-editor-title" onCancel={event=>{event.preventDefault();if(!busy)onClose();}} onClick={event=>{if(event.target!==dialog.current||busy)return;const bounds=dialog.current.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)onClose();}}>
    <div className="dialog-heading"><div><span className="eyebrow">КАРТОЧКА УЧЕНИКА</span><h2 id="student-editor-title">{student?'Редактировать ученика':'Новый ученик'}</h2></div><button className="icon-button" aria-label="Закрыть форму ученика" disabled={busy} onClick={onClose}><X size={20}/></button></div><p className="student-form-description">Для начала достаточно имени. Остальное можно заполнить позже.</p>
    <form onSubmit={event=>void submit(event)}><fieldset disabled={busy} className="student-form-fields">
      <label className="student-field-wide" htmlFor="roster-full_name">Имя и фамилия <span className="field-required">*</span><input autoFocus id="roster-full_name" value={draft.full_name} required maxLength={120} autoComplete="off" onChange={event=>update('full_name',event.target.value)} aria-invalid={!!errors.full_name} aria-describedby={errors.full_name?'error-full_name':undefined}/>{errors.full_name&&<span className="field-error" id="error-full_name">{errors.full_name}</span>}</label>
      <label htmlFor="roster-email">Электронная почта<input id="roster-email" type="email" value={draft.email} maxLength={254} autoComplete="off" onChange={event=>update('email',event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email?'error-email':undefined}/>{errors.email&&<span className="field-error" id="error-email">{errors.email}</span>}</label>
      <label htmlFor="roster-level">Уровень английского<select id="roster-level" value={draft.level} onChange={event=>update('level',event.target.value)}><option value="">Пока не определён</option>{STUDENT_LEVELS.map(level=><option key={level}>{level}</option>)}</select></label>
      <label className="student-field-wide" htmlFor="roster-status">Статус обучения<select id="roster-status" value={draft.status} onChange={event=>update('status',event.target.value)}>{Object.entries(STUDENT_STATUSES).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="student-field-wide" htmlFor="roster-goals">Цели обучения<textarea id="roster-goals" rows={3} maxLength={2000} value={draft.goals} placeholder="Например: свободнее говорить на работе, подготовиться к B2" onChange={event=>update('goals',event.target.value)}/></label>
      <label className="student-field-wide" htmlFor="roster-notes">Заметки учителя<textarea id="roster-notes" rows={4} maxLength={5000} value={draft.notes} placeholder="Что учитывать при подготовке занятий" onChange={event=>update('notes',event.target.value)}/><small>Эти заметки доступны только в вашем кабинете.</small></label>
    </fieldset>{error&&<p className="students-error" role="alert">{error}</p>}<div className="student-dialog-actions"><button className="secondary" type="button" disabled={busy} onClick={onClose}>Отмена</button><button className="primary" type="submit" disabled={busy}>{busy?<LoaderCircle className="students-spinner" size={17}/>:<Check size={17}/>} {busy?'Сохраняем…':student?'Сохранить изменения':'Добавить ученика'}</button></div></form>
  </dialog>;
}
