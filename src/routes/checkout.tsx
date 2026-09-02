import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Screen, TopBar } from "@/components/AppShell";
import { getProduct } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MARUDHARA" },
      { name: "description", content: "Confirm your order of village-made goods from Rajasthan." },
      { property: "og:title", content: "Checkout — MARUDHARA" },
      { property: "og:description", content: "Fair price, straight to the maker." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { t } = useLang();
  const L = useLocal();
  const navigate = useNavigate();
  const { cart, clearCart, placeOrder, commission } = useApp();
  const [placed, setPlaced] = useState<string | null>(null);

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.productId) }))
    .filter((x) => x.product);
  const subtotal = lines.reduce((n, x) => n + x.product!.price * x.line.qty, 0);
  const delivery = subtotal > 1500 ? 0 : 60;
  const fee = Math.round((subtotal * commission.product) / 100);
  const total = subtotal + delivery + fee;

  if (placed) {
    return (
      <Screen>
        <TopBar title={t("checkout")} action={<span className="w-1" />} />
        <div className="grid place-items-center gap-4 px-6 pt-20 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <h1 className="text-2xl">{t("confirmed")}</h1>
          <p className="text-sm text-muted-foreground">#{placed}</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/orders" })}
            className="tap btn-primary mt-2 text-sm"
          >
            {t("myOrders")}
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title={t("checkout")} action={<span className="w-1" />} />

      <ul className="grid gap-2 px-4 pt-4">
        {lines.map(({ line, product }) => (
          <li key={line.productId} className="surface flex items-center justify-between p-3 text-sm">
            <span className="min-w-0 truncate pr-3">
              {L(product!.name)} × {line.qty}
            </span>
            <span className="font-bold">{rupee(product!.price * line.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="px-4 pt-4">
        <div className="surface grid gap-2 p-4 text-sm">
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{rupee(subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("delivery")}</span>
            <span>{delivery ? rupee(delivery) : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">
              {t("platformFee")} ({commission.product}%)
            </span>
            <span>{rupee(fee)}</span>
          </p>
          <p className="mt-1 flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>{t("total")}</span>
            <span className="text-primary">{rupee(total)}</span>
          </p>
        </div>

        <button
          type="button"
          disabled={!lines.length}
          onClick={() => {
            const order = placeOrder(cart, total);
            clearCart();
            setPlaced(order.id);
          }}
          className="tap btn-primary mt-4 w-full text-base disabled:opacity-50"
        >
          {t("placeOrder")}
        </button>
      </div>
    </Screen>
  );
}
