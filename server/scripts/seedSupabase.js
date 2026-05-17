import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.error('❌ Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🌱 Seeding Supabase with Dehradun Sanitation Network...');

  // 1. Seed Users
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const inspectorPass = await bcrypt.hash('Inspector@123', 10);

  const { error: userError } = await supabase.from('users').upsert([
    { username: 'admin@saaf.local', password_hash: adminPass, name: 'System Administrator', role: 'admin' },
    { username: 'inspector@saaf.local', password_hash: inspectorPass, name: 'Ward Inspector', role: 'inspector' }
  ], { onConflict: 'username' });

  if (userError) console.error('Error seeding users:', userError);

  // 2. Seed Cleaners
  const c1Pin = await bcrypt.hash('1234', 10);
  const { error: cleanerError } = await supabase.from('cleaners').upsert([
    { cleaner_id: 'CLEANER1', pin_hash: c1Pin, name: 'Ram Kumar', assigned_zone: 'Zone A - Platform' }
  ], { onConflict: 'cleaner_id' });

  if (cleanerError) console.error('Error seeding cleaners:', cleanerError);

  // 3. Seed Facilities
  const dehradunFacilities = [
    { name: 'SBM Toilet – Old Cantt Market', location: 'Old Cantt Market', address: 'Quarter Deck Rd, Bharuwala Colony, Clement Town, Uttarakhand 248002', type: 'public', total_stalls: 12, lat: 30.2705, lng: 78.0055, rating: 4.5, review_count: 12, status: 'OPEN', hours: 'Open · Closes 12 am', ward_number: 'Ward 18', zone: 'Clement Town', owning_agency: 'Cantonment Board', contractor_name: 'CleanCity Pvt Ltd', contract_type: 'Direct ULB' },
    { name: 'SBM Toilet – Quarter Deck Market', location: 'Quarter Deck Market', address: 'Market, Quarter Deck Rd, New Cantt, Bharuwala Colony, Clement Town, Dehradun, Uttarakhand 248002', type: 'public', total_stalls: 8, lat: 30.2710, lng: 78.0060, rating: 3.8, review_count: 5, status: 'OPEN', hours: 'Open · Closes 12 am', ward_number: 'Ward 18', zone: 'Clement Town', owning_agency: 'Cantonment Board', contractor_name: 'CleanCity Pvt Ltd', contract_type: 'Direct ULB' },
    { name: 'SBM Toilet – ISBT Flyover', location: 'ISBT Flyover', address: '22, ISBT Flyover, near ISBT Flyover, ISBT, Morowala, Subhash Nagar, Shewala Kala, Uttarakhand 248171', type: 'transport', total_stalls: 24, lat: 30.2850, lng: 77.9980, rating: 4.0, review_count: 32, status: 'OPEN', hours: 'Open 24 hours', ward_number: 'Ward 12', zone: 'Transport Corridor', owning_agency: 'Nagar Nigam Dehradun', contractor_name: 'EcoSan Solutions', contract_type: 'PPP Model' },
    { name: 'SBM Toilet – Highway Corridor', location: 'Near ISBT', address: 'Ambala–Dehradun–Rishikesh Rd, near ISBT, Morowala, Majra, Dehradun, Uttarakhand 248002', type: 'transport', total_stalls: 32, lat: 30.2860, lng: 77.9970, rating: 3.4, review_count: 45, status: 'OPEN', hours: 'Open 24 hours', ward_number: 'Ward 12', zone: 'Transport Corridor', owning_agency: 'Nagar Nigam Dehradun', contractor_name: 'EcoSan Solutions', contract_type: 'SBM-U 2.0' }
  ];

  const { data: facilities, error: facError } = await supabase.from('facilities').upsert(dehradunFacilities, { onConflict: 'name' }).select();

  if (facError) {
    console.error('Error seeding facilities:', facError);
  } else {
    console.log(`✅ Seeded ${facilities.length} facilities.`);

    // 4. Seed Initial Cleanliness Status
    const statusData = facilities.map(f => ({
      facility_id: f.id,
      status: 'GREEN',
      reason: 'Initial Sync'
    }));
    await supabase.from('cleanliness_status').insert(statusData);
    console.log('✅ Initialized cleanliness status.');
  }

  console.log('🏁 Seeding completed!');
}

seed();
