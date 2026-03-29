export type AgeResult =
  | { status: "error"; message: string }
  | { status: "future"; message: string }
  | { status: "today"; message: string }
  | { status: "ok"; age: number; messages: string[] };

export const CENTENARY_AGE = 100;

export function toUTCMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function calculateAge(birthUTC: Date, nowUTC: Date): number {
  let age = nowUTC.getUTCFullYear() - birthUTC.getUTCFullYear();

  const birthdayReadchedThisYear =
    nowUTC.getUTCMonth() > birthUTC.getUTCMonth() ||
    (nowUTC.getUTCMonth() === birthUTC.getUTCMonth() &&
      nowUTC.getUTCDate() >= birthUTC.getUTCDate());

  if (!birthdayReadchedThisYear) age -= 1;

  return age;
}

export function isBirthdayToday(birthUTC: Date, nowUTC: Date): boolean {
  return (
    birthUTC.getUTCMonth() == nowUTC.getUTCMonth() &&
    birthUTC.getUTCDate() == nowUTC.getUTCDate()
  );
}

export function evaluateBirthDate(birthDate: Date, now: Date): AgeResult {
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

  messages.push(`You are ${age} years old`);
  return { status: "ok", age, messages };
}
