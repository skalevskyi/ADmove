'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Layers, Mail, Monitor, Moon, Package, Route, Smartphone, Sun } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { BASE_PATH } from '@/lib/base-path';
import type { Locale } from '@/i18n';

const linkClass =
  'text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70 rounded px-1';

const desktopNavLinkBaseClass =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70 transition-colors duration-150 ease-out';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
  { value: 'ua', label: 'UA' },
];

const DESKTOP_ITEMS = [
  { key: 'support' as const, href: '#support', icon: Layers },
  { key: 'parcours' as const, href: '#parcours', icon: Route },
  { key: 'offres' as const, href: '#offres', icon: Package },
  { key: 'contact' as const, href: '#contact', icon: Mail },
] as const;

const SECTION_IDS = DESKTOP_ITEMS.map((item) => item.href.slice(1));

function getActiveSectionFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  return SECTION_IDS.includes(hash) ? hash : null;
}

function getActiveSectionFromScroll(): string | null {
  const threshold = 120;
  let active: string | null = null;
  let maxTop = -Infinity;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= threshold && top > maxTop) {
      maxTop = top;
      active = id;
    }
  }
  return active;
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70"
        aria-label={t.language.label}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        <span className="uppercase">{locale === 'ua' ? 'UA' : locale}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[7rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {LOCALES.map(({ value, label }) => (
            <li key={value} role="option" aria-selected={locale === value}>
              <button
                type="button"
                onClick={() => {
                  setLocale(value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70 ${
                  locale === value
                    ? 'bg-sky-50 font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { themeMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setIsCoarsePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const ariaLabel =
    themeMode === 'light'
      ? t.theme.ariaLight
      : themeMode === 'dark'
        ? t.theme.ariaDark
        : t.theme.ariaAuto;

  const icon =
    themeMode === 'light' ? (
      <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden />
    ) : themeMode === 'dark' ? (
      <Moon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
    ) : isCoarsePointer ? (
      <Smartphone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
    ) : (
      <Monitor className="h-4 w-4" strokeWidth={1.5} aria-hidden />
    );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={ariaLabel}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70"
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}

export function Navbar() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const updateFromHash = () => setActiveSection(getActiveSectionFromHash());
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const fromScroll = getActiveSectionFromScroll();
        if (fromScroll !== null) setActiveSection(fromScroll);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-950/85 max-md:flex max-md:flex-col max-md:pt-[env(safe-area-inset-top,0px)] md:border-none md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:flex md:justify-center md:px-4 md:pt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <nav
        className="mx-auto flex w-full min-h-0 min-w-0 max-w-6xl items-center justify-between gap-4 px-4 max-md:h-[var(--shell-mobile-header-bar-height)] max-md:min-h-[var(--shell-mobile-header-bar-height)] max-md:max-h-[var(--shell-mobile-header-bar-height)] max-md:py-0 md:w-full md:rounded-2xl md:border md:border-slate-200/80 md:bg-white/90 md:px-6 md:py-3 md:shadow-md md:backdrop-blur-sm dark:md:border-slate-700/70 dark:md:bg-slate-950/85 dark:md:shadow-lg dark:md:shadow-slate-950/45"
        aria-label={t.nav.ariaLabel}
      >
        <div className="flex min-w-0 items-center md:contents">
          <Link
            href="#hero"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70"
          >
            <img
              src={`${BASE_PATH}/logo/favicon.svg`}
              alt="Skalevskyi — publicité mobile"
              loading="eager"
              className="h-7 md:h-8 w-auto shrink-0"
            />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.18em] text-slate-900 dark:text-white">
                SKALEVSKYI
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                publicite mobile
              </span>
            </span>
          </Link>
        </div>

        <ul className="hidden min-w-0 items-center justify-center md:gap-4 lg:gap-8 md:flex">
          {DESKTOP_ITEMS.map(({ key, href, icon: Icon }) => {
            const isActive = mounted && activeSection === href.slice(1);
            const label =
              key === 'support'
                ? t.nav.support
                : key === 'parcours'
                  ? t.nav.parcours
                  : key === 'offres'
                    ? t.nav.offres
                    : t.nav.contact;
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setActiveSection(href.slice(1))}
                  className={`${desktopNavLinkBaseClass} ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
