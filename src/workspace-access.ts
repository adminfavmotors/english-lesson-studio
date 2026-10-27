import type { AppRoute } from './app-routes.ts';

export type WorkspaceRole = 'teacher' | 'student';
export function workspaceRole(value: unknown): WorkspaceRole | null {
  return value === 'teacher' || value === 'student' ? value : null;
}
export function workspaceHome(role: WorkspaceRole) {
  return role === 'teacher' ? '/teacher/materials' : '/student/classroom';
}
export function mayOpenWorkspace(role: WorkspaceRole, route: AppRoute) {
  return route.area === 'student' || (route.area === 'teacher' && role === 'teacher');
}
