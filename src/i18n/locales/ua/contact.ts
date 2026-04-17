/**
 * UA — Contact section. Translated from FR; structure matches exactly.
 */

export const contact = {
  title: 'Отримайте оцінку для вашої компанії',
  subtitle: 'Без зобов’язань. Швидка відповідь.',
  name: "Ім'я",
  company: 'Компанія',
  email: 'Email',
  phone: "Телефон (необов'язково)",
  message: 'Повідомлення',
  placeholderName: "Ваше ім'я",
  placeholderCompany: 'Ваша компанія',
  placeholderEmail: 'email@example.com',
  placeholderPhone: '+33 6 00 00 00 00',
  placeholderMessage: 'Ваше повідомлення або уточнення щодо потреби…',
  reassurance: 'Без зобов’язань. Ваші дані залишаються конфіденційними.',
  submit: 'Отримати мою оцінку',
  submitMicrocopy: 'Відповідь протягом 24 год',
  submitLoading: 'Надсилання…',
  submitSuccess: 'Дякуємо. Ваш запит надіслано.',
  submitError: 'Сталася помилка. Спробуйте ще раз.',
  submitErrorRateLimited:
    'Забагато спроб відправки. Зачекайте кілька хвилин або відвідайте spmads.fr, якщо це повторюється.',
  submitErrorBackup:
    'Не вдалося безпечно зберегти ваш запит. Спробуйте ще раз пізніше або зв’яжіться через spmads.fr.',
  validation: {
    required: 'Це поле обов’язкове',
    invalid: 'Некоректний формат',
    tooLong: 'Текст занадто довгий',
  },
  success: {
    title: 'Запит надіслано',
    description: 'Дякуємо — ми отримали ваш запит.',
    responseTime: 'Зазвичай відповідаємо протягом 24 годин.',
    reassurance: 'Без зобов’язань. Ваші дані нікому не передаються.',
    resetButton: 'Надіслати ще один запит',
  },
  prefillMessageTemplate:
    'Добрий день,\n\nПрошу оцінку для присутності на маршруті:\n\nПакет: {package}\nРежим оплати: {billing}\nТривалість: {duration}\nОбрані опції:\n{addons}\n\nЗагальна вартість: {total}\n\nБудь ласка, зв’яжіться зі мною для уточнення умов.',
  prefillNoAddons: 'без додаткових опцій',
} as const;
