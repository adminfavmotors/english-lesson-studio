// Clerk owns token refresh. Request a fresh token for every database operation.
type TokenSource = () => Promise<string | null>;
let source: TokenSource | null = null;
export function setAccountTokenSource(next: TokenSource) {
  source = next;
  return () => { if (source === next) source = null; };
}
export const accountToken = () => source?.() ?? Promise.resolve(null);
