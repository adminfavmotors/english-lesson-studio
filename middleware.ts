import { clerkFrontendApiProxy } from '@clerk/backend/proxy';

export const config = { matcher: '/__clerk/:path*', runtime: 'nodejs' };

export default async function middleware(request: Request) {
  const canonicalOrigin = process.env.CLERK_PROXY_ORIGIN;
  if (!canonicalOrigin) return new Response('Account access is temporarily unavailable.', { status: 503 });
  const origin = new URL(canonicalOrigin);
  const headers = new Headers(request.headers);
  // Vercel supplies the client IP. A forwarded Cloudflare header is not trusted here.
  headers.delete('cf-connecting-ip');
  headers.delete('x-real-ip');
  const clientIp = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for');
  if (!clientIp) return new Response('Account access is temporarily unavailable.', { status: 503 });
  headers.set('x-forwarded-for', clientIp);
  headers.set('x-forwarded-host', origin.host);
  headers.set('x-forwarded-proto', origin.protocol.slice(0, -1));
  const response = await clerkFrontendApiProxy(new Request(request, { headers }), {
    proxyPath: '/__clerk',
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
