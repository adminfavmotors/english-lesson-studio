import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BookOpen, Check, UserRound } from 'lucide-react';
import AppLink from './AppLink';
import AccountControls from './AccountControls';
import { studentClassroomPath } from './app-routes';
import { useWorkspaceAuth } from './workspace-auth';
import { acceptStudentInvitation, previewStudentInvitation } from './student-invitation-api';
import { studentInvitationError, studentInvitationToken } from './student-invitation';
import type { StudentInvitationPreview } from './student-invitation';

const subscribeToInvitation = (notify: () => void) => {
  window.addEventListener('hashchange', notify);
  window.addEventListener('popstate', notify);
  return () => {
    window.removeEventListener('hashchange', notify);
    window.removeEventListener('popstate', notify);
  };
};
const currentInvitationToken = () => studentInvitationToken(location.href);

export default function StudentConnectionPage() {
  const token = useSyncExternalStore(subscribeToInvitation, currentInvitationToken);
  return <StudentConnection key={token ?? 'missing'} token={token}/>;
}

function StudentConnection({ token }: { token: string | null }) {
  const { user, role } = useWorkspaceAuth();
  const [preview, setPreview] = useState<StudentInvitationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { document.title = 'Connect with your teacher · Lesson Studio'; }, []);
  useEffect(() => { if (preview?.connected) heading.current?.focus(); }, [preview?.connected]);
  useEffect(() => {
    setPreview(null); setError(''); setLoading(true);
    if (!token || role !== 'student') { setLoading(false); return; }
    const controller = new AbortController();
    void previewStudentInvitation(token, controller.signal).then(value => {
      if (!controller.signal.aborted) setPreview(value);
    }).catch(error => {
      if (!controller.signal.aborted) setError(studentInvitationError(error));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, user?.id, role, revision]);
  const accept = async () => {
    if (!token) return;
    setBusy(true); setError('');
    try { setPreview(await acceptStudentInvitation(token)); }
    catch (error) { setError(studentInvitationError(error)); }
    finally { setBusy(false); }
  };
  return <div className="student-home" data-role="student">
    <header><AppLink className="landing-brand" href="/"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></AppLink><AccountControls returnTo={location.pathname + location.hash}/></header>
    <main><span className="landing-eyebrow">PERSONAL INVITATION</span><h1 ref={heading} tabIndex={-1}>{preview?.connected ? 'You’re connected.' : 'Connect with your teacher.'}</h1>
      <section className="student-home-card" aria-busy={loading || busy}>
        {preview?.connected ? <Check size={28} aria-hidden="true"/> : <UserRound size={28} aria-hidden="true"/>}
        <h2>{preview?.connected ? `Welcome, ${preview.student_name}.` : 'Accept your invitation'}</h2>
        <p>Signed in as {user?.email}.</p>
        {!token ? <p role="alert">This invitation link is incomplete. Ask your teacher for the full link.</p> : role !== 'student' ? <p role="alert">Open this invitation with your student account. Sign out to use a different account.</p> : loading ? <p role="status">Checking your invitation…</p> : <>
          {error && <p className="students-error" role="alert">{error}</p>}
          {preview?.connected ? <><p role="status">Your account is connected to your teacher’s student profile. Your teacher will share lesson invitations with you.</p><AppLink className="primary" href={studentClassroomPath}>Open your learning space</AppLink></> : preview && <><p>Connect this account to the student profile “{preview.student_name}”. Your teacher will see that you have accepted.</p><button className="primary" disabled={busy} onClick={() => void accept()}>{busy ? 'Connecting…' : 'Accept invitation'}</button></>}
          {error && <button className="secondary" disabled={busy} onClick={() => setRevision(value => value + 1)}>Check invitation again</button>}
        </>}
      </section>
    </main>
  </div>;
}
