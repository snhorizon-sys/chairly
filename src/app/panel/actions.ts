"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";
import { SPECIALTIES, type ListingType } from "@/data/listings";
import type { FormState } from "@/components/form";

const TYPES: ListingType[] = ["stanowisko", "sala", "event"];
const TONES = ["#E7D9DC", "#D9E3DF", "#E9E1D2", "#D8DCE6", "#E3DCEA", "#DDE2D6", "#EADBD3", "#D6E0E3"];

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base || "oferta"}-${Math.random().toString(36).slice(2, 7)}`;
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const lines = (fd: FormData, key: string) =>
  text(fd, key)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
function price(fd: FormData, key: string) {
  const raw = text(fd, key).replace(",", ".");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : NaN;
}

async function ownSalon(userId: string) {
  const sb = await createSupabaseServer();
  const { data } = await sb.from("salons").select("id, name").eq("owner_id", userId).maybeSingle();
  return { sb, salon: data };
}

/** Najemca przełącza konto na konto salonu */
export async function becomeHost() {
  const user = await requireUser("/panel");
  const sb = await createSupabaseServer();
  await sb.from("profiles").update({ role: "host" }).eq("id", user.id);
  redirect("/panel");
}

export async function createSalon(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("/panel");
  const name = text(fd, "name");
  const city = text(fd, "city");
  if (!name || !city) return { error: "Podaj nazwę salonu i miasto." };

  const sb = await createSupabaseServer();
  const { error } = await sb.from("salons").insert({
    owner_id: user.id,
    name: name.slice(0, 120),
    slug: slugify(name),
    city: city.slice(0, 80),
    district: text(fd, "district").slice(0, 80) || null,
    address: text(fd, "address").slice(0, 200) || null,
    description: text(fd, "description").slice(0, 2000) || null,
  });
  if (error) {
    if (error.code === "23505") return { error: "To konto ma już salon." };
    return { error: "Nie udało się zapisać salonu. Spróbuj ponownie." };
  }
  redirect("/panel");
}

export async function createListing(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("/panel/oferty/nowa");
  const { sb, salon } = await ownSalon(user.id);
  if (!salon) return { error: "Najpierw uzupełnij dane salonu." };

  const type = text(fd, "type") as ListingType;
  const title = text(fd, "title");
  const priceHour = price(fd, "price_hour");
  const priceDay = price(fd, "price_day");
  const priceMonth = price(fd, "price_month");
  const capacityRaw = text(fd, "capacity");
  const capacity = capacityRaw ? Number(capacityRaw) : null;

  if (!TYPES.includes(type)) return { error: "Wybierz rodzaj miejsca." };
  if (!title) return { error: "Podaj tytuł oferty." };
  if ([priceHour, priceDay, priceMonth].some((p) => Number.isNaN(p)))
    return { error: "Ceny muszą być liczbami większymi od zera." };
  if (priceHour == null && priceDay == null && priceMonth == null)
    return { error: "Podaj co najmniej jedną cenę: za godzinę, dzień lub miesiąc." };
  if (capacity != null && !(Number.isInteger(capacity) && capacity > 0))
    return { error: "Liczba osób musi być liczbą całkowitą." };

  const rules: { weekday: number; start_time: string; end_time: string }[] = [];
  for (let d = 0; d < 7; d++) {
    if (!fd.get(`day_${d}`)) continue;
    const from = text(fd, `from_${d}`);
    const to = text(fd, `to_${d}`);
    if (!/^\d{2}:\d{2}$/.test(from) || !/^\d{2}:\d{2}$/.test(to) || to <= from)
      return { error: "Sprawdź grafik: godzina zakończenia musi być późniejsza niż rozpoczęcia." };
    rules.push({ weekday: d, start_time: from, end_time: to });
  }

  const specialties = fd.getAll("specialties").map(String).filter((s) => SPECIALTIES.includes(s));
  const status = fd.get("intent") === "draft" ? "draft" : "published";

  const { data: listing, error } = await sb
    .from("listings")
    .insert({
      salon_id: salon.id,
      slug: slugify(title),
      type,
      status,
      title: title.slice(0, 120),
      description: text(fd, "description").slice(0, 3000) || null,
      specialties,
      equipment: lines(fd, "equipment"),
      included: lines(fd, "included"),
      price_hour: priceHour,
      price_day: priceDay,
      price_month: priceMonth,
      capacity,
      tone: TONES[Math.floor(Math.random() * TONES.length)],
    })
    .select("id")
    .single();
  if (error || !listing) return { error: "Nie udało się zapisać oferty. Spróbuj ponownie." };

  if (rules.length) {
    const { error: rulesError } = await sb
      .from("availability_rules")
      .insert(rules.map((r) => ({ ...r, listing_id: listing.id })));
    if (rulesError) {
      await sb.from("listings").delete().eq("id", listing.id);
      return { error: "Nie udało się zapisać grafiku. Spróbuj ponownie." };
    }
  }

  updateTag("listings");
  redirect(`/panel?dodano=${status === "published" ? "opublikowana" : "szkic"}`);
}

export async function setListingStatus(fd: FormData) {
  await requireUser("/panel");
  const id = text(fd, "id");
  const status = text(fd, "status");
  if (!["draft", "published", "archived"].includes(status)) return;
  const sb = await createSupabaseServer();
  await sb.from("listings").update({ status }).eq("id", id); // RLS: tylko właściciel
  updateTag("listings");
}

export async function deleteListing(fd: FormData) {
  await requireUser("/panel");
  const id = text(fd, "id");
  const sb = await createSupabaseServer();
  const { error } = await sb.from("listings").delete().eq("id", id);
  // Oferty z rezerwacjami nie da się usunąć – archiwizujemy
  if (error?.code === "23503") await sb.from("listings").update({ status: "archived" }).eq("id", id);
  updateTag("listings");
}
