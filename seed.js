import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pcmjvcjewlgejwmoxxmf.supabase.co',
  'sb_publishable_3D-VZGp8cZpnKozxUMugqw_EuX_vraO'
)

const lashProducts = [
  { name: 'Lash Trays', price: 25.00, image_url: 'classic.jpg', category: 'Trays' },
  { name: 'Lash Glue', price: 30.00, image_url: 'glue.jpg', category: 'Adhesives' },
  { name: 'Tweezers', price: 15.00, image_url: 'tweez1.jpg', category: 'Tools' },
  { name: 'Lash Fan', price: 20.00, image_url: 'lash_fan.jpg', category: 'Tools' },
  { name: 'Lash Chair', price: 150.00, image_url: 'lash_chair.jpg', category: 'Furniture' },
  { name: 'Lash Light', price: 85.00, image_url: 'lash_light.jpg', category: 'Lighting' },
  { name: 'Lash Spooly', price: 5.00, image_url: 'lash_spooly.jpg', category: 'Disposables' },
  { name: 'Lash Tape', price: 8.00, image_url: 'lash_tape.jpg', category: 'Disposables' },
  { name: 'Glue Shaker', price: 25.00, image_url: 'glue_shaker.jpg', category: 'Tools' },
  { name: 'Lash Mirror', price: 12.00, image_url: 'lash_mirror.jpg', category: 'Tools' }
]

async function seed() {
  const { data, error } = await supabase.from('products').insert(lashProducts)
  if (error) console.error('Error:', error)
  else console.log('All products added successfully!')
}

seed()