# MHR Birthdate Validator

A command-line application that accepts a user's birthdate, validates the
input, calculates their age, and displays a contextual message.

Built with TypeScript. Tested with Jest.

---

## Table of contents

1. [What this program does](#what-this-program-does)
2. [Prerequisites](#prerequisites)
3. [VS Code setup](#vs-code-setup)
4. [Getting started](#getting-started)
5. [Running the program](#running-the-program)
6. [Running the tests](#running-the-tests)
7. [Project structure explained](#project-structure-explained)
8. [How the code works](#how-the-code-works)
9. [How the tests work](#how-the-tests-work)
10. [Common errors and fixes](#common-errors-and-fixes)
11. [Design decisions](#design-decisions)
12. [Known constraints and future improvements](#known-constraints-and-future-improvements)

---

## What this program does

The program asks the user to type their birthdate in `YYYY/MM/DD` format
and then responds with one of the following:

| Scenario              | Example input                      | Output                                                       |
| --------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Valid past date       | `1990/07/07`                       | `You are 35 years old.`                                      |
| User's birthday today | `1990/07/07` (if today is July 07) | `Happy Birthday! You are 35 years old.`                      |
| Born today            | Today's date                       | `Are you sure you are born today?`                           |
| Future date           | Tomorrow's date                    | `You are not born yet!`                                      |
| Age 100 or over       | `1925/07/07`                       | `Incredible — you are 100 years old!`                        |
| 100th birthday today  | `1925/07/07` (if today is Jul7 07) | `Happy Birthday! Incredible — you are 100 years old!`        |
| Wrong format          | `2022-05-16`                       | `Error: Invalid format: "1990-06-15". Please use YYYY/MM/DD` |
| Impossible date       | `2023/02/29`                       | `Error: Non-existent date: "2023/02/29"`                     |
| Empty input           | _(just press Enter)_               | `Error: No date provided`                                    |

---

## Prerequisites

Before you can run this project you need two tools installed on your machine.

### 1. Node.js

Node.js is the engine that runs JavaScript and TypeScript outside a browser.
When you install Node.js, npm (the package manager) comes included automatically.

- Download from: https://nodejs.org
- Choose the **LTS** version (Long Term Support — the stable one)
- Minimum version required: **Node.js 18.x**

After installing, verify in your terminal:

```bash
node --version    # should print v18.x.x or higher
npm --version     # should print 9.x.x or higher
```

> **Windows users:** Use **PowerShell** or the **VS Code integrated terminal**
> for all commands in this guide. Avoid Command Prompt (cmd) — it behaves
> differently and some commands may not work.

### 2. VS Code (recommended editor)

Download from: https://code.visualstudio.com

VS Code has built-in TypeScript support and the extensions below make
development significantly easier.

---

## VS Code setup

These steps only need to be done once. They improve your experience across
all TypeScript projects, not just this one.

### Install extensions

Press `Ctrl+Shift+X` to open the Extensions panel. Search for and install:

| Extension                     | Author    | Purpose                                    |
| ----------------------------- | --------- | ------------------------------------------ |
| **Prettier - Code formatter** | Prettier  | Auto-formats code on save                  |
| **ESLint**                    | Microsoft | Underlines code quality issues as you type |
| **Error Lens**                | Alexander | Shows errors inline next to the code       |
| **Jest Runner**               | firsttris | Adds run/debug buttons next to each test   |

### Configure format on save

Press `Ctrl+Shift+P` → type **"Open User Settings JSON"** → press Enter.

Add these lines inside the existing curly braces:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

> **Important:** If you already have settings in this file (for Python,
> Flutter, etc.) just add the new lines inside the same `{}` — do not
> create a second set of curly braces. Add a comma after the last existing
> line before adding the new ones.

After this, every time you press `Ctrl+S` to save a TypeScript file,
Prettier will automatically fix indentation, spacing, and quote styles.

### Create a Prettier config file

In the root of your project, create a file called `.prettierrc` and paste:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

This tells Prettier exactly how to format your code. Without this file,
Prettier uses its own defaults which may differ from your team's style.

---

## Getting started

### 1. Get the project

If you received a zip file, extract it. If you have Git:

```bash
git clone <repository-url>
cd mhr-birthdate-validator
```

### 2. Open in VS Code

```bash
code .
```

The `.` means "open the current folder". VS Code will open with the full
project visible in the Explorer panel on the left.

### 3. Open the integrated terminal

Press `` Ctrl+` `` (the backtick key, left of the `1` key).

This opens a terminal inside VS Code so you don't need to switch between
applications. All commands in this guide should be run here.

### 4. Install dependencies

```bash
npm install
```

This reads `package.json` and downloads every library the project needs
into a `node_modules` folder. This folder is large — do not commit it to
Git or include it in a zip submission.

> **First time seeing npm install?**
> Think of `package.json` as a shopping list and `npm install` as the
> shopping trip. The `node_modules` folder is the cupboard where everything
> gets stored. You never edit anything inside `node_modules` directly.

> **If you see warnings about peer dependencies** — these are usually safe
> to ignore. A warning means two packages disagree on a shared dependency
> version but npm installed anyway. Only errors (not warnings) block the
> install.

---

## Running the program

```bash
npm start
```

You will see:

```
================================
   MHR Birthdate Validator
================================

Please enter your birthdate (YYYY/MM/DD):
```

Type a date and press Enter. The program will respond and exit.

### What each npm script does

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `npm start`          | Runs the program via ts-node (no compile step needed)   |
| `npm run build`      | Compiles TypeScript to JavaScript in the `dist/` folder |
| `npm test`           | Runs all tests with coverage report                     |
| `npm run test:watch` | Re-runs tests automatically every time you save a file  |

---

## Running the tests

```bash
npm test
```

You should see all tests pass with output like this:

```
 PASS  tests/dateValidator.test.ts
 PASS  tests/ageCalculator.test.ts
------------------------|---------|----------|---------|---------|-------------------|
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
------------------------|---------|----------|---------|---------|-------------------|
All files               |     100 |      100 |     100 |     100 |                   |
ageCalculator.ts        |     100 |      100 |     100 |     100 |                   |
birthdate-validator.ts  |     100 |      100 |     100 |     100 |                   |
------------------------|---------|----------|---------|---------|-------------------|
```

### Understanding the coverage table

Coverage tells you how much of your code was actually executed during tests.

| Column                | What it means                                                                  |
| --------------------- | ------------------------------------------------------------------------------ |
| **% Stmts**           | Percentage of code statements that were executed                               |
| **% Branch**          | Percentage of if/else branches that were tested — both the true AND false path |
| **% Funcs**           | Percentage of functions that were called by at least one test                  |
| **% Lines**           | Percentage of lines that were executed                                         |
| **Uncovered Line #s** | Exact line numbers that no test reached — your next test targets               |

> **Branch coverage is the most important column for a QA role.**
> 100% branch coverage means every `if` and `else` in your code was
> tested in both directions. A function with an untested `else` branch
> could have a bug that never gets caught.

### Running a single test

With the **Jest Runner** extension installed, you will see a play button
appear above each `it()` and `describe()` block in your test files.
Click it to run just that one test without running the entire suite.

This is invaluable when debugging a single failing test.

### Watch mode

```bash
npm run test:watch
```

Leave this running while you write code. Every time you save a file, the
relevant tests re-run automatically and the green ticks in the editor
update instantly. This is the fastest feedback loop available.

---

## Project structure explained

```
mhr-birthdate-validator/
│
├── src/                        # All source code lives here
│   ├── index.ts                # Entry point — handles I/O only
│   ├── dateValidator.ts        # Parses and validates date strings
│   └── ageCalculator.ts        # Calculates age and builds messages
│
├── tests/                      # All test files live here
│   ├── dateValidator.test.ts   # Tests for dateValidator.ts
│   └── ageCalculator.test.ts   # Tests for ageCalculator.ts
│
├── .vscode/
│   └── launch.json             # VS Code debugger configuration
│
├── .gitignore                  # Tells Git which files to ignore
├── .prettierrc                 # Prettier formatting rules
├── jest.config.ts              # Jest test runner configuration
├── package.json                # Project metadata and dependencies
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # This file
```

> **Notice there is no `index.test.ts`.**
> `index.ts` contains no business logic — only I/O wiring. There is
> nothing to unit test there. The functions it calls are thoroughly tested
> in the other two test files.

---

## How the code works

Understanding the three-layer architecture helps you extend or debug
the program confidently.

### Layer 1 — `dateValidator.ts`

**Job:** Answer the question _"is this string a valid date?"_

This file does three things in order:

```
1. Is the input empty?              → return "No date provided" error
2. Does it match YYYY/MM/DD format? → return "Invalid format" error
3. Does the date actually exist?    → return "Non-existent date" error
4. All checks passed                → return the parsed Date object
```

**The format check uses a regular expression (regex):**

```typescript
const DATE_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;
```

Breaking this down character by character:

- `^` — must start here (nothing before)
- `\d{4}` — exactly 4 digits (the year)
- `\/` — a literal forward slash
- `\d{2}` — exactly 2 digits (the month)
- `\/` — another forward slash
- `\d{2}` — exactly 2 digits (the day)
- `$` — must end here (nothing after)

So `1990/06/15` passes. `1990-06-15` fails (dashes). `1990/6/15` fails
(single digit month). `-2026/03/28` fails (minus sign is not a digit).

**The calendar check uses JavaScript's own Date correction:**

```typescript
const dt = new Date(Date.UTC(y, m - 1, d));

if (
  dt.getUTCFullYear() !== y ||
  dt.getUTCMonth() !== m - 1 ||
  dt.getUTCDate() !== d
) {
  return null;
}
```

JavaScript auto-corrects impossible dates — `Feb 30` silently becomes
`Mar 2`. By constructing the date and then reading the components back
out, we catch this correction. If what comes back doesn't match what we
put in, the date doesn't exist.

> **Why `m - 1`?**
> JavaScript months are zero-indexed. January = 0, December = 11.
> You pass `06` for June but JavaScript needs `5`. The `- 1` handles
> this conversion. You will see this everywhere in JavaScript date code.

> **Why `Date.UTC()` instead of `new Date(y, m-1, d)`?**
> `new Date(y, m-1, d)` uses the local timezone of the machine running
> the code. On a server in New York (UTC-5), midnight on June 15th UTC
> appears as 7pm on June 14th locally — the wrong date. `Date.UTC()`
> always uses UTC regardless of where the server is located. For a
> payroll and HR system where date accuracy affects people's pay, this
> is critical.

**The return type is a discriminated union:**

```typescript
export type ValidationResult =
  | { isValid: true; date: Date }
  | { isValid: false; errorMessage: string };
```

This means the result is always one of exactly two shapes. TypeScript
uses the `isValid` field to know which shape it is. When `isValid` is
`true`, TypeScript guarantees `date` exists. When `isValid` is `false`,
TypeScript guarantees `errorMessage` exists. You can never accidentally
access the wrong field — the compiler stops you.

---

### Layer 2 — `ageCalculator.ts`

**Job:** Answer the question _"what does this date mean for this user?"_

This file receives a validated `Date` object (never a raw string) and
returns one of four possible statuses:

```typescript
export type AgeResult =
  | { status: "error"; message: string }
  | { status: "future"; message: string }
  | { status: "today"; message: string }
  | { status: "ok"; age: number; messages: string[] };
```

The evaluation follows a strict priority order:

```
1. Is the birthdate after today?      → status: "future"
2. Is the birthdate today's date?     → status: "today"
3. Everything else (past dates):
     a. Is today their birthday?      → add "Happy Birthday!" to messages
     b. Are they 100 or older?        → add centenary message
     c. Always                        → add "You are X years old."
                                      → status: "ok"
```

This priority order is important. It means "born today" and "happy
birthday" can never fire together — a person born today is 0 years old,
not celebrating an anniversary.

**Why `messages` is an array:**

Multiple conditions can be true simultaneously. On someone's 100th
birthday, both `"Happy Birthday!"` and the centenary message apply.
An array lets both messages appear without one overwriting the other.

**`toUTCMidnight` — stripping the time component:**

```typescript
export function toUTCMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
```

A JavaScript `Date` stores an exact moment in time — not just a calendar
date. Two dates on the same calendar day can be different millisecond
values if one is at 9am and one is at 3pm.

Before comparing dates, we strip the time component by creating a new
Date at midnight UTC on the same calendar day. This means we are always
comparing calendar dates — not timestamps.

Example with real values:

```
User's birthdate:  1990-07-07T00:00:00Z  (midnight UTC)
Current time now:  2024-07-07T14:30:00Z  (2:30pm UTC)

Without toUTCMidnight:
  birthdate.getTime() = 645321600000
  now.getTime()       = 1718462200000
  Are they equal? NO — different millisecond values
  Birthday check FAILS even though it IS their birthday

With toUTCMidnight:
  birthdate midnight = 645321600000  (July 07 1990 00:00 UTC)
  now midnight       = 1718409600000 (July 07 2025 00:00 UTC)
  Are they equal? NO — different years — but now both midnight
  isBirthdayToday() compares only month+day → YES ✅ birthday detected
```

**Dependency injection — why `now` is a parameter:**

```typescript
export function evaluateBirthdate(birthdate: Date, now: Date): AgeResult;
```

Instead of calling `new Date()` inside the function, `now` is passed
in by the caller. This makes the function **pure** — given the same
inputs, it always returns the same output.

In tests, you pass a fixed date:

```typescript
evaluateBirthdate(utc(1990, 7, 7), utc(2025, 7, 7));
// Always returns the same result — no matter when the test runs
```

In production (`index.ts`), you pass the real current time:

```typescript
evaluateBirthdate(validation.date, new Date());
```

Without this pattern, a test for "Happy Birthday" would only pass on
the person's actual birthday. With it, tests are deterministic forever.

---

### Layer 3 — `index.ts`

**Job:** Handle input and output. Nothing else.

```
1. Print welcome message
2. Prompt user for input (readline-sync blocks here)
3. Pass input to validateBirthdate()
4. If invalid → print error and exit with code 1
5. Pass valid date to evaluateBirthdate() with today's date
6. Print the messages from the result
```

`new Date()` is called exactly once — here in the entry point — and
passed down to `evaluateBirthdate()`. The core functions never touch
the system clock directly.

The `switch` statement uses the discriminated union:

```typescript
switch (result.status) {
  case "future":
  case "today":
    console.log(result.message);
    break;
  case "ok":
    result.messages.forEach((msg) => console.log(msg));
    break;
}
```

TypeScript verifies at compile time that every possible status is handled.
If you added a new status to `AgeResult` and forgot to add a case here,
TypeScript would show an error before you even ran the code.

---

## How the tests work

### Test file structure

Each test file mirrors its source file:

```
src/dateValidator.ts    →   tests/dateValidator.test.ts
src/ageCalculator.ts    →   tests/ageCalculator.test.ts
```

Tests are organised using `describe` (groups) and `it` (individual tests):

```typescript
describe("validateBirthdate", () => {
  // group: function being tested
  describe("valid input", () => {
    // sub-group: scenario category
    it("returns isValid true for correct input", () => {
      // one test
      const result = validateBirthdate("1990/06/15");
      expect(result.isValid).toBe(true); // assertion
    });
  });
});
```

Every test follows the **AAA pattern** — Arrange, Act, Assert:

```typescript
it("returns correct age when birthday has passed this year", () => {
  // ARRANGE — set up inputs
  const birthdate = utc(1990, 1, 1);
  const today = utc(2024, 6, 15);

  // ACT — call the function
  const age = calculateAge(birthdate, today);

  // ASSERT — check the result
  expect(age).toBe(34);
});
```

### The `utc` helper

At the top of `ageCalculator.test.ts`:

```typescript
const utc = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d));
```

This is a test-only helper. It exists for two reasons:

1. **Readability** — `utc(1990, 6, 15)` is immediately clear.
   `new Date(Date.UTC(1990, 5, 15))` requires the reader to remember
   that months are zero-indexed and mentally add 1 to verify June.

2. **Safety** — the helper handles `m - 1` automatically so you never
   have to think about zero-indexing when writing tests.

### Why tests use Date objects, not strings

`dateValidator.test.ts` tests use strings because that is what
`validateBirthdate` accepts:

```typescript
validateBirthdate("1990/06/15"); // ✅ correct — function takes a string
```

`ageCalculator.test.ts` tests use `utc()` Date objects because that is
what `evaluateBirthdate` accepts:

```typescript
evaluateBirthdate(utc(1990, 6, 15), utc(2024, 6, 15)); // ✅ correct
```

Testing each function with exactly the type it accepts means a failing
test points to one specific function — not two.

### Four categories of tests

For every function, tests are written across four categories:

```
1. Happy path    — does it work when input is correct?
2. Format errors — does it handle wrong format gracefully?
3. Calendar errors — does it handle impossible dates?
4. Edge cases    — boundaries, midnight, Dec 31, Feb 29, turning 100?
```

Thinking in these four categories before writing tests is the habit that
produces comprehensive coverage.

### Debugging tests

**Quick method — add a console.log:**

```typescript
it("parses year correctly", () => {
  const result = parseDate("1985/03/22")!;
  console.log("Month value:", result.getUTCMonth()); // prints during test run
  expect(result.getUTCMonth()).toBe(2);
});
```

Delete the `console.log` once you have found the issue.

**Full debugger — step through code line by line:**

1. Set a breakpoint by clicking the grey margin left of a line number
   (a red dot appears)
2. Press `F5` to start debugging
3. `F10` — move to the next line (step over)
4. `F11` — jump inside the function being called (step into)
5. `Shift+F11` — finish the current function and return (step out)
6. Hover over any variable to see its current value

---

## Common errors and fixes

These are real errors encountered while building this project and how
to fix them.

---

### `Cannot find name 'describe'` / `Cannot find name 'expect'`

**What it means:** TypeScript doesn't know about Jest's global functions.

**Fix:** Add `"types": ["jest", "node"]` to `tsconfig.json` and include
the tests folder:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

---

### `Individual declarations in merged declaration must be all export or all local`

**What it means:** You have two declarations of the same type name in
your project — probably in two different files, or you accidentally
declared it twice in the same file.

**Fix:** Press `Ctrl+Shift+F` and search for the type name (e.g.
`ValidationResult`). Find which files contain it and delete the duplicate.
Each type should be declared exactly once.

---

### `A top-level 'export' modifier cannot be used on value declarations in CommonJS module`

**What it means:** Your `tsconfig.json` has settings that conflict with
each other — usually `"verbatimModuleSyntax": true` or
`"moduleDetection": "force"` combined with `"module": "commonjs"`.

**Fix:** Replace your entire `tsconfig.json` with this minimal version:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "types": ["jest", "node"]
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> **Root cause:** VS Code sometimes generates a `tsconfig.json` template
> designed for React or Deno projects. These templates contain settings
> like `"verbatimModuleSyntax"`, `"jsx": "react-jsx"`, and
> `"moduleDetection": "force"` that are incompatible with a Node.js
> CommonJS project. Always start with the minimal config above for a
> Node.js CLI project.

---

### `No overload matches this call` on `new Date(Date.UTC(y, m - 1, d))`

**What it means:** TypeScript isn't sure `y`, `m`, `d` are definitely
numbers — they could be `undefined` if the split produced fewer parts
than expected.

**Fix:** Assert the array has exactly three numbers:

```typescript
const [y, m, d] = input.split("/").map(Number) as [number, number, number];
```

This is safe because the regex above already confirmed the format is
`YYYY/MM/DD` before this line runs — the split will always produce
exactly three parts.

---

### `404 Not Found` when running `npm install`

**What it means:** A package name in your install command doesn't exist
on the npm registry — usually a typo.

**Fix:** Check the exact package name at https://npmjs.com. The most
common typo in this project: `readline-async` instead of `readline-sync`.

---

### Round-trip check always returning `null` for valid dates

**What it means:** You used local timezone getters instead of UTC getters
in the validation check.

**Wrong:**

```typescript
if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
```

**Correct:**

```typescript
if (
  dt.getUTCFullYear() !== y ||
  dt.getUTCMonth()    !== m - 1 ||
  dt.getUTCDate()     !== d
)
```

You built the date with `Date.UTC()` so you must read it back with
`getUTC*` methods. Mixing UTC construction with local getters causes
dates to appear invalid on machines in timezones behind UTC.

---

### Tests pass locally but would fail in a different timezone

**What it means:** You used `new Date(y, m-1, d)` (local time) instead
of `new Date(Date.UTC(y, m-1, d))` somewhere in your source code.

**Fix:** Search your codebase for `new Date(` and verify every date
construction uses `Date.UTC()`. Also verify every date comparison uses
`getUTC*` methods, not `getFullYear()`, `getMonth()`, `getDate()`.

---

### TypeScript version conflicts with ts-jest

**What it means:** ts-jest has a declared compatibility range. TypeScript
versions newer than that range may cause unexpected errors.

**Fix:** Pin to known-compatible versions:

```bash
npm uninstall typescript ts-jest jest @types/jest
npm install --save-dev typescript@5.4.5 ts-jest@29.1.2 jest@29.7.0 @types/jest@29.5.12
```

---

### VS Code not showing TypeScript errors / `Restart TS Server` not found

**Fix:** Press `Ctrl+Shift+P` and search for:

- `TypeScript: Restart TS Server`
- `TypeScript: Reload Project`

If neither appears, check the bottom-right status bar when a `.ts` file
is open — it should say `TypeScript 5.x.x`. If it says `JavaScript`,
VS Code is not recognising the file as TypeScript. Check the file
extension is `.ts` not `.js`.

If the issue persists, close and reopen VS Code completely.

---

## Design decisions

### Why three separate files?

Each file has exactly one job. This is the **Single Responsibility
Principle** — a core software engineering concept.

- `dateValidator.ts` answers: _"is this a valid date?"_
- `ageCalculator.ts` answers: _"what does this date mean?"_
- `index.ts` answers: _"how do I show this to the user?"_

The practical benefit: if MHR decides to turn this into a web API next
year, only `index.ts` changes. The validation and calculation logic —
and all its tests — stay completely untouched.

### Why result objects instead of throwing exceptions?

```typescript
// Throwing — caller must use try/catch
try {
  const date = DateValidator.validate(input); // throws on invalid input
} catch (error) {
  console.error(error.message);
}

// Result objects — caller uses a simple if check
const validation = validateBirthdate(input);
if (!validation.isValid) {
  console.error(validation.errorMessage);
}
```

Result objects are easier to read, easier to test (no try/catch in tests),
and TypeScript can verify at compile time that every branch is handled.
Exceptions are appropriate for truly unexpected failures — not for
predictable user input errors.

### Why UTC everywhere?

A date like `2024/06/15` means "June 15th" — a calendar date, not a
specific moment in time. JavaScript's `Date` object stores a specific
moment in time (milliseconds since 1970). The gap between these two
concepts causes bugs when a server's local timezone converts "midnight
UTC" to "11pm yesterday" in local time.

Using `Date.UTC()` for construction and `getUTC*()` for reading means
the calendar date is always identical regardless of which timezone the
server runs in.

### Why `messages` is an array?

Multiple conditions can be true simultaneously. On someone's 100th
birthday:

```
1. It is their birthday     → "Happy Birthday!"
2. They are 100 years old   → "Incredible — you are 100 years old!"
3. Always                   → "You are 100 years old."
```

A single string field would force the code to concatenate these —
mixing message-building logic into the evaluator. An array keeps each
message independent and lets the caller decide how to render them.

### Why is future date status `"future"` and not `"error"`?

A future date like `2099/01/01` is a perfectly valid, well-formed date.
The validator's job is to check if the input _is a date_ — not whether
it makes business sense. Returning `status: "error"` for a future date
would conflate two different problems.

This also makes the validator reusable. If MHR later needs to validate
a future appointment date, the same `validateBirthdate` function works
without modification.

### Why negative years return "Invalid format" not "Invalid date"?

An input like `-2026/03/28` fails the regex because `-` is not a digit
(`\d`). This is correct behaviour — the format error message tells the
user to use `YYYY/MM/DD` which implicitly communicates that a minus sign
is not valid. No real human birthdate has a negative year so a specific
error message adds complexity without value.

---

## Known constraints and future improvements

- **Single input per run** — the program accepts one birthdate and exits,
  as per the specification. A retry loop could be added to `index.ts`
  without touching any core business logic or tests.

- **No retry on invalid input** — invalid input exits with an error code
  rather than re-prompting. Exit code `1` is the Unix convention for
  failure and allows the program to be composed in shell scripts.

- **February 29th in non-leap years** — someone born on Feb 29th will
  not see a birthday message on non-leap years (e.g. 2023/02/28 is not
  their birthday). The program makes no attempt to pick the nearest date.
  This is standard behaviour and matches how most systems handle it.

- **Negative years** — `-2026/03/28` returns an invalid format error.
  This is intentional — negative birth years are not a real-world
  scenario for this application.

- **English only** — all messages are in English. Internationalisation
  (i18n) could be added by extracting message strings to a separate
  locale file.

- **No logging** — the program uses `console.log` directly. A production
  system would use a structured logging library so logs can be filtered,
  searched, and monitored.

- **CLI only** — the entry point is a command-line interface. The core
  modules (`dateValidator.ts`, `ageCalculator.ts`) are completely
  decoupled from I/O and could be imported directly into a REST API,
  a web form handler, or a serverless function with no changes.

### Merging tests with similar output using `it.each`

When multiple different inputs all produce the same result for the same
reason, writing a separate `it` block for each one creates noise — the
test file grows long and the repeated structure hides what actually
differs between each case.

Jest provides `it.each` for exactly this situation. It runs the same
test logic once per row in a data table, and each row appears as its
own named result in the output.

**Example — invalid format cases merged into one block:**

```typescript
// BEFORE — seven separate it blocks, all identical except the input
it("returns null for dashes instead of slashes", () => {
  expect(parseDate("1990-06-15")).toBeNull();
});
it("returns null for dots as separator", () => {
  expect(parseDate("1990.06.15")).toBeNull();
});
it("returns null for missing leading zeros", () => {
  expect(parseDate("1990/6/5")).toBeNull();
});
// ... four more blocks exactly like these

// AFTER — one it.each block, same coverage, far less repetition
it.each([
  ["empty string", ""],
  ["dashes instead of slashes", "1990-06-15"],
  ["dots as separator", "1990.06.15"],
  ["DD/MM/YYYY order", "15/06/1990"],
  ["missing leading zeros", "1990/6/5"],
  ["plain text", "not-a-date"],
  ["partial date", "1990/06"],
  ["negative year", "-2026/03/28"],
  ["trailing characters", "1990/06/15abc"],
])("returns null for %s", (_description, input) => {
  expect(parseDate(input)).toBeNull();
});
```

Jest output for the `it.each` version:

```
✅ returns null for empty string
✅ returns null for dashes instead of slashes
✅ returns null for dots as separator
✅ returns null for DD/MM/YYYY order
✅ returns null for missing leading zeros
✅ returns null for plain text
✅ returns null for partial date
✅ returns null for negative year
✅ returns null for trailing characters
```

Each row appears individually in the output — if one input fails you
see exactly which one without needing to debug a loop.

**When to use `it.each` vs separate `it` blocks:**

| Use separate `it` blocks when...                       | Use `it.each` when...                                  |
| ------------------------------------------------------ | ------------------------------------------------------ |
| Each case fails for a different reason                 | All cases produce the same result for the same reason  |
| Each case needs a different assertion                  | The assertion is identical — only the input changes    |
| The failure of one case tells you something different  | Any failure points to the same bug                     |
| You need to explain each case individually             | The test name + input data is self-explanatory         |

> **Important:** do not use `it.each` to merge tests that check
> _different things_. For example, the "born today" check and the
> "future date" check should stay as separate `it` blocks — they
> exercise different branches of the code and a failure in one tells
> you something completely different from a failure in the other.

### Shared date variables

Repeating raw date values across multiple tests creates a maintenance
problem — change a date and you have to find every occurrence. Named
constants solve this:

```typescript
// Without variables — reader has to decode numbers every time
it("returns correct age on exact birthday", () => {
  expect(calculateAge(utc(1990, 7, 7), utc(2025, 7, 7))).toBe(35);
});

// With variables — intent is immediately clear
it("returns correct age on exact birthday", () => {
  expect(calculateAge(BIRTH_TODAY, TODAY_STANDARD)).toBe(35);
});
```

All shared dates are declared at the top of `ageCalculator.test.ts`
before any `describe` block, split into two groups:

- **`BIRTH_`** prefix — what the user was born (e.g. `BIRTH_TODAY`,
  `BIRTH_CENTENARY`, `BIRTH_LEAP_DAY`)
- **`TODAY_`** prefix — what "today" is in each test scenario
  (e.g. `TODAY_STANDARD`, `TODAY_LEAP_YEAR`, `TODAY_NEW_YEAR`)

Names describe the **scenario** being tested, not the raw date value.
Use a named variable when a date appears in more than one test. Use an
inline `utc()` call when the date is unique to one test and the test
name makes the intent obvious.
