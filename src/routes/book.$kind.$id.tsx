import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { Screen, TopBar } from "@/components/AppShell";
import { experiences, homestays } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

const find = (kind: string, id: string) =>
  kind === "homestay" ? homestays.find((h) => h.id === id) : experiences.find((e) => e.id === id);

export const Route = createFileRoute("/book/$kind/$id")({
  loader: ({ params }) => {
    if (params.kind !== "homestay" && params.kind !== "experience") throw notFound();
    const item = find(params.kind, params.id);
    if (!item) throw notFound();
    return { name: item.name.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Booking unavailable — MARUDHARA" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Book ${loaderData.name} — MARUDHARA`;
    return {
      meta: [
        { title },
        { name: "description", content: `Reserve ${loaderData.name} directly with the village host.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Reserve ${loaderData.name} with the host.` },
      ],
    };
  },
  component: BookPage,
});

function BookPage() {
  const { kind, id } = Route.useParams();
  const { t } = useLang();
  const L = useLocal();
  const navigate = useNavigate();
  const { addBooking, commission } = useApp();

  const item = find(kind, id)!;
  const isStay = kind === "homestay";
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);
  const [date, setDate] = useState("2026-09-18");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const units = isStay ? nights : guests;
  const base = item.price * units;
  const fee = Math.round((base * (isStay ? commission.homestay : commission.experience)) / 100);
  const total = base + fee;

  if (confirmed) {
    return (
      <Screen>
        <TopBar title={t("bookNow")} action={<span className="w-1" />} />
        <div className="grid place-items-center gap-4 px-6 pt-20 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <h1 className="text-2xl">{t("confirmed")}</h1>
          <p className="text-sm font-semibold">{L(item.name)}</p>
          <p className="text-xs text-muted-foreground">
            {confirmed} · {date} · {guests}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/orders" })}
            className="tap btn-primary mt-2 text-sm"
          >
            {t("myBookings")}
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title={t("bookNow")} action={<span className="w-1" />} />

      <img src={item.image} alt={L(item.name)} className="h-48 w-full object-cover" />

      <div className="px-4 pt-4">
        <h1 className="text-xl leading-tight">{L(item.name)}</h1>
        <p className="mt-1 font-display text-2xl text-primary">
          {rupee(item.price)}{" "}
          <span className="font-sans text-xs text-muted-foreground">
            {isStay ? t("perNight") : t("perPerson")}
          </span>
        </p>

        <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-3 text-base font-normal normal-case tracking-normal text-foreground"
          />
        </label>

        <Counter label="Guests" value={guests} set={(n) => setGuests(Math.max(1, n))} />
        {isStay ? (
          <Counter label="Nights" value={nights} set={(n) => setNights(Math.max(1, n))} />
        ) : null}

        <div className="surface mt-5 grid gap-2 p-4 text-sm">
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{rupee(base)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("platformFee")}</span>
            <span>{rupee(fee)}</span>
          </p>
          <p className="mt-1 flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>{t("total")}</span>
            <span className="text-primary">{rupee(total)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const b = addBooking({
              kind: isStay ? "homestay" : "experience",
              refId: item.id,
              date,
              guests,
              total,
            });
            setConfirmed(b.id);
          }}
          className="tap btn-primary mt-4 w-full text-base"
        >
          {t("bookNow")}
        </button>
      </div>
    </Screen>
  );
}

function Counter({
  label,
  value,
  set,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <span className="text-sm font-bold">{label}</span>
      <span className="flex items-center gap-1 rounded-full bg-muted p-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => set(value - 1)}
          className="grid h-10 w-10 place-items-center rounded-full bg-card"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-bold">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => set(value + 1)}
          className="grid h-10 w-10 place-items-center rounded-full bg-card"
        >
          <Plus className="h-4 w-4" />
        </button>
      </span>
    </div>
  );
}
