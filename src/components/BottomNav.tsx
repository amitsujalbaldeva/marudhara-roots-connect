import { Link } from "@tanstack/react-router";
import { Home, Compass, ShoppingBag, Package, User } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export function BottomNav() {
  const { t } = useLang();
  const { cartCount } = useApp();

  const items = [
    { to: "/", label: t("home"), Icon: Home, exact: true },
    { to: "/explore", label: t("explore"), Icon: Compass, exact: false },
    { to: "/shop", label: t("shop"), Icon: ShoppingBag, exact: false, badge: cartCount },
    { to: "/orders", label: t("orders"), Icon: Package, exact: false },
    { to: "/profile", label: t("profile"), Icon: User, exact: false },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, Icon, exact, ...rest }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" />
                {"badge" in rest && rest.badge ? (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {rest.badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
