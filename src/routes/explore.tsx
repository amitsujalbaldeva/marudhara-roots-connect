import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "lucide-react";
import { useState } from "react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { MakerCard, VillageCard } from "@/components/cards";
import { districts, producers, villages } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";


export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Villages & Districts — MARUDHARA" },
      {
        name: "description",
        content:
          "Browse Udaipur, Bikaner and Jodhpur villages, their crafts, stories and the artisans who live there.",
      },
      { property: "og:title", content: "Explore Villages & Districts — MARUDHARA" },
      { property: "og:description", content: "Village directory of rural Rajasthan." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { t } = useLang();
  const L = useLocal();
  const [district, setDistrict] = useState<string>("all");

  const list = district === "all" ? villages : villages.filter((v) => v.district === district);
  const makers =
    district === "all"
      ? producers
      : producers.filter((p) => {
          const v = villages.find((x) => x.id === p.villageId);
          return v?.district === district;
        });

  return (
    <Screen>
      <TopBar title={t("explore")} back={false} />

      <div className="px-4 pt-4">
        <Link to="/nearby" className="surface flex items-center gap-3 p-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal/12 text-teal">
            <Navigation className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">
              {L({ en: "Villages near me", hi: "मेरे पास के गाँव" })}
            </span>
            <span className="block text-xs text-muted-foreground">
              {L({
                en: "Distance & directions from Jaipur, Jodhpur, Udaipur…",
                hi: "जयपुर, जोधपुर, उदयपुर से दूरी और रास्ता",
              })}
            </span>
          </span>
        </Link>
      </div>


      <div className="flex gap-2 overflow-x-auto px-4 pt-4">
        {[{ id: "all", name: { en: t("allDistricts"), hi: t("allDistricts") } }, ...districts].map(
          (d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDistrict(d.id)}
              className={`chip h-11 shrink-0 px-4 ${district === d.id ? "chip-active" : ""}`}
            >
              {L(d.name)}
            </button>
          ),
        )}
      </div>

      <SectionHead title={t("villageDirectory")} sub={`${list.length} ${t("villages")}`} />
      <div className="grid gap-4 px-4">
        {list.map((v) => (
          <VillageCard key={v.id} village={v} />
        ))}
      </div>

      <SectionHead title={t("makers")} />
      <div className="grid gap-3 px-4">
        {makers.map((p) => (
          <MakerCard key={p.id} producer={p} />
        ))}
      </div>
    </Screen>
  );
}
