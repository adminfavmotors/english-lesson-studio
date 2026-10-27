import { backend } from './backend.config.ts';
import type { Document, Value } from './store-model.ts';
import { sharedLessonErrorMessage } from './session-messages.ts';

export type SessionRole = 'teacher' | 'student';
export type SessionCredentials = { id: string; token: string };
export type SessionData = {
  id: string; role: SessionRole; revision: number; epochs: Record<string, number>;
  document: Document | null; discarded?: string[]; server_time: number; student_token?: string | null;
};
export type CreatedSession = SessionData & { teacher_token: string; student_token: string };
export type Operation = {
  id: string; action: 'patch' | 'reset_exercise' | 'reset_all';
  values: Record<string, Value>; epochs: Record<string, number>; exercise: string | null;
};
export class SessionError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
async function rpc<T>(name: string, params: object, token?: string): Promise<T> {
  const response = await fetch(`${backend.url}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: backend.publishableKey, 'Content-Type': 'application/json', ...(token ? { 'x-lesson-token': token } : {}) },
    body: JSON.stringify(params), signal: AbortSignal.timeout(12000), cache: 'no-store', referrerPolicy: 'no-referrer',
  });
  if (!response.ok) {
    let detail: unknown;
    try { detail = (await response.json()).message; } catch { /* use the connection message */ }
    const message = sharedLessonErrorMessage(response.status,detail);
    throw new SessionError(message, response.status);
  }
  return response.json() as Promise<T>;
}
export const createSession = () => rpc<CreatedSession>('lesson_create', {});
export const readSession = (credentials: SessionCredentials, revision = -1) => rpc<SessionData>('lesson_read', { p_id: credentials.id, p_revision: revision }, credentials.token);
export const writeSession = (credentials: SessionCredentials, operation: Operation) => rpc<SessionData>('lesson_write', {
  p_id: credentials.id, p_operation: operation.id, p_action: operation.action,
  p_values: operation.values, p_epochs: operation.epochs, p_exercise: operation.exercise,
}, credentials.token);

export function parseSessionUrl(address: string): SessionCredentials | null {
  const url = new URL(address);
  const id = url.searchParams.get('session');
  if (!id) return null;
  const token = new URLSearchParams(url.hash.slice(1)).get('access');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !token || !/^[0-9a-f]{64}$/.test(token)) throw new SessionError('This invitation link is incomplete. Ask your teacher for the full link.', 400);
  return { id, token };
}
export function sessionLink(address: string, credentials: SessionCredentials, role: SessionRole, section = 'vocabulary') {
  const url = new URL(address); url.search = ''; url.searchParams.set('session', credentials.id); url.searchParams.set('mode', role);
  url.hash = new URLSearchParams({ access: credentials.token, section }).toString();
  return url.toString();
}
export function sectionFromHash(hash: string) {
  return hash.includes('access=') ? new URLSearchParams(hash.slice(1)).get('section') ?? 'vocabulary' : hash.slice(1);
}
export function hashForSection(hash: string, section: string) {
  if (!hash.includes('access=')) return `#${section}`;
  const params = new URLSearchParams(hash.slice(1)); params.set('section', section); return `#${params}`;
}
