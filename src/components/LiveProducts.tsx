import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionHead } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { rupee } from "@/lib/store";
import { useMediaUrl, type LiveProduct } from "@/lib/live";

function Media({ path, className }: { path?: string | null; className?: string }) {
  const url = useMediaUrl(path);
  if (!url) return <div className={`bg-muted ${className ?? ""}`} />;
  return <img src={url} alt="" className={className} loading="lazy" />;
}

/** Products launched by real producers — newest first. */
export function LiveProducts({ limit = 6 }: { limit?: number }) {
  const q = useQuery({
    queryKey: ["live-products", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("producer_products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as LiveProduct[];
    },
  });

  if (!q.data?.length) return null;

  return (
    <>
      <SectionHead
        title="गाँव से लाइव / Just launched by makers"
        sub="सब देखें"
        href="/community"
      />
      <ul className="grid grid-cols-2 gap-3 px-4">
        {q.data.map((p) => (
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
  );
}
