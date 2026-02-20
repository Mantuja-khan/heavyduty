
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Trading', 'Manufacturing')),
  description TEXT NOT NULL DEFAULT '',
  specifications JSONB NOT NULL DEFAULT '{}',
  price NUMERIC,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view products)
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing product data
INSERT INTO public.products (name, slug, category, description, specifications, price, stock, featured) VALUES
('JCB 3CX Backhoe Loader', 'jcb-3cx-backhoe', 'Trading', 'Versatile backhoe loader for construction and utility work.', '{"Engine Power":"74 kW","Operating Weight":"8070 kg","Max Dig Depth":"5.46 m","Bucket Capacity":"1.0 m³"}', NULL, 5, true),
('CAT 320 Excavator', 'cat-320-excavator', 'Trading', 'Next-gen excavator with smart tech for efficiency.', '{"Engine Power":"121 kW","Operating Weight":"22000 kg","Max Dig Depth":"6.7 m","Bucket Capacity":"1.19 m³"}', NULL, 3, true),
('Komatsu D65 Bulldozer', 'komatsu-d65-bulldozer', 'Trading', 'Heavy-duty bulldozer for large earthmoving projects.', '{"Engine Power":"153 kW","Operating Weight":"20800 kg","Blade Capacity":"5.6 m³","Ground Pressure":"68 kPa"}', NULL, 2, true),
('Volvo L120H Wheel Loader', 'volvo-l120h-loader', 'Trading', 'Efficient wheel loader with superior lifting capacity.', '{"Engine Power":"177 kW","Operating Weight":"19400 kg","Bucket Capacity":"3.4 m³","Breakout Force":"178 kN"}', NULL, 4, false),
('Liebherr LTM 1100 Crane', 'liebherr-ltm-1100', 'Trading', 'All-terrain crane with 100-ton lifting capacity.', '{"Max Capacity":"100 t","Max Boom Length":"60 m","Engine Power":"370 kW","Axles":"5"}', NULL, 1, true),
('Hitachi ZX350 Excavator', 'hitachi-zx350', 'Trading', 'Large excavator built for tough mining and quarrying.', '{"Engine Power":"192 kW","Operating Weight":"35700 kg","Max Dig Depth":"7.45 m","Bucket Capacity":"1.6 m³"}', NULL, 2, false),
('Caterpillar 950M Loader', 'cat-950m-loader', 'Trading', 'Medium wheel loader with advanced operator controls.', '{"Engine Power":"162 kW","Operating Weight":"18100 kg","Bucket Capacity":"3.3 m³","Dump Clearance":"2.86 m"}', NULL, 3, false),
('Doosan DX225LC Excavator', 'doosan-dx225lc', 'Trading', 'Crawler excavator combining power and fuel economy.', '{"Engine Power":"110 kW","Operating Weight":"22500 kg","Max Dig Depth":"6.58 m","Bucket Capacity":"1.0 m³"}', NULL, 6, false),
('JCB 457 Wheel Loader', 'jcb-457-loader', 'Trading', 'High-performance loader for quarry and recycling.', '{"Engine Power":"193 kW","Operating Weight":"23500 kg","Bucket Capacity":"3.7 m³","Breakout Force":"190 kN"}', NULL, 2, false),
('Kobelco SK210 Excavator', 'kobelco-sk210', 'Trading', 'Fuel-efficient excavator for general construction.', '{"Engine Power":"113 kW","Operating Weight":"21300 kg","Max Dig Depth":"6.42 m","Bucket Capacity":"0.91 m³"}', NULL, 4, false),
('XCMG XE215C Excavator', 'xcmg-xe215c', 'Trading', 'Reliable mid-size excavator with strong digging force.', '{"Engine Power":"118 kW","Operating Weight":"21500 kg","Max Dig Depth":"6.5 m","Bucket Capacity":"1.0 m³"}', NULL, 5, false),
('Sany SY215C Excavator', 'sany-sy215c', 'Trading', 'Cost-effective excavator with advanced hydraulics.', '{"Engine Power":"118 kW","Operating Weight":"21800 kg","Max Dig Depth":"6.6 m","Bucket Capacity":"1.06 m³"}', NULL, 3, false),
('Case 580N Backhoe', 'case-580n-backhoe', 'Trading', 'Compact backhoe ideal for utility and road work.', '{"Engine Power":"72 kW","Operating Weight":"7600 kg","Max Dig Depth":"4.4 m","Loader Capacity":"0.96 m³"}', NULL, 4, false),
('Tadano GR-1000XL Crane', 'tadano-gr1000xl', 'Trading', 'Rough terrain crane with 100-ton capacity.', '{"Max Capacity":"100 t","Max Boom Length":"47 m","Engine Power":"205 kW","Axles":"4"}', NULL, 1, false),
('Terex TC48 Mini Excavator', 'terex-tc48', 'Trading', 'Compact mini excavator for confined spaces.', '{"Engine Power":"30 kW","Operating Weight":"4900 kg","Max Dig Depth":"3.5 m","Bucket Capacity":"0.12 m³"}', NULL, 8, false),
('HeavyBuild HB-200 Concrete Mixer', 'hb200-concrete-mixer', 'Manufacturing', 'Industrial-grade concrete mixer with 200L drum capacity.', '{"Drum Capacity":"200 L","Motor Power":"2.2 kW","Rotation Speed":"28 rpm","Weight":"180 kg"}', 285000, 20, true),
('HeavyBuild HB-500 Plate Compactor', 'hb500-plate-compactor', 'Manufacturing', 'Vibrating plate compactor for soil and asphalt.', '{"Plate Size":"500x400 mm","Centrifugal Force":"20 kN","Engine":"6.5 HP","Weight":"95 kg"}', 145000, 35, true),
('HeavyBuild HB-3T Tower Hoist', 'hb3t-tower-hoist', 'Manufacturing', '3-ton capacity material hoist for building construction.', '{"Capacity":"3 ton","Height":"30 m","Speed":"30 m/min","Motor":"15 kW"}', 520000, 8, true),
('HeavyBuild HB-C12 Bar Cutter', 'hb-c12-bar-cutter', 'Manufacturing', 'Electric rebar cutter for construction sites.', '{"Max Bar":"32 mm","Motor":"3 kW","Cuts/min":"4-5","Weight":"280 kg"}', 195000, 15, false),
('HeavyBuild HB-V8 Vibrator', 'hb-v8-vibrator', 'Manufacturing', 'Concrete vibrator needle for compaction.', '{"Needle Dia":"38 mm","Motor":"2.2 kW","Frequency":"12000 rpm","Hose Length":"6 m"}', 32000, 50, false),
('HeavyBuild HB-W150 Weigh Batcher', 'hb-w150-batcher', 'Manufacturing', 'Precision weigh batcher for concrete mixing plants.', '{"Capacity":"500 kg","Accuracy":"±2%","Bins":"4","Power":"5 kW"}', 380000, 5, false),
('HeavyBuild HB-L50 Lab Mixer', 'hb-l50-lab-mixer', 'Manufacturing', '50-liter lab mixer for concrete testing.', '{"Capacity":"50 L","Motor":"1.5 kW","Speed":"20 rpm","Weight":"120 kg"}', 175000, 12, false),
('HeavyBuild HB-P10 Water Pump', 'hb-p10-pump', 'Manufacturing', 'Dewatering pump for construction sites.', '{"Flow Rate":"1000 L/min","Head":"25 m","Engine":"10 HP","Outlet":"100 mm"}', 95000, 25, false),
('HeavyBuild HB-S200 Scaffolding Set', 'hb-s200-scaffolding', 'Manufacturing', 'Heavy-duty steel scaffolding for building construction.', '{"Height":"2 m/unit","Load":"500 kg/m²","Material":"Galvanized Steel","Width":"1.2 m"}', 42000, 100, false),
('HeavyBuild HB-BB50 Block Machine', 'hb-bb50-block-machine', 'Manufacturing', 'Semi-automatic concrete block making machine.', '{"Blocks/hr":"800","Block Size":"400x200x200 mm","Motor":"7.5 kW","Weight":"3200 kg"}', 850000, 3, false);
