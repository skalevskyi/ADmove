'use client';

import { useLanguage } from '@/context/LanguageContext';
import { BASE_PATH } from '@/lib/base-path';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/65">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex w-auto max-w-full items-center gap-3">
            <img
              src={`${BASE_PATH}/logo/favicon.svg`}
              alt="Skalevskyi — publicité mobile"
              loading="eager"
              className="h-7 w-auto shrink-0"
            />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.18em] text-slate-900 dark:text-white">
                SKALEVSKYI
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                publicite mobile
              </span>
            </div>
          </div>
          <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400 md:max-w-none">
            {t.footer.positioning}
          </p>
        </div>
        <p className="mt-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-slate-700/80 dark:text-slate-400 md:whitespace-nowrap">
          {t.footer.copyright}
          {' · '}
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
