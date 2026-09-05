CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  producer_id uuid NOT NULL REFERENCES public.producer_profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.producer_products(id) ON DELETE SET NULL,
  product_name text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX chat_threads_unique ON public.chat_threads (buyer_id, producer_id, COALESCE(product_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX chat_threads_buyer ON public.chat_threads (buyer_id, last_message_at DESC);
CREATE INDEX chat_threads_seller ON public.chat_threads (seller_id, last_message_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY threads_participant_read ON public.chat_threads FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY threads_buyer_insert ON public.chat_threads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id AND seller_id = (SELECT user_id FROM public.producer_profiles WHERE id = producer_id));
CREATE POLICY threads_participant_update ON public.chat_threads FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_thread ON public.chat_messages (thread_id, created_at);

GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_participant_read ON public.chat_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND (auth.uid() = t.buyer_id OR auth.uid() = t.seller_id)));
CREATE POLICY messages_participant_insert ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND (auth.uid() = t.buyer_id OR auth.uid() = t.seller_id)));