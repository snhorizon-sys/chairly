import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { hasSupabase } from "./supabase";
import { createSupabaseServer } from "./supabase-server";

export type Role = "renter" | "host" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  fullName: string | null;
  phone: string | null;
  bio: string | null;
  specialties: string[];
};

/** Zalogowany użytkownik z profilem albo null. Jedno zapytanie na żądanie. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!hasSupabase) return null;
  await connection(); // sesja zawsze w czasie żądania, nigdy w prerenderze
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("role, full_name, phone, bio, specialties")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    role: (profile?.role as Role) ?? "renter",
    fullName: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
    bio: profile?.bio ?? null,
    specialties: profile?.specialties ?? [],
  };
});

/** Wymaga zalogowania; w przeciwnym razie przekierowuje do logowania. */
export async function requireUser(next: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/logowanie?next=${encodeURIComponent(next)}`);
  return user;
}

/** Dopuszcza tylko ścieżki wewnątrz serwisu (ochrona przed przekierowaniem na obcą stronę). */
export function safeNext(value: FormDataEntryValue | string | null | undefined, fallback = "/") {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
