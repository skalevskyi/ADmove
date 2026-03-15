'use client';

import Image from 'next/image';

import { useLanguage } from '@/context/LanguageContext';
import { BASE_PATH } from '@/lib/base-path';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex h-8 w-auto max-w-full items-center gap-2">
            <Image
              src={`${BASE_PATH}/vehicle/admove-icon.svg`}
              alt=""
              width={32}
              height={32}
              className="h-8 w-auto shrink-0 object-contain"
              aria-hidden
            />
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              ADMOVE
            </span>
          </div>
          <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400">
            {t.footer.positioning}
          </p>
        </div>
        <p className="mt-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-slate-700/80 dark:text-slate-400">
          {t.footer.copyright}
          {' · '}
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
