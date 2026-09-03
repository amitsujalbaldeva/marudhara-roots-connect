import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Screen, SectionHead, TopBar } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { districts } from "@/lib/data";
import { rupee } from "@/lib/store";
import { uploadMedia, useMediaUrl, type LiveCulture, type LiveProduct, type LiveProfile } from "@/lib/live";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "My Maker Studio (मेरा स्टूडियो) — MARUDHARA" },
      {
        name: "description",
        content:
          "Producers add their profile, products with photos and price, and share their village culture with tourists.",
      },
      { property: "og:title", content: "My Maker Studio — MARUDHARA" },
      { property: "og:description", content: "List products and village culture on MARUDHARA." },
    ],
  }),
  component: Studio,
});

function Thumb({ path, className }: { path?: string | null; className?: string }) {
  const url = useMediaUrl(path);
  if (!url) return <div className={`bg-muted ${className ?? ""}`} />;
  return <img src={url} alt="" className={className} />;
}

function Studio() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading } = useSupabaseUser();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const profileQ = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as LiveProfile | null) ?? null;
    },
  });
  const profile = profileQ.data ?? null;

  const productsQ = useQuery({
    queryKey: ["my-products", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_products")
        .select("*")
        .eq("producer_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LiveProduct[];
    },
  });

  const cultureQ = useQuery({
    queryKey: ["my-culture", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("village_culture")
        .select("*")
        .eq("producer_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LiveCulture[];
    },
  });

  const [p, setP] = useState({
    name: "",
    village_name: "",
    district: districts[0]?.id ?? "udaipur",
    craft: "",
    story: "",
    phone: "",
    upi_id: "",
    upi_name: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!profile) return;
    setP({
      name: profile.name,
      village_name: profile.village_name,
      district: profile.district,
      craft: profile.craft ?? "",
      story: profile.story ?? "",
      phone: profile.phone ?? "",
      upi_id: profile.upi_id ?? "",
      upi_name: profile.upi_name ?? "",
    });
  }, [profile]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!p.name.trim() || !p.village_name.trim()) throw new Error("नाम और गाँव ज़रूरी है");
      let photo_url = profile?.photo_url ?? null;
      if (photo) photo_url = await uploadMedia(user!.id, photo);
      const upi = p.upi_id.trim();
      if (upi && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi))
        throw new Error("UPI ID सही नहीं है (जैसे: 9876543210@ybl)");
      const row = {
        ...p,
        name: p.name.trim(),
        village_name: p.village_name.trim(),
        upi_id: upi || null,
        upi_name: p.upi_name.trim() || null,
        photo_url,
        user_id: user!.id,
      };
      const { error } = await supabase
        .from("producer_profiles")
        .upsert(row, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      setPhoto(null);
      toast.success("प्रोफ़ाइल सेव हो गई / Profile saved");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      qc.invalidateQueries({ queryKey: ["live-profiles"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "सेव नहीं हुआ"),
  });

  const [pr, setPr] = useState({ name: "", price: "", unit: "", stock: "", category: "food", story: "", facilities: "" });
  const [prPhoto, setPrPhoto] = useState<File | null>(null);

  const addProduct = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("पहले प्रोफ़ाइल सेव करें");
      if (!pr.name.trim() || !pr.price) throw new Error("उत्पाद का नाम और कीमत ज़रूरी है");
      let image_url: string | null = null;
      if (prPhoto) image_url = await uploadMedia(user!.id, prPhoto);
      const { error } = await supabase.from("producer_products").insert({
        user_id: user!.id,
        producer_id: profile.id,
        name: pr.name.trim(),
        price: Number(pr.price) || 0,
        unit: pr.unit || null,
        stock: Number(pr.stock) || 0,
        category: pr.category,
        story: pr.story || null,
        facilities: pr.facilities || null,
        image_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setPr({ name: "", price: "", unit: "", stock: "", category: "food", story: "", facilities: "" });
      setPrPhoto(null);
      toast.success("उत्पाद लाइव हो गया / Product is live");
      qc.invalidateQueries({ queryKey: ["my-products"] });
      qc.invalidateQueries({ queryKey: ["live-products"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "जोड़ नहीं पाए"),
  });

  const [cu, setCu] = useState({ title: "", description: "" });
  const [cuPhoto, setCuPhoto] = useState<File | null>(null);

  const addCulture = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("पहले प्रोफ़ाइल सेव करें");
      if (!cu.title.trim()) throw new Error("शीर्षक ज़रूरी है");
      const image_urls: string[] = [];
      if (cuPhoto) image_urls.push(await uploadMedia(user!.id, cuPhoto));
      const { error } = await supabase.from("village_culture").insert({
        user_id: user!.id,
        producer_id: profile.id,
        village_name: profile.village_name,
        district: profile.district,
        title: cu.title.trim(),
        description: cu.description || null,
        image_urls,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCu({ title: "", description: "" });
      setCuPhoto(null);
      toast.success("गाँव की संस्कृति जुड़ गई / Culture post published");
      qc.invalidateQueries({ queryKey: ["my-culture"] });
      qc.invalidateQueries({ queryKey: ["live-culture"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "जोड़ नहीं पाए"),
  });

  async function removeProduct(id: string) {
    const { error } = await supabase.from("producer_products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-products"] });
    qc.invalidateQueries({ queryKey: ["live-products"] });
  }

  async function removeCulture(id: string) {
    const { error } = await supabase.from("village_culture").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-culture"] });
    qc.invalidateQueries({ queryKey: ["live-culture"] });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading || !user) {
    return (
      <Screen>
        <TopBar title="मेरा स्टूडियो / My studio" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">लोड हो रहा है…</p>
      </Screen>
    );
  }

  const input = "h-12 w-full rounded-2xl border border-border bg-card px-3 text-base";

  return (
    <Screen>
      <TopBar
        title="मेरा स्टूडियो / My studio"
        action={
          <button type="button" onClick={signOut} aria-label="Sign out" className="tap h-11 w-11">
            <LogOut className="h-5 w-5" />
          </button>
        }
      />

      <SectionHead title="मेरी पहचान / My profile" />
      <div className="grid gap-3 px-4">
        <input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="आपका नाम / SHG name" className={input} />
        <input value={p.village_name} onChange={(e) => setP({ ...p, village_name: e.target.value })} placeholder="गाँव का नाम / Village name" className={input} />
        <select value={p.district} onChange={(e) => setP({ ...p, district: e.target.value })} className={input}>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name.hi} / {d.name.en}
            </option>
          ))}
        </select>
        <input value={p.craft} onChange={(e) => setP({ ...p, craft: e.target.value })} placeholder="काम / Craft (जैसे: पापड़, बंधेज)" className={input} />
        <input value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} inputMode="tel" placeholder="मोबाइल नंबर / Phone" className={input} />
        <textarea value={p.story} onChange={(e) => setP({ ...p, story: e.target.value })} rows={4} placeholder="आपकी कहानी / Your story" className="w-full rounded-2xl border border-border bg-card p-3 text-base" />
        <label className="tap surface grid place-items-center gap-1 p-5 text-xs font-bold text-muted-foreground">
          <UploadCloud className="h-6 w-6 text-primary" />
          {photo ? photo.name : "अपनी फोटो जोड़ें / Add your photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </label>
        {profile?.photo_url ? <Thumb path={profile.photo_url} className="h-28 w-28 rounded-3xl object-cover" /> : null}
        <button type="button" disabled={saveProfile.isPending} onClick={() => saveProfile.mutate()} className="tap btn-primary w-full text-sm disabled:opacity-60">
          प्रोफ़ाइल सेव करें / Save profile
        </button>
        {profile ? (
          <Link to="/maker/$id" params={{ id: profile.id }} className="text-center text-xs font-bold text-primary">
            मेरा सार्वजनिक पेज देखें / View my public page →
          </Link>
        ) : null}
      </div>

      <SectionHead title="उत्पाद जोड़ें / Add product" />
      <div className="grid gap-3 px-4">
        <input value={pr.name} onChange={(e) => setPr({ ...pr, name: e.target.value })} placeholder="उत्पाद का नाम / Product name" className={input} />
        <div className="grid grid-cols-2 gap-3">
          <input value={pr.price} onChange={(e) => setPr({ ...pr, price: e.target.value })} inputMode="numeric" placeholder="कीमत ₹ / Price" className={input} />
          <input value={pr.stock} onChange={(e) => setPr({ ...pr, stock: e.target.value })} inputMode="numeric" placeholder="स्टॉक / Stock" className={input} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input value={pr.unit} onChange={(e) => setPr({ ...pr, unit: e.target.value })} placeholder="मात्रा / Unit (500g)" className={input} />
          <select value={pr.category} onChange={(e) => setPr({ ...pr, category: e.target.value })} className={input}>
            <option value="food">खाद्य / Food</option>
            <option value="spice">मसाले / Spices</option>
            <option value="craft">हस्तशिल्प / Handicraft</option>
            <option value="textile">कपड़ा / Textile</option>
          </select>
        </div>
        <textarea value={pr.story} onChange={(e) => setPr({ ...pr, story: e.target.value })} rows={3} placeholder="कहानी / Story (कोई स्वास्थ्य दावा नहीं)" className="w-full rounded-2xl border border-border bg-card p-3 text-base" />
        <input value={pr.facilities} onChange={(e) => setPr({ ...pr, facilities: e.target.value })} placeholder="सुविधाएं / Facilities (डिलीवरी, COD)" className={input} />
        <label className="tap surface grid place-items-center gap-1 p-5 text-xs font-bold text-muted-foreground">
          <UploadCloud className="h-6 w-6 text-primary" />
          {prPhoto ? prPhoto.name : "उत्पाद की फोटो / Product photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPrPhoto(e.target.files?.[0] ?? null)} />
        </label>
        <button type="button" disabled={addProduct.isPending} onClick={() => addProduct.mutate()} className="tap btn-teal w-full text-sm disabled:opacity-60">
          <Plus className="h-4 w-4" /> उत्पाद जोड़ें
        </button>
      </div>

      {productsQ.data?.length ? (
        <ul className="mt-4 grid gap-2 px-4">
          {productsQ.data.map((x) => (
            <li key={x.id} className="surface grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
              <Thumb path={x.image_url} className="h-12 w-12 rounded-xl object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{x.name}</span>
                <span className="text-xs text-muted-foreground">{rupee(Number(x.price))} · {x.stock} स्टॉक</span>
              </span>
              <button type="button" onClick={() => removeProduct(x.id)} aria-label="Delete" className="tap h-11 w-11 text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <SectionHead title="गाँव की संस्कृति / Village culture" />
      <div className="grid gap-3 px-4">
        <input value={cu.title} onChange={(e) => setCu({ ...cu, title: e.target.value })} placeholder="शीर्षक / Title (त्योहार, खाना, कला)" className={input} />
        <textarea value={cu.description} onChange={(e) => setCu({ ...cu, description: e.target.value })} rows={4} placeholder="विवरण / Describe your village culture" className="w-full rounded-2xl border border-border bg-card p-3 text-base" />
        <label className="tap surface grid place-items-center gap-1 p-5 text-xs font-bold text-muted-foreground">
          <UploadCloud className="h-6 w-6 text-primary" />
          {cuPhoto ? cuPhoto.name : "गाँव की फोटो / Village photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setCuPhoto(e.target.files?.[0] ?? null)} />
        </label>
        <button type="button" disabled={addCulture.isPending} onClick={() => addCulture.mutate()} className="tap btn-primary w-full text-sm disabled:opacity-60">
          <Plus className="h-4 w-4" /> संस्कृति जोड़ें
        </button>
      </div>

      {cultureQ.data?.length ? (
        <ul className="mt-4 grid gap-2 px-4">
          {cultureQ.data.map((c) => (
            <li key={c.id} className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{c.title}</span>
                <span className="text-xs text-muted-foreground">{c.village_name}</span>
              </span>
              <button type="button" onClick={() => removeCulture(c.id)} aria-label="Delete" className="tap h-11 w-11 text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Screen>
  );
}
