/**
 * UA — Contact section. Translated from FR.
 */

export const contact = {
  title: 'Контакт',
  subtitle:
    'Залиште запит, і ми зв’яжемося з вами, щоб підтвердити оцінку під вашу мету.',
  name: "Ім'я",
  company: 'Компанія',
  email: 'Email',
  phone: "Телефон (необов'язково)",
  message: 'Повідомлення',
  placeholderName: "Ваше ім'я",
  placeholderCompany: 'Ваша компанія',
  placeholderEmail: 'email@example.com',
  placeholderPhone: '+33 6 00 00 00 00',
  placeholderMessage: 'Ваше повідомлення або запит пропозиції...',
  reassurance:
    "Без зобов’язань. Оцінку підтверджуємо після короткого спілкування. Без спаму.",
  submit: 'Запросити оцінку',
  submitLoading: 'Надсилання…',
  submitSuccess: 'Дякуємо. Ваш запит надіслано.',
  submitError: 'Сталася помилка. Спробуйте ще раз.',
  validation: {
    name: 'Вкажіть ім’я щонайменше з 2 символів.',
    email: 'Вкажіть коректну адресу електронної пошти.',
    message: 'Вкажіть повідомлення щонайменше з 5 символів.',
  },
} as const;
