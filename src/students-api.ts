import { platform } from './platform-client';
import { studentValues, validateStudent } from './students-model';
import type { Student, StudentDraft } from './students-model';

export const STUDENTS_PAGE_SIZE = 20;
class StudentActionError extends Error {}
export type StudentFilters = { search: string; status: string; level: string; page: number };
export async function listStudents(filters: StudentFilters, signal: AbortSignal) {
  let query = platform.from('teacher_students').select('*', { count: 'exact' }).order('created_at', { ascending: false }).order('id');
  if (filters.search.trim()) query = query.ilike('full_name', `%${filters.search.trim().replace(/[\\%_]/g, '\\$&')}%`);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.level) query = query.eq('level', filters.level);
  const { data, count, error } = await query.range(filters.page * STUDENTS_PAGE_SIZE, (filters.page + 1) * STUDENTS_PAGE_SIZE - 1).abortSignal(signal);
  if (error) throw error;
  return { students: data as Student[], count: count ?? 0 };
}
export async function studentCounts(signal: AbortSignal) {
  const queries = [null, 'active', 'trial', 'archived'].map(status => {
    let query = platform.from('teacher_students').select('id', { count: 'exact', head: true });
    if (status) query = query.eq('status', status);
    return query.abortSignal(signal);
  });
  const results = await Promise.all(queries);
  for (const result of results) if (result.error) throw result.error;
  return results.map(result => result.count ?? 0);
}
export async function saveStudent(id: string, draft: StudentDraft, version?: number): Promise<Student> {
  if (Object.keys(validateStudent(draft)).length) throw new StudentActionError('Check the form fields.');
  const values = studentValues(draft);
  const query = version === undefined
    ? platform.from('teacher_students').insert({ id, ...values })
    : platform.from('teacher_students').update(values).eq('id', id).eq('version', version);
  const { data, error } = await query.select('*').abortSignal(AbortSignal.timeout(15000)).single();
  if (version === undefined && error?.code === '23505') {
    const previous = await platform.from('teacher_students').select('*').eq('id',id).abortSignal(AbortSignal.timeout(12000)).single();
    if (previous.data && Object.entries(values).every(([key,value])=>previous.data[key]===value)) return previous.data as Student;
    throw new StudentActionError('This student was already created by a previous attempt. Close the form and refresh the list.');
  }
  if (error?.code === 'PGRST116') throw new StudentActionError('This profile was updated on another device. Close it, refresh the list and open it again.');
  if (error) throw error;
  return data as Student;
}
export function studentsError(error: unknown) {
  const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : String(error);
  if (/Invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/Email not confirmed/i.test(message)) return 'Confirm your email using the link in your inbox, then sign in.';
  if (/User already registered/i.test(message)) return 'An account already exists for this email. Please sign in.';
  if (/rate limit|too many requests|over_email_send_rate_limit/i.test(message)) return 'Too many attempts. Please wait a moment and try again.';
  if (/Failed to fetch|NetworkError|fetch failed/i.test(message)) return 'Could not reach the server. Check your internet connection and try again.';
  if (/JWT|session.*missing|refresh_token/i.test(message)) return 'Your session has expired. Please sign in again.';
  return error instanceof StudentActionError ? message : 'Could not complete the action. Please try again; your entries are still in the form.';
}
