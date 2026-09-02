import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Screen, TopBar } from "@/components/AppShell";
import { getProduct } from "@/lib/data";
import { useLang, useLocal } from "@/lib/i18n";
import { rupee, useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — MARUDHARA" },
      { name: "description", content: "Review the village-made goods in your cart before checkout." },
      { property: "og:title", content: "Your Cart — MARUDHARA" },
      { property: "og:description", content: "Buy direct from Rajasthan's artisans." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { t } = useLang();
  const L = useLocal();
  const { cart, setQty } = useApp();

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.productId) }))
    .filter((x) => x.product);
  const subtotal = lines.reduce((n, x) => n + x.product!.price * x.line.qty, 0);

  return (
    <Screen>
      <TopBar title={t("cart")} action={<span className="w-1" />} />

      {lines.length === 0 ? (
        <div className="grid place-items-center gap-4 px-6 pt-24 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-semibold text-muted-foreground">{t("cartEmpty")}</p>
          <Link to="/shop" className="tap btn-primary text-sm">
            {t("shop")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid gap-3 px-4 pt-4">
            {lines.map(({ line, product }) => (
              <li key={line.productId} className="surface grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3">
                <img
                  src={product!.image}
                  alt={L(product!.name)}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{L(product!.name)}</p>
                  <p className="text-xs text-muted-foreground">{L(product!.unit)}</p>
                  <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <span className="flex items-center gap-1 rounded-full bg-muted p-1">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQty(line.productId, line.qty - 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-card"
                      >
                        {line.qty === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold">{line.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQty(line.productId, line.qty + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-card"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </span>
                    <span className="text-right font-display text-lg text-primary">
                      {rupee(product!.price * line.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 pt-5">
            <div className="surface grid gap-2 p-4 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-bold">{rupee(subtotal)}</span>
              </p>
            </div>
            <Link to="/checkout" className="tap btn-primary mt-4 w-full text-base">
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </Screen>
  );
}
