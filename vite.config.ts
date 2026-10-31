import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (process.env.VERCEL_ENV === 'production' && !env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
    throw new Error('Production requires the Lesson Studio Clerk production instance. Configure VITE_CLERK_PUBLISHABLE_KEY before deploying.');
  }
  return { plugins: [react()] };
});
