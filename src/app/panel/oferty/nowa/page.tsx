import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";
import { ListingForm } from "./ListingForm";

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/panel" className="text-sm text-muted underline underline-offset-4">
        Wróć do panelu
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Nowa oferta</h1>
      <div className="mt-8">
        <Suspense fallback={<div className="h-96 rounded-2xl border border-line bg-paper" />}>
          <Guarded />
        </Suspense>
      </div>
    </div>
  );
}

async function Guarded() {
  const user = await requireUser("/panel/oferty/nowa");
  if (user.role === "renter") redirect("/panel");
  const sb = await createSupabaseServer();
  const { data: salon } = await sb.from("salons").select("id").eq("owner_id", user.id).maybeSingle();
  if (!salon) redirect("/panel");
  return <ListingForm />;
}
