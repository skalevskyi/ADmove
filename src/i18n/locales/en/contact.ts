/**
 * EN — Contact section.
 */

export const contact = {
  title: 'Get an estimate for your business',
  subtitle:
    'No commitment. A quick reply.',
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone (optional)',
  message: 'Message',
  placeholderName: 'Your name',
  placeholderCompany: 'Your company',
  placeholderEmail: 'email@example.com',
  placeholderPhone: '+33 6 00 00 00 00',
  placeholderMessage: 'Your message or details about your needs…',
  reassurance: 'No commitment. Your data remains confidential.',
  submit: 'Get my estimate',
  submitMicrocopy: 'Reply within 24h',
  submitLoading: 'Sending…',
  submitSuccess: 'Thank you. Your request has been sent.',
  submitError: 'Something went wrong. Please try again.',
  submitErrorRateLimited:
    'Too many submission attempts. Please wait a few minutes or visit spmads.fr if this continues.',
  submitErrorBackup:
    'We could not save your request securely. Please try again shortly or reach us via spmads.fr.',
  validation: {
    required: 'This field is required',
    invalid: 'Invalid format',
    tooLong: 'Text is too long',
  },
  success: {
    title: 'Request sent',
    description: 'Thank you — we have received your request.',
    responseTime: 'We usually reply within 24 hours.',
    reassurance: 'No commitment. Your data is never shared.',
    resetButton: 'Send another request',
  },
  prefillMessageTemplate:
    'Hello,\n\nI would like an estimate for presence on the route:\n\nPackage: {package}\nBilling mode: {billing}\nDuration: {duration}\nSelected add-ons:\n{addons}\n\nTotal price: {total}\n\nPlease contact me to confirm next steps.',
  prefillNoAddons: 'no additional add-ons',
} as const;
