import type { Lead } from './types';
import { sendLeadEmail } from './providers/email';

/**
 * Delivery entry point — email channel only for now.
 */
export async function sendLead(lead: Lead): Promise<void> {
  await sendLeadEmail(lead);
}
