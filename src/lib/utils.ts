import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addMonths,
  addYears,
  isSameMonth,
  isSameYear,
  isAfter,
  startOfDay,
  differenceInDays,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextPaymentDate(
  startDate: Date | string,
  cycle: string,
): Date {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const today = startOfDay(new Date());
  let nextPayment = startOfDay(start);

  // Safety break
  let loops = 0;

  // Logic: Advance the date until it is in the SAME month/year as today, or later.
  // This ensures that if the bill is Jan 17 and today is Jan 19, we stick with Jan 17.
  while (
    (nextPayment < today && !isSameMonth(nextPayment, today)) ||
    (nextPayment < today &&
      isSameMonth(nextPayment, today) &&
      cycle === "YEARLY" &&
      !isSameYear(nextPayment, today))
  ) {
    if (cycle === "MONTHLY") {
      nextPayment = addMonths(nextPayment, 1);
    } else if (cycle === "YEARLY") {
      nextPayment = addYears(nextPayment, 1);
    }

    loops++;
    if (loops > 1000) break; // prevent infinite loop
  }

  return nextPayment;
}

export function isUrgent(date: Date): boolean {
  const today = startOfDay(new Date());
  const target = startOfDay(date);

  const diff = differenceInDays(target, today);

  // Urgent if it's due in the next 7 days OR if it was due in the last 3 days (Overdue/Recent)
  return diff >= -3 && diff <= 7;
}
