// Matches exactly YYYY/MM/DD — four digits, slash, two digits, slash, two digits
// ^ and $ anchors ensure nothing before or after the pattern
const DATE_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;

export type ValidationResult =
  | { isValid: true; date: Date }
  | { isValid: false; errorMessage: string };

/**
 * Parses a YYYY/MM/DD string into a UTC midnight Date.
 * Returns null for invalid format or impossible calendar dates.
 *
 * Uses Date.UTC for construction so the result is timezone-agnostic.
 * Validates by round-tripping components — if JS normalised the date
 * (e.g. Feb 30 → Mar 2) the components won't match and we return null.
 */
export function parseDate(input: string): Date | null {
  if (!DATE_REGEX.test(input)) return null;

  const [y, m, d] = input.split("/").map(Number) as [number, number, number];
  const dt = new Date(Date.UTC(y, m - 1, d));

  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }

  return dt;
}

/**
 * Validates raw user input and returns a structured result.
 *
 * Three distinct failure modes with distinct messages:
 *  1. Empty / whitespace-only input
 *  2. Wrong format (pattern mismatch)
 *  3. Impossible calendar date (e.g. Feb 30)
 *
 * Trims whitespace before validating — tolerant of accidental spaces.
 */
export function validateBirthdate(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage:
        "No date entered. Please enter your birthdate in YYYY/MM/DD format.",
    };
  }

  if (!DATE_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `Invalid format: "${trimmed}". Please use YYYY/MM/DD (e.g. 1990/06/15).`,
    };
  }

  const date = parseDate(trimmed);
  if (!date) {
    return {
      isValid: false,
      errorMessage: `Non-existent date: "${trimmed}". Please check the day is valid for that month and year.`,
    };
  }

  return { isValid: true, date };
}
