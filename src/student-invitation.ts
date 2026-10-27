export type StudentInvitationStatus = {
  status: 'not-invited' | 'pending' | 'expired' | 'revoked' | 'connected';
  email: string | null;
  expires_at: string | null;
  connected_at: string | null;
};
export type StudentInvitationPreview = { student_name: string; expires_at: string; connected: boolean };
export type StudentConnection = { student_id: string; student_name: string; connected_at: string };
export const studentConnectPath = '/student/connect';
const tokenPattern = /^[0-9a-f]{64}$/;

export function studentInvitationLink(address: string, token: string) {
  if (!tokenPattern.test(token)) throw new Error('Invalid student invitation token.');
  const url = new URL(studentConnectPath, address);
  url.hash = new URLSearchParams({ invite: token }).toString();
  return url.href;
}
export function studentInvitationToken(address: string): string | null {
  const url = new URL(address);
  if (url.pathname !== studentConnectPath) return null;
  const params = new URLSearchParams(url.hash.slice(1));
  const tokens = params.getAll('invite');
  return tokens.length === 1 && tokenPattern.test(tokens[0]) ? tokens[0] : null;
}

const invitationMessages = new Set([
  'Sign in with a confirmed account.',
  'Use your student account.',
  'Only your teacher can manage invitations.',
  'This student profile is unavailable.',
  'This profile has changed. Refresh the student list and try again.',
  'This student already has a connected account.',
  'Restore this profile before inviting the student.',
  'Add the student’s email address to their profile before inviting them.',
  'This invitation is unavailable. Ask your teacher for a new link.',
  'Sign in with the email address your teacher invited, then reopen this link.',
  'This student already has a connected account. Contact your teacher.',
  'Your account is already connected to another profile with this teacher. Contact your teacher.',
]);
export function studentInvitationError(error: unknown) {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  return invitationMessages.has(message) ? message : 'Could not update the account connection. Check your connection and try again.';
}
