const DATE_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;

export type ValidationResult =
  | { isValid: true; date: Date }
  | { isValid: false; errorMessage: string };

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

export function validateBirthDate(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorMessage:
        "No Date entered, Please enter your birthdate in YYYY/MM/DD format.",
    };
  }

  if (!DATE_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `Invalid format: "${trimmed}". Please enter your birthdate in YYYY/MMM/DD format.`,
    };
  }

  const date = parseDate(trimmed);
  if (!date) {
    return {
      isValid: false,
      errorMessage: `Non-existent date: "${trimmed}". Please check the day is valid for the month and year.`,
    };
  }

  return { isValid: true, date };
}
