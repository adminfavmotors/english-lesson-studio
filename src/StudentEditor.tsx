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
    <div className="dialog-heading"><div><span className="eyebrow">STUDENT PROFILE</span><h2 id="student-editor-title">{student?'Edit student':'New student'}</h2></div><button className="icon-button" aria-label="Close student form" disabled={busy} onClick={onClose}><X size={20}/></button></div><p className="student-form-description">Start with a name. You can fill in the other details later.</p>
    <form onSubmit={event=>void submit(event)}><fieldset disabled={busy} className="student-form-fields">
      <label className="student-field-wide" htmlFor="roster-full_name">Full name <span className="field-required">*</span><input autoFocus id="roster-full_name" value={draft.full_name} required maxLength={120} autoComplete="off" onChange={event=>update('full_name',event.target.value)} aria-invalid={!!errors.full_name} aria-describedby={errors.full_name?'error-full_name':undefined}/>{errors.full_name&&<span className="field-error" id="error-full_name">{errors.full_name}</span>}</label>
      <label htmlFor="roster-email">Email address<input id="roster-email" type="email" value={draft.email} maxLength={254} autoComplete="off" onChange={event=>update('email',event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email?'error-email':undefined}/>{errors.email&&<span className="field-error" id="error-email">{errors.email}</span>}</label>
      <label htmlFor="roster-level">English level<select id="roster-level" value={draft.level} onChange={event=>update('level',event.target.value)}><option value="">Not set yet</option>{STUDENT_LEVELS.map(level=><option key={level}>{level}</option>)}</select></label>
      <label className="student-field-wide" htmlFor="roster-status">Learning status<select id="roster-status" value={draft.status} onChange={event=>update('status',event.target.value)}>{Object.entries(STUDENT_STATUSES).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="student-field-wide" htmlFor="roster-goals">Learning goals<textarea id="roster-goals" rows={3} maxLength={2000} value={draft.goals} placeholder="For example: speak more confidently at work, prepare for B2" onChange={event=>update('goals',event.target.value)}/></label>
      <label className="student-field-wide" htmlFor="roster-notes">Teacher notes<textarea id="roster-notes" rows={4} maxLength={5000} value={draft.notes} placeholder="Things to keep in mind when planning lessons" onChange={event=>update('notes',event.target.value)}/><small>These notes are private to your account.</small></label>
    </fieldset>{error&&<p className="students-error" role="alert">{error}</p>}<div className="student-dialog-actions"><button className="secondary" type="button" disabled={busy} onClick={onClose}>Cancel</button><button className="primary" type="submit" disabled={busy}>{busy?<LoaderCircle className="students-spinner" size={17}/>:<Check size={17}/>} {busy?'Saving…':student?'Save changes':'Add student'}</button></div></form>
  </dialog>;
}
