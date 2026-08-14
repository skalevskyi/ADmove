import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGpsRecordStatusText,
  shouldShowGpsMetrics,
  shouldShowGpsRouteTrace,
} from '../trajets-proof';
import { trajets as frTrajets } from '../../../i18n/locales/fr/trajets';
import { trajets as enTrajets } from '../../../i18n/locales/en/trajets';
import { trajets as uaTrajets } from '../../../i18n/locales/ua/trajets';
import { hero as frHero } from '../../../i18n/locales/fr/hero';
import { hero as enHero } from '../../../i18n/locales/en/hero';
import { hero as uaHero } from '../../../i18n/locales/ua/hero';
import { parcours as frParcours } from '../../../i18n/locales/fr/parcours';
import { parcours as enParcours } from '../../../i18n/locales/en/parcours';
import { parcours as uaParcours } from '../../../i18n/locales/ua/parcours';
import { seoAffichageMobile as frSeoAffichageMobile } from '../../../i18n/locales/fr/seoAffichageMobile';
import { seoAffichageMobile as enSeoAffichageMobile } from '../../../i18n/locales/en/seoAffichageMobile';
import { seoAffichageMobile as uaSeoAffichageMobile } from '../../../i18n/locales/ua/seoAffichageMobile';
import { seoPubliciteLocale as frSeoPubliciteLocale } from '../../../i18n/locales/fr/seoPubliciteLocale';
import { seoPubliciteLocale as enSeoPubliciteLocale } from '../../../i18n/locales/en/seoPubliciteLocale';
import { seoPubliciteLocale as uaSeoPubliciteLocale } from '../../../i18n/locales/ua/seoPubliciteLocale';

const locales = [
  { key: 'fr', trajets: frTrajets },
  { key: 'en', trajets: enTrajets },
  { key: 'ua', trajets: uaTrajets },
] as const;

function numericValue(value: string): number | null {
  const match = value.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

test('isRecorded=false never exposes GPS route trace or GPS metrics', () => {
  for (const { key, trajets } of locales) {
    for (const day of trajets.days) {
      assert.equal(shouldShowGpsRouteTrace(day), day.isRecorded, `${key} ${day.id} route trace`);
      assert.equal(shouldShowGpsMetrics(day), day.isRecorded, `${key} ${day.id} metrics`);

      if (!day.isRecorded) {
        assert.equal(day.distance, '—', `${key} ${day.id} distance hidden`);
        assert.equal(day.duration, '—', `${key} ${day.id} duration hidden`);
        assert.equal(day.passages, '—', `${key} ${day.id} passages hidden`);
        assert.equal(day.gpsPoints, '—', `${key} ${day.id} GPS hidden`);
      }
    }
  }
});

test('summary reflects recorded GPS days only', () => {
  for (const { key, trajets } of locales) {
    assert.equal(trajets.days.filter((day) => day.isRecorded).length, 3, `${key} recorded count`);
    assert.equal(trajets.summary.daysValue, '3 / 7', `${key} summary days`);
    assert.equal(numericValue(trajets.summary.distanceValue), 193, `${key} summary distance`);
    assert.match(trajets.summary.timeValue, /4.*47/, `${key} summary time`);
  }
});

test('recorded GPS facts stay aligned across FR/EN/UA locales', () => {
  const [fr, en, ua] = locales.map((locale) => locale.trajets.days);

  for (let index = 0; index < fr.length; index += 1) {
    assert.equal(en[index].id, fr[index].id);
    assert.equal(ua[index].id, fr[index].id);
    assert.equal(en[index].isRecorded, fr[index].isRecorded, `${fr[index].id} EN recorded`);
    assert.equal(ua[index].isRecorded, fr[index].isRecorded, `${fr[index].id} UA recorded`);

    if (fr[index].isRecorded) {
      for (const field of ['distance', 'duration', 'gpsPoints'] as const) {
        assert.equal(numericValue(en[index][field]), numericValue(fr[index][field]), `${fr[index].id} EN ${field}`);
        assert.equal(numericValue(ua[index][field]), numericValue(fr[index][field]), `${fr[index].id} UA ${field}`);
      }
      assert.deepEqual(
        en[index].timeSlots.map((slot) => slot.value),
        fr[index].timeSlots.map((slot) => slot.value),
        `${fr[index].id} EN time slots`,
      );
      assert.deepEqual(
        ua[index].timeSlots.map((slot) => slot.value),
        fr[index].timeSlots.map((slot) => slot.value),
        `${fr[index].id} UA time slots`,
      );
    }
  }
});

test('homepage proof copy says 3 recorded days, not 7-day GPS proof', () => {
  assert.match(frParcours.proofDescription, /3 jours enregistrés/);
  assert.match(enParcours.proofDescription, /3 recorded days/);
  assert.match(uaParcours.proofDescription, /3 зафіксованих днів/);
  assert.doesNotMatch(enParcours.proofDescription, /over 7 days/i);
});

test('200k visibility claims are presented as forecast/model language', () => {
  assert.match(frHero.proof, /Modèle prévisionnel/);
  assert.match(enHero.proof, /Forecast model/);
  assert.match(uaHero.proof, /Прогнозна модель/);

  for (const copy of [
    frSeoAffichageMobile.section5Text,
    enSeoAffichageMobile.section5Text,
    uaSeoAffichageMobile.section5Text,
    frSeoPubliciteLocale.section6Text,
    enSeoPubliciteLocale.section6Text,
    uaSeoPubliciteLocale.section6Text,
  ]) {
    assert.match(copy, /forecast|prévisionnel|прогноз/i);
  }
});

test('GPS record status labels support non-color-only selector state', () => {
  const recorded = getGpsRecordStatusText({ isRecorded: true }, {
    recorded: enTrajets.selector.recordedAria,
    notRecorded: enTrajets.selector.notRecordedAria,
  });
  const notRecorded = getGpsRecordStatusText({ isRecorded: false }, {
    recorded: enTrajets.selector.recordedAria,
    notRecorded: enTrajets.selector.notRecordedAria,
  });

  assert.equal(recorded, 'GPS route recorded');
  assert.equal(notRecorded, 'no GPS route recorded');
});
