import { resolveAppRoute } from './app-routes.ts';

function navigationArea(url: URL) {
  const route = resolveAppRoute(url.href);
  return route.area === 'entry' || route.area === 'login' ? 'public' : route.area;
}

export function canNavigateInApp(currentAddress: string, nextAddress: string) {
  const current = new URL(currentAddress);
  const next = new URL(nextAddress, current);
  if (current.origin !== next.origin || !['http:', 'https:'].includes(next.protocol)) return false;
  if (resolveAppRoute(next.href).area === 'not-found') return false;
  // A classroom store is scoped to its account area and invitation at startup.
  // Crossing that boundary must initialise a fresh store, including on Back.
  if (navigationArea(current) !== navigationArea(next)) return false;
  for (const url of [current, next]) {
    if (['session', 'code', 'access_token', 'refresh_token'].some(key => url.searchParams.has(key)) || /(?:access|invite|access_token|refresh_token|code)=/.test(url.hash)) return false;
  }
  return !next.hash;
}

export function navigateInApp(href: string) {
  history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
