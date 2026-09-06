import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { BadgeCheck, Copy, IndianRupee, MapPin, MessageCircle, Phone } from "lucide-react";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { districtName } from "@/lib/data";
import { useLocal } from "@/lib/i18n";
import { rupee } from "@/lib/store";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { openThread } from "@/lib/chat";
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

function UpiPay({ upiId, payeeName }: { upiId: string; payeeName: string }) {
  const [amount, setAmount] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const link = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR${
    Number(amount) > 0 ? `&am=${Number(amount)}` : ""
  }`;

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(link, { margin: 1, width: 320 })
      .then((url) => {
        if (alive) setQr(url);
      })
      .catch(() => setQr(null));
    return () => {
      alive = false;
    };
  }, [link]);

  const openApp = () => {
    try {
      const w = window.top ?? window;
      w.location.href = link;
    } catch {
      window.location.href = link;
    }
    setTimeout(() => {
      toast.info("अगर कोई ऐप न खुले तो नीचे QR स्कैन करें या UPI ID कॉपी करें।");
    }, 1200);
  };

  return (
    <div className="surface mt-4 grid gap-3 p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal">
        <IndianRupee className="h-4 w-4" /> ऑनलाइन भुगतान / Pay online
      </p>
      <p className="text-sm">
        UPI: <span className="font-bold">{upiId}</span>
        <span className="block text-xs text-muted-foreground">{payeeName}</span>
      </p>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
        inputMode="numeric"
        placeholder="राशि ₹ / Amount (optional)"
        className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
      />
      <button type="button" onClick={openApp} className="tap btn-primary w-full text-sm">
        GPay / PhonePe / Paytm से भेजें
      </button>
      {qr ? (
        <div className="grid justify-items-center gap-1">
          <img src={qr} alt="UPI QR" className="h-40 w-40 rounded-2xl bg-white p-2" />
          <span className="text-[11px] text-muted-foreground">
            किसी भी UPI ऐप से यह QR स्कैन करें / Scan this QR
          </span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(upiId);
            toast.success("UPI ID कॉपी हो गई / Copied");
          } catch {
            toast.error("कॉपी नहीं हुआ — UPI ID हाथ से लिखें");
          }
        }}
        className="tap btn-outline w-full text-sm"
      >
        <Copy className="h-4 w-4" /> UPI ID कॉपी करें
      </button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        पैसा सीधे कारीगर के खाते में जाता है। भेजने से पहले नाम ज़रूर देखें।
      </p>
    </div>
  );
}

function ChatButton({
  maker,
  product,
  variant = "primary",
}: {
  maker: LiveProfile;
  product?: LiveProduct;
  variant?: "primary" | "outline";
}) {
  const { user } = useSupabaseUser();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!user) {
          navigate({ to: "/auth" });
          return;
        }
        if (user.id === maker.user_id) {
          toast.info("यह आपका ही पेज है / This is your own page.");
          return;
        }
        setBusy(true);
        try {
          const id = await openThread({
            buyerId: user.id,
            sellerId: maker.user_id,
            producerId: maker.id,
            productId: product?.id ?? null,
            productName: product?.name ?? null,
          });
          navigate({ to: "/chat/$threadId", params: { threadId: id } });
        } catch (e) {
          toast.error((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
      className={`tap w-full text-sm ${variant === "primary" ? "btn-teal" : "btn-outline"} disabled:opacity-50`}
    >
      <MessageCircle className="h-4 w-4" />
      {product ? "इस उत्पाद पर बात करें" : "कारीगर से बात करें / Chat with maker"}
    </button>
  );
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

        <div className="mt-3">
          <ChatButton maker={maker} />
        </div>

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
                  <div className="mt-3">
                    <ChatButton maker={maker} product={p} variant="outline" />
                  </div>
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
