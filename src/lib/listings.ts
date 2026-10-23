import { cacheLife, cacheTag } from "next/cache";
import { getSupabase } from "./supabase";
import {
  sampleListings,
  type CancellationPolicy,
  type ConfirmationMode,
  type Listing,
  type ListingType,
} from "@/data/listings";

type CardRow = {
  id: string;
  slug: string;
  type: ListingType;
  title: string;
  description: string | null;
  specialties: string[];
  equipment: string[];
  included: string[];
  price_hour: string | null;
  price_day: string | null;
  price_month: string | null;
  capacity: number | null;
  tone: string | null;
  salon_name: string;
  city: string;
  district: string | null;
  verified: boolean;
  rating: string;
  review_count: number;
  confirmation: ConfirmationMode;
  cancellation: CancellationPolicy;
  min_hours: number;
  deposit: string | null;
  notice_days: number | null;
  rules: string[];
  requirements: string[];
  requires_insurance: boolean;
  amenities: string[];
  layouts: string[];
  catering_allowed: boolean | null;
  setup_info: string | null;
  floor: string | null;
  has_elevator: boolean | null;
  parking: string | null;
  lat?: number | null; // z widoku listing_cards po migracji z mapą
  lng?: number | null;
};

type RuleRow = { listing_id: string; start_time: string; end_time: string };

const num = (v: string | null) => (v == null ? undefined : Number(v));
const hour = (t: string) => Number(t.slice(0, 2)) + Number(t.slice(3, 5)) / 60;

/** Dzień tygodnia w Polsce (0 = niedziela), niezależnie od strefy serwera */
function warsawWeekday(date = new Date()) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Warsaw", weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/**
 * Wszystkie opublikowane oferty.
 * Bez kluczy w .env.local zwraca dane przykładowe z src/data/listings.ts.
 * Wynik jest cache'owany na kilka minut.
 */
export async function getListings(): Promise<Listing[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("listings");

  const sb = getSupabase();
  if (!sb) return sampleListings;

  const [cards, rules] = await Promise.all([
    sb.from("listing_cards").select("*").order("created_at"),
    sb.from("availability_rules").select("listing_id, start_time, end_time").eq("weekday", warsawWeekday()),
  ]);
  if (cards.error) throw new Error(`Supabase (listing_cards): ${cards.error.message}`);
  if (rules.error) throw new Error(`Supabase (availability_rules): ${rules.error.message}`);

  // TODO: odjąć zajęte godziny (funkcja busy_ranges), gdy pojawią się rezerwacje
  const freeByListing = new Map<string, [number, number][]>();
  for (const r of rules.data as RuleRow[]) {
    const list = freeByListing.get(r.listing_id) ?? [];
    list.push([hour(r.start_time), hour(r.end_time)]);
    freeByListing.set(r.listing_id, list);
  }

  return (cards.data as CardRow[]).map((row) => ({
    id: row.slug,
    type: row.type,
    title: row.title,
    salon: row.salon_name,
    city: row.city,
    district: row.district ?? "",
    specialties: row.specialties,
    priceHour: num(row.price_hour),
    priceDay: num(row.price_day),
    priceMonth: num(row.price_month),
    capacity: row.capacity ?? undefined,
    rating: Number(row.rating),
    reviews: row.review_count,
    equipment: row.equipment,
    included: row.included,
    description: row.description ?? "",
    freeToday: (freeByListing.get(row.id) ?? []).sort((a, b) => a[0] - b[0]),
    verified: row.verified,
    tone: row.tone ?? "#E3E6EA",
    confirmation: row.confirmation,
    cancellation: row.cancellation,
    minHours: row.min_hours,
    deposit: num(row.deposit),
    noticeDays: row.notice_days ?? undefined,
    rules: row.rules,
    requirements: row.requirements,
    requiresInsurance: row.requires_insurance,
    amenities: row.amenities,
    layouts: row.layouts,
    cateringAllowed: row.catering_allowed ?? undefined,
    setupInfo: row.setup_info ?? undefined,
    floor: row.floor ?? undefined,
    hasElevator: row.has_elevator ?? undefined,
    parking: row.parking ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
  }));
}

export async function getListing(slug: string) {
  const all = await getListings();
  return all.find((l) => l.id === slug);
}
