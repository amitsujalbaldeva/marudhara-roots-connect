CREATE TABLE public.producer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  village_name TEXT NOT NULL,
  district TEXT NOT NULL,
  craft TEXT,
  story TEXT,
  phone TEXT,
  photo_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.producer_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.producer_profiles TO authenticated;
GRANT ALL ON public.producer_profiles TO service_role;
ALTER TABLE public.producer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.producer_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_insert" ON public.producer_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_owner_update" ON public.producer_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_owner_delete" ON public.producer_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.producer_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  producer_id UUID NOT NULL REFERENCES public.producer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  story TEXT,
  facilities TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.producer_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.producer_products TO authenticated;
GRANT ALL ON public.producer_products TO service_role;
ALTER TABLE public.producer_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.producer_products FOR SELECT USING (true);
CREATE POLICY "products_owner_insert" ON public.producer_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_owner_update" ON public.producer_products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_owner_delete" ON public.producer_products FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.village_culture (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  producer_id UUID REFERENCES public.producer_profiles(id) ON DELETE CASCADE,
  village_name TEXT NOT NULL,
  district TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.village_culture TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.village_culture TO authenticated;
GRANT ALL ON public.village_culture TO service_role;
ALTER TABLE public.village_culture ENABLE ROW LEVEL SECURITY;
CREATE POLICY "culture_public_read" ON public.village_culture FOR SELECT USING (true);
CREATE POLICY "culture_owner_insert" ON public.village_culture FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "culture_owner_update" ON public.village_culture FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "culture_owner_delete" ON public.village_culture FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER producer_profiles_touch BEFORE UPDATE ON public.producer_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER producer_products_touch BEFORE UPDATE ON public.producer_products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER village_culture_touch BEFORE UPDATE ON public.village_culture FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "village_media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'village-media');
CREATE POLICY "village_media_owner_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'village-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "village_media_owner_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'village-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "village_media_owner_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'village-media' AND (storage.foldername(name))[1] = auth.uid()::text);