"use server";

import { requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";
import { SPECIALTIES } from "@/data/listings";
import type { FormState } from "@/components/form";

export async function updateProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("/konto");
  const fullName = String(fd.get("full_name") ?? "").trim();
  if (!fullName) return { error: "Podaj imię i nazwisko." };

  const sb = await createSupabaseServer();
  const { error } = await sb
    .from("profiles")
    .update({
      full_name: fullName.slice(0, 120),
      phone: String(fd.get("phone") ?? "").trim().slice(0, 30) || null,
      bio: String(fd.get("bio") ?? "").trim().slice(0, 1500) || null,
      specialties: fd.getAll("specialties").map(String).filter((s) => SPECIALTIES.includes(s)),
      has_insurance: fd.get("has_insurance") === "on",
    })
    .eq("id", user.id);

  if (error) return { error: "Nie udało się zapisać profilu. Spróbuj ponownie." };
  return { message: "Zapisano zmiany." };
}
