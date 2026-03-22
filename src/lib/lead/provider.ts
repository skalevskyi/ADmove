import type { Lead } from './types';
import { sendLeadAutoReply, sendLeadNotification } from './providers/email';

/**
 * Delivery entry point — owner notification, then best-effort auto-reply to the lead.
 */
export async function sendLead(lead: Lead): Promise<void> {
  await sendLeadNotification(lead);

  try {
    await sendLeadAutoReply(lead);
  } catch (error) {
    console.error('Auto-reply failed', error);
  }
}
