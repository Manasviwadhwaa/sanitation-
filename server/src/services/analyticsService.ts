import { db } from '../db/setup.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';

export const getFacilityHealthSummary = async (facilityId: number) => {
  let latestStatus, latestQueue, latestReading, lastCleaning, openAlerts;

  // 1. Primary: Supabase
  if (isSupabaseConfigured()) {
    try {
      const [statusRes, queueRes, readingRes, cleaningRes, alertsRes] = await Promise.all([
        supabase.from('cleanliness_status').select('status, reason, updated_at').eq('facility_id', facilityId).order('id', { ascending: false }).limit(1).single(),
        supabase.from('crowd_queue').select('current_users, wait_time_mins, pressure_level').eq('facility_id', facilityId).order('id', { ascending: false }).limit(1).single(),
        supabase.from('sensor_readings').select('ammonia_level, tissue_level, soap_level').eq('facility_id', facilityId).order('id', { ascending: false }).limit(1).single(),
        supabase.from('maintenance_tasks').select('completed_at').eq('facility_id', facilityId).not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(1).single(),
        supabase.from('maintenance_tasks').select('id', { count: 'exact' }).eq('facility_id', facilityId).is('completed_at', null)
      ]);

      latestStatus = statusRes.data;
      latestQueue = queueRes.data;
      latestReading = readingRes.data;
      lastCleaning = cleaningRes.data;
      openAlerts = { count: alertsRes.count || 0 };
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to SQLite');
    }
  }

  // 2. Fallback: SQLite
  if (!latestStatus || !latestQueue) {
    latestStatus = db.prepare('SELECT status, reason, updated_at FROM cleanliness_status WHERE facility_id = ? ORDER BY id DESC LIMIT 1').get(facilityId) as any;
    latestQueue = db.prepare('SELECT current_users, wait_time_mins, pressure_level FROM crowd_queue WHERE facility_id = ? ORDER BY id DESC LIMIT 1').get(facilityId) as any;
    latestReading = db.prepare('SELECT ammonia_level, tissue_level, soap_level FROM sensor_readings WHERE facility_id = ? ORDER BY id DESC LIMIT 1').get(facilityId) as any;
    lastCleaning = db.prepare('SELECT verified_at FROM maintenance_tasks WHERE facility_id = ? AND verified_at IS NOT NULL ORDER BY verified_at DESC LIMIT 1').get(facilityId) as any;
    openAlerts = db.prepare('SELECT COUNT(*) as count FROM maintenance_tasks WHERE facility_id = ? AND verified_at IS NULL').get(facilityId) as any;
  }

  // Compute Cleanliness Score (0-100)
  let score = 100;
  if (latestReading) {
    score -= (latestReading.ammonia_level / 100) * 40; 
    score -= (100 - (latestReading.tissue_level || 100)) * 0.3; 
    score -= (100 - (latestReading.soap_level || 100)) * 0.3;   
  }
  score = Math.max(0, Math.min(100, score));

  const lastCleanedAt = lastCleaning?.verified_at;
  const timeSinceLastClean = lastCleanedAt 
    ? Math.floor((Date.now() - new Date(lastCleanedAt).getTime()) / 60000)
    : 1440; 

  return {
    facility_id: facilityId,
    cleanliness_score: Math.round(score),
    occupancy_rate: latestQueue ? latestQueue.current_users / 20 : 0, 
    queue_pressure: latestQueue?.pressure_level || 'LOW',
    last_cleaned_at: lastCleanedAt,
    time_since_last_clean_minutes: timeSinceLastClean,
    alerts_open_count: openAlerts?.count || 0,
    sla_breach_risk: (timeSinceLastClean > 120 && latestQueue?.pressure_level === 'HIGH') ? 'RED' : (timeSinceLastClean > 90 ? 'AMBER' : 'NONE')
  };
};

export const getGlobalKPIs = async () => {
  // 1. Primary: Supabase
  if (isSupabaseConfigured()) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [facCount, alertCount, progressCount, tasksRes, costRes, userRes] = await Promise.all([
        supabase.from('facilities').select('id', { count: 'exact' }),
        supabase.from('maintenance_tasks').select('id', { count: 'exact' }).not('status', 'eq', 'COMPLETED'),
        supabase.from('maintenance_tasks').select('id', { count: 'exact' }).in('status', ['IN_PROGRESS', 'ASSIGNED']),
        supabase.from('maintenance_tasks').select('created_at, completed_at').not('completed_at', 'is', null).gte('completed_at', today),
        supabase.from('budget_log').select('amount').gte('created_at', today),
        supabase.from('crowd_queue').select('current_users').gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      let avgResponse = 15;
      if (tasksRes.data && tasksRes.data.length > 0) {
        const totalResponseTime = tasksRes.data.reduce((acc, task) => {
          const start = new Date(task.created_at).getTime();
          const end = new Date(task.completed_at).getTime();
          return acc + (end - start) / 60000;
        }, 0);
        avgResponse = totalResponseTime / tasksRes.data.length;
      }

      return {
        total_facilities: facCount.count || 0,
        open_alerts: alertCount.count || 0,
        tasks_in_progress: progressCount.count || 0,
        avg_response_time_mins_today: Math.round(avgResponse * 10) / 10,
        today_cost_inr: costRes.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
        total_users_last_24h: userRes.data?.reduce((acc, curr) => acc + curr.current_users, 0) || 0,
        overall_cleanliness_index: 85
      };
    } catch (e) {
      console.warn('Supabase KPI fetch failed');
    }
  }

  // 2. Fallback: SQLite
  const totalFacilities = db.prepare('SELECT COUNT(*) as count FROM facilities').get() as any;
  const openAlerts = db.prepare("SELECT COUNT(*) as count FROM maintenance_tasks WHERE status != 'COMPLETED'").get() as any;
  const tasksInProgress = db.prepare("SELECT COUNT(*) as count FROM maintenance_tasks WHERE status = 'IN_PROGRESS' OR status = 'ASSIGNED'").get() as any;
  
  const avgResponse = db.prepare(`
    SELECT AVG((julianday(verified_at) - julianday(created_at)) * 1440) as avg 
    FROM maintenance_tasks 
    WHERE verified_at IS NOT NULL 
    AND date(verified_at) = date('now')
  `).get() as any;

  const totalCost = db.prepare(`
    SELECT SUM(amount) as sum 
    FROM budget_log 
    WHERE date(created_at) = date('now')
  `).get() as any;

  const totalUsers = db.prepare(`
    SELECT SUM(current_users) as sum 
    FROM crowd_queue 
    WHERE datetime(timestamp) >= datetime('now', '-24 hours')
  `).get() as any;

  return {
    total_facilities: totalFacilities.count,
    open_alerts: openAlerts.count,
    tasks_in_progress: tasksInProgress.count,
    avg_response_time_mins_today: Math.round((avgResponse.avg || 15) * 10) / 10,
    today_cost_inr: totalCost.sum || 0,
    total_users_last_24h: totalUsers.sum || 0,
    overall_cleanliness_index: 85
  };
};
