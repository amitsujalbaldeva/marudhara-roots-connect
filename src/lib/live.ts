import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveProfile = {
  id: string;
  user_id: string;
  name: string;
  village_name: string;
  district: string;
  craft: string | null;
  story: string | null;
  phone: string | null;
  upi_id: string | null;
  upi_name: string | null;
  photo_url: string | null;
  verified: boolean;
  created_at: string;
};

export type LiveProduct = {
  id: string;
  producer_id: string;
  name: string;
  price: number;
  unit: string | null;
  stock: number;
  category: string | null;
  story: string | null;
  facilities: string | null;
  image_url: string | null;
  created_at: string;
};

export type LiveCulture = {
  id: string;
  producer_id: string | null;
  village_name: string;
  district: string | null;
  title: string;
  description: string | null;
  image_urls: string[];
  created_at: string;
};

export const BUCKET = "village-media";

/** Upload a photo into the signed-in producer's own folder. Returns storage path. */
export async function uploadMedia(userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

const cache = new Map<string, string>();

/** Signed URL for a stored photo path (bucket is private). */
export function useMediaUrl(path?: string | null) {
  const [url, setUrl] = useState<string | null>(path ? cache.get(path) ?? null : null);

  useEffect(() => {
    let alive = true;
    if (!path) {
      setUrl(null);
      return;
    }
    const cached = cache.get(path);
    if (cached) {
      setUrl(cached);
      return;
    }
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 6)
      .then(({ data }) => {
        if (!alive || !data?.signedUrl) return;
        cache.set(path, data.signedUrl);
        setUrl(data.signedUrl);
      });
    return () => {
      alive = false;
    };
  }, [path]);

  return url;
}
