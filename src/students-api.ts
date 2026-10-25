import { platform } from './platform-client';
import { studentValues, validateStudent } from './students-model';
import type { Student, StudentDraft } from './students-model';

export const STUDENTS_PAGE_SIZE = 20;
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
  if (Object.keys(validateStudent(draft)).length) throw new Error('Проверьте заполненные поля.');
  const values = studentValues(draft);
  const query = version === undefined
    ? platform.from('teacher_students').insert({ id, ...values })
    : platform.from('teacher_students').update(values).eq('id', id).eq('version', version);
  const { data, error } = await query.select('*').abortSignal(AbortSignal.timeout(15000)).single();
  if (version === undefined && error?.code === '23505') {
    const previous = await platform.from('teacher_students').select('*').eq('id',id).abortSignal(AbortSignal.timeout(12000)).single();
    if (previous.data && Object.entries(values).every(([key,value])=>previous.data[key]===value)) return previous.data as Student;
    throw new Error('Ученик уже создан при предыдущей попытке. Закройте форму и обновите список.');
  }
  if (error?.code === 'PGRST116') throw new Error('Карточка уже изменена на другом устройстве. Закройте её, обновите список и откройте снова.');
  if (error) throw error;
  return data as Student;
}
export function studentsError(error: unknown) {
  const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : String(error);
  if (/Invalid login credentials/i.test(message)) return 'Неверная почта или пароль.';
  if (/Email not confirmed/i.test(message)) return 'Подтвердите почту по письму, затем войдите в кабинет.';
  if (/User already registered/i.test(message)) return 'Для этой почты уже есть кабинет. Используйте вход.';
  if (/rate limit|too many requests|over_email_send_rate_limit/i.test(message)) return 'Слишком много попыток. Подождите немного и повторите.';
  if (/Failed to fetch|NetworkError|fetch failed/i.test(message)) return 'Не удалось связаться с сервером. Проверьте интернет и повторите.';
  if (/JWT|session.*missing|refresh_token/i.test(message)) return 'Сессия входа истекла. Войдите в кабинет снова.';
  return /[а-яё]/i.test(message) ? message : 'Не удалось выполнить действие. Попробуйте ещё раз; введённые данные сохранены в форме.';
}
