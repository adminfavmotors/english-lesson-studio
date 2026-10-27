import { platform } from './platform-client';
import type { StudentConnection, StudentInvitationPreview, StudentInvitationStatus } from './student-invitation';

async function request<T>(name: string, params: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const timeout = AbortSignal.timeout(12000);
  const { data, error } = await platform.rpc(name, params).abortSignal(signal ? AbortSignal.any([signal, timeout]) : timeout);
  if (error) throw error;
  return data as T;
}
export const loadStudentInvitation = (id: string, signal: AbortSignal) =>
  request<StudentInvitationStatus>('student_invitation_status', { p_student_id: id }, signal);
export const createStudentInvitation = (id: string, version: number) =>
  request<StudentInvitationStatus & { token: string }>('student_invitation_create', { p_student_id: id, p_version: version });
export const revokeStudentInvitation = (id: string) =>
  request<StudentInvitationStatus>('student_invitation_revoke', { p_student_id: id });
export const previewStudentInvitation = (token: string, signal: AbortSignal) =>
  request<StudentInvitationPreview>('student_invitation_read', { p_token: token }, signal);
export const acceptStudentInvitation = (token: string) =>
  request<StudentInvitationPreview>('student_invitation_accept', { p_token: token });
export const loadStudentConnections = (signal: AbortSignal) =>
  request<StudentConnection[]>('student_connections', {}, signal);
