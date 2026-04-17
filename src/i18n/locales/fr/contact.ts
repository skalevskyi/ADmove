/**
 * FR — Contact section.
 */

export const contact = {
  title: 'Recevez une estimation pour votre entreprise',
  subtitle:
    'Sans engagement. Réponse rapide.',
  name: 'Nom',
  company: 'Société',
  email: 'Email',
  phone: 'Téléphone (optionnel)',
  message: 'Message',
  placeholderName: 'Votre nom',
  placeholderCompany: 'Votre société',
  placeholderEmail: 'email@exemple.fr',
  placeholderPhone: '06 00 00 00 00',
  placeholderMessage: 'Votre message ou précisions sur votre besoin…',
  reassurance: 'Sans engagement. Vos données restent confidentielles.',
  submit: 'Obtenir mon estimation',
  submitMicrocopy: 'Réponse sous 24h',
  submitLoading: 'Envoi en cours…',
  submitSuccess: 'Merci. Votre demande a bien été envoyée.',
  submitError: "Une erreur s'est produite. Réessayez ou contactez-nous autrement.",
  submitErrorRateLimited:
    'Trop de tentatives d’envoi. Patientez quelques minutes ou visitez spmads.fr si le problème persiste.',
  submitErrorBackup:
    "L'enregistrement sécurisé de votre demande a échoué. Réessayez dans quelques instants ou contactez-nous via spmads.fr.",
  validation: {
    required: 'Ce champ est requis',
    invalid: 'Format invalide',
    tooLong: 'Le texte est trop long',
  },
  success: {
    title: 'Demande envoyée',
    description: 'Merci, votre demande a bien été reçue.',
    responseTime: 'Réponse sous 24 h en général.',
    reassurance: 'Sans engagement. Vos données ne sont jamais partagées.',
    resetButton: 'Envoyer une autre demande',
  },
  /** Calculator → contact prefill ({package}, {billing}, {duration}, {addons}, {total}) */
  prefillMessageTemplate:
    'Bonjour,\n\nJe souhaite une estimation pour une présence sur le parcours :\n\nOffre : {package}\nMode de paiement : {billing}\nDurée : {duration}\nOptions sélectionnées :\n{addons}\n\nPrix total : {total}\n\nMerci de me recontacter pour préciser les modalités.',
  prefillNoAddons: 'aucune option supplémentaire',
} as const;
