import { useEffect, useState } from 'react';
import { Check, Copy, Link, RefreshCw, UserRound } from 'lucide-react';
import { APP_LOCALE } from './app-language';
import type { Student } from './students-model';
import { createStudentInvitation, loadStudentInvitation, revokeStudentInvitation } from './student-invitation-api';
import { studentInvitationError, studentInvitationLink } from './student-invitation';
import type { StudentInvitationStatus } from './student-invitation';

export default function StudentAccountInvitation({ student }: { student: Student }) {
  const [status, setStatus] = useState<StudentInvitationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setLink(''); setCopied(false); setStatus(null);
    void loadStudentInvitation(student.id, controller.signal).then(value => {
      if (!controller.signal.aborted) setStatus(value);
    }).catch(error => {
      if (!controller.signal.aborted) setError(studentInvitationError(error));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [student.id, student.version, revision]);

  const change = async (action: 'create' | 'revoke') => {
    setBusy(true); setError(''); setCopied(false);
    try {
      if (action === 'create') {
        const value = await createStudentInvitation(student.id, student.version);
        setStatus(value); setLink(studentInvitationLink(location.href, value.token));
      } else {
        setStatus(await revokeStudentInvitation(student.id)); setLink('');
      }
    } catch (error) { setError(studentInvitationError(error)); }
    finally { setBusy(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); }
    catch { setError('Select the invitation link and copy it manually.'); }
  };
  const canInvite = !!student.email.trim() && student.status !== 'archived';
  return <section className="student-profile-section student-account-invitation" aria-labelledby="student-account-title">
    <h3 id="student-account-title"><UserRound size={18} aria-hidden="true"/>Student account</h3>
    {loading ? <p role="status">Checking account connection…</p> : <>
      {error && <p className="students-error" role="alert">{error}</p>}
      {status?.status === 'connected' ? <><p role="status"><Check size={17} aria-hidden="true"/> Account connected. This student has accepted your invitation.</p><p>Changing the contact email does not change the connected account.</p></> : status && <>
        <p>{status.status === 'pending' ? `Invitation awaiting acceptance by ${status.email}.` : status.status === 'revoked' ? 'The previous invitation has been revoked.' : status.status === 'expired' ? 'The previous invitation has expired.' : 'No account connected yet.'}</p>
        {!canInvite ? <p>{student.status === 'archived' ? 'Restore this profile before inviting the student.' : 'Add the student’s email address to their profile before inviting them.'}</p> : <p>The student must confirm this email address and accept your link. Creating a link does not send an email.</p>}
        {status.status === 'pending' && status.expires_at && <p>Expires {new Date(status.expires_at).toLocaleString(APP_LOCALE)}.</p>}
        {link && <div className="student-invitation-link"><label htmlFor="student-account-link">Personal invitation link</label><input id="student-account-link" readOnly value={link} onFocus={event => event.target.select()}/><button className="secondary" disabled={busy} onClick={() => void copy()}>{copied ? <Check size={16} aria-hidden="true"/> : <Copy size={16} aria-hidden="true"/>}{copied ? 'Copied' : 'Copy invitation link'}</button></div>}
        <div className="student-invitation-actions">
          <button className="secondary" disabled={busy || !canInvite} onClick={() => void change('create')}><Link size={16} aria-hidden="true"/>{busy ? 'Updating invitation…' : status.status === 'pending' ? 'Replace invitation link' : 'Create invitation link'}</button>
          {status.status === 'pending' && <button className="text-button" disabled={busy} onClick={() => void change('revoke')}>Revoke invitation</button>}
        </div>
        {status.status === 'pending' && <p>Replacing the link invalidates the previous invitation.</p>}
      </>}
      <button className="text-button" disabled={busy} onClick={() => setRevision(value => value + 1)}><RefreshCw size={15} aria-hidden="true"/>Refresh connection status</button>
    </>}
  </section>;
}
