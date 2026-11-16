import type { SupabaseClient } from "@supabase/supabase-js";
export const cloudConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
let client: Promise<SupabaseClient> | undefined;
export function getSupabase() {
  if (!cloudConfigured)
    return Promise.reject(
      new Error("Cloud sync is not configured for this build."),
    );
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "implicit",
        },
      },
    ),
  );
  return client;
}
