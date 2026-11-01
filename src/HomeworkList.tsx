import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import AppLink from './AppLink';
import { homeworkPath } from './app-routes';
import { listHomework, HOMEWORK_STATUSES } from './homework-api';
import type { HomeworkStatus, HomeworkSummary } from './homework-api';
import { useWorkspaceAuth } from './workspace-auth';
import { APP_LOCALE } from './app-language';
export function HomeworkBadge({ status }: { status: HomeworkStatus }) { return <span className={`homework-badge ${status}`}><span aria-hidden="true"/>{HOMEWORK_STATUSES[status]}</span>; }
export default function HomeworkList({ studentId = null }: { studentId?: string | null }) {
  const { role } = useWorkspaceAuth();
  const [rows, setRows] = useState<HomeworkSummary[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1); window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    void listHomework(studentId, controller.signal).then(value => { if (!controller.signal.aborted) setRows(value); })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [studentId, revision]);
  return <section className="homework-list" aria-label="Homework"><div className="homework-section-heading"><h2>Homework</h2><button className="icon-button" aria-label="Refresh homework" disabled={loading} onClick={() => setRevision(v => v + 1)}><RefreshCw size={18}/></button></div>
    {error ? <p role="alert">{error} <button className="text-button" onClick={() => setRevision(v => v + 1)}>Try again</button></p> : loading ? <p role="status">Loading homework…</p> : rows.length === 0 ? <p>{role === 'teacher' ? 'No homework assigned yet. Open a dictation in Materials and select Assign homework.' : 'Your teacher’s homework will appear here. You can also open a homework link from your teacher.'}</p> : <ul>{rows.map(row => <li key={row.id}>
      <div><AppLink href={homeworkPath(role === 'teacher' ? 'teacher' : 'student', row.id)}>{row.catalogue.title}</AppLink><p>{new Date(row.assigned_at).toLocaleDateString(APP_LOCALE, { day: 'numeric', month: 'short' })} · {row.result.done}/{row.result.total} words</p></div><HomeworkBadge status={row.status}/>
    </li>)}</ul>}
  </section>;
}
