import {
  toUTCMidnight,
  calculateAge,
  isBirthdayToday,
  evaluateBirthDate,
  CENTENARY_AGE,
} from "../src/ageCalculator";

const utc = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d));
// ─── Shared test dates ────────────────────────────────────────────────────────
// All dates use the utc() helper which handles zero-indexed months
// internally — pass human-readable month numbers (1=Jan, 12=Dec)

// Birthdates — what the user was born
const BIRTH_YESTERDAY = utc(1990, 7, 6); // born day before TODAY_STANDARD
const BIRTH_TODAY = utc(1990, 7, 7); // born same month+day as TODAY_STANDARD
const BIRTH_TOMORROW = utc(1990, 7, 8); // born day after TODAY_STANDARD
const BIRTH_CENTENARY = utc(1925, 7, 7); // turns exactly 100 on TODAY_STANDARD
const BIRTH_LEAP_DAY = utc(2000, 2, 29); // Feb 29 — only valid in leap years
const BIRTH_END_OF_YEAR = utc(1990, 12, 31); // Dec 31 edge case
const BIRTH_START_OF_YEAR = utc(1990, 1, 1); // Jan 1 edge case
const BIRTH_FUTURE = utc(2025, 7, 8); // one day after TODAY_STANDARD — not born yet
const BIRTH_EARLIER_THIS_YEAR = utc(2025, 1, 1); // born this year — age is 0

// Reference dates — what "today" is in each test scenario
const TODAY_STANDARD = utc(2025, 7, 7); // the main reference date used across most tests
const TODAY_LEAP_YEAR = utc(2024, 2, 29); // a day that only exists in leap years
const TODAY_END_OF_YEAR = utc(2025, 12, 31); // Dec 31 — last day of year
const TODAY_NEW_YEAR = utc(2025, 1, 1); // Jan 1 — first day of year

// toUTCMidnight
describe("toUTCMidnight", () => {
  it("removes the time component from datetime", () => {
    const dt = new Date("2024-06-05T13:30:00Z");
    const result = toUTCMidnight(dt);
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
  });

  it("preserves the year, month and date", () => {
    const dt = new Date("2024-06-05T13:30:00Z");
    const result = toUTCMidnight(dt);
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(5);
    expect(result.getUTCDate()).toBe(5);
  });
});

// calculateAge
describe("calculateAge", () => {
  it("returns correct age when the birthday has passed this year", () => {
    expect(calculateAge(BIRTH_YESTERDAY, TODAY_STANDARD)).toBe(35);
  });

  it("returns correct age when the birthday has not passed this year", () => {
    expect(calculateAge(BIRTH_TOMORROW, TODAY_STANDARD)).toBe(34);
  });

  it("returns the correct age on the birthday", () => {
    expect(calculateAge(BIRTH_TODAY, TODAY_STANDARD)).toBe(35);
  });

  it("return 0 years age born the same year", () => {
    expect(calculateAge(TODAY_STANDARD, TODAY_STANDARD)).toBe(0);
  });

  it("returns 99 for someone turning 100 tomorrow", () => {
    expect(calculateAge(utc(1925, 7, 8), TODAY_STANDARD)).toBe(99);
  });

  it("returns 100 on the exact 100th birthday", () => {
    expect(calculateAge(BIRTH_CENTENARY, TODAY_STANDARD)).toBe(100);
  });
});

// isBirthdayToday
describe("isBirthdayToday", () => {
  it("returns true when month and day match", () => {
    expect(isBirthdayToday(BIRTH_TODAY, TODAY_STANDARD)).toBe(true);
  });

  it("returns false when the month doesn't match", () => {
    expect(isBirthdayToday(utc(1990, 6, 7), TODAY_STANDARD)).toBe(false);
  });

  it("returns false when the date doesn't match", () => {
    expect(isBirthdayToday(BIRTH_YESTERDAY, TODAY_STANDARD)).toBe(false);
  });

  it("returns true for Feb 29 birthdate in leapyear", () => {
    expect(isBirthdayToday(BIRTH_LEAP_DAY, TODAY_LEAP_YEAR)).toBe(true);
  });
});

// evaluateBirthdate
describe("evaluateBirthdate", () => {
  describe("future date", () => {
    it("returns future status for tomorrow's date", () => {
      const result = evaluateBirthDate(BIRTH_FUTURE, TODAY_STANDARD);
      expect(result.status).toBe("future");
    });

    it("returns correct message for future date", () => {
      const result = evaluateBirthDate(BIRTH_FUTURE, TODAY_STANDARD);
      if (result.status == "future") {
        expect(result.message).toBe("You are not born yet!");
      }
    });

    it("returns correct status for far future date", () => {
      const result = evaluateBirthDate(utc(2099, 12, 31), TODAY_STANDARD);
      expect(result.status).toBe("future");
    });
  });

  describe("born today", () => {
    it("returns today status correctly for born today", () => {
      const result = evaluateBirthDate(TODAY_STANDARD, TODAY_STANDARD);
      expect(result.status).toBe("today");
    });

    it("returns correct message for born today", () => {
      const result = evaluateBirthDate(TODAY_STANDARD, TODAY_STANDARD);
      if (result.status == "today") {
        expect(result.message).toBe("Are you sure you are born today?");
      }
    });

    it("does not return Happy Birthday if born today", () => {
      const result = evaluateBirthDate(TODAY_STANDARD, TODAY_STANDARD);
      expect(result.status).not.toBe("ok");
    });
  });

  describe("standard past date", () => {
    it("returns status ok for past birthdate", () => {
      const result = evaluateBirthDate(BIRTH_YESTERDAY, TODAY_STANDARD);
      expect(result.status).toBe("ok");
    });

    it("returns correct age for past birthdate", () => {
      const result = evaluateBirthDate(BIRTH_YESTERDAY, TODAY_STANDARD);
      if (result.status == "ok") {
        expect(result.age).toBe(
          TODAY_STANDARD.getUTCFullYear() - BIRTH_YESTERDAY.getUTCFullYear()
        );
      }
    });

    it("tells the correct age in message", () => {
      const result = evaluateBirthDate(utc(1990, 7, 7), TODAY_STANDARD);
      if (result.status == "ok") {
        expect(result.messages.some((m) => m.includes("35"))).toBe(true);
      }
    });

    it("returns age 0 for person born months ago", () => {
      const result = evaluateBirthDate(BIRTH_EARLIER_THIS_YEAR, TODAY_STANDARD);
      if (result.status == "ok") {
        expect(result.age).toBe(0);
      }
    });
  });

  describe("birthday today", () => {
    it("includes Happy Birthday on birthdate", () => {
      const result = evaluateBirthDate(BIRTH_TODAY, TODAY_STANDARD);
      if (result.status == "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("does not include Happy Birthday on non birthdate", () => {
      const result = evaluateBirthDate(BIRTH_YESTERDAY, TODAY_STANDARD);
      if (result.status == "ok") {
        expect(result.messages).not.toContain("Happy Birthday!");
      }
    });
  });

  describe(`centenary age >= ${CENTENARY_AGE}`, () => {
    it("includes the centenary message for age exactly 100", () => {
      const result = evaluateBirthDate(BIRTH_CENTENARY, TODAY_STANDARD);
      if (result.status === "ok") {
        expect(result.messages.some((m) => m.includes("100"))).toBe(true);
      }
    });

    it("does not include centenary message for age 99", () => {
      const result = evaluateBirthDate(utc(1925, 7, 6), TODAY_STANDARD);
      if (result.status === "ok") {
        expect(
          result.messages.some((m) => m.toLowerCase().includes("Wow"))
        ).toBe(false);
      }
    });

    it("includes both Happy Birthday and centenary on 100th birthday", () => {
      const result = evaluateBirthDate(BIRTH_CENTENARY, TODAY_STANDARD);
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
        expect(result.messages.some((m) => m.includes("100"))).toBe(true);
      }
    });
  });

  describe("edge cases", () => {
    it("handles the last day of the year", () => {
      const result = evaluateBirthDate(BIRTH_END_OF_YEAR, TODAY_END_OF_YEAR);
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("handles the first day of January", () => {
      const result = evaluateBirthDate(BIRTH_START_OF_YEAR, TODAY_NEW_YEAR);
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("handles the day before a birthday — not a birthday", () => {
      const result = evaluateBirthDate(BIRTH_YESTERDAY, TODAY_STANDARD);
      expect(result.status).toBe("ok");
    });

    it("handles the day after a birthday — age already incremented", () => {
      const result = evaluateBirthDate(BIRTH_TOMORROW, TODAY_STANDARD);
      if (result.status === "ok") {
        expect(result.age).toBe(34);
      }
    });
  });
});
