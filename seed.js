import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pcmjvcjewlgejwmoxxmf.supabase.co',
  'sb_publishable_3D-VZGp8cZpnKozxUMugqw_EuX_vraO'
)

const lashProducts = [
  // --- CATEGORY 1: LASH SERVICES (10 items) ---
  { name: "Classic Full Set", price: 100.00, category: "Services", type: "service", stock: 999, description: "Natural 1:1 lash application" },
  { name: "Hybrid Full Set", price: 125.00, category: "Services", type: "service", stock: 999, description: "A mix of classic and volume" },
  { name: "Volume Full Set", price: 150.00, category: "Services", type: "service", stock: 999, description: "Full, fluffy, dramatic lashes" },
  { name: "Mega Volume Set", price: 175.00, category: "Services", type: "service", stock: 999, description: "Maximum drama and density" },
  { name: "Classic Fill", price: 60.00, category: "Services", type: "service", stock: 999, description: "2-week maintenance for classic" },
  { name: "Hybrid Fill", price: 75.00, category: "Services", type: "service", stock: 999, description: "2-week maintenance for hybrid" },
  { name: "Volume Fill", price: 85.00, category: "Services", type: "service", stock: 999, description: "2-week maintenance for volume" },
  { name: "Lash Removal", price: 25.00, category: "Services", type: "service", stock: 999, description: "Safe professional removal" },
  { name: "Lash Bath", price: 15.00, category: "Services", type: "service", stock: 999, description: "Deep cleaning for lash health" },
  { name: "Bottom Lash Set", price: 40.00, category: "Services", type: "service", stock: 999, description: "Lower lash enhancement" },

  // --- CATEGORY 2: LASH SUPPLIES (10 items) ---
  { name: "LBL Pro Glue", price: 35.00, category: "Supplies", type: "physical", stock: 50, description: "1-second drying time adhesive" },
  { name: "Isolation Tweezers", price: 20.00, category: "Supplies", type: "physical", stock: 30, description: "Precision stainless steel" },
  { name: "Volume Tweezers", price: 25.00, category: "Supplies", type: "physical", stock: 25, description: "Perfect for fan making" },
  { name: "Lash Cleaning Foam", price: 18.00, category: "Supplies", type: "physical", stock: 100, description: "Daily aftercare cleanser" },
  { name: "Soft Cleaning Brush", price: 5.00, category: "Supplies", type: "physical", stock: 200, description: "Gentle for lash baths" },
  { name: "Microfiber Wands", price: 12.00, category: "Supplies", type: "physical", stock: 150, description: "Lint-free application tools" },
  { name: "Under-Eye Patches", price: 15.00, category: "Supplies", type: "physical", stock: 80, description: "50 pairs of gel pads" },
  { name: "Lash Tile", price: 10.00, category: "Supplies", type: "physical", stock: 40, description: "Acrylic palette for strips" },
  { name: "Nano Mister", price: 22.00, category: "Supplies", type: "physical", stock: 15, description: "Cure adhesive instantly" },
  { name: "Spoolie Tube (Glitter)", price: 3.00, category: "Supplies", type: "physical", stock: 500, description: "Portable lash brush" },

  // --- CATEGORY 3: LBL APPAREL (10 items) ---
  { name: "LBL Signature Hoodie", price: 55.00, category: "Apparel", type: "physical", stock: 20, description: "Heavyweight brand hoodie" },
  { name: "Lash Tech Graphic Tee", price: 30.00, category: "Apparel", type: "physical", stock: 35, description: "Comfy oversized cotton tee" },
  { name: "LBL Embroidered Hat", price: 25.00, category: "Apparel", type: "physical", stock: 15, description: "Adjustable dad hat" },
  { name: "Luxury Tote Bag", price: 20.00, category: "Apparel", type: "physical", stock: 45, description: "Perfect for tech supplies" },
  { name: "LBL Joggers", price: 45.00, category: "Apparel", type: "physical", stock: 20, description: "Matching brand sweatpants" },
  { name: "Brand Logo Crop Top", price: 28.00, category: "Apparel", type: "physical", stock: 30, description: "Summer brand essential" },
  { name: "Custom Pin Set", price: 10.00, category: "Apparel", type: "physical", stock: 100, description: "Lash-inspired lapel pins" },
  { name: "LBL Windbreaker", price: 65.00, category: "Apparel", type: "physical", stock: 10, description: "Limited edition outerwear" },
  { name: "Satin Hair Scarf", price: 15.00, category: "Apparel", type: "physical", stock: 50, description: "Protect your hair and lashes" },
  { name: "Logo Socks", price: 12.00, category: "Apparel", type: "physical", stock: 60, description: "Cozy branded crew socks" },

  // --- CATEGORY 4: TRAINING (10 items) ---
  { name: "Lash Vendor List", price: 50.00, category: "Training", type: "digital", stock: 999, description: "Top secret wholesale links" },
  { name: "The Lash Bible E-Book", price: 35.00, category: "Training", type: "digital", stock: 999, description: "Everything you need to start" },
  { name: "Marketing for Techs", price: 45.00, category: "Training", type: "digital", stock: 999, description: "How to get fully booked" },
  { name: "Mapping Guide (PDF)", price: 20.00, category: "Training", type: "digital", stock: 999, description: "Style guides for all eyes" },
  { name: "Client Waiver Template", price: 15.00, category: "Training", type: "digital", stock: 999, description: "Professional legal forms" },
  { name: "Editing Masterclass", price: 60.00, category: "Training", type: "digital", stock: 999, description: "How to film lash content" },
  { name: "Virtual Consultation", price: 40.00, category: "Training", type: "service", stock: 999, description: "30-min Zoom branding call" },
  { name: "Branding Kit", price: 75.00, category: "Training", type: "digital", stock: 999, description: "Logo and card templates" },
  { name: "Price Calculator", price: 10.00, category: "Training", type: "digital", stock: 999, description: "Excel for profit tracking" },
  { name: "Retention Secrets", price: 30.00, category: "Training", type: "digital", stock: 999, description: "Make lashes last 6+ weeks" },
];

async function seed() {
  const { data, error } = await supabase.from('products').insert(lashProducts)
  if (error) console.error('Error:', error)
  else console.log('All products added successfully!')
}

seed()