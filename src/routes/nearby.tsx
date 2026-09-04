import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import {
  districtName,
  driveHours,
  mapsDirectionsUrl,
  originCities,
  villagesNear,
  type OriginCity,
} from "@/lib/data";
import { useLocal } from "@/lib/i18n";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Villages Near You — MARUDHARA" },
      {
        name: "description",
        content:
          "Pick your city — Jaipur, Jodhpur, Udaipur or Bikaner — and see how far each MARUDHARA village is, with road distance, drive time and map directions.",
      },
      { property: "og:title", content: "Villages Near You — MARUDHARA" },
      {
        property: "og:description",
        content: "Distance, drive time and directions to Rajasthan's village experiences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nearby,
});

function Nearby() {
  const L = useLocal();
  const [cityId, setCityId] = useState("jaipur");
  const city = (originCities.find((c) => c.id === cityId) ?? originCities[0]) as OriginCity;
  const list = villagesNear(city);

  return (
    <Screen>
      <TopBar title={L({ en: "Villages near me", hi: "मेरे पास के गाँव" })} />

      <div className="px-4 pt-4">
        <p className="text-sm text-muted-foreground">
          {L({
            en: "Choose where you are — we show distance, drive time and directions.",
            hi: "आप कहाँ हैं चुनें — दूरी, समय और रास्ता दिखा देंगे।",
          })}
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {originCities.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCityId(c.id)}
              className={`chip h-11 shrink-0 px-4 ${cityId === c.id ? "chip-active" : ""}`}
            >
              {L(c.name)}
            </button>
          ))}
        </div>
      </div>

      <SectionHead
        title={L({ en: "Nearest first", hi: "सबसे नज़दीक पहले" })}
        sub={`${L(city.name)} → ${list.length} ${L({ en: "villages", hi: "गाँव" })}`}
      />

      <div className="grid gap-3 px-4">
        {list.map(({ village, km }) => (
          <article key={village.id} className="surface grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3">
            <img
              src={village.cover}
              alt={L(village.name)}
              loading="lazy"
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{L(village.name)}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {L(districtName(village.district))}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-teal">
                <span>≈ {km} km</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {driveHours(km)} {L({ en: "hr drive", hi: "घंटे सड़क से" })}
                </span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/village/$villageId"
                  params={{ villageId: village.id }}
                  className="tap btn-outline h-10 text-xs"
                >
                  {L({ en: "Open village", hi: "गाँव देखें" })}
                </Link>
                <a
                  href={mapsDirectionsUrl(city, village)}
                  target="_blank"
                  rel="noreferrer"
                  className="tap btn-teal h-10 text-xs"
                >
                  <Navigation className="h-4 w-4" />
                  {L({ en: "Directions", hi: "रास्ता" })}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
