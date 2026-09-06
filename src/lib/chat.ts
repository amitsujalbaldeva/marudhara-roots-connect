import { supabase } from "@/integrations/supabase/client";

/** Chat tables are newer than the generated types, so we talk to them untyped. */
const db = supabase as unknown as {
  from: (table: string) => any;
};

export type ChatThread = {
  id: string;
  buyer_id: string;
  seller_id: string;
  producer_id: string;
  product_id: string | null;
  product_name: string | null;
  last_message_at: string;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export async function listThreads(userId: string): Promise<ChatThread[]> {
  const { data, error } = await db
    .from("chat_threads")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ChatThread[];
}

export async function getThread(id: string): Promise<ChatThread | null> {
  const { data, error } = await db.from("chat_threads").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as ChatThread | null) ?? null;
}

export async function listMessages(threadId: string): Promise<ChatMessage[]> {
  const { data, error } = await db
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(threadId: string, senderId: string, body: string) {
  const { error } = await db
    .from("chat_messages")
    .insert({ thread_id: threadId, sender_id: senderId, body: body.trim() });
  if (error) throw error;
  await db.from("chat_threads").update({ last_message_at: new Date().toISOString() }).eq("id", threadId);
}

/** Find (or open) the buyer↔seller chat for a maker, optionally about one product. */
export async function openThread(opts: {
  buyerId: string;
  sellerId: string;
  producerId: string;
  productId?: string | null;
  productName?: string | null;
}): Promise<string> {
  let find = db
    .from("chat_threads")
    .select("id")
    .eq("buyer_id", opts.buyerId)
    .eq("producer_id", opts.producerId);
  find = opts.productId ? find.eq("product_id", opts.productId) : find.is("product_id", null);
  const { data: existing, error: findError } = await find.maybeSingle();
  if (findError) throw findError;
  if (existing?.id) return existing.id as string;

  const { data, error } = await db
    .from("chat_threads")
    .insert({
      buyer_id: opts.buyerId,
      seller_id: opts.sellerId,
      producer_id: opts.producerId,
      product_id: opts.productId ?? null,
      product_name: opts.productName ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}
