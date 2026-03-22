/**
 * EN — Contact section.
 */

export const contact = {
  title: 'Contact',
  subtitle:
    'Leave your request and we will contact you to confirm an estimate tailored to your objective.',
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone (optional)',
  message: 'Message',
  placeholderName: 'Your name',
  placeholderCompany: 'Your company',
  placeholderEmail: 'email@example.com',
  placeholderPhone: '+33 6 00 00 00 00',
  placeholderMessage: 'Your message or quote request...',
  reassurance:
    'No commitment. Your estimate is confirmed after a short exchange. No spam.',
  submit: 'Request your estimate',
  submitLoading: 'Sending…',
  submitSuccess: 'Thank you. Your request has been sent.',
  submitError: 'Something went wrong. Please try again.',
  validation: {
    name: 'Enter a name with at least 2 characters.',
    email: 'Enter a valid email address.',
    message: 'Enter a message with at least 5 characters.',
  },
} as const;
