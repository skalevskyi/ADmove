/**
 * FR — Contact section.
 */

export const contact = {
  title: 'Contact',
  subtitle:
    'Laissez votre demande et nous vous recontactons pour confirmer une estimation adaptée à votre objectif.',
  name: 'Nom',
  company: 'Société',
  email: 'Email',
  phone: 'Téléphone (optionnel)',
  message: 'Message',
  placeholderName: 'Votre nom',
  placeholderCompany: 'Votre société',
  placeholderEmail: 'email@exemple.fr',
  placeholderPhone: '06 00 00 00 00',
  placeholderMessage: 'Votre message ou demande de devis...',
  reassurance:
    "Sans engagement. Estimation confirmée après échange. Vos informations ne sont pas utilisées à d'autres fins.",
  submit: 'Demander votre estimation',
  submitLoading: 'Envoi en cours…',
  submitSuccess: 'Merci. Votre demande a bien été envoyée.',
  submitError: "Une erreur s'est produite. Réessayez ou contactez-nous autrement.",
  validation: {
    name: 'Indiquez un nom d’au moins 2 caractères.',
    email: 'Indiquez une adresse e-mail valide.',
    message: 'Indiquez un message d’au moins 5 caractères.',
  },
} as const;
