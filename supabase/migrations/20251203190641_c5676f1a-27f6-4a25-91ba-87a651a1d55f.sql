-- Create drinks table
CREATE TABLE public.drinks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('whiskey', 'beer', 'wine', 'cocktail', 'other')),
  brand TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  location TEXT,
  price DECIMAL(10,2),
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;

-- Users can only view their own drinks
CREATE POLICY "Users can view their own drinks"
ON public.drinks FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own drinks
CREATE POLICY "Users can create their own drinks"
ON public.drinks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own drinks
CREATE POLICY "Users can update their own drinks"
ON public.drinks FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own drinks
CREATE POLICY "Users can delete their own drinks"
ON public.drinks FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_drinks_updated_at
BEFORE UPDATE ON public.drinks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();