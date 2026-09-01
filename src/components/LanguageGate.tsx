import { useState } from "react";
import { Check, Languages } from "lucide-react";
import { LANGUAGES, tr, useLang, type Lang } from "@/lib/i18n";

export function LanguageGate() {
  const { chosen, setLang } = useLang();
  const [picked, setPicked] = useState<Lang>("hi");

  if (chosen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-5 pt-14 pb-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Languages className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-2xl leading-tight">MARUDHARA</p>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">मरुधरा</p>
        </div>
      </div>

      <h1 className="mt-9 text-3xl leading-tight">
        {tr("chooseLanguage", picked)}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{tr("chooseLanguageSub", picked)}</p>

      <div className="mt-7 grid gap-3">
        {LANGUAGES.map((l) => {
          const active = picked === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setPicked(l.code)}
              aria-pressed={active}
              className={`tap w-full justify-between px-4 py-3 text-left ${
                active
                  ? "bg-primary/8 border-2 border-primary"
                  : "surface border border-border"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-lg font-bold">{l.native}</span>
                <span className="block text-xs font-medium text-muted-foreground">
                  {l.label} · {l.note}
                </span>
              </span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {active ? <Check className="h-4 w-4" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={() => setLang(picked)}
          className="tap btn-primary w-full text-base"
        >
          {tr("continue", picked)}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {tr("tagline", picked)}
        </p>
      </div>
    </div>
  );
}
