/**
 * Urgency-based discount — the closer to now, the bigger the deal.
 * Used in the deals API and slot creation cron.
 */
export function urgencyDiscount(startTime: Date): number {
  const hoursUntil = (startTime.getTime() - Date.now()) / 3_600_000;
  if (hoursUntil > 24) return 20;
  if (hoursUntil > 6) return 25;
  if (hoursUntil > 2) return 30;
  return 35;
}
