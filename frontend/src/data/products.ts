export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Trading" | "Manufacturing";
  description: string;
  specifications: Record<string, string>;
  price?: number;
  images: string[];
  stock: number;
  featured: boolean;
}

const tradingProducts: Product[] = [
  { id: "t1", name: "JCB 3CX Backhoe Loader", slug: "jcb-3cx-backhoe", category: "Trading", description: "Versatile backhoe loader for construction and utility work.", specifications: { "Engine Power": "74 kW", "Operating Weight": "8070 kg", "Max Dig Depth": "5.46 m", "Bucket Capacity": "1.0 m³" }, images: [], stock: 5, featured: true },
  { id: "t2", name: "CAT 320 Excavator", slug: "cat-320-excavator", category: "Trading", description: "Next-gen excavator with smart tech for efficiency.", specifications: { "Engine Power": "121 kW", "Operating Weight": "22000 kg", "Max Dig Depth": "6.7 m", "Bucket Capacity": "1.19 m³" }, images: [], stock: 3, featured: true },
  { id: "t3", name: "Komatsu D65 Bulldozer", slug: "komatsu-d65-bulldozer", category: "Trading", description: "Heavy-duty bulldozer for large earthmoving projects.", specifications: { "Engine Power": "153 kW", "Operating Weight": "20800 kg", "Blade Capacity": "5.6 m³", "Ground Pressure": "68 kPa" }, images: [], stock: 2, featured: true },
  { id: "t4", name: "Volvo L120H Wheel Loader", slug: "volvo-l120h-loader", category: "Trading", description: "Efficient wheel loader with superior lifting capacity.", specifications: { "Engine Power": "177 kW", "Operating Weight": "19400 kg", "Bucket Capacity": "3.4 m³", "Breakout Force": "178 kN" }, images: [], stock: 4, featured: false },
  { id: "t5", name: "Liebherr LTM 1100 Crane", slug: "liebherr-ltm-1100", category: "Trading", description: "All-terrain crane with 100-ton lifting capacity.", specifications: { "Max Capacity": "100 t", "Max Boom Length": "60 m", "Engine Power": "370 kW", "Axles": "5" }, images: [], stock: 1, featured: true },
  { id: "t6", name: "Hitachi ZX350 Excavator", slug: "hitachi-zx350", category: "Trading", description: "Large excavator built for tough mining and quarrying.", specifications: { "Engine Power": "192 kW", "Operating Weight": "35700 kg", "Max Dig Depth": "7.45 m", "Bucket Capacity": "1.6 m³" }, images: [], stock: 2, featured: false },
  { id: "t7", name: "Caterpillar 950M Loader", slug: "cat-950m-loader", category: "Trading", description: "Medium wheel loader with advanced operator controls.", specifications: { "Engine Power": "162 kW", "Operating Weight": "18100 kg", "Bucket Capacity": "3.3 m³", "Dump Clearance": "2.86 m" }, images: [], stock: 3, featured: false },
  { id: "t8", name: "Doosan DX225LC Excavator", slug: "doosan-dx225lc", category: "Trading", description: "Crawler excavator combining power and fuel economy.", specifications: { "Engine Power": "110 kW", "Operating Weight": "22500 kg", "Max Dig Depth": "6.58 m", "Bucket Capacity": "1.0 m³" }, images: [], stock: 6, featured: false },
  { id: "t9", name: "JCB 457 Wheel Loader", slug: "jcb-457-loader", category: "Trading", description: "High-performance loader for quarry and recycling.", specifications: { "Engine Power": "193 kW", "Operating Weight": "23500 kg", "Bucket Capacity": "3.7 m³", "Breakout Force": "190 kN" }, images: [], stock: 2, featured: false },
  { id: "t10", name: "Kobelco SK210 Excavator", slug: "kobelco-sk210", category: "Trading", description: "Fuel-efficient excavator for general construction.", specifications: { "Engine Power": "113 kW", "Operating Weight": "21300 kg", "Max Dig Depth": "6.42 m", "Bucket Capacity": "0.91 m³" }, images: [], stock: 4, featured: false },
  { id: "t11", name: "XCMG XE215C Excavator", slug: "xcmg-xe215c", category: "Trading", description: "Reliable mid-size excavator with strong digging force.", specifications: { "Engine Power": "118 kW", "Operating Weight": "21500 kg", "Max Dig Depth": "6.5 m", "Bucket Capacity": "1.0 m³" }, images: [], stock: 5, featured: false },
  { id: "t12", name: "Sany SY215C Excavator", slug: "sany-sy215c", category: "Trading", description: "Cost-effective excavator with advanced hydraulics.", specifications: { "Engine Power": "118 kW", "Operating Weight": "21800 kg", "Max Dig Depth": "6.6 m", "Bucket Capacity": "1.06 m³" }, images: [], stock: 3, featured: false },
  { id: "t13", name: "Case 580N Backhoe", slug: "case-580n-backhoe", category: "Trading", description: "Compact backhoe ideal for utility and road work.", specifications: { "Engine Power": "72 kW", "Operating Weight": "7600 kg", "Max Dig Depth": "4.4 m", "Loader Capacity": "0.96 m³" }, images: [], stock: 4, featured: false },
  { id: "t14", name: "Tadano GR-1000XL Crane", slug: "tadano-gr1000xl", category: "Trading", description: "Rough terrain crane with 100-ton capacity.", specifications: { "Max Capacity": "100 t", "Max Boom Length": "47 m", "Engine Power": "205 kW", "Axles": "4" }, images: [], stock: 1, featured: false },
  { id: "t15", name: "Terex TC48 Mini Excavator", slug: "terex-tc48", category: "Trading", description: "Compact mini excavator for confined spaces.", specifications: { "Engine Power": "30 kW", "Operating Weight": "4900 kg", "Max Dig Depth": "3.5 m", "Bucket Capacity": "0.12 m³" }, images: [], stock: 8, featured: false },
];

const manufacturingProducts: Product[] = [
  { id: "m1", name: "HeavyBuild HB-200 Concrete Mixer", slug: "hb200-concrete-mixer", category: "Manufacturing", description: "Industrial-grade concrete mixer with 200L drum capacity.", specifications: { "Drum Capacity": "200 L", "Motor Power": "2.2 kW", "Rotation Speed": "28 rpm", "Weight": "180 kg" }, price: 285000, images: [], stock: 20, featured: true },
  { id: "m2", name: "HeavyBuild HB-500 Plate Compactor", slug: "hb500-plate-compactor", category: "Manufacturing", description: "Vibrating plate compactor for soil and asphalt.", specifications: { "Plate Size": "500x400 mm", "Centrifugal Force": "20 kN", "Engine": "6.5 HP", "Weight": "95 kg" }, price: 145000, images: [], stock: 35, featured: true },
  { id: "m3", name: "HeavyBuild HB-3T Tower Hoist", slug: "hb3t-tower-hoist", category: "Manufacturing", description: "3-ton capacity material hoist for building construction.", specifications: { "Capacity": "3 ton", "Height": "30 m", "Speed": "30 m/min", "Motor": "15 kW" }, price: 520000, images: [], stock: 8, featured: true },
  { id: "m4", name: "HeavyBuild HB-C12 Bar Cutter", slug: "hb-c12-bar-cutter", category: "Manufacturing", description: "Electric rebar cutter for construction sites.", specifications: { "Max Bar": "32 mm", "Motor": "3 kW", "Cuts/min": "4-5", "Weight": "280 kg" }, price: 195000, images: [], stock: 15, featured: false },
  { id: "m5", name: "HeavyBuild HB-V8 Vibrator", slug: "hb-v8-vibrator", category: "Manufacturing", description: "Concrete vibrator needle for compaction.", specifications: { "Needle Dia": "38 mm", "Motor": "2.2 kW", "Frequency": "12000 rpm", "Hose Length": "6 m" }, price: 32000, images: [], stock: 50, featured: false },
  { id: "m6", name: "HeavyBuild HB-W150 Weigh Batcher", slug: "hb-w150-batcher", category: "Manufacturing", description: "Precision weigh batcher for concrete mixing plants.", specifications: { "Capacity": "500 kg", "Accuracy": "±2%", "Bins": "4", "Power": "5 kW" }, price: 380000, images: [], stock: 5, featured: false },
  { id: "m7", name: "HeavyBuild HB-L50 Lab Mixer", slug: "hb-l50-lab-mixer", category: "Manufacturing", description: "50-liter lab mixer for concrete testing.", specifications: { "Capacity": "50 L", "Motor": "1.5 kW", "Speed": "20 rpm", "Weight": "120 kg" }, price: 175000, images: [], stock: 12, featured: false },
  { id: "m8", name: "HeavyBuild HB-P10 Water Pump", slug: "hb-p10-pump", category: "Manufacturing", description: "Dewatering pump for construction sites.", specifications: { "Flow Rate": "1000 L/min", "Head": "25 m", "Engine": "10 HP", "Outlet": "100 mm" }, price: 95000, images: [], stock: 25, featured: false },
  { id: "m9", name: "HeavyBuild HB-S200 Scaffolding Set", slug: "hb-s200-scaffolding", category: "Manufacturing", description: "Heavy-duty steel scaffolding for building construction.", specifications: { "Height": "2 m/unit", "Load": "500 kg/m²", "Material": "Galvanized Steel", "Width": "1.2 m" }, price: 42000, images: [], stock: 100, featured: false },
  { id: "m10", name: "HeavyBuild HB-BB50 Block Machine", slug: "hb-bb50-block-machine", category: "Manufacturing", description: "Semi-automatic concrete block making machine.", specifications: { "Blocks/hr": "800", "Block Size": "400x200x200 mm", "Motor": "7.5 kW", "Weight": "3200 kg" }, price: 850000, images: [], stock: 3, featured: false },
];

export const allProducts: Product[] = [...tradingProducts, ...manufacturingProducts];

export const featuredProducts = allProducts.filter(p => p.featured);
