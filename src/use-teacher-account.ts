import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { platform } from "./platform-client";
export function useTeacherAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = platform.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setReady(true);
      }
    });
    void platform.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          setUser(data.session?.user ?? null);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  return { user, ready };
}
