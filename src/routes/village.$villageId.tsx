import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { MakerCard, ProductCard } from "@/components/cards";
import {
  districtName,
  distanceKm,
  driveHours,
  experiences,
  getVillage,
  homestays,
  mapsDirectionsUrl,
  mapsPlaceUrl,
  originCities,
  producers,
  products,
  type OriginCity,
} from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee } from "@/lib/store";


export const Route = createFileRoute("/village/$villageId")({
  loader: ({ params }) => {
    const village = getVillage(params.villageId);
    if (!village) throw notFound();
    return { villageId: village.id, name: village.name.en, tagline: village.tagline.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Village unavailable — MARUDHARA" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — MARUDHARA`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  component: VillagePage,
});

function VillagePage() {
  const { villageId } = Route.useParams();
  const { t } = useLang();
  const L = useLocal();
  const village = getVillage(villageId)!;

  const vMakers = producers.filter((p) => p.villageId === villageId);
  const vProducts = products.filter((p) => vMakers.some((m) => m.id === p.producerId));
  const vStays = homestays.filter((h) => h.villageId === villageId);
  const vExp = experiences.filter((e) => e.villageId === villageId);

  const [from, setFrom] = useState("jaipur");
  const origin = (originCities.find((c) => c.id === from) ?? originCities[0]) as OriginCity;
  const km = distanceKm(origin, village);



  return (
    <Screen>
      <TopBar title={L(village.name)} />

      <div className="relative h-56">
        <img src={village.cover} alt={L(village.name)} className="h-full w-full object-cover" />
        <div className="absolute inset-0 hero-veil" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5" />
            {L(districtName(village.district))}
          </p>
          <h1 className="mt-1 text-2xl leading-tight">{L(village.name)}</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-sm font-semibold">{L(village.tagline)}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(village.story)}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal">
          <CalendarDays className="h-4 w-4" />
          {L(village.bestTime)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {village.crafts.map((c) => (
            <span key={c.en} className="chip">
              {L(c)}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="surface p-3">
          <h3 className="text-sm font-bold">
            {L({ en: "How to reach", hi: "कैसे पहुँचें" })}
          </h3>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {originCities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFrom(c.id)}
                className={`chip h-10 shrink-0 px-3 ${from === c.id ? "chip-active" : ""}`}
              >
                {L(c.name)}
              </button>
            ))}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-teal">
            <span>
              {L(origin.name)} → {L(village.name)}: ≈ {km} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {driveHours(km)} {L({ en: "hr by road", hi: "घंटे सड़क से" })}
            </span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={mapsDirectionsUrl(origin, village)}
              target="_blank"
              rel="noreferrer"
              className="tap btn-teal h-11 text-sm"
            >
              <Navigation className="h-4 w-4" />
              {L({ en: "Directions", hi: "रास्ता देखें" })}
            </a>
            <a
              href={mapsPlaceUrl(village)}
              target="_blank"
              rel="noreferrer"
              className="tap btn-outline h-11 text-sm"
            >
              <MapPin className="h-4 w-4" />
              {L({ en: "On map", hi: "नक्शे पर" })}
            </a>
          </div>
        </div>
      </div>


      {vStays.length ? (
        <>
          <SectionHead title={t("homestays")} />
          <div className="grid gap-3 px-4">
            {vStays.map((h) => (
              <article key={h.id} className="surface overflow-hidden">
                <img src={h.image} alt={L(h.name)} loading="lazy" className="h-36 w-full object-cover" />
                <div className="p-3">
                  <h3 className="text-base font-bold">{L(h.name)}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {h.rooms} · {h.includes.map((i) => L(i)).join(" · ")}
                  </p>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="font-display text-lg text-primary">
                      {rupee(h.price)}{" "}
                      <span className="font-sans text-xs text-muted-foreground">{t("perNight")}</span>
                    </p>
                    <Link
                      to="/book/$kind/$id"
                      params={{ kind: "homestay", id: h.id }}
                      className="tap btn-primary text-sm"
                    >
                      {t("bookNow")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}

      {vExp.length ? (
        <>
          <SectionHead title={t("experiences")} />
          <div className="grid gap-3 px-4">
            {vExp.map((e) => (
              <article key={e.id} className="surface grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3">
                <img src={e.image} alt={L(e.name)} loading="lazy" className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-snug">{L(e.name)}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{L(e.duration)}</p>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="font-display text-base text-primary">{rupee(e.price)}</p>
                    <Link
                      to="/book/$kind/$id"
                      params={{ kind: "experience", id: e.id }}
                      className="tap btn-teal h-10 text-xs"
                    >
                      {t("bookNow")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}

      {vMakers.length ? (
        <>
          <SectionHead title={t("makers")} />
          <div className="grid gap-3 px-4">
            {vMakers.map((p) => (
              <MakerCard key={p.id} producer={p} />
            ))}
          </div>
        </>
      ) : null}

      {vProducts.length ? (
        <>
          <SectionHead title={t("products")} />
          <ul className="grid grid-cols-2 gap-3 px-4">
            {vProducts.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Screen>
  );
}
