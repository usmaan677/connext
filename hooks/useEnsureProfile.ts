import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useEnsureProfile() {
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const u = session.user;
        const { error } = await supabase.from("profiles").upsert(
          {
            user_id: u.id, // 👈 matches your schema
            email: u.email,
            full_name: u.user_metadata?.full_name ?? "",
            year: u.user_metadata?.year ?? null,
            major: u.user_metadata?.major ?? null,
            role: u.user_metadata?.role ?? "student",
          },
          { onConflict: "user_id" }
        );
        if (error) console.warn("profiles upsert error:", error);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);
}
