import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { SectionHead, Screen } from "@/components/AppShell";
import { MakerCard, ProductCard, VillageCard } from "@/components/cards";
import { categories, districts, images, journeySteps, producers, products, villages } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MARUDHARA — Rajasthan's Village-to-World Platform" },
      {
        name: "description",
        content:
          "Discover Rajasthan's villages, book homestays and experiences, and buy handmade goods direct from artisans.",
      },
      { property: "og:title", content: "MARUDHARA — Rajasthan's Village-to-World Platform" },
      {
        property: "og:description",
        content: "Discover Rajasthan. Experience Local. Buy Direct.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();
  const L = useLocal();

  return (
    <Screen>
      <div className="relative h-[300px]">
        <img
          src={images.heroVillage}
          alt={t("brand")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-veil" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] opacity-90">
            Rajasthan
          </p>
          <h1 className="mt-1 text-4xl leading-none">{t("brand")}</h1>
          <p className="mt-2 max-w-[19rem] text-sm font-medium opacity-95">{t("tagline")}</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/explore"
          className="tap surface w-full justify-start px-4 text-sm font-medium text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          {t("searchPlaceholder")}
        </Link>
      </div>

      <SectionHead title={t("categories")} />
      <ul className="grid grid-cols-3 gap-3 px-4">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              to="/explore"
              className="surface flex h-full flex-col items-center gap-1.5 p-3 text-center"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[11px] font-bold leading-tight">{L(c.name)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <SectionHead title={t("district")} sub={t("allDistricts")} href="/explore" />
      <ul className="flex gap-3 overflow-x-auto px-4 pb-1">
        {districts.map((d) => (
          <li key={d.id} className="shrink-0">
            <Link to="/explore" className="chip h-11 px-4">
              {L(d.name)} · {d.villages}
            </Link>
          </li>
        ))}
      </ul>

      <SectionHead title={t("villages")} sub={t("villageDirectory")} href="/explore" />
      <div className="grid gap-4 px-4">
        {villages.slice(0, 2).map((v) => (
          <VillageCard key={v.id} village={v} />
        ))}
      </div>

      <SectionHead title={t("products")} href="/shop" />
      <ul className="grid grid-cols-2 gap-3 px-4">
        {products.slice(0, 4).map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <LiveProducts />



      <SectionHead title={t("makers")} href="/explore" />
      <div className="grid gap-3 px-4">
        {producers.slice(0, 3).map((p) => (
          <MakerCard key={p.id} producer={p} />
        ))}
      </div>

      <SectionHead title={t("journey")} sub={t("journeySub")} />
      <ol className="grid gap-3 px-4">
        {journeySteps.map((s, i) => (
          <li key={s.icon} className="surface grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/12 text-sm font-bold text-teal">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{L(s.title)}</span>
              <span className="block text-xs text-muted-foreground">{L(s.note)}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="px-4 pt-7">
        <div className="surface flex items-start gap-3 bg-teal/8 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("tagline")} — {t("journeySub")}
          </p>
        </div>
      </div>
    </Screen>
  );
}
