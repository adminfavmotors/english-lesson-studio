import { createClient } from '@supabase/supabase-js';
import { backend } from './backend.config';
import { accountToken } from './account-token';

// Authentication belongs to Clerk; Supabase only verifies its session token.
export const platform = createClient(backend.url, backend.publishableKey, {
  accessToken: accountToken,
});
