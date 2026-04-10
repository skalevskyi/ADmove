'use client';

import type { ReactNode } from 'react';
import { BadgeCheck, Camera, CheckCircle2, Eye, Play, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { InfoIconTooltip } from '@/components/ui/Tooltip';
import { useCalculatorContactPrefill } from '@/context/CalculatorContactPrefillContext';
import { useLanguage } from '@/context/LanguageContext';
import { buildCalculatorContactPayload } from '@/lib/contactPrefillMessage';
import { ctaShapeBase } from '@/lib/cta-shape';
import { ADDON_PRICES, BASE_MONTHLY_MEDIA_EUR, EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE } from '@/lib/calculator/config';
import type { AddonEligibility } from '@/lib/calculator/types';
import type { AddonId, CalculatorResult, DisplayMode, DurationMonths, PackageId } from '@/lib/calculator/types';

/** Matches OffresSection primary buttons (Calculer) for section-native focus. */
const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

/** Right-panel section labels (i18n strings; styling only). Slight weight for scan without dashboard stiffness. */
const summarySectionHeading =
  'mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-600 dark:text-slate-300 md:mb-1.5 md:text-xs';

/** Discount / savings amounts only — calmer premium success (not utility neon). */
const summaryDiscountValueClass =
  'tabular-nums text-sm font-normal text-emerald-900/88 dark:text-emerald-400/78';

/** Hide UI rows when the rounded euro amount is zero (presentation-only). */
function isNonZeroEur(eur: number): boolean {
  return Math.round(eur * 100) !== 0;
}

function prepaidRateForDuration(months: DurationMonths): number {
  switch (months) {
    case 3:
      return 0.02;
    case 6:
      return 0.03;
    case 9:
      return 0.04;
    case 12:
      return 0.05;
    default:
      return 0;
  }
}

type Props = {
  packageId: PackageId;
  durationMonths: DurationMonths;
  setDurationMonths: (m: DurationMonths) => void;
  weekendExposure: boolean;
  setWeekendExposure: (v: boolean) => void;
  photoReporting: boolean;
  setPhotoReporting: (v: boolean) => void;
  videoReporting: boolean;
  setVideoReporting: (v: boolean) => void;
  exclusivity: boolean;
  setExclusivity: (v: boolean) => void;
  displayMode: DisplayMode;
  setDisplayMode: (m: DisplayMode) => void;
  result: CalculatorResult;
  selectedName: string;
  selectedPositioning: string;
  packageDescription: string;
  packageFeatured: boolean;
  formatEur: (value: number) => string;
};

function setAddonState(
  addonId: AddonId,
  next: boolean,
  setters: Pick<Props, 'setWeekendExposure' | 'setPhotoReporting' | 'setVideoReporting' | 'setExclusivity'>,
) {
  if (addonId === 'extra_route_day') setters.setWeekendExposure(next);
  else if (addonId === 'photo_reporting') setters.setPhotoReporting(next);
  else if (addonId === 'video_reporting') setters.setVideoReporting(next);
  else if (addonId === 'exclusivity') setters.setExclusivity(next);
}

function tooltipForAddonId(
  addonId: AddonId,
  t: ReturnType<typeof useLanguage>['t'],
): string {
  switch (addonId) {
    case 'extra_route_day':
      return t.tooltips.weekendExposure;
    case 'photo_reporting':
      return t.tooltips.photo;
    case 'video_reporting':
      return t.tooltips.video;
    case 'exclusivity':
      return t.tooltips.exclusivity;
    default:
      return '';
  }
}

function labelForAddon(addon: AddonEligibility, t: ReturnType<typeof useLanguage>['t']): string {
  switch (addon.addonId) {
    case 'extra_route_day':
      return t.offres.calculatorAddonWeekendExposure;
    case 'photo_reporting':
      return t.offres.calculatorAddonPhotoReporting;
    case 'video_reporting':
      return t.offres.calculatorAddonVideoReporting;
    case 'exclusivity':
      return t.offres.calculatorAddonExclusivity;
    case 'priority_booking':
      return t.offres.calculatorOneTimeFeesLabel;
    default:
      return '';
  }
}

function formatAddonPriceMo(amount: number, t: ReturnType<typeof useLanguage>['t']): string {
  return t.offres.calculatorAddonPriceFormat.replace('{amount}', String(Math.round(amount)));
}

function contactsRangeNumbers(
  packageId: PackageId,
  t: ReturnType<typeof useLanguage>['t'],
): string {
  switch (packageId) {
    case 'BASIC':
      return t.offres.calculatorContactsRangeBasic;
    case 'PRO':
      return t.offres.calculatorContactsRangePro;
    case 'EXCLUSIVE':
      return t.offres.calculatorContactsRangeExclusive;
  }
}

function addonPillIcon(addonId: AddonId): LucideIcon {
  switch (addonId) {
    case 'extra_route_day':
      return Eye;
    case 'photo_reporting':
      return Camera;
    case 'video_reporting':
      return Play;
    case 'exclusivity':
      return Shield;
    default:
      return Eye;
  }
}

type PaidAddonRowProps = {
  addon: AddonEligibility;
  label: string;
  priceLabel: string;
  tip: string;
  onToggle: () => void;
};

function PaidAddonRow({ addon, label, priceLabel, tip, onToggle }: PaidAddonRowProps) {
  const isActive = addon.active;
  const canToggle = addon.available;
  const { t } = useLanguage();
  const Icon = addonPillIcon(addon.addonId);

  const rowState =
    !canToggle
      ? 'cursor-not-allowed border-slate-100 bg-slate-50/70 text-slate-500 opacity-80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-slate-400'
      : isActive
        ? 'cursor-pointer border-sky-500 bg-sky-50 text-slate-900 hover:bg-sky-50/90 dark:border-sky-600/50 dark:bg-sky-950/30 dark:text-slate-50 dark:hover:bg-sky-950/42'
        : 'cursor-pointer border-slate-200/95 bg-slate-100/85 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-600/75 dark:bg-slate-800/75 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/95';

  return (
    <div className="flex w-full min-w-0 items-stretch gap-1.5">
      <button
        type="button"
        disabled={!canToggle}
        aria-pressed={canToggle ? isActive : undefined}
        aria-disabled={!canToggle}
        onClick={() => {
          if (!canToggle) return;
          onToggle();
        }}
        className={`flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm font-medium transition-colors duration-150 md:min-h-9 md:gap-2.5 md:px-3 ${rowState} ${focusRing}`}
      >
        <Icon
          className={`size-4 shrink-0 stroke-[2] ${
            !canToggle
              ? 'text-slate-400 dark:text-slate-500'
              : isActive
                ? 'text-sky-600 dark:text-sky-400/90'
                : 'text-slate-500 dark:text-slate-400'
          }`}
          aria-hidden
        />
        <span
          className={`min-w-0 flex-1 leading-snug ${
            canToggle && isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {label}
        </span>
        {canToggle ? (
          <span
            className={`shrink-0 tabular-nums ${
              isActive ? 'font-semibold text-slate-900 dark:text-slate-50' : 'font-medium text-slate-600 dark:text-slate-400'
            }`}
          >
            {priceLabel}
          </span>
        ) : (
          <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
            {t.offres.calculatorBadgeNotAvailable}
          </span>
        )}
      </button>
      <div
        className={`flex shrink-0 items-center self-center pr-0.5 ${!canToggle ? 'opacity-70' : ''}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <InfoIconTooltip
          content={tip}
          placement="top-right"
          noLeadingMargin
          triggerClassName={
            isActive && canToggle
              ? '!text-sky-600/80 hover:!text-sky-700 dark:!text-sky-400/80 dark:hover:!text-sky-300'
              : '!text-slate-500 hover:!text-slate-700 dark:!text-slate-400 dark:hover:!text-slate-300'
          }
        />
      </div>
    </div>
  );
}

function IncludedPackageBlock({
  addons,
  t,
}: {
  addons: AddonEligibility[];
  t: ReturnType<typeof useLanguage>['t'];
}) {
  if (addons.length === 0) return null;

  return (
    <div className="rounded-lg border border-emerald-200/90 bg-emerald-50/55 px-2 py-2 shadow-sm shadow-emerald-900/5 dark:border-emerald-700/45 dark:bg-emerald-950/30 dark:shadow-sm dark:shadow-black/20 md:px-2.5 md:py-1.5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800/95 dark:text-emerald-100 md:text-xs">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600/90 dark:text-emerald-300/95" strokeWidth={2} aria-hidden />
        {t.offres.calculatorIncludedBlockTitle}
      </p>
      <ul className="mt-1.5 space-y-1 md:mt-1.5 md:space-y-0.5">
        {addons.map((addon) => {
          const ItemIcon = addonPillIcon(addon.addonId);
          return (
            <li key={addon.addonId} className="flex items-start gap-2 text-[11px] leading-snug text-emerald-900/85 dark:text-emerald-100/95 md:text-xs md:gap-2.5">
              <ItemIcon
                className="mt-0.5 size-4 shrink-0 text-emerald-600/85 dark:text-emerald-300/90"
                strokeWidth={2}
                aria-hidden
              />
              <span className="inline-flex min-w-0 flex-wrap items-center gap-0.5">
                <span>{labelForAddon(addon, t)}</span>
                <InfoIconTooltip
                  content={tooltipForAddonId(addon.addonId, t)}
                  placement="top-right"
                  noLeadingMargin
                  triggerClassName="!text-emerald-700/85 hover:!text-emerald-900 dark:!text-emerald-200/95 dark:hover:!text-emerald-100"
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ladderRow(
  label: ReactNode,
  value: ReactNode,
  valueClassName = 'tabular-nums text-sm font-normal text-slate-600/95 dark:text-slate-300/95',
  labelClassName = 'min-w-0 text-left text-sm text-slate-500/80 dark:text-slate-400/85',
) {
  return (
    <div className="flex items-baseline justify-between gap-3 leading-snug">
      <span className={labelClassName}>{label}</span>
      <span className={`shrink-0 text-right ${valueClassName}`}>{value}</span>
    </div>
  );
}

function addonLadderRow(
  addonId: AddonId,
  label: ReactNode,
  value: ReactNode,
  valueClassName: string,
  labelClassName: string,
) {
  const RowIcon = addonPillIcon(addonId);
  return (
    <div className="flex items-center justify-between gap-2 leading-snug">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <RowIcon
          className="size-4 shrink-0 translate-y-[0.5px] text-slate-400 dark:text-slate-500"
          strokeWidth={2}
          aria-hidden
        />
        <span className={`min-w-0 leading-snug ${labelClassName}`}>{label}</span>
      </span>
      <span className={`shrink-0 text-right leading-snug ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function OfferCalculatorPanel(props: Props) {
  const { t } = useLanguage();
  const { setPayload: setContactPrefillPayload } = useCalculatorContactPrefill();
  const {
    packageId,
    durationMonths,
    setDurationMonths,
    displayMode,
    setDisplayMode,
    result,
    selectedName,
    selectedPositioning,
    packageDescription,
    packageFeatured,
    formatEur,
  } = props;

  const handleContactNavClick = () => {
    if (result.ok) {
      setContactPrefillPayload(
        buildCalculatorContactPayload(result, displayMode, packageId, durationMonths),
      );
    }
  };

  if (!result.ok) {
    return (
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/55 md:p-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-700/60">
          <h4 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t.offres.simTitle}
          </h4>
          <p className="mt-1 text-sm leading-snug text-slate-600 dark:text-slate-400">{t.offres.hint}</p>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t.offres.simFormatLabel}
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">{selectedName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{selectedPositioning}</p>
        </div>
        <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
          {t.offres.simDisclaimer}
        </p>
        <a
          href="#contact"
          onClick={handleContactNavClick}
          className={`mt-4 block w-full text-center ${ctaShapeBase} bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-sm shadow-sky-950/10 transition-[transform,opacity] duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 active:translate-y-px active:opacity-[0.97] dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:shadow-none dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 ${focusRing}`}
        >
          {t.offres.ctaEstimation}
        </a>
      </div>
    );
  }

  const { addOnEligibility, monthlyView, contractTotalView, durationMultiplier } = result;

  const avgMonthlyRounded = Math.round(
    contractTotalView.contractTotalEur / durationMonths,
  );

  const periodDiscountEurOnBase =
    Math.round(BASE_MONTHLY_MEDIA_EUR[packageId] * (1 - durationMultiplier) * 100) / 100;

  const prepaidRate = prepaidRateForDuration(durationMonths);
  const contractTotalEur = contractTotalView.contractTotalEur;
  const prepaidTotalEur = Math.round(contractTotalEur * (1 - prepaidRate) * 100) / 100;
  const prepaidSavingsEur = Math.round((contractTotalEur - prepaidTotalEur) * 100) / 100;

  /** Presentation-only: base media over the contract period (no add-ons). Mirrors engine line items. */
  const baseContractAmountEur =
    Math.round(
      (monthlyView.month1BaseMediaEur + (durationMonths - 1) * monthlyView.fromMonth2BaseMediaEur) * 100,
    ) / 100;

  const getAddon = (id: AddonId) => addOnEligibility.find((a) => a.addonId === id);

  const extraRouteAddon = getAddon('extra_route_day');
  const photoAddon = getAddon('photo_reporting');
  const videoAddon = getAddon('video_reporting');
  const exclusivityAddon = getAddon('exclusivity');

  const includedAddons = addOnEligibility.filter(
    (a) => a.includedByDefinition && a.addonId !== 'priority_booking',
  );

  const paidLineItems = addOnEligibility.filter(
    (a) => (a.chargedMonthlyEur > 0 || a.chargedOneTimeEur > 0) && !a.includedByDefinition,
  );

  const addonsMonthlyTotal = paidLineItems.reduce((sum, a) => sum + a.chargedMonthlyEur, 0);

  const addonsContractTotal = paidLineItems.reduce(
    (sum, a) => sum + a.chargedMonthlyEur * durationMonths + a.chargedOneTimeEur,
    0,
  );

  const hasPaidSelection = paidLineItems.length > 0;

  const extraRoutePillPriceEur = ADDON_PRICES.extra_route_day.eur;

  const formatPaidAddonLine = (a: AddonEligibility) => {
    if (a.chargedMonthlyEur > 0) return formatAddonPriceMo(a.chargedMonthlyEur, t);
    return `${formatEur(Math.round(a.chargedOneTimeEur))} (${t.offres.calculatorOneTimeFeesLabel})`;
  };

  const renderPaidAddonRow = (addon: AddonEligibility | undefined, priceEur: number) => {
    if (!addon) return null;
    const priceLabel = formatAddonPriceMo(priceEur, t);
    return (
      <PaidAddonRow
        key={addon.addonId}
        addon={addon}
        label={labelForAddon(addon, t)}
        priceLabel={priceLabel}
        tip={tooltipForAddonId(addon.addonId, t)}
        onToggle={() => setAddonState(addon.addonId, !addon.active, props)}
      />
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/55 md:p-5">
      <div className="border-b border-slate-100 pb-3 dark:border-slate-700/60 md:pb-3">
        <h4 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white md:text-xl">
          {t.offres.simTitle}
        </h4>
        <p className="mt-0.5 text-sm leading-snug text-slate-600 dark:text-slate-400">{t.offres.hint}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 md:mt-5 md:grid-cols-2 md:items-stretch md:gap-6 lg:gap-7">
        <div className="flex min-h-0 min-w-0 flex-col gap-3 md:gap-2">
          <div className="rounded-xl border border-slate-200/95 bg-slate-50 p-3 shadow-sm shadow-slate-200/60 dark:border-slate-600/55 dark:bg-slate-800 dark:shadow-sm dark:shadow-black/25 md:p-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t.offres.simFormatLabel}
              </p>
              <div className="mt-0.5 flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 text-base font-semibold leading-tight text-slate-900 dark:text-white">
                  {selectedName}
                </p>
                {packageFeatured ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/40 dark:text-sky-300">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                    {t.offres.badgeFeatured}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                {selectedPositioning}
              </p>
            </div>
            {packageDescription ? (
              <p className="mt-2 text-xs font-medium leading-snug text-slate-600 dark:text-slate-300 md:mt-1.5 md:line-clamp-2 md:text-sm">
                {packageDescription}
              </p>
            ) : null}
            <div className="mt-2 border-t border-slate-200/90 pt-2 dark:border-slate-600/45 md:mt-2 md:pt-2">
              <p className="text-xl font-bold tabular-nums leading-tight tracking-tight text-slate-900 dark:text-white">
                {contactsRangeNumbers(packageId, t)}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                {t.offres.calculatorContactsUnit}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400 md:text-xs">
                {t.offres.calculatorContactsEstimateCaption}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/95 bg-white p-3 shadow-sm shadow-slate-200/50 dark:border-slate-600/55 dark:bg-slate-800/95 dark:shadow-sm dark:shadow-black/25 md:p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t.offres.simDuration}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:gap-2">
              {([3, 6, 9, 12] as const).map((m) => {
                const isActive = durationMonths === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(m)}
                    className={`min-h-9 rounded-md border px-2 py-1.5 text-center text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'border-sky-500 bg-sky-50 text-slate-900 hover:bg-sky-50/90 dark:border-sky-500/80 dark:bg-sky-950/40 dark:text-white dark:hover:bg-sky-950/55'
                        : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-800/45 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/65'
                    } ${focusRing}`}
                  >
                    {t.offres.calculatorDurationChip.replace('{n}', String(m))}
                  </button>
                );
              })}
            </div>
          </div>

          <IncludedPackageBlock addons={includedAddons} t={t} />

          <div className="rounded-xl border border-slate-200/95 bg-slate-50 p-2.5 shadow-sm shadow-slate-200/55 dark:border-slate-600/55 dark:bg-slate-800 dark:shadow-sm dark:shadow-black/25 md:p-2">
            <p className="mb-2 font-medium text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 md:mb-1.5">
              {t.offres.calculatorAddonsTitle}
            </p>
            <div className="flex flex-col gap-1.5 md:gap-1">
              {packageId === 'EXCLUSIVE' ? (
                <>
                  {extraRouteAddon ? renderPaidAddonRow(extraRouteAddon, extraRoutePillPriceEur) : null}
                  {videoAddon ? renderPaidAddonRow(videoAddon, ADDON_PRICES.video_reporting.eur) : null}
                </>
              ) : (
                <>
                  {extraRouteAddon ? renderPaidAddonRow(extraRouteAddon, extraRoutePillPriceEur) : null}
                  {packageId === 'BASIC' && photoAddon
                    ? renderPaidAddonRow(photoAddon, ADDON_PRICES.photo_reporting.eur)
                    : null}
                  {packageId === 'PRO' && videoAddon
                    ? renderPaidAddonRow(videoAddon, ADDON_PRICES.video_reporting.eur)
                    : null}
                  {exclusivityAddon
                    ? renderPaidAddonRow(
                        exclusivityAddon,
                        packageId === 'BASIC'
                          ? EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.BASIC
                          : EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.PRO,
                      )
                    : null}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col gap-2 rounded-2xl border border-slate-200/95 bg-slate-50 p-3 shadow-sm shadow-slate-200/60 dark:border-slate-600/55 dark:bg-slate-800 dark:shadow-md dark:shadow-black/30 md:gap-2 md:p-3 lg:p-3.5">
          <div
            className="mx-auto grid w-full max-w-md shrink-0 grid-cols-2 gap-2"
            role="group"
            aria-label={t.offres.calculatorPriceModeTitle}
          >
            <button
              type="button"
              onClick={() => setDisplayMode('monthly')}
              className={`min-h-9 w-full rounded-md border px-2 py-1.5 text-center text-sm font-medium leading-snug transition-colors duration-150 ${
                displayMode === 'monthly'
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-600/50 dark:bg-sky-950/30 dark:text-slate-50'
                  : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-800/45 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/65'
              } ${focusRing}`}
            >
              {t.offres.calculatorModeMonthly}
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('contract_total')}
              className={`min-h-9 w-full rounded-md border px-2 py-1.5 text-center text-sm font-medium leading-snug transition-colors duration-150 ${
                displayMode === 'contract_total'
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-600/50 dark:bg-sky-950/30 dark:text-slate-50'
                  : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-800/45 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/65'
              } ${focusRing}`}
            >
              {t.offres.calculatorModeContractTotal}
            </button>
          </div>

          <div className="min-h-0 flex-1 text-slate-600 dark:text-slate-300">
            {displayMode === 'monthly' ? (
              <div className="space-y-0">
                <div className="space-y-1 pb-2 md:space-y-1.5 md:pb-2">
                  <div className="space-y-1 md:space-y-1.5">
                    {ladderRow(
                      t.offres.calculatorBlockBasePriceTitle,
                      <>
                        {formatEur(BASE_MONTHLY_MEDIA_EUR[packageId])}
                        {t.offres.calculatorPerMonthSuffix}
                      </>,
                      'tabular-nums text-sm font-medium text-slate-700 dark:text-slate-200',
                      'min-w-0 text-left text-xs font-medium text-slate-500 dark:text-slate-400',
                    )}
                    {ladderRow(
                      t.offres.calculatorEstimatedCostCpmLabel,
                      t.offres.calculatorEstimatedCostCpmValue,
                      'text-[11px] md:text-xs text-slate-500/80 dark:text-slate-400/80 text-right',
                      'text-[11px] md:text-xs text-slate-500 dark:text-slate-400',
                    )}
                    {isNonZeroEur(monthlyView.month1BaseDiscountEur) ||
                    isNonZeroEur(periodDiscountEurOnBase) ? (
                      <div className="space-y-1 pt-1">
                        <p className={summarySectionHeading}>{t.offres.calculatorAdjustmentsTitle}</p>
                        {isNonZeroEur(monthlyView.month1BaseDiscountEur) ? (
                          <div className="space-y-0.5">
                            {ladderRow(
                              t.offres.calculatorDiscountFirstMonthLabel,
                              <>−{formatEur(monthlyView.month1BaseDiscountEur)}</>,
                              summaryDiscountValueClass,
                              'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                            )}
                            <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 md:text-xs">
                              {t.offres.calculatorDiscountFirstMonthNote}
                            </p>
                          </div>
                        ) : null}
                        {isNonZeroEur(periodDiscountEurOnBase)
                          ? ladderRow(
                              t.offres.calculatorPeriodDiscountEurLabel,
                              <>
                                −{formatEur(periodDiscountEurOnBase)}
                                {t.offres.calculatorPerMonthSuffix}
                              </>,
                              summaryDiscountValueClass,
                              'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                            )
                          : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                  <p className={summarySectionHeading}>{t.offres.calculatorPaymentStructureBaseTitle}</p>
                  <div className="mt-1.5 space-y-1 md:mt-2 md:space-y-1.5">
                    {ladderRow(
                      t.offres.calculatorPriceLineMonth1,
                      formatEur(monthlyView.month1BaseMediaEur),
                      'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                      'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                    )}
                    {ladderRow(
                      t.offres.calculatorPriceLineFromMonth2,
                      <>
                        {formatEur(monthlyView.fromMonth2BaseMediaEur)}
                        {t.offres.calculatorPerMonthSuffix}
                      </>,
                      'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                      'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                    )}
                  </div>
                </div>

                {hasPaidSelection ? (
                  <div className="mt-4 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                    <p className={summarySectionHeading}>{t.offres.calculatorAddonsTitle}</p>
                    <div className="mt-1.5 space-y-1 md:mt-2 md:space-y-1.5">
                      {paidLineItems.map((a) => (
                        <div key={a.addonId}>
                          {addonLadderRow(
                            a.addonId,
                            labelForAddon(a, t),
                            formatPaidAddonLine(a),
                            'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                            'text-xs text-slate-600/95 dark:text-slate-300/90',
                          )}
                        </div>
                      ))}
                      {isNonZeroEur(addonsMonthlyTotal)
                        ? ladderRow(
                            t.offres.calculatorAddonsMonthlyTotalLabel,
                            <>
                              {formatEur(addonsMonthlyTotal)}
                              {t.offres.calculatorPerMonthSuffix}
                            </>,
                            'tabular-nums text-sm font-medium text-slate-600 dark:text-slate-400',
                            'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                          )
                        : null}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                  <p className={summarySectionHeading}>{t.offres.calculatorPayableTitle}</p>
                  <div className="mt-2 space-y-1.5 md:mt-2 md:space-y-2">
                    {ladderRow(
                      t.offres.calculatorPayableFirstMonth,
                      formatEur(monthlyView.month1TotalEur),
                      'tabular-nums text-base font-semibold text-slate-900 dark:text-white md:text-lg',
                      'min-w-0 text-left text-sm font-semibold text-slate-800 dark:text-slate-50',
                    )}
                    {ladderRow(
                      t.offres.calculatorPayableFromMonth2,
                      <>
                        {formatEur(monthlyView.fromMonth2TotalEur)}
                        {t.offres.calculatorPerMonthSuffix}
                      </>,
                      'tabular-nums text-base font-semibold text-slate-900 dark:text-white md:text-lg',
                      'min-w-0 text-left text-sm font-semibold text-slate-800 dark:text-slate-50',
                    )}
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-200/85 pt-2.5 dark:border-slate-600/40 md:mt-4 md:pt-3">
                  {ladderRow(
                    t.offres.calculatorAvgOverContractLabel,
                    <>
                      {formatEur(avgMonthlyRounded)}
                      {t.offres.calculatorPerMonthSuffix}
                    </>,
                    'tabular-nums text-[11px] font-normal text-slate-500/80 dark:text-slate-500/85 md:text-xs',
                    'min-w-0 text-left text-[11px] text-slate-500/80 dark:text-slate-500/85 md:text-xs',
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                <div className="space-y-1 pb-2.5 md:space-y-1.5 md:pb-3">
                  {ladderRow(
                    t.offres.calculatorContractBaseTotalLabel,
                    formatEur(baseContractAmountEur),
                    'tabular-nums text-sm font-semibold text-slate-800 dark:text-slate-100',
                    'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                  )}
                  <p className="text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {t.offres.calculatorResultHeroSubtitleContract.replace('{months}', String(durationMonths))}
                  </p>
                </div>

                <div className="mt-3 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                  <p className={summarySectionHeading}>{t.offres.calculatorPaymentStructureTotalsTitle}</p>
                  <div className="mt-1.5 space-y-1 md:mt-2 md:space-y-1.5">
                    {ladderRow(
                      t.offres.calculatorPriceLineMonth1,
                      formatEur(monthlyView.month1BaseMediaEur),
                      'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                      'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                    )}
                    {ladderRow(
                      t.offres.calculatorPriceLineFromMonth2,
                      <>
                        {formatEur(monthlyView.fromMonth2BaseMediaEur)}
                        {t.offres.calculatorPerMonthSuffix}
                      </>,
                      'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                      'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                    )}
                  </div>
                </div>

                {hasPaidSelection ? (
                  <div className="mt-4 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                    <p className={summarySectionHeading}>{t.offres.calculatorAddonsTitle}</p>
                    <div className="mt-1.5 space-y-1 md:mt-2 md:space-y-1.5">
                      {paidLineItems.map((a) => {
                        const line = Math.round(a.chargedMonthlyEur * durationMonths + a.chargedOneTimeEur);
                        return (
                          <div key={a.addonId}>
                            {addonLadderRow(
                              a.addonId,
                              labelForAddon(a, t),
                              formatEur(line),
                              'tabular-nums text-sm font-normal text-slate-600 dark:text-slate-300',
                              'text-xs text-slate-600/95 dark:text-slate-300/90',
                            )}
                          </div>
                        );
                      })}
                      {isNonZeroEur(addonsContractTotal)
                        ? ladderRow(
                            t.offres.calculatorAddonsContractTotalLabel,
                            formatEur(addonsContractTotal),
                            'tabular-nums text-sm font-semibold text-slate-600 dark:text-slate-300',
                            'min-w-0 text-left text-xs font-medium text-slate-500 dark:text-slate-400',
                          )
                        : null}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 border-t border-slate-200/85 pt-3 dark:border-slate-600/40 md:mt-4 md:pt-3.5">
                  <p className={summarySectionHeading}>{t.offres.calculatorPayableTitle}</p>
                  <div className="mt-2 space-y-1.5 md:mt-2 md:space-y-2">
                    {ladderRow(
                      t.offres.calculatorContractPayMonthlyLabel,
                      formatEur(contractTotalEur),
                      'tabular-nums text-base font-semibold text-slate-900 dark:text-white md:text-lg',
                      'min-w-0 text-left text-sm font-semibold text-slate-800 dark:text-slate-50',
                    )}
                    {isNonZeroEur(prepaidSavingsEur)
                      ? ladderRow(
                          t.offres.calculatorContractPrepaidDiscountLabel,
                          <>−{formatEur(prepaidSavingsEur)}</>,
                          summaryDiscountValueClass,
                          'min-w-0 text-left text-xs text-slate-500 dark:text-slate-400',
                        )
                      : null}
                    {ladderRow(
                      t.offres.calculatorContractPrepaidTotalLabel,
                      formatEur(prepaidTotalEur),
                      'tabular-nums text-base font-semibold text-slate-900 dark:text-white md:text-lg',
                      'min-w-0 text-left text-sm font-semibold text-slate-800 dark:text-slate-50',
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="#contact"
            onClick={handleContactNavClick}
            className={`mt-2 block w-full flex-shrink-0 text-center ${ctaShapeBase} bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-sm shadow-sky-950/10 transition-[transform,opacity] duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 active:translate-y-px active:opacity-[0.97] dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:shadow-none dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 md:mt-2 ${focusRing}`}
          >
            {t.offres.ctaEstimation}
          </a>
        </div>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500 dark:border-slate-700/50 dark:text-slate-400 md:mt-5 md:pt-3.5">
        {t.offres.simDisclaimer}
      </p>
    </div>
  );
}
