#!/usr/bin/env node
/**
 * 1) Shows why the OLD client failed: (subtotal + rawStripeFee).toFixed(2) vs line items.
 * 2) Verifies the FIXED total (cent sum of line items) passes the same check as /api/checkout.
 *
 * Run: node scripts/reproduce-checkout-total-mismatch.mjs
 *      npm run repro:checkout-total
 */

function stripeFeeFromSubtotal(subtotal) {
  return subtotal * 0.029 + 0.3;
}

/** OLD bug: total did not match sum of Stripe line items */
function legacyClientTotalPriceString(subtotal) {
  const fee = stripeFeeFromSubtotal(subtotal);
  return (subtotal + fee).toFixed(2);
}

/** Same as src/lib/checkout-total-cents.ts (keep in sync). */
function totalCentsFromCheckoutLineItems(items) {
  return items.reduce((sum, item) => {
    const q =
      Number.isFinite(item.quantity) && item.quantity >= 1 ? Math.floor(item.quantity) : 1;
    const unitCents = Math.round(Number(item.amount) * 100);
    return sum + unitCents * q;
  }, 0);
}

/** FIXED: total matches what we send as line items */
function fixedClientTotalPriceString(subtotal) {
  const items = lineItemsLikeForm(subtotal);
  const cents = totalCentsFromCheckoutLineItems(items);
  return (cents / 100).toFixed(2);
}

function lineItemsLikeForm(subtotal) {
  const fee = stripeFeeFromSubtotal(subtotal);
  return [
    { amount: subtotal, quantity: 1 },
    { amount: Number(fee.toFixed(2)), quantity: 1 },
  ];
}

/** Pre-fix server: float reduce + round (could disagree with Stripe cents). */
function legacyServerRejects(totalPriceStr, items) {
  const computedTotal = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  const suppliedTotal = Number.parseFloat(totalPriceStr);
  const bad =
    Number.isNaN(suppliedTotal) ||
    Math.round(suppliedTotal * 100) !== Math.round(computedTotal * 100);
  return bad;
}

/** Current /api/checkout: totalCentsFromCheckoutLineItems */
function appServerRejects(totalPriceStr, items) {
  const computedCents = totalCentsFromCheckoutLineItems(items);
  if (computedCents <= 0) return true;
  const suppliedTotal = Number.parseFloat(totalPriceStr);
  const suppliedCents = Math.round(suppliedTotal * 100);
  return Number.isNaN(suppliedTotal) || suppliedCents !== computedCents;
}

const MAX_CENTS = 500_000;

function main() {
  console.log('=== Legacy client vs legacy float-sum check (shows the bug) ===\n');
  const legacyExamples = [];
  for (let cents = 1; cents <= MAX_CENTS; cents++) {
    const subtotal = cents / 100;
    const items = lineItemsLikeForm(subtotal);
    const totalStr = legacyClientTotalPriceString(subtotal);
    if (legacyServerRejects(totalStr, items)) {
      legacyExamples.push({ subtotal, totalStr });
      if (legacyExamples.length >= 5) break;
    }
  }
  if (legacyExamples.length === 0) {
    console.log('No legacy mismatches in range (unexpected).');
  } else {
    console.log(`First ${legacyExamples.length} failing subtotals (old behavior), e.g. $${legacyExamples[0].subtotal} → totalPrice "${legacyExamples[0].totalStr}" vs items sum.\n`);
  }

  console.log('=== Fixed client vs app server (must all pass) ===\n');
  let failedAt = null;
  for (let cents = 1; cents <= MAX_CENTS; cents++) {
    const subtotal = cents / 100;
    const items = lineItemsLikeForm(subtotal);
    const totalStr = fixedClientTotalPriceString(subtotal);
    if (appServerRejects(totalStr, items)) {
      failedAt = { subtotal, totalStr, items };
      break;
    }
  }

  if (failedAt) {
    console.error('FAIL: fixed path rejected:', JSON.stringify(failedAt, null, 2));
    process.exit(1);
  }

  console.log(`PASS: fixed totalPrice matches app checkout validation for all subtotals 0.01 .. ${(MAX_CENTS / 100).toFixed(2)} (${MAX_CENTS} steps).`);
  process.exit(0);
}

main();
