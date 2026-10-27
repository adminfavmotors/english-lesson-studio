import { useEffect, useState } from 'react';
import { BookOpen, Check, Mail } from 'lucide-react';
import AppLink from './AppLink';
import AccountControls from './AccountControls';
import { useWorkspaceAuth } from './workspace-auth';
import { loadStudentConnections } from './student-invitation-api';
import { studentInvitationError } from './student-invitation';
import type { StudentConnection } from './student-invitation';

export default function StudentHome() {
  const { user, role } = useWorkspaceAuth();
  const [connections, setConnections] = useState<StudentConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    setConnections([]); setError(''); setLoading(true);
    if (role !== 'student') { setLoading(false); return; }
    const controller = new AbortController();
    void loadStudentConnections(controller.signal).then(value => {
      if (!controller.signal.aborted) setConnections(value);
    }).catch(error => {
      if (!controller.signal.aborted) setError(studentInvitationError(error));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [user?.id, role, revision]);
  return <div className="student-home" data-role="student"><header><AppLink className="landing-brand" href="/"><span><BookOpen size={23}/></span>lesson<strong>studio</strong></AppLink><AccountControls/></header><main>
    <span className="landing-eyebrow">YOUR LEARNING SPACE</span><h1>Ready for your<br/>next conversation?</h1><p>This is your space for learning English with your teacher.</p>
    {loading ? <p role="status">Checking your account connections…</p> : error ? <section className="student-home-card"><p role="alert">{error}</p><button className="secondary" onClick={() => setRevision(value => value + 1)}>Try again</button></section> : connections.length > 0 ? <section className="student-home-card"><Check size={28} aria-hidden="true"/><h2>Connected with your teacher</h2>{connections.map(connection => <p key={connection.student_id}>Your student profile: {connection.student_name}.</p>)}<p>Your teacher can see that you have accepted your personal invitation.</p></section> : <section className="student-home-card"><Mail size={28} aria-hidden="true"/><h2>Connect with your teacher</h2><p>Open the personal invitation your teacher sent you and accept it using your confirmed email account. If you have not received a link, ask your teacher.</p></section>}
    <section className="student-home-card"><Mail size={28} aria-hidden="true"/><h2>Join your next lesson</h2><p>Open the lesson invitation your teacher sent you. If you have not received a link yet, ask your teacher before your lesson.</p><p>Your teacher chooses the lesson and shares access with you.</p></section>
  </main></div>;
}
