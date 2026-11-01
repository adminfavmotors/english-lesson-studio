import { platform } from './platform-client';
import type { DictationContent, DictationProgress } from './dictation-model';
export type HomeworkStatus = 'not_completed' | 'completed' | 'reviewed';
export const HOMEWORK_STATUSES: Record<HomeworkStatus, string> = { not_completed: 'Not completed', completed: 'Completed', reviewed: 'Reviewed' };
export type HomeworkSummary = {
  id: string; access: 'teacher' | 'student'; student_id: string; student_name: string; material_id: string; material_version: number;
  catalogue: { title: string; subtitle: string; level: string; duration: number };
  status: HomeworkStatus; version: number; feedback: string; assigned_at: string; submitted_at: string | null; reviewed_at: string | null;
  result: { total: number; done: number; correct: number; shown: number; hinted: number };
};
export type Homework = HomeworkSummary & { content: DictationContent; progress: DictationProgress };
export class HomeworkError extends Error { code: string; constructor(message: string, code = '') { super(message); this.code = code; } }
async function rpc<T>(name: string, params: object, signal?: AbortSignal): Promise<T> {
  const { data, error } = await platform.rpc(name, params).abortSignal(signal ?? AbortSignal.timeout(15000));
  if (error) throw new HomeworkError(error.code?.startsWith('PT') ? error.message : 'Could not connect to your homework. Check your connection and try again.', error.code);
  return data as T;
}
export const listHomework = (studentId: string | null, signal: AbortSignal) => rpc<HomeworkSummary[]>('homework_list', { p_student_id: studentId }, signal);
export const getHomework = (id: string, signal: AbortSignal) => rpc<Homework>('homework_get', { p_id: id }, signal);
export const assignHomework = (id: string, studentId: string, materialId: string) => rpc<Homework>('homework_create', { p_id: id, p_student_id: studentId, p_material_id: materialId });
export const saveHomework = (id: string, version: number, progress: DictationProgress) => rpc<Homework>('homework_save', { p_id: id, p_version: version, p_progress: progress });
export const submitHomework = (id: string, version: number, progress: DictationProgress) => rpc<Homework>('homework_submit', { p_id: id, p_version: version, p_progress: progress });
export const reviewHomework = (id: string, version: number, feedback: string) => rpc<Homework>('homework_review', { p_id: id, p_version: version, p_feedback: feedback });
