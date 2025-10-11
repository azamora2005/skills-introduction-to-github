export function formatChf(cents: number): string {
  const amount = cents / 100;
  const hasDecimals = Math.round(cents) % 100 !== 0;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
}
