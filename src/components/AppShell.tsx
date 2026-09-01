import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export function TopBar({
  title,
  back = true,
  action,
}: {
  title: string;
  back?: boolean;
  action?: ReactNode;
}) {
  const router = useRouter();
  const { cartCount } = useApp();

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-background/95 px-2 py-2 backdrop-blur">
      {back ? (
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Back"
          className="tap h-11 w-11 shrink-0 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <span className="w-1" />
      )}
      <h1 className="truncate px-1 text-base font-bold">{title}</h1>
      {action ?? (
        <Link to="/cart" aria-label="Cart" className="tap relative h-11 w-11 shrink-0">
          <ShoppingCart className="h-[22px] w-[22px]" />
          {cartCount ? (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          ) : null}
        </Link>
      )}
    </header>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-screen max-w-md pb-24">{children}</div>;
}

export function SectionHead({
  title,
  sub,
  href,
}: {
  title: string;
  sub?: string;
  href?: string;
}) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 px-4 pt-7 pb-3">
      <div className="min-w-0">
        <h2 className="text-xl leading-tight">{title}</h2>
        {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
      </div>
      {href ? (
        <Link to={href} className="shrink-0 text-xs font-bold text-primary">
          {t("all")} →
        </Link>
      ) : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const { t } = useLang();
  const tone =
    status === "completed" || status === "approved" || status === "confirmed"
      ? "bg-success/12 text-success"
      : status === "rejected"
        ? "bg-destructive/12 text-destructive"
        : status === "shipped"
          ? "bg-teal/12 text-teal"
          : "bg-warning/15 text-warning";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>{t(status)}</span>
  );
}
