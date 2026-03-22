import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'min_length').max(120, 'max_length'),
  company: z.string().max(160, 'max_length').optional(),
  email: z.string().email('invalid_email').max(160, 'max_length'),
  phone: z.string().max(50, 'max_length').optional(),
  message: z.string().min(5, 'min_length').max(2000, 'max_length'),
  locale: z.enum(['fr', 'en', 'ua']),
  source: z.literal('contact'),
  packageId: z.string().nullable().optional(),
});

export type LeadSchemaInput = z.infer<typeof leadSchema>;
