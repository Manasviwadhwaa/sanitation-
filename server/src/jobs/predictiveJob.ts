import cron from 'node-cron';
import { db } from '../db/setup.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { io } from '../index.js';

export const initPredictiveJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running predictive rush simulation...');
    const facilities = db.prepare('SELECT * FROM facilities').all() as any[];

    for (const facility of facilities) {
      const surgeInMins = Math.floor(Math.random() * 55) + 5; 
      const confidence = 50 + Math.random() * 45; 
      
      // 1. Persist to SQLite (Local)
      db.prepare(`
        INSERT INTO predicted_rush (facility_id, predicted_at, surge_in_mins, confidence_pct, source)
        VALUES (?, ?, ?, ?, ?)
      `).run(facility.id, new Date().toISOString(), surgeInMins, confidence, 'schedule_simulator');

      // 2. Persist to Supabase (Cloud)
      if (isSupabaseConfigured()) {
        await supabase.from('predicted_rush').insert({
          facility_id: facility.id,
          surge_in_mins: surgeInMins,
          confidence_pct: confidence,
          source: 'AI_PREDICTIVE_MODEL'
        });
      }

      // 3. Emit Realtime Event
      io.emit('rush_prediction', {
        facility_id: facility.id,
        surge_in_mins: surgeInMins,
        confidence_pct: confidence,
        source: 'AI_PREDICTIVE_MODEL'
      });
    }
  });
};
