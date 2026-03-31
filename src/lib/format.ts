import { format, formatDistanceToNow } from "date-fns";

export function formatSlotRange(start: Date, end: Date) {
  return `${format(start, "EEE d MMM")} • ${format(start, "h:mma")} – ${format(
    end,
    "h:mma",
  )}`;
}

export function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}
