import { Redis } from '@upstash/redis';

import type { Lead } from './types';

const DEFAULT_LIST_KEY = 'spm:leads:backup';

export type PersistLeadBackupFailureCode = 'not_configured' | 'redis_error';

export type PersistLeadBackupResult =
  | { ok: true; skipped: boolean }
  | { ok: false; code: PersistLeadBackupFailureCode };

function isBackupExplicitlySkipped(): boolean {
  const v = process.env.LEAD_BACKUP_SKIP?.trim().toLowerCase();
  return v === 'true' || v === '1';
}

/**
 * Durable backup for accepted leads (Upstash Redis LIST, LPUSH).
 * Production: set Upstash Redis REST env vars. Vercel Marketplace Upstash KV
 * provides KV_REST_API_URL and KV_REST_API_TOKEN; manual Upstash setup may use
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 * Local/dev only: LEAD_BACKUP_SKIP=true skips persistence (loud log) — do not use in production.
 */
export async function persistLeadBackup(lead: Lead, requestId: string): Promise<PersistLeadBackupResult> {
  if (isBackupExplicitlySkipped()) {
    console.warn(
      JSON.stringify({
        component: 'persistLeadBackup',
        event: 'lead_backup_skipped',
        requestId,
        reason: 'LEAD_BACKUP_SKIP',
      }),
    );
    return { ok: true, skipped: true };
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) {
    return { ok: false, code: 'not_configured' };
  }

  const listKey = process.env.LEAD_BACKUP_LIST_KEY?.trim() || DEFAULT_LIST_KEY;

  try {
    const redis = new Redis({ url, token });
    const record = {
      requestId,
      storedAt: new Date().toISOString(),
      lead,
    };
    await redis.lpush(listKey, JSON.stringify(record));
    return { ok: true, skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        component: 'persistLeadBackup',
        event: 'redis_error',
        requestId,
        message: message.slice(0, 300),
      }),
    );
    return { ok: false, code: 'redis_error' };
  }
}
