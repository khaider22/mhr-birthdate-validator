export type AgeResult =
  | { status: "error"; message: string }
  | { status: "future"; message: string }
  | { status: "today"; message: string }
  | { status: "ok"; age: number; messages: string[] };

export const CENTENARY_AGE = 100;

/**
 * Strips the time component from any Date, returning UTC midnight.
 * Ensures all day-level comparisons are immune to partial-day offsets.
 * Must use getUTC* getters — mixing local getters with Date.UTC
 * construction causes wrong dates on servers in non-UTC timezones.
 */
export function toUTCMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

/**
 * Calculates completed years between two UTC midnight dates.
 * Subtracts one year if the birthday has not yet occurred this year.
 */
export function calculateAge(birthUTC: Date, nowUTC: Date): number {
  let age = nowUTC.getUTCFullYear() - birthUTC.getUTCFullYear();

  const birthdayReachedThisYear =
    nowUTC.getUTCMonth() > birthUTC.getUTCMonth() ||
    (nowUTC.getUTCMonth() === birthUTC.getUTCMonth() &&
      nowUTC.getUTCDate() >= birthUTC.getUTCDate());

  if (!birthdayReachedThisYear) age -= 1;

  return age;
}

/**
 * Returns true when birth month and day match today's month and day.
 * Year is intentionally ignored — a birthday is an annual event.
 */
export function isBirthdayToday(birthUTC: Date, nowUTC: Date): boolean {
  return (
    birthUTC.getUTCMonth() === nowUTC.getUTCMonth() &&
    birthUTC.getUTCDate() === nowUTC.getUTCDate()
  );
}

/**
 * Evaluates a validated birthdate against today and returns a typed result.
 *
 * Priority order:
 *  1. Future date  → status "future"
 *  2. Born today   → status "today"
 *  3. Past date    → status "ok" with age and contextual messages
 */
export function evaluateBirthdate(birthDate: Date, now: Date): AgeResult {
  const birthUTC = toUTCMidnight(birthDate);
  const nowUTC = toUTCMidnight(now);

  if (birthUTC.getTime() > nowUTC.getTime()) {
    return { status: "future", message: "You are not born yet!" };
  }

  if (birthUTC.getTime() === nowUTC.getTime()) {
    return { status: "today", message: "Are you sure you are born today?" };
  }

  const age = calculateAge(birthUTC, nowUTC);
  const messages: string[] = [];

  if (isBirthdayToday(birthUTC, nowUTC)) {
    messages.push("Happy Birthday!");
  }

  if (age >= CENTENARY_AGE) {
    messages.push(`Incredible — you are ${age} years old!`);
  }

  messages.push(`You are ${age} years old.`);
  return { status: "ok", age, messages };
}
