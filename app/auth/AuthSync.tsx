// app/auth/AuthSync.js
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthSync() {
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const u = session.user;
        const m = u.user_metadata ?? {};
        const payload = {
          user_id: u.id,                 // or user_id: u.id (match your schema)
          email: u.email,
          full_name: m.full_name ?? "",
          year: m.year ?? null,
          major: m.major ?? null,
          role: m.role ?? "student",
        };
        // fire-and-forget; don't await
        supabase.from("profiles").upsert(payload, { onConflict: "id" })
          .then(({ error }) => { 
            if (error) {
              console.log("profiles upsert error:", error);
            }
          }, (e: any) => {
            console.log("profiles upsert exception:", e);
          });
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);
  return null;
}
