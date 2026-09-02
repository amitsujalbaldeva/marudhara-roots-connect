import { createFileRoute } from "@tanstack/react-router";
import { Check, Percent, X } from "lucide-react";
import { Screen, SectionHead, StatusPill, TopBar } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Review & Commission — MARUDHARA" },
      {
        name: "description",
        content:
          "Approve or reject pending villages, producers, homestays and products, and set platform commission.",
      },
      { property: "og:title", content: "Admin Review & Commission — MARUDHARA" },
      { property: "og:description", content: "Quality control before anything goes public." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { t } = useLang();
  const { pendingQueue, setApproval, commission, setCommission } = useApp();

  return (
    <Screen>
      <TopBar title={t("adminDashboard")} />

      <SectionHead title={t("pending")} sub={`${pendingQueue.length}`} />
      <ul className="grid gap-3 px-4">
        {pendingQueue.map((item) => (
          <li key={item.id} className="surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="chip">{item.type}</span>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-2 text-base font-bold">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApproval(item.id, "approved")}
                className="tap btn-primary h-11 text-xs"
              >
                <Check className="h-4 w-4" />
                {t("approved")}
              </button>
              <button
                type="button"
                onClick={() => setApproval(item.id, "rejected")}
                className="tap btn-outline h-11 text-xs"
              >
                <X className="h-4 w-4" />
                {t("rejected")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <SectionHead title={t("platformFee")} />
      <div className="grid gap-3 px-4">
        {(["product", "homestay", "experience"] as const).map((k) => (
          <label
            key={k}
            className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"
          >
            <span className="text-sm font-bold capitalize">{t(k === "product" ? "products" : k === "homestay" ? "homestays" : "experiences")}</span>
            <span className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={40}
                value={commission[k]}
                onChange={(e) =>
                  setCommission({ ...commission, [k]: Number(e.target.value) || 0 })
                }
                className="h-11 w-20 rounded-2xl border border-border bg-card px-3 text-base"
              />
              <Percent className="h-4 w-4 text-muted-foreground" />
            </span>
          </label>
        ))}
      </div>
    </Screen>
  );
}
