import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateCalculator } from '../engine';

test('base price + duration multiplier: BASIC / 3 months / no add-ons', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    weekendExposure: false,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.indicativeMonthlyContacts, 30000);
  assert.equal(result.effectiveBaseMonthlyMediaEur, 350);
  assert.equal(result.monthlyView.month1BaseMediaEur, 175);
  assert.equal(result.monthlyView.month1BaseDiscountEur, 175);
  assert.equal(result.monthlyView.month1TotalEur, 175);
  assert.equal(result.monthlyView.fromMonth2TotalEur, 350);
  assert.equal(result.contractTotalView.contractTotalEur, 875);
});

test('first-month discount is 50% of effective base media only (no add-ons): BASIC / 3 months', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    weekendExposure: false,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.monthlyView.month1BaseDiscountEur, result.effectiveBaseMonthlyMediaEur / 2);
  assert.equal(
    result.monthlyView.month1TotalEur,
    result.monthlyView.fromMonth2TotalEur - result.monthlyView.month1BaseDiscountEur,
  );
});

test('included add-ons are free: PRO / 3 months / no optional toggles', () => {
  const result = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 3,
    weekendExposure: false,
    videoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    photoReporting: false, // ignored by definition for PRO
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.indicativeMonthlyContacts, 45000);
  assert.equal(result.effectiveBaseMonthlyMediaEur, 550);
  assert.equal(result.monthlyView.month1BaseMediaEur, 275);
  assert.equal(result.monthlyView.month1BaseDiscountEur, 275);
  assert.equal(result.monthlyView.fromMonth2TotalEur, 550);
  assert.equal(result.monthlyView.month1TotalEur, 275);
});

test('invalid: video must be unavailable on BASIC', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    weekendExposure: false,
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
    weekendExposure: false,
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

test('weekend exposure add-on affects price but not contacts: BASIC / 6 months', () => {
  const resultNoExtras = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 6,
    weekendExposure: false,
    photoReporting: false,
    priorityBooking: false,
    exclusivity: false,
    videoReporting: false,
  });
  const resultWithExtras = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 6,
    weekendExposure: true,
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

  assert.equal(
    resultWithExtras.monthlyView.fromMonth2TotalEur - resultNoExtras.monthlyView.fromMonth2TotalEur,
    30,
  );
});

test('contract total formula: PRO / 3 months / one-time priority booking counted once', () => {
  const result = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 3,
    weekendExposure: false,
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
    weekendExposure: true,
    photoReporting: true,
    priorityBooking: false,
    exclusivity: true,
    videoReporting: false,
  });
  assert.equal(basic.ok, true);
  if (basic.ok) {
    assert.equal(basic.monthlyView.month1TotalEur, 336.25);
    assert.equal(basic.monthlyView.fromMonth2TotalEur, 502.5);
    assert.equal(basic.contractTotalView.contractTotalEur, 2848.75);
  }

  const pro = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 12,
    weekendExposure: true,
    videoReporting: true,
    priorityBooking: true,
    exclusivity: false,
    photoReporting: false, // ignored by definition
  });
  assert.equal(pro.ok, true);
  if (pro.ok) {
    assert.equal(pro.monthlyView.month1TotalEur, 342);
    assert.equal(pro.monthlyView.fromMonth2TotalEur, 554);
    assert.equal(pro.contractTotalView.contractTotalEur, 6436);
  }

  const exclusive = calculateCalculator({
    packageId: 'EXCLUSIVE',
    durationMonths: 9,
    weekendExposure: true,
    videoReporting: true,
    // no exclusivity toggle field allowed on EXCLUSIVE
  });
  assert.equal(exclusive.ok, true);
  if (exclusive.ok) {
    assert.equal(exclusive.monthlyView.month1TotalEur, 415);
    assert.equal(exclusive.monthlyView.fromMonth2TotalEur, 760);
    assert.equal(exclusive.contractTotalView.contractTotalEur, 6495);
  }
});

test('guardrails must pass for all durations', () => {
  const result = calculateCalculator({
    packageId: 'BASIC',
    durationMonths: 3,
    weekendExposure: false,
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
    weekendExposure: false,
    videoReporting: false,
    priorityBooking: false,
    exclusivity: false,
  });
  const contractTotal = calculateCalculator({
    packageId: 'PRO',
    durationMonths: 6,
    weekendExposure: false,
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
