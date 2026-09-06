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

const input = "h-12 w-full rounded-2xl border border-border bg-card px-3 text-base";

function Avatar({ path }: { path?: string | null | undefined }) {
  const url = useMediaUrl(path);
  if (!url) return <div className="h-16 w-16 rounded-2xl bg-muted" />;
  return <img src={url} alt="" className="h-16 w-16 rounded-2xl object-cover" />;
}

function MyAccount() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading } = useSupabaseUser();

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

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [f, setF] = useState({ name: "", village_name: "", phone: "", upi_id: "" });

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!profile) return;
    setF({
      name: profile.name,
      village_name: profile.village_name,
      phone: profile.phone ?? "",
      upi_id: profile.upi_id ?? "",
    });
  }, [profile]);

  const saveEmail = useMutation({
    mutationFn: async () => {
      const next = email.trim();
      if (!next || next === user?.email) throw new Error("नया ईमेल डालें / Enter a new email");
      const { error } = await supabase.auth.updateUser({ email: next });
      if (error) throw error;
    },
    onSuccess: () =>
      toast.success("नए ईमेल पर पुष्टि लिंक भेजा गया / Confirmation link sent to the new email"),
    onError: (e) => toast.error(e instanceof Error ? e.message : "बदल नहीं पाए"),
  });

  const savePass = useMutation({
    mutationFn: async () => {
      if (pass.length < 6) throw new Error("पासवर्ड कम से कम 6 अक्षर / At least 6 characters");
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) throw error;
    },
    onSuccess: () => {
      setPass("");
      toast.success("पासवर्ड बदल गया / Password updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "बदल नहीं पाए"),
  });

  const saveDetails = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("पहले स्टूडियो में प्रोफ़ाइल बनाएं");
      if (!f.name.trim() || !f.village_name.trim()) throw new Error("नाम और गाँव ज़रूरी है");
      const upi = f.upi_id.trim();
      if (upi && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi))
        throw new Error("UPI ID सही नहीं है (जैसे: 9876543210@ybl)");
      const { error } = await supabase
        .from("producer_profiles")
        .update({
          name: f.name.trim(),
          village_name: f.village_name.trim(),
          phone: f.phone.trim() || null,
          upi_id: upi || null,
        })
        .eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("जानकारी सेव हो गई / Details saved");
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      qc.invalidateQueries({ queryKey: ["live-profiles"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "सेव नहीं हुआ"),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading) return null;

  if (!user)
    return (
      <div className="px-4 pt-4">
        <div className="surface grid gap-3 p-4">
          <p className="text-sm font-bold">मेरा खाता / My account</p>
          <p className="text-xs text-muted-foreground">
            लॉगिन करें और अपनी सारी जानकारी देखें व बदलें।
          </p>
          <Link to="/auth" className="tap btn-primary w-full text-sm">
            <Mail className="h-4 w-4" /> लॉगिन / साइन अप
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <SectionHead title="मेरा खाता / My account" />
      <div className="grid gap-3 px-4">
        <div className="surface grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-3">
          <Avatar path={profile?.photo_url} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{profile?.name ?? user.email}</span>
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
            {profile ? (
              <span className="block truncate text-xs text-primary">
                {profile.village_name} · {profile.craft ?? ""}
              </span>
            ) : null}
          </span>
        </div>

        <div className="surface grid gap-3 p-3">
          <p className="text-xs font-bold text-teal">ईमेल बदलें / Change email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            autoCapitalize="none"
            className={input}
            placeholder="ईमेल / Email"
          />
          <button
            type="button"
            disabled={saveEmail.isPending}
            onClick={() => saveEmail.mutate()}
            className="tap btn-outline w-full text-sm disabled:opacity-60"
          >
            ईमेल अपडेट करें
          </button>
          <p className="text-xs font-bold text-teal">पासवर्ड बदलें / Change password</p>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            className={input}
            placeholder="नया पासवर्ड / New password"
          />
          <button
            type="button"
            disabled={savePass.isPending}
            onClick={() => savePass.mutate()}
            className="tap btn-outline w-full text-sm disabled:opacity-60"
          >
            पासवर्ड अपडेट करें
          </button>
        </div>

        {profile ? (
          <div className="surface grid gap-3 p-3">
            <p className="text-xs font-bold text-teal">मेरी जानकारी / My details</p>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} placeholder="नाम / Name" />
            <input value={f.village_name} onChange={(e) => setF({ ...f, village_name: e.target.value })} className={input} placeholder="गाँव / Village" />
            <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" className={input} placeholder="मोबाइल / Phone" />
            <input value={f.upi_id} onChange={(e) => setF({ ...f, upi_id: e.target.value })} autoCapitalize="none" className={input} placeholder="UPI ID (9876543210@ybl)" />
            <button
              type="button"
              disabled={saveDetails.isPending}
              onClick={() => saveDetails.mutate()}
              className="tap btn-primary w-full text-sm disabled:opacity-60"
            >
              जानकारी सेव करें / Save details
            </button>
            <Link to="/maker/$id" params={{ id: profile.id }} className="text-center text-xs font-bold text-primary">
              मेरा सार्वजनिक पेज देखें →
            </Link>
          </div>
        ) : (
          <Link to="/studio" className="tap btn-teal w-full text-sm">
            <Store className="h-4 w-4" /> प्रोड्यूसर प्रोफ़ाइल बनाएं
          </Link>
        )}

        <button type="button" onClick={signOut} className="tap btn-outline w-full text-sm">
          <LogOut className="h-4 w-4" /> लॉग आउट / Sign out
        </button>
      </div>
    </>
  );
}

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

      <MyAccount />



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
        <Link to="/chats" className="tap btn-outline w-full text-sm">
          <LayoutDashboard className="h-4 w-4" />
          मेरी बातचीत / My chats
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
