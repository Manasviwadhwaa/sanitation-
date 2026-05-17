import { db } from '../db/setup.js';

export interface AuditLogOptions {
  actorId: number;
  actorRole: string;
  eventType: 'AUTH' | 'DATA_CHANGE' | 'SYSTEM_OVERRIDE' | 'BUDGET_APPROVAL' | 'MAINTENANCE_LOG';
  module: 'FACILITIES' | 'TASKS' | 'BUDGET' | 'USERS' | 'SENSORS' | 'FEEDBACK';
  recordId?: number;
  beforePayload?: any;
  afterPayload?: any;
  ipAddress?: string;
}

export const logAudit = async (options: AuditLogOptions) => {
  try {
    const { 
      actorId, 
      actorRole, 
      eventType, 
      module, 
      recordId, 
      beforePayload, 
      afterPayload, 
      ipAddress 
    } = options;

    db.prepare(`
      INSERT INTO audit_logs (
        actor_id, 
        actor_role, 
        event_type, 
        module, 
        record_id, 
        before_payload, 
        after_payload, 
        ip_address
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      actorId,
      actorRole,
      eventType,
      module,
      recordId || null,
      beforePayload ? JSON.stringify(beforePayload) : null,
      afterPayload ? JSON.stringify(afterPayload) : null,
      ipAddress || '0.0.0.0'
    );

    console.log(`📑 [Audit Log]: ${actorRole} performed ${eventType} on ${module} (Record: ${recordId})`);
  } catch (err) {
    console.error('❌ [Audit Service] Failed to log event:', err);
    // We don't throw here to avoid crashing the main request if logging fails, 
    // but in a high-security env we might want to.
  }
};
