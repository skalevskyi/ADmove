/**
 * Lead capture types — contact form and future calculator fields.
 */

export type LeadLocale = 'fr' | 'en' | 'ua';

export type LeadOrigin = 'contact' | 'calculator';

export type CalculatorSummary = {
  packageLabel: string;
  paymentMode: string;
  durationMonths: number;
  addons: string[];
  totalPrice: number;
};

export type LeadInput = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  locale: LeadLocale;
  source: 'contact';
  packageId?: string | null;
  leadOrigin?: LeadOrigin;
  calculatorSummary?: CalculatorSummary;
};

export type Lead = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  locale: LeadLocale;
  source: 'contact';
  packageId: string | null;
  createdAt: string;
  leadOrigin: LeadOrigin;
  calculatorSummary?: CalculatorSummary;
};

export type LeadApiResponse = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};
