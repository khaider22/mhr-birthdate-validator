import {
  toUTCMidnight,
  calculateAge,
  isBirthdayToday,
  evaluateBirthDate,
  CENTENARY_AGE,
} from "../src/ageCalculator";

const utc = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d));

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
    expect(calculateAge(utc(1990, 7, 6), utc(2025, 7, 7))).toBe(35);
  });

  it("returns correct age when the birthday has not passed this year", () => {
    expect(calculateAge(utc(1990, 7, 8), utc(2025, 7, 7))).toBe(34);
  });

  it("returns the correct age on the birthday", () => {
    expect(calculateAge(utc(1990, 7, 7), utc(2025, 7, 7))).toBe(35);
  });

  it("return 0 years age born the same year", () => {
    expect(calculateAge(utc(2025, 7, 7), utc(2025, 7, 7))).toBe(0);
  });

  it("returns 99 for someone turning 100 tomorrow", () => {
    expect(calculateAge(utc(1925, 7, 8), utc(2025, 7, 7))).toBe(99);
  });

  it("returns 100 on the exact 100th birthday", () => {
    expect(calculateAge(utc(1925, 7, 7), utc(2025, 7, 7))).toBe(100);
  });
});

// isBirthdayToday
describe("isBirthdayToday", () => {
  it("returns true when month and day match", () => {
    expect(isBirthdayToday(utc(1990, 7, 7), utc(2025, 7, 7))).toBe(true);
  });

  it("returns false when the month doesn't match", () => {
    expect(isBirthdayToday(utc(1990, 6, 7), utc(2025, 7, 7))).toBe(false);
  });

  it("returns false when the date doesn't match", () => {
    expect(isBirthdayToday(utc(1990, 7, 6), utc(2025, 7, 7))).toBe(false);
  });

  it("returns true for Feb 29 birthdate in leapyear", () => {
    expect(isBirthdayToday(utc(2000, 2, 29), utc(2024, 2, 29))).toBe(true);
  });
});

// evaluateBirthdate
describe("evaluateBirthdate", () => {
  describe("future date", () => {
    it("returns future status for tomorrow's date", () => {
      const result = evaluateBirthDate(utc(2025, 7, 8), utc(2025, 7, 7));
      expect(result.status).toBe("future");
    });

    it("returns correct message for future date", () => {
      const result = evaluateBirthDate(utc(2025, 7, 8), utc(2025, 7, 7));
      if (result.status == "future") {
        expect(result.message).toBe("You are not born yet!");
      }
    });

    it("returns correct status for far future date", () => {
      const result = evaluateBirthDate(utc(2099, 12, 31), utc(2025, 7, 7));
      expect(result.status).toBe("future");
    });
  });

  describe("born today", () => {
    it("returns today status correctly for born today", () => {
      const result = evaluateBirthDate(utc(2025, 7, 7), utc(2025, 7, 7));
      expect(result.status).toBe("today");
    });

    it("returns correct message for born today", () => {
      const result = evaluateBirthDate(utc(2025, 7, 7), utc(2025, 7, 7));
      if (result.status == "today") {
        expect(result.message).toBe("Are you sure you are born today?");
      }
    });

    it("does not return Happy Birthday if born today", () => {
      const result = evaluateBirthDate(utc(2025, 7, 7), utc(2025, 7, 7));
      expect(result.status).not.toBe("ok");
    });
  });

  describe("standard past date", () => {
    it("returns status ok for past birthdate", () => {
      const result = evaluateBirthDate(utc(1990, 7, 6), utc(2025, 7, 7));
      expect(result.status).toBe("ok");
    });

    it("returns correct age for past birthdate", () => {
      const result = evaluateBirthDate(utc(1990, 7, 6), utc(2025, 7, 7));
      if (result.status == "ok") {
        expect(result.age).toBe(
          utc(2025, 7, 7).getUTCFullYear() - utc(1990, 7, 6).getUTCFullYear()
        );
      }
    });

    it("tells the correct age in message", () => {
      const result = evaluateBirthDate(utc(1990, 7, 7), utc(2025, 7, 7));
      if (result.status == "ok") {
        expect(result.messages.some((m) => m.includes("35"))).toBe(true);
      }
    });

    it("returns age 0 for person born months ago", () => {
      const result = evaluateBirthDate(utc(2025, 1, 1), utc(2025, 7, 7));
      if (result.status == "ok") {
        expect(result.age).toBe(0);
      }
    });
  });

  describe("birthday today", () => {
    it("includes Happy Birthday on birthdate", () => {
      const result = evaluateBirthDate(utc(1990, 7, 7), utc(2025, 7, 7));
      if (result.status == "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("does not include Happy Birthday on non birthdate", () => {
      const result = evaluateBirthDate(utc(1990, 7, 6), utc(2025, 7, 7));
      if (result.status == "ok") {
        expect(result.messages).not.toContain("Happy Birthday!");
      }
    });
  });

  describe(`centenary age >= ${CENTENARY_AGE}`, () => {
    it("includes the centenary message for age exactly 100", () => {
      const result = evaluateBirthDate(utc(1925, 7, 7), utc(2025, 7, 7));
      if (result.status === "ok") {
        expect(result.messages.some((m) => m.includes("100"))).toBe(true);
      }
    });

    it("does not include centenary message for age 99", () => {
      const result = evaluateBirthDate(utc(1925, 7, 6), utc(2025, 7, 7));
      if (result.status === "ok") {
        expect(
          result.messages.some((m) => m.toLowerCase().includes("Wow"))
        ).toBe(false);
      }
    });

    it("includes both Happy Birthday and centenary on 100th birthday", () => {
      const result = evaluateBirthDate(utc(1925, 7, 7), utc(2025, 7, 7));
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
        expect(result.messages.some((m) => m.includes("100"))).toBe(true);
      }
    });
  });

  describe("edge cases", () => {
    it("handles the last day of the year", () => {
      const result = evaluateBirthDate(utc(1990, 12, 31), utc(2025, 12, 31));
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("handles the first day of January", () => {
      const result = evaluateBirthDate(utc(1990, 1, 1), utc(2025, 1, 1));
      if (result.status === "ok") {
        expect(result.messages).toContain("Happy Birthday!");
      }
    });

    it("handles the day before a birthday — not a birthday", () => {
      const result = evaluateBirthDate(utc(1990, 7, 6), utc(2025, 7, 7));
      expect(result.status).toBe("ok");
    });

    it("handles the day after a birthday — age already incremented", () => {
      const result = evaluateBirthDate(utc(1990, 7, 8), utc(2025, 7, 7));
      if (result.status === "ok") {
        expect(result.age).toBe(34);
      }
    });
  });
});
