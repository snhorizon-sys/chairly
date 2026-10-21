import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "./ProfileForm";
import { becomeHost } from "@/app/panel/actions";
import { secondaryButton } from "@/components/form";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Suspense fallback={<p className="text-muted">Ładowanie profilu…</p>}>
        <Account />
      </Suspense>
    </div>
  );
}

async function Account() {
  const user = await requireUser("/konto");

  return (
    <>
      <h1 className="text-3xl font-bold">Mój profil</h1>
      <p className="mt-2 text-muted">
        {user.role === "renter"
          ? "Salony widzą Twój profil, zanim zaakceptują rezerwację. Uzupełniony profil to szybsza akceptacja."
          : "Dane właściciela konta. Ofertami i salonem zarządzasz w panelu."}
      </p>
      {user.role !== "renter" && (
        <Link href="/panel" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
          Przejdź do panelu salonu
        </Link>
      )}
      {user.role === "renter" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5">
          <div>
            <p className="font-semibold">Prowadzisz salon?</p>
            <p className="text-sm text-muted">Przełącz konto, żeby dodawać stanowiska i sale. Rezerwować u innych możesz dalej.</p>
          </div>
          <form action={becomeHost}>
            <button className={secondaryButton}>Przełącz na konto salonu</button>
          </form>
        </div>
      )}
      <div className="mt-8">
        <ProfileForm
          fullName={user.fullName ?? ""}
          phone={user.phone ?? ""}
          bio={user.bio ?? ""}
          specialties={user.specialties}
          email={user.email}
        />
      </div>
    </>
  );
}
