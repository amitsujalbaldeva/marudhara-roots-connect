import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { districtName } from "@/lib/data";
import { useLocal } from "@/lib/i18n";
import { rupee } from "@/lib/store";
import { useMediaUrl, type LiveCulture, type LiveProduct, type LiveProfile } from "@/lib/live";

export const Route = createFileRoute("/maker/$id")({
  head: () => ({
    meta: [
      { title: "Meet the Maker — MARUDHARA" },
      {
        name: "description",
        content:
          "A real Rajasthan village producer: their story, the products they make and the culture of their village.",
      },
      { property: "og:title", content: "Meet the Maker — MARUDHARA" },
      { property: "og:description", content: "Buy direct from a village maker in Rajasthan." },
    ],
  }),
  component: MakerPage,
});

function Media({ path, className }: { path?: string | null; className?: string }) {
  const url = useMediaUrl(path);
  if (!url) return <div className={`bg-muted ${className ?? ""}`} />;
  return <img src={url} alt="" className={className} loading="lazy" />;
}

function MakerPage() {
  const { id } = Route.useParams();
  const L = useLocal();

  const makerQ = useQuery({
    queryKey: ["live-profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as LiveProfile | null) ?? null;
    },
  });

  const productsQ = useQuery({
    queryKey: ["live-products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_products")
        .select("*")
        .eq("producer_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LiveProduct[];
    },
  });

  const cultureQ = useQuery({
    queryKey: ["live-culture", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("village_culture")
        .select("*")
        .eq("producer_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LiveCulture[];
    },
  });

  const maker = makerQ.data;

  if (makerQ.isLoading) {
    return (
      <Screen>
        <TopBar title="कारीगर / Maker" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">लोड हो रहा है…</p>
      </Screen>
    );
  }

  if (!maker) {
    return (
      <Screen>
        <TopBar title="कारीगर / Maker" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">
          यह प्रोफ़ाइल नहीं मिली / This maker profile was not found.
        </p>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title={maker.name} />

      <div className="px-4 pt-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <Media path={maker.photo_url} className="h-24 w-24 rounded-3xl object-cover" />
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-xl leading-tight">
              {maker.name}
              {maker.verified ? <BadgeCheck className="h-5 w-5 shrink-0 text-teal" /> : null}
            </h1>
            {maker.craft ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{maker.craft}</p>
            ) : null}
            <p className="mt-1 flex items-center gap-1 truncate text-xs font-bold text-primary">
              <MapPin className="h-3.5 w-3.5" />
              {maker.village_name} · {L(districtName(maker.district))}
            </p>
          </div>
        </div>

        {maker.story ? (
          <>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              कहानी / Story
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{maker.story}</p>
          </>
        ) : null}

        {maker.phone ? (
          <a href={`tel:${maker.phone}`} className="tap btn-outline mt-4 w-full text-sm">
            <Phone className="h-4 w-4" /> {maker.phone}
          </a>
        ) : null}

        {maker.upi_id ? <UpiPay upiId={maker.upi_id} payeeName={maker.upi_name ?? maker.name} /> : null}
      </div>

      {productsQ.data?.length ? (
        <>
          <SectionHead title="उत्पाद / Products" />
          <ul className="grid gap-3 px-4">
            {productsQ.data.map((p) => (
              <li key={p.id} className="surface overflow-hidden">
                <Media path={p.image_url} className="h-40 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.unit ?? ""} {p.stock ? `· ${p.stock} in stock` : ""}
                  </p>
                  <p className="mt-1 font-display text-lg text-primary">{rupee(Number(p.price))}</p>
                  {p.story ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.story}</p>
                  ) : null}
                  {p.facilities ? (
                    <p className="mt-2 text-xs font-semibold text-teal">{p.facilities}</p>
                  ) : null}
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
