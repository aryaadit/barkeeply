-- Add wishlist column to drinks table
ALTER TABLE public.drinks ADD COLUMN is_wishlist BOOLEAN DEFAULT false;

-- Create collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📚',
  cover_color TEXT DEFAULT '#8B5CF6',
  share_id UUID UNIQUE DEFAULT gen_random_uuid(),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create collection_drinks junction table
CREATE TABLE public.collection_drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  drink_id UUID REFERENCES public.drinks(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(collection_id, drink_id)
);

-- Enable RLS on collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Collections RLS policies
CREATE POLICY "Users can view their own collections"
ON public.collections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections"
ON public.collections FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can create their own collections"
ON public.collections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON public.collections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON public.collections FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on collection_drinks
ALTER TABLE public.collection_drinks ENABLE ROW LEVEL SECURITY;

-- Collection_drinks RLS policies (users can manage drinks in their own collections)
CREATE POLICY "Users can view drinks in their collections"
ON public.collection_drinks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view drinks in public collections"
ON public.collection_drinks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND is_public = true
  )
);

CREATE POLICY "Users can add drinks to their collections"
ON public.collection_drinks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove drinks from their collections"
ON public.collection_drinks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update drink positions in their collections"
ON public.collection_drinks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

-- Add trigger for updated_at on collections
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();