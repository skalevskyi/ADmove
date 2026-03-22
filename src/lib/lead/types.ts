/**
 * Lead capture types — contact form and future calculator fields.
 */

export type LeadLocale = 'fr' | 'en' | 'ua';

export type LeadInput = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  locale: LeadLocale;
  source: 'contact';
  packageId?: string | null;
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
};

export type LeadApiResponse = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};
