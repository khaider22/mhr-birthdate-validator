import { parseDate, validateBirthDate } from "../src/birthdate-validator";

//Parse Date
describe("ParseDate", () => {
  describe("valid dates", () => {
    it("returns a Date for standard date", () => {
      expect(parseDate("1990/07/07")).toBeInstanceOf(Date);
    });

    it("returns a UTC midnight date - hours are zero", () => {
      const result = parseDate("1990/07/07")!;
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
    });

    it("parses year, month and day correctly", () => {
      const result = parseDate("1990/07/07");
      expect(result?.getUTCFullYear()).toBe(1990);
      expect(result?.getUTCMonth()).toBe(6);
      expect(result?.getUTCDate()).toBe(7);
    });

    it("accepts Feb 29 in a leap year", () => {
      const result = parseDate("2000/02/29");
      expect(result).not.toBe(null);
    });

    it("accepts Feb 28 in non leap year", () => {
      const result = parseDate("2001/02/28");
      expect(result).not.toBe(null);
    });

    it("accepts last day of December", () => {
      const result = parseDate("2020/12/31");
      expect(result).not.toBe(null);
    });

    it("accepts first day of January", () => {
      const result = parseDate("2021/01/01");
      expect(result).not.toBe(null);
    });

    it("accepts future date", () => {
      const result = parseDate("2050/10/22");
      expect(result).not.toBe(null);
    });
  });

  describe("invalid fomat should return null", () => {
    it("returns null for DD/MM/YYYY format", () => {
      const result = parseDate("07/07/1990");
      expect(result).toBe(null);
    });

    it("returns null for YYYY-MM-DD format", () => {
      const result = parseDate("2022-05-16");
      expect(result).toBe(null);
    });

    it("returns null for missing leading zeroes in month and date", () => {
      const result = parseDate("2015/8/8");
      expect(result).toBe(null);
    });

    it("returns null for negative year", () => {
      const result = parseDate("-2026/03/28");
      expect(result).toBe(null);
    });

    it("returns null for plain text", () => {
      expect(parseDate("invalid")).toBe(null);
    });

    it("return null for partial date", () => {
      expect(parseDate("2019/09")).toBe(null);
    });

    it("returns null for date with characters", () => {
      expect(parseDate("2019/09/19th")).toBe(null);
    });

    it("returns null for empty input", () => {
      expect(parseDate("")).toBe(null);
    });

    it("returns null for white spaces", () => {
      expect(parseDate(" ")).toBe(null);
    });
  });

  describe("calendar failures should return null", () => {
    it("returns null for Feb 29 in non leap year", () => {
      expect(parseDate("2025/02/29")).toBe(null);
    });

    it("returns null for feb 30 in leap year", () => {
      expect(parseDate("2024/02/30")).toBe(null);
    });

    it("returns null for December 32nd", () => {
      expect(parseDate("2025/12/32")).toBe(null);
    });

    it("returns null for date 00", () => {
      expect(parseDate("2025/12/00")).toBe(null);
    });

    it("returns null for month 00", () => {
      expect(parseDate("2025/00/31")).toBe(null);
    });

    it("returns null for month 13th", () => {
      expect(parseDate("2025/13/01")).toBe(null);
    });
  });

  // validateBirthDate
  describe("validateBirthdate", () => {
    describe("valid input", () => {
      it("return isValid true for correct date formar", () => {
        const result = validateBirthDate("2015/08/08");
        expect(result.isValid).toBe(true);
        if (result.isValid) {
          expect(result.date).toBeInstanceOf(Date);
        }
      });

      it("trims surrounding white spaces before validating birthdate", () => {
        const result = validateBirthDate(" 2019/09/19 ");
        expect(result.isValid).toBe(true);
      });

      it("accepts Feb 29 in a leap year", () => {
        const result = validateBirthDate("2024/02/29");
        expect(result.isValid).toBe(true);
      });
    });

    describe("empty input", () => {
      it("returns isValid false for empty input", () => {
        const result = validateBirthDate("");
        expect(result.isValid).toBe(false);
      });

      it("returns appropriate error message for empty string", () => {
        const result = validateBirthDate("");
        if (!result.isValid) {
          expect(result.errorMessage).toContain("No Date entered");
        }
      });

      it("returns isValid false for white spaced only", () => {
        const result = validateBirthDate("  ");
        expect(result.isValid).toBe(false);
      });
    });

    describe("wrong format", () => {
      it("returns isValid false for dashes in date", () => {
        const result = validateBirthDate("2022-05-16");
        expect(result.isValid).toBe(false);
      });

      it("returns an invalid format message", () => {
        const result = validateBirthDate("16/05/2022");
        expect(result.isValid).toBe(false);
        if (!result.isValid) {
          expect(result.errorMessage).toContain("Invalid format");
        }
      });

      it("returns non existent date error message for invalid date input", () => {
        const result = validateBirthDate("not-a-date");
        if (!result.isValid) {
          expect(result.errorMessage).toContain("not-a-date");
        }
      });
    });

    describe("impossible calendar date", () => {
      it("returns isValid false for Feb 29 in non-leap year", () => {
        const result = validateBirthDate("2023/02/29");
        expect(result.isValid).toBe(false);
      });

      it("returns non-existent date error message for Feb 29 in non-leap year", () => {
        const result = validateBirthDate("2023/02/29");
        if (!result.isValid) {
          expect(result.errorMessage).toContain("Non-existent date");
        }
      });

      it("returns isValid to be false for december 32nd", () => {
        const result = validateBirthDate("2025/12/32");
        expect(result.isValid).toBe(false);
      });
    });
  });
});
