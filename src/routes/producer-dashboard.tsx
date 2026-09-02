import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, IndianRupee, Package, Truck, UploadCloud } from "lucide-react";
import { Screen, SectionHead, StatusPill, TopBar } from "@/components/AppShell";
import { getProduct, producers, products } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/producer-dashboard")({
  head: () => ({
    meta: [
      { title: "Producer Dashboard (कारीगर डैशबोर्ड) — MARUDHARA" },
      {
        name: "description",
        content:
          "Hindi-friendly dashboard for village producers: earnings, orders, delivery status and new listings.",
      },
      { property: "og:title", content: "Producer Dashboard — MARUDHARA" },
      { property: "og:description", content: "Track earnings and orders in your own language." },
    ],
  }),
  component: ProducerDashboard,
});

function ProducerDashboard() {
  const { t } = useLang();
  const L = useLocal();
  const { orders, advanceOrder, commission } = useApp();
  const me = producers[0]!;
  const myProducts = products.filter((p) => p.producerId === me.id);

  const [form, setForm] = useState({ name: "", price: "", story: "" });
  const [submitted, setSubmitted] = useState(false);

  const gross = orders.reduce((n, o) => n + o.total, 0);
  const net = Math.round(gross * (1 - commission.product / 100));

  return (
    <Screen>
      <TopBar title={t("producerDashboard")} />

      <div className="px-4 pt-4">
        <div className="surface grid grid-cols-2 gap-3 p-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("earnings")}
            </p>
            <p className="mt-1 flex items-center font-display text-2xl text-primary">
              <IndianRupee className="h-5 w-5" />
              {net.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("orders")}
            </p>
            <p className="mt-1 flex items-center gap-1 font-display text-2xl">
              <Package className="h-5 w-5 text-teal" />
              {orders.length}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {t("platformFee")}: {commission.product}% · {rupee(gross)} → {rupee(net)}
        </p>
      </div>

      <SectionHead title={t("orders")} />
      <ul className="grid gap-3 px-4">
        {orders.map((o) => (
          <li key={o.id} className="surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">#{o.id}</p>
              <StatusPill status={o.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {o.buyer} ·{" "}
              {o.lines
                .map((l) => {
                  const p = getProduct(l.productId);
                  return p ? `${L(p.name)} ×${l.qty}` : "";
                })
                .join(", ")}
            </p>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <p className="font-display text-lg text-primary">{rupee(o.total)}</p>
              {o.status !== "completed" ? (
                <button
                  type="button"
                  onClick={() => advanceOrder(o.id)}
                  className="tap btn-teal h-10 text-xs"
                >
                  {o.status === "pending" ? <Truck className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  {o.status === "pending" ? t("shipped") : t("completed")}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <SectionHead title={t("products")} />
      <ul className="grid gap-2 px-4">
        {myProducts.map((p) => (
          <li key={p.id} className="surface flex items-center justify-between gap-3 p-3">
            <span className="min-w-0 truncate text-sm font-bold">{L(p.name)}</span>
            <StatusPill status={p.status} />
          </li>
        ))}
      </ul>

      <SectionHead title={t("submitForReview")} />
      <div className="grid gap-3 px-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="उत्पाद का नाम / Product name"
          className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          inputMode="numeric"
          placeholder="कीमत ₹ / Price"
          className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
        />
        <textarea
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          rows={3}
          placeholder="कहानी / Your story (no health claims)"
          className="w-full rounded-2xl border border-border bg-card p-3 text-base"
        />
        <label className="tap surface grid place-items-center gap-1 p-5 text-xs font-bold text-muted-foreground">
          <UploadCloud className="h-6 w-6 text-primary" />
          फोटो जोड़ें / Add photo
          <input type="file" accept="image/*" className="hidden" />
        </label>
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="tap btn-primary w-full text-sm"
        >
          {t("submitForReview")}
        </button>
        {submitted ? (
          <p className="text-center text-xs font-bold text-success">
            {t("pending")} — {t("adminDashboard")}
          </p>
        ) : null}
      </div>
    </Screen>
  );
}
