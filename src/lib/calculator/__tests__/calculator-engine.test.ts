import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateCalculator } from '../engine';

test('base price + duration multiplier: BASIC / 3 months / no add-ons', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    extraRouteDays: 0,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.indicativeMonthlyContacts, 30000);
  assert.equal(result.effectiveBaseMonthlyMediaEur, 300);
  assert.equal(result.monthlyView.month1TotalEur, 200);
  assert.equal(result.monthlyView.fromMonth2TotalEur, 300);
  assert.equal(result.contractTotalView.contractTotalEur, 800);
});

test('first-month discount applies to base only (no add-ons): BASIC / 3 months', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    extraRouteDays: 0,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  // From month 2: 300; month 1 base discount is 100 => 200.
  assert.equal(result.monthlyView.month1TotalEur, result.monthlyView.fromMonth2TotalEur - 100);
});

test('included add-ons are free: PRO / 3 months / no optional toggles', () => {
  const result = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 3,
    extraRouteDays: 0,
    videoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    photoReporting: false, // ignored by definition for PRO
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.indicativeMonthlyContacts, 45000);
  assert.equal(result.monthlyView.fromMonth2TotalEur, 450);
  assert.equal(result.monthlyView.month1TotalEur, 350);
});

test('invalid: video must be unavailable on BASIC', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    extraRouteDays: 0,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: true,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.ok(result.errors.some((e) => e.includes('videoReporting is not available for BASIC')));
});

test('invalid: EXCLUSIVE cannot stack separate exclusivity toggle', () => {
  const result = calculateCalculator({
    packageId: 'EXCLUSIVE',
    durationMonths: 9,
    extraRouteDays: 0,
    // explicitly provided => invalid
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.ok(
    result.errors.some((e) => e.includes('exclusivity must not be provided for EXCLUSIVE')),
  );
});

test('extra route day affects price but not contacts: BASIC / 6 months', () => {
  const resultNoExtras = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 6,
    extraRouteDays: 0,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });
  const resultWithExtras = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 6,
    extraRouteDays: 3,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(resultNoExtras.ok, true);
  assert.equal(resultWithExtras.ok, true);
  if (!resultNoExtras.ok || !resultWithExtras.ok) return;

  assert.equal(resultNoExtras.indicativeMonthlyContacts, 30000);
  assert.equal(resultWithExtras.indicativeMonthlyContacts, 30000);

  // Extra route day price is €15/day per selected extra day, applied each month.
  // For fromMonth2 monthly: + 3 * 15 = +45.
  assert.equal(
    resultWithExtras.monthlyView.fromMonth2TotalEur - resultNoExtras.monthlyView.fromMonth2TotalEur,
    45,
  );
});

test('contract total formula: PRO / 3 months / one-time priority booking counted once', () => {
  const result = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 3,
    extraRouteDays: 0,
    videoReporting: false,
    priorityBooking: true,
    exclusivity: false,
    photoReporting: false, // ignored by definition
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  const month1 = result.monthlyView.month1TotalEur;
  const fromMonth2 = result.monthlyView.fromMonth2TotalEur;
  const duration = result.contractTotalView.durationMonths;

  assert.equal(result.contractTotalView.contractTotalEur, month1 + (duration - 1) * fromMonth2);
});

test('snapshot cases (rounded expectations): BASIC/6, PRO/12, EXCLUSIVE/9', () => {
  const basic = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 6,
    extraRouteDays: 1,
    photoReporting: true,
    priorityBooking: false,
    exclusivity: true,
    videoReporting: false,
  });
  assert.equal(basic.ok, true);
  if (basic.ok) {
    assert.equal(basic.monthlyView.month1TotalEur, 270);
    assert.equal(basic.monthlyView.fromMonth2TotalEur, 370);
    assert.equal(basic.contractTotalView.contractTotalEur, 2120);
  }

  const pro = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 12,
    extraRouteDays: 2,
    videoReporting: true,
    priorityBooking: true,
    exclusivity: false,
    photoReporting: false, // ignored by definition
  });
  assert.equal(pro.ok, true);
  if (pro.ok) {
    assert.equal(pro.monthlyView.month1TotalEur, 396);
    assert.equal(pro.monthlyView.fromMonth2TotalEur, 466);
    assert.equal(pro.contractTotalView.contractTotalEur, 5522);
  }

  const exclusive = calculateCalculator({
    packageId: 'EXCLUSIVE',
    durationMonths: 9,
    extraRouteDays: 2,
    videoReporting: true,
    // no exclusivity toggle field allowed on EXCLUSIVE
  });
  assert.equal(exclusive.ok, true);
  if (exclusive.ok) {
    assert.equal(exclusive.monthlyView.month1TotalEur, 568);
    assert.equal(exclusive.monthlyView.fromMonth2TotalEur, 668);
    assert.equal(exclusive.contractTotalView.contractTotalEur, 5912);
  }
});

test('guardrails must pass for all durations', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    extraRouteDays: 0,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.tierGuardrails.ok, true);
  assert.deepEqual(result.tierGuardrails.errors, []);
});

test('contacts remain monthly benchmark in both display preferences', () => {
  const monthly = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 6,
    extraRouteDays: 0,
    videoReporting: false,
    priorityBooking: false,
    exclusivity: false,
  });
  const contractTotal = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 6,
    extraRouteDays: 0,
    videoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    displayMode: 'contract_total',
  });

  assert.equal(monthly.ok, true);
  assert.equal(contractTotal.ok, true);
  if (!monthly.ok || !contractTotal.ok) return;

  assert.equal(monthly.indicativeMonthlyContacts, contractTotal.indicativeMonthlyContacts);
  assert.equal(monthly.indicativeMonthlyContacts, 45000);
});

