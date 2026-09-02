import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Screen, TopBar } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Producer Login (कारीगर लॉगिन) — MARUDHARA" },
      {
        name: "description",
        content:
          "Village women, artisans and homestay hosts: create your MARUDHARA account to list products and share your village culture.",
      },
      { property: "og:title", content: "Producer Login — MARUDHARA" },
      { property: "og:description", content: "Create your maker account on MARUDHARA." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useSupabaseUser();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/studio", replace: true });
  }, [user, navigate]);

  async function submit() {
    if (!email.trim() || password.length < 6) {
      toast.error("ईमेल और 6 अक्षर का पासवर्ड डालें / Enter email and 6+ char password");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/studio" },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "कुछ गड़बड़ हुई / Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google लॉगिन नहीं हो पाया / Google sign-in failed");
      return;
    }
  }

  return (
    <Screen>
      <TopBar title="कारीगर लॉगिन / Maker login" />

      <div className="grid gap-4 px-4 pt-5">
        <div>
          <h2 className="text-xl leading-tight">अपना खाता बनाएं</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your maker account to list products, homestays and your village culture.
          </p>
        </div>

        {sent ? (
          <div className="surface p-4 text-sm">
            <p className="font-bold text-success">ईमेल देखें / Check your email</p>
            <p className="mt-1 text-muted-foreground">
              हमने {email} पर पुष्टि लिंक भेजा है। लिंक खोलने के बाद आप लॉगिन हो जाएंगे।
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`chip h-11 flex-1 px-4 ${mode === "signup" ? "chip-active" : ""}`}
              >
                नया खाता / Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`chip h-11 flex-1 px-4 ${mode === "login" ? "chip-active" : ""}`}
              >
                लॉगिन / Log in
              </button>
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ईमेल / Email"
              className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="पासवर्ड / Password"
              className="h-12 w-full rounded-2xl border border-border bg-card px-3 text-base"
            />
            <button
              type="button"
              disabled={busy}
              onClick={submit}
              className="tap btn-primary w-full text-base disabled:opacity-60"
            >
              {mode === "signup" ? "खाता बनाएं" : "लॉगिन करें"}
            </button>

            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> या / or <span className="h-px flex-1 bg-border" />
            </div>

            <button type="button" onClick={google} className="tap btn-outline w-full text-sm">
              Google से जारी रखें
            </button>
          </>
        )}
      </div>
    </Screen>
  );
}
