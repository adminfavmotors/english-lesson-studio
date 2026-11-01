import { useCallback, useEffect, useRef, useState } from 'react';
import AppLink from './AppLink';
import AccountControls from './AccountControls';
import WorkspaceNotice from './WorkspaceNotice';
import DictationLesson from './DictationLesson';
import { HomeworkBadge } from './HomeworkList';
import { getHomework, reviewHomework, saveHomework, submitHomework } from './homework-api';
import type { Homework } from './homework-api';
import { dictationCounts, dictationWords } from './dictation-model';
import type { DictationProgress } from './dictation-model';
import { homeworkPath } from './app-routes';
import { APP_LOCALE } from './app-language';
import { navigateInApp } from './navigation';

function HomeworkWork({ initial, teacher, reload }: { initial: Homework; teacher: boolean; reload: () => void }) {
  const [homework, setHomework] = useState(initial), [progress, setProgress] = useState(initial.progress), [feedback, setFeedback] = useState(initial.feedback);
  const [saving, setSaving] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [dirty, setDirty] = useState(false), [copied, setCopied] = useState(false);
  const current = useRef(initial), latest = useRef(progress), acknowledged = useRef(JSON.stringify(progress)), pending = useRef<Promise<void> | null>(null), alive = useRef(true), conflict = useRef(false);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const change = (next: DictationProgress) => { latest.current = next; setProgress(next); setDirty(JSON.stringify(next) !== acknowledged.current); };
  const flush = useCallback(async function persist(): Promise<void> {
    if (pending.current) { await pending.current; return persist(); }
    const serialised = JSON.stringify(latest.current);
    if (serialised === acknowledged.current) return;
    if (conflict.current) throw new Error('Your answers are still in this tab. Copy any unsaved answers before reloading saved work.');
    if (alive.current) setSaving(true);
    const request = (async () => {
      try {
        const saved = await saveHomework(current.current.id, current.current.version, JSON.parse(serialised));
        current.current = saved; acknowledged.current = serialised;
        if (alive.current) { setHomework(saved); setDirty(JSON.stringify(latest.current) !== serialised); setError(''); }
      } catch (e) {
        if ((e as { code?: string }).code === 'PT409') conflict.current = true;
        if (alive.current) setError((e as Error).message);
        throw e;
      } finally { if (alive.current) setSaving(false); }
    })();
    pending.current = request;
    try { await request; } finally { pending.current = null; }
    if (JSON.stringify(latest.current) !== acknowledged.current) return persist();
  }, []);
  useEffect(() => {
    if (teacher || homework.status !== 'not_completed' || !dirty) return;
    const timer = window.setTimeout(() => { void flush().catch(() => {}); }, 650);
    return () => window.clearTimeout(timer);
  }, [progress, dirty, teacher, homework.status, flush]);
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => { if (JSON.stringify(latest.current) !== acknowledged.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', prevent); return () => window.removeEventListener('beforeunload', prevent);
  }, []);
  const result = dictationCounts(dictationWords(homework.content.sentences).flat(), progress);
  const readOnly = teacher || homework.status !== 'not_completed' || busy;
  const studentUrl = new URL(homeworkPath('student', homework.id), location.origin).href;
  const complete = async () => {
    setBusy(true); setError('');
    try {
      await flush();
      const saved = await submitHomework(homework.id, current.current.version, latest.current);
      current.current = saved; setHomework(saved); setProgress(saved.progress); latest.current = saved.progress; acknowledged.current = JSON.stringify(saved.progress); setDirty(false);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  return <div className={`homework-page ${teacher ? 'teacher-homework' : 'student-homework'}`}>
    {!teacher && <header className="homework-account"><AppLink href="/student/classroom" onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || JSON.stringify(latest.current) === acknowledged.current) return;
      event.preventDefault(); void flush().then(() => navigateInApp('/student/classroom')).catch(() => {});
    }}>Your learning space</AppLink><AccountControls/></header>}
    <article><div className="homework-page-heading"><div>{teacher && <AppLink href="/teacher/students">Back to Students</AppLink>}<p className="eyebrow">{teacher ? `HOMEWORK REVIEW · ${homework.student_name}` : 'YOUR HOMEWORK'} · {homework.catalogue.level}</p><h1>{homework.catalogue.title}</h1><p>Assigned {new Date(homework.assigned_at).toLocaleDateString(APP_LOCALE, { day: 'numeric', month: 'long' })} · {homework.catalogue.duration} minutes</p></div><HomeworkBadge status={homework.status}/></div>
      {teacher && <section className="homework-link"><label>Student homework link<input readOnly value={studentUrl} onFocus={e => e.target.select()}/></label><button className="secondary" onClick={async () => { try { await navigator.clipboard.writeText(studentUrl); setCopied(true); } catch { setError('Select and copy the student homework link above.'); } }}>{copied ? 'Copied' : 'Copy student link'}</button><p>Only the assigned student can open this link after signing in.</p></section>}
      <p>{homework.content.instruction}</p>
      {!teacher && homework.status === 'not_completed' && <div className="homework-save-bar"><span role="status">{saving ? 'Saving answers…' : dirty ? 'Unsaved answers — keep this page open.' : 'All answers saved.'}</span><button className="secondary" disabled={busy || saving || !dirty} onClick={() => { void flush().catch(() => {}); }}>Save answers</button></div>}
      {error && <div className="homework-error" role="alert"><p>{error}</p><button className="secondary" onClick={reload}>Reload saved work</button></div>}
      {homework.status !== 'not_completed' && <p role="status" className="dictation-notice">{homework.status === 'reviewed' ? 'Your teacher has reviewed this homework.' : teacher ? 'The student has sent this work for your review.' : 'Homework completed and sent to your teacher.'} Answers are now read-only.</p>}
      <DictationLesson content={homework.content} progress={progress} onChange={change} readOnly={readOnly}/>
      <section className="homework-summary"><h2>{teacher ? 'Student work' : 'Your work'}</h2><p>Correct without Show: {result.correct} · Shown: {result.shown} · Words with hints: {result.hinted}</p>
        {!teacher && homework.status === 'not_completed' && <><p>Finish every word, then send your work. Your teacher can see which words used hints or Show.</p><button className="primary" disabled={busy || result.done !== result.total} onClick={() => void complete()}>{busy ? 'Sending homework…' : 'Send to teacher'}</button></>}
      </section>
      {teacher && <section className="homework-review"><h2>Your review</h2><label>Feedback for the student<textarea rows={4} maxLength={3000} value={feedback} readOnly={homework.status !== 'completed'} onChange={e => setFeedback(e.target.value)}/></label>
        <button className="primary" disabled={busy || homework.status !== 'completed'} onClick={async () => { setBusy(true); setError(''); try { const reviewed = await reviewHomework(homework.id, current.current.version, feedback); current.current = reviewed; setHomework(reviewed); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }}>{homework.status === 'reviewed' ? 'Reviewed' : busy ? 'Saving review…' : 'Mark as reviewed'}</button>
        {homework.status === 'not_completed' && <p>The student has not sent this homework yet. You can view saved progress while they work.</p>}</section>}
      {!teacher && homework.status === 'reviewed' && <section className="homework-review"><h2>Your teacher’s feedback</h2><p>{homework.feedback || 'Your teacher has checked your work.'}</p></section>}
    </article>
  </div>;
}
export default function HomeworkPage({ id, teacher }: { id: string; teacher: boolean }) {
  const [homework, setHomework] = useState<Homework | null>(null), [error, setError] = useState(''), [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setHomework(null); setError('');
    void getHomework(id, controller.signal).then(h => {
      if (controller.signal.aborted) return;
      if ((h.access === 'teacher') !== teacher) { location.replace(homeworkPath(h.access, id)); return; }
      setHomework(h);
    }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [id, revision, teacher]);
  useEffect(() => { document.title = `${homework?.catalogue.title ?? 'Homework'} · Lesson Studio`; }, [homework?.catalogue.title]);
  return error ? <WorkspaceNotice title="We could not open this homework" description={error} href={teacher ? '/teacher/students' : '/student/classroom'} label={teacher ? 'Back to Students' : 'Back to your learning space'} onRetry={() => setRevision(v => v + 1)}/> : homework ? <HomeworkWork key={`${id}.${revision}`} initial={homework} teacher={teacher} reload={() => setRevision(v => v + 1)}/> : <WorkspaceNotice title="Loading homework…" loading/>;
}
