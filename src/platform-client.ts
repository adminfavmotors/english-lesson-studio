import { createClient } from '@supabase/supabase-js';
import { backend } from './backend.config';
import { isTeacherAuthCallback } from './teacher-auth-url';

// A teacher's account is independent of lesson invitation capabilities.
// Only account callbacks are parsed; lesson invitations keep their hash intact.
export const platform = createClient(backend.url, backend.publishableKey, {
  auth: { storageKey: 'lessonstudio.teacher.auth.v1', detectSessionInUrl: isTeacherAuthCallback, persistSession: true, autoRefreshToken: true },
});
