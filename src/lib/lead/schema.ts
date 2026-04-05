import { z } from 'zod';

const durationMonthsSchema = z.union([z.literal(3), z.literal(6), z.literal(9), z.literal(12)]);

const calculatorSummarySchema = z.object({
  packageLabel: z.string().min(1).max(500),
  paymentMode: z.string().min(1).max(200),
  durationMonths: durationMonthsSchema,
  addons: z.array(z.string().max(300)).max(32),
  totalPrice: z.number().finite().min(0).max(1_000_000_000),
});

export const leadSchema = z.object({
  name: z.string().min(2, 'min_length').max(120, 'max_length'),
  company: z.string().max(160, 'max_length').optional(),
  email: z.string().email('invalid_email').max(160, 'max_length'),
  phone: z.string().max(50, 'max_length').optional(),
  message: z.string().min(5, 'min_length').max(2000, 'max_length'),
  locale: z.enum(['fr', 'en', 'ua']),
  source: z.literal('contact'),
  packageId: z.string().nullable().optional(),
  leadOrigin: z.enum(['contact', 'calculator']).default('contact'),
  calculatorSummary: calculatorSummarySchema.optional(),
});

export type LeadSchemaInput = z.infer<typeof leadSchema>;
