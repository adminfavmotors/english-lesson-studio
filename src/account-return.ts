import { canonicalAppUrl, resolveAppRoute } from './app-routes.ts';

// Invitation credentials stay in this tab, outside Clerk's URLs and logs.
const key = 'lessonstudio.account-return.v1';
export function accountDestination(address: string): string | null {
  const url = canonicalAppUrl(address);
  const route = resolveAppRoute(url.href);
  return route.area === 'teacher' || route.area === 'student'
    ? url.pathname + url.search + url.hash : null;
}
export function saveAccountReturn(address: string) {
  const destination = accountDestination(address);
  if (destination) sessionStorage.setItem(key, destination);
}
export function readAccountReturn(origin: string): string | null {
  let value: string | null;
  try { value = sessionStorage.getItem(key); } catch { return null; }
  if (!value?.startsWith('/') || value.startsWith('//')) return null;
  const url = new URL(value, origin);
  return url.origin === origin ? accountDestination(url.href) : null;
}
export function clearAccountReturn() {
  try { sessionStorage.removeItem(key); } catch { /* no saved return is available */ }
}
