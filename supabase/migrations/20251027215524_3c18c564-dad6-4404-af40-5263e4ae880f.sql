-- Create mortgage rates table for admin-managed rate data
CREATE TABLE public.mortgage_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ltv_ratio TEXT NOT NULL UNIQUE,
  two_year_rate NUMERIC(4,2) NOT NULL,
  five_year_rate NUMERIC(4,2) NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mortgage_rates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read rates (public data)
CREATE POLICY "Anyone can view mortgage rates"
  ON public.mortgage_rates
  FOR SELECT
  USING (true);

-- Only admins can update rates
CREATE POLICY "Admins can update mortgage rates"
  ON public.mortgage_rates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Insert default rates
INSERT INTO public.mortgage_rates (ltv_ratio, two_year_rate, five_year_rate, description, display_order) VALUES
  ('60%', 3.77, 3.94, 'Best rates for high equity', 1),
  ('75%', 4.74, 5.04, 'Popular LTV bracket', 2),
  ('85%', 4.15, 4.28, 'First-time buyers', 3),
  ('90%', 4.22, 4.45, 'Low deposit mortgages', 4),
  ('95%', 5.24, 5.49, 'Highest LTV available', 5);

-- Create trigger for updated_at
CREATE TRIGGER update_mortgage_rates_updated_at
  BEFORE UPDATE ON public.mortgage_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();