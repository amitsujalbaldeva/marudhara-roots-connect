import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MapPin, Plus } from "lucide-react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { districtName } from "@/lib/data";
import { useLocal } from "@/lib/i18n";
import { rupee } from "@/lib/store";
import { useMediaUrl, type LiveCulture, type LiveProduct, type LiveProfile } from "@/lib/live";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Live Village Community — MARUDHARA" },
      {
        name: "description",
        content:
          "Real producers from Rajasthan villages: their profiles, products listed by themselves and village culture stories shared straight from the ground.",
      },
      { property: "og:title", content: "Live Village Community — MARUDHARA" },
      {
        property: "og:description",
        content: "Real makers, real products, real village culture from Rajasthan.",
      },
    ],
  }),
  component: Community,
});

function Media({ path, className }: { path?: string | null; className?: string }) {
  const url = useMediaUrl(path);
  if (!url) return <div className={`bg-muted ${className ?? ""}`} />;
  return <img src={url} alt="" className={className} loading="lazy" />;
}

function Community() {
  const L = useLocal();

  const profilesQ = useQuery({
    queryKey: ["live-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LiveProfile[];
    },
  });

  const productsQ = useQuery({
    queryKey: ["live-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as LiveProduct[];
    },
  });

  const cultureQ = useQuery({
    queryKey: ["live-culture"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("village_culture")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as LiveCulture[];
    },
  });

  const empty =
    !profilesQ.isLoading &&
    !profilesQ.data?.length &&
    !productsQ.data?.length &&
    !cultureQ.data?.length;

  return (
    <Screen>
      <TopBar title="गाँव समुदाय / Village community" />

      <div className="px-4 pt-4">
        <h2 className="text-xl leading-tight">असली गाँव, असली कारीगर</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything below is added by real producers and hosts from their own phones.
        </p>
        <Link to="/auth" className="tap btn-primary mt-3 w-full text-sm">
          <Plus className="h-4 w-4" /> मैं भी जोड़ूं / Join as a producer
        </Link>
      </div>

      {empty ? (
        <p className="px-4 pt-8 text-sm text-muted-foreground">
          अभी कोई लाइव प्रोफ़ाइल नहीं है। पहला कारीगर आप बनें! / No live makers yet — be the first.
        </p>
      ) : null}

      {profilesQ.data?.length ? (
        <>
          <SectionHead title="कारीगर / Makers" />
          <ul className="grid gap-3 px-4">
            {profilesQ.data.map((m) => (
              <li key={m.id}>
                <Link
                  to="/maker/$id"
                  params={{ id: m.id }}
                  className="surface grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3"
                >
                  <Media path={m.photo_url} className="h-16 w-16 rounded-2xl object-cover" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 truncate text-sm font-bold">
                      {m.name}
                      {m.verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-teal" /> : null}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {m.village_name} · {L(districtName(m.district))}
                    </span>
                    {m.craft ? (
                      <span className="block truncate text-xs font-semibold text-primary">{m.craft}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {productsQ.data?.length ? (
        <>
          <SectionHead title="नए उत्पाद / Fresh listings" />
          <ul className="grid grid-cols-2 gap-3 px-4">
            {productsQ.data.map((p) => (
              <li key={p.id} className="surface overflow-hidden">
                <Media path={p.image_url} className="h-28 w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.unit ?? ""}</p>
                  <p className="mt-1 font-display text-base text-primary">{rupee(Number(p.price))}</p>
                  <Link
                    to="/maker/$id"
                    params={{ id: p.producer_id }}
                    className="mt-1 block text-[11px] font-bold text-teal"
                  >
                    कारीगर देखें →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {cultureQ.data?.length ? (
        <>
          <SectionHead title="गाँव की संस्कृति / Village culture" />
          <ul className="grid gap-3 px-4">
            {cultureQ.data.map((c) => (
              <li key={c.id} className="surface overflow-hidden">
                {c.image_urls[0] ? (
                  <Media path={c.image_urls[0]} className="h-40 w-full object-cover" />
                ) : null}
                <div className="p-3">
                  <p className="text-sm font-bold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.village_name}</p>
                  {c.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Screen>
  );
}
