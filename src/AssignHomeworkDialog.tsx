import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { platform } from './platform-client';
import { assignHomework } from './homework-api';
import type { Homework } from './homework-api';
import AppLink from './AppLink';
type Recipient = { id: string; full_name: string; student_user_id: string | null };
export default function AssignHomeworkDialog({ materialId, onClose, onAssigned }: { materialId: string; onClose: () => void; onAssigned: (homework: Homework) => void }) {
  const dialog = useRef<HTMLDialogElement>(null), requestId = useRef(crypto.randomUUID());
  const [students, setStudents] = useState<Recipient[]>([]), [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [revision, setRevision] = useState(0);
  useEffect(() => { const previous = document.activeElement; dialog.current?.showModal(); return () => { dialog.current?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); }; }, []);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    void (async () => {
      const rows: Recipient[] = [];
      for (let offset = 0; ; offset += 250) {
        const result = await platform.from('teacher_students').select('id,full_name,student_user_id').neq('status', 'archived').order('full_name').order('id').range(offset, offset + 249).abortSignal(controller.signal);
        if (result.error) throw new Error('Could not load your students. Check your connection and try again.');
        rows.push(...result.data); if (result.data.length < 250) break;
      }
      if (!controller.signal.aborted) setStudents(rows);
    })().catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  return <dialog ref={dialog} className="homework-assign-dialog" aria-labelledby="assign-homework-title" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}>
    <div className="dialog-heading"><h2 id="assign-homework-title">Assign homework</h2><button className="icon-button" aria-label="Close homework assignment" disabled={busy} onClick={onClose}><X size={20}/></button></div>
    <p>The student will find this dictation in their learning space. Their answers and your review are saved to this assignment.</p>
    {loading ? <p role="status">Loading students…</p> : <><label htmlFor="homework-recipient">Student</label><select id="homework-recipient" value={studentId} disabled={busy} onChange={e => setStudentId(e.target.value)}><option value="">Choose a student</option>{students.map(s => <option key={s.id} value={s.id} disabled={!s.student_user_id}>{s.full_name}{!s.student_user_id ? ' — account not connected' : ''}</option>)}</select>
      <p className="dictation-helper">A student must accept their personal account invitation first. Manage invitations in <AppLink href="/teacher/students">Students</AppLink>.</p></>}
    {error && <p role="alert" className="homework-error">{error} <button className="text-button" disabled={busy} onClick={() => setRevision(v => v + 1)}>Reload students</button></p>}
    <div className="homework-actions"><button className="secondary" disabled={busy} onClick={onClose}>Cancel</button><button className="primary" disabled={busy || loading || !studentId} onClick={async () => {
      setBusy(true); setError('');
      try { onAssigned(await assignHomework(requestId.current, studentId, materialId)); }
      catch (e) { setError((e as Error).message); }
      finally { setBusy(false); }
    }}>{busy ? 'Assigning…' : 'Assign homework'}</button></div>
  </dialog>;
}
