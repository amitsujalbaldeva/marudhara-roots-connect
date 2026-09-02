import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { ProductCard } from "@/components/cards";
import { categories, products } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Village-Made Goods — MARUDHARA" },
      {
        name: "description",
        content:
          "Buy shelf-stable papad, hand-ground spices and handicrafts direct from Rajasthan's village producers.",
      },
      { property: "og:title", content: "Shop Village-Made Goods — MARUDHARA" },
      { property: "og:description", content: "No middlemen. Fair prices to the maker." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { t } = useLang();
  const L = useLocal();
  const [cat, setCat] = useState<string>("all");

  const shopCats = categories.filter((c) => !["homestay", "experience"].includes(c.id));
  const list = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <Screen>
      <TopBar title={t("shop")} back={false} />

      <div className="flex gap-2 overflow-x-auto px-4 pt-4">
        <button
          type="button"
          onClick={() => setCat("all")}
          className={`chip h-11 shrink-0 px-4 ${cat === "all" ? "chip-active" : ""}`}
        >
          {t("all")}
        </button>
        {shopCats.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`chip h-11 shrink-0 px-4 ${cat === c.id ? "chip-active" : ""}`}
          >
            {c.emoji} {L(c.name)}
          </button>
        ))}
      </div>

      <SectionHead title={t("products")} sub={`${list.length} ${t("products")}`} />
      <ul className="grid grid-cols-2 gap-3 px-4">
        {list.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </Screen>
  );
}
