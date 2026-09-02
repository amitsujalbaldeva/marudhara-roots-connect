import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { Screen, SectionHead, StatusPill, TopBar } from "@/components/AppShell";
import { experiences, getProduct, homestays } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders & Bookings — MARUDHARA" },
      {
        name: "description",
        content: "Track your village product orders and homestay bookings in one place.",
      },
      { property: "og:title", content: "My Orders & Bookings — MARUDHARA" },
      { property: "og:description", content: "Pending, shipped and completed at a glance." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { t } = useLang();
  const L = useLocal();
  const { orders, bookings, addToCart } = useApp();

  return (
    <Screen>
      <TopBar title={t("myOrders")} back={false} />

      <SectionHead title={t("myOrders")} />
      {orders.length === 0 ? (
        <p className="px-4 text-sm text-muted-foreground">{t("noOrders")}</p>
      ) : (
        <ul className="grid gap-3 px-4">
          {orders.map((o) => (
            <li key={o.id} className="surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Package className="h-4 w-4 text-primary" />#{o.id}
                </p>
                <StatusPill status={o.status} />
              </div>
              <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                {o.lines.map((l) => {
                  const p = getProduct(l.productId);
                  return p ? (
                    <li key={l.productId}>
                      {L(p.name)} × {l.qty}
                    </li>
                  ) : null;
                })}
              </ul>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <p className="font-display text-lg text-primary">{rupee(o.total)}</p>
                <button
                  type="button"
                  onClick={() => o.lines.forEach((l) => addToCart(l.productId, l.qty))}
                  className="tap btn-outline h-10 text-xs"
                >
                  {t("reorder")}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{o.placedAt}</p>
            </li>
          ))}
        </ul>
      )}

      <SectionHead title={t("myBookings")} />
      <ul className="grid gap-3 px-4">
        {bookings.map((b) => {
          const ref =
            b.kind === "homestay"
              ? homestays.find((h) => h.id === b.refId)
              : experiences.find((e) => e.id === b.refId);
          return (
            <li key={b.id} className="surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold">{ref ? L(ref.name) : b.refId}</p>
                <StatusPill status="confirmed" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {b.date} · {b.guests} · {b.id}
              </p>
              <p className="mt-2 font-display text-lg text-primary">{rupee(b.total)}</p>
            </li>
          );
        })}
      </ul>

      <div className="px-4 pt-6">
        <Link to="/shop" className="tap btn-outline w-full text-sm">
          {t("shop")}
        </Link>
      </div>
    </Screen>
  );
}
