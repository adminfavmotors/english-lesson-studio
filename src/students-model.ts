export const STUDENT_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const STUDENT_STATUSES = { active: 'Занимается', trial: 'Пробный урок', paused: 'На паузе', archived: 'В архиве' } as const;
export type StudentStatus = keyof typeof STUDENT_STATUSES;
export type StudentDraft = { full_name: string; email: string; level: string; status: StudentStatus; goals: string; notes: string };
export type Student = StudentDraft & { id: string; owner_id: string; created_at: string; updated_at: string; version: number };
export const emptyStudent = (): StudentDraft => ({ full_name: '', email: '', level: '', status: 'active', goals: '', notes: '' });
export type StudentErrors = Partial<Record<keyof StudentDraft, string>>;
export function validateStudent(draft: StudentDraft): StudentErrors {
  const errors: StudentErrors = {};
  if (!draft.full_name.trim()) errors.full_name = 'Укажите имя ученика.';
  else if (draft.full_name.trim().length > 120) errors.full_name = 'Не более 120 символов.';
  const email = draft.email.trim();
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = 'Проверьте адрес электронной почты.';
  if (draft.level && !STUDENT_LEVELS.includes(draft.level as typeof STUDENT_LEVELS[number])) errors.level = 'Выберите уровень из списка.';
  if (!Object.hasOwn(STUDENT_STATUSES, draft.status)) errors.status = 'Выберите статус из списка.';
  if (draft.goals.trim().length > 2000) errors.goals = 'Не более 2000 символов.';
  if (draft.notes.trim().length > 5000) errors.notes = 'Не более 5000 символов.';
  return errors;
}
export function studentValues(draft: StudentDraft): StudentDraft {
  return { full_name: draft.full_name.trim(), email: draft.email.trim().toLowerCase(), level: draft.level, status: draft.status, goals: draft.goals.trim(), notes: draft.notes.trim() };
}
export function studentInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0] ?? '').join('').toLocaleUpperCase();
}
