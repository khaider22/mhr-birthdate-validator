/**
 * index.ts — CLI entry point.
 *
 * This file handles input and output only.
 * Zero business logic lives here — all validation and age calculation
 * is delegated to dateValidator.ts and ageCalculator.ts.
 *
 * This means the core modules can be reused by an API or web app
 * without changing a single line of business logic.
 */

import readlineSync from "readline-sync";
import { validateBirthDate } from "../src/birthdate-validator";
import { evaluateBirthDate } from "../src/ageCalculator";

async function main(): Promise<void> {
  console.log("================================");
  console.log("   MHR Birthdate Validator");
  console.log("================================\n");

  // Step 1 — ask the user for their birthdate
  // readline-sync blocks here until the user presses Enter
  // No async/await or callbacks needed for a single prompt
  const input = readlineSync.question(
    "Please enter your birthdate (YYYY/MM/DD): "
  );

  // Step 2 — validate the format and calendar correctness
  // validateBirthdate returns a result object — never throws
  // so we handle errors as data, not exceptions
  const validation = validateBirthDate(input);

  if (!validation.isValid) {
    console.error(`\nError: ${validation.errorMessage}`);
    process.exit(1);
  }

  // Step 3 — calculate age and determine messages
  // new Date() is called once here and passed down
  // so the core functions never touch the system clock directly
  // making them fully testable without mocking
  const result = evaluateBirthDate(validation.date, new Date());

  console.log();

  // Step 4 — display the result
  // switch on the discriminated union — TypeScript guarantees
  // every possible status is handled at compile time
  switch (result.status) {
    case "future":
    case "today":
      // both statuses carry a single message — render it the same way
      console.log(result.message);
      break;

    case "ok":
      // multiple messages can apply at once (e.g. birthday + centenary)
      // the core module decides what to include — we just print each one
      result.messages.forEach((msg) => console.log(msg));
      break;
  }

  console.log();
}

// Top-level error handler — catches any unexpected runtime failures
// that slip past the result-object pattern
// Uses 'unknown' not 'any' — safer because TypeScript forces us
// to check the type before calling .message on it
main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Unexpected error:", message);
  process.exit(1);
});
