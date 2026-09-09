export interface AuditLogEntry {
  id: string;
  adminUid: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: string;
  createdAt: number;
}
