"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { safeNext } from "@/lib/auth";
import type { FormState } from "@/components/form";

function polishError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Nieprawidłowy e-mail lub hasło.";
  if (m.includes("email not confirmed")) return "Najpierw potwierdź adres e-mail. Link wysłaliśmy w wiadomości po rejestracji.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Konto z tym adresem już istnieje. Zaloguj się.";
  if (m.includes("password")) return "Hasło jest za słabe. Użyj co najmniej 8 znaków.";
  if (m.includes("rate limit")) return "Za dużo prób. Spróbuj ponownie za kilka minut.";
  if (m.includes("invalid") && m.includes("email")) return "Nieprawidłowy adres e-mail.";
  return "Coś poszło nie tak. Spróbuj ponownie.";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Podaj e-mail i hasło." };

  const sb = await createSupabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: polishError(error.message) };

  redirect(safeNext(formData.get("next"), "/panel"));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "host" ? "host" : "renter";
  const next = safeNext(formData.get("next"), role === "host" ? "/panel" : "/konto");

  if (!fullName) return { error: "Podaj imię i nazwisko." };
  if (!email) return { error: "Podaj adres e-mail." };
  if (password.length < 8) return { error: "Hasło musi mieć co najmniej 8 znaków." };

  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;

  const sb = await createSupabaseServer();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: polishError(error.message) };

  // Gdy potwierdzanie e-maila jest wyłączone, sesja jest od razu
  if (data.session) redirect(next);

  return {
    message: `Wysłaliśmy link aktywacyjny na ${email}. Kliknij go, żeby dokończyć rejestrację.`,
  };
}

export async function signOut() {
  const sb = await createSupabaseServer();
  await sb.auth.signOut();
  redirect("/");
}
