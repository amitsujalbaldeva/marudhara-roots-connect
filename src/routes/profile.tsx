import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, LayoutDashboard, LogOut, Mail, ShieldCheck, Store } from "lucide-react";
import { toast } from "sonner";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { MakerCard } from "@/components/cards";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { producers } from "@/lib/data";
import { LANGUAGES, useLang } from "@/lib/i18n";
import { useApp, type Role } from "@/lib/store";
import { useMediaUrl, type LiveProfile } from "@/lib/live";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile & Role — MARUDHARA" },
      {
        name: "description",
        content:
          "Switch language, choose your role as tourist, producer or admin, and see the producers you follow.",
      },
      { property: "og:title", content: "Your Profile & Role — MARUDHARA" },
      { property: "og:description", content: "Tourist, producer or admin — all in one app." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t, lang, setLang } = useLang();
  const { role, setRole, follows } = useApp();

  const roles: { id: Role; label: string; Icon: typeof Store }[] = [
    { id: "tourist", label: t("tourist"), Icon: Heart },
    { id: "producer", label: t("producer"), Icon: Store },
    { id: "admin", label: t("admin"), Icon: ShieldCheck },
  ];

  const followed = producers.filter((p) => follows.includes(p.id));

  return (
    <Screen>
      <TopBar title={t("profile")} back={false} />

      <SectionHead title={t("language")} />
      <div className="grid grid-cols-2 gap-3 px-4">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={`tap surface p-3 text-left ${lang === l.code ? "ring-2 ring-primary" : ""}`}
          >
            <span className="block font-display text-lg">{l.native}</span>
            <span className="block text-[11px] text-muted-foreground">{l.label}</span>
          </button>
        ))}
      </div>

      <SectionHead title={t("role")} />
      <div className="grid gap-3 px-4">
        {roles.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setRole(id)}
            className={`tap surface grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-4 text-left ${
              role === id ? "ring-2 ring-primary" : ""
            }`}
          >
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 px-4 pt-6">
        <Link to="/studio" className="tap btn-primary w-full text-sm">
          <LayoutDashboard className="h-4 w-4" />
          मेरा स्टूडियो / My maker studio
        </Link>
        <Link to="/community" className="tap btn-teal w-full text-sm">
          <LayoutDashboard className="h-4 w-4" />
          गाँव समुदाय / Live village community
        </Link>
        <Link to="/producer-dashboard" className="tap btn-outline w-full text-sm">
          <LayoutDashboard className="h-4 w-4" />
          {t("producerDashboard")}
        </Link>
        <Link to="/admin" className="tap btn-outline w-full text-sm">
          <ShieldCheck className="h-4 w-4" />
          {t("adminDashboard")}
        </Link>
      </div>


      {followed.length ? (
        <>
          <SectionHead title={t("following")} />
          <div className="grid gap-3 px-4">
            {followed.map((p) => (
              <MakerCard key={p.id} producer={p} />
            ))}
          </div>
        </>
      ) : null}
    </Screen>
  );
}
