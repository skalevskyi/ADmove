'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Info, Mail, Moon, Package, Route, Sun } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { BASE_PATH } from '@/lib/base-path';
import type { Locale } from '@/i18n';

const linkClass =
  'text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded px-1';

const desktopNavLinkBaseClass =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
  { value: 'ua', label: 'UA' },
];

const DESKTOP_ITEMS = [
  { key: 'support' as const, href: '#support', icon: Info },
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
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
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
                className={`w-full px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-inset dark:focus:ring-offset-0 ${
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
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={theme === 'dark' ? t.theme.light : t.theme.dark}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      )}
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
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 md:border-none md:bg-transparent md:backdrop-blur-none md:flex md:justify-center md:px-4 md:pt-3"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:w-full md:rounded-2xl md:border md:border-slate-200/80 md:bg-white/80 md:px-6 md:py-3 md:shadow-md md:backdrop-blur-md dark:md:border-slate-700 dark:md:bg-slate-900/80"
        aria-label={t.nav.ariaLabel}
      >
        <Link
          href="#hero"
          className={`flex min-w-0 items-center justify-self-start ${linkClass}`}
        >
          <Image
            src={`${BASE_PATH}/vehicle/admove-logo.png`}
            alt="ADMOVE"
            width={140}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <ul className="hidden items-center justify-center gap-8 md:flex">
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
                  className={`${desktopNavLinkBaseClass} ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
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

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
