import { describe, expect, it } from "vitest";
import {
  calculateCurrentMatch,
  calculateTotalMatches,
  findMatches,
  getNextMatch,
} from "./highlight";

describe("highlight utils", () => {
  describe("findMatches", () => {
    const searchResults = [
      { title: "Title one", url: "", category: "" },
      { title: "Title two", url: "", category: "" },
      { title: "Title three", url: "", category: "" },
    ];

    it("returns empty array when no search term", () => {
      const result = findMatches(searchResults, "");
      expect(result).toEqual([]);
    });

    it("finds 'one' word in titles", () => {
      const result = findMatches(searchResults, "one");

      expect(result).toHaveLength(1);
      expect(result[0].count).toBe(1);
    });

    it("counts when 'one' appears twice", () => {
      const results = [
        { title: "Title one one", url: "", category: "" },
        { title: "Title one two", url: "", category: "" },
      ];

      const result = findMatches(results, "one");

      expect(result[0].count).toBe(2);
      expect(result[0].resultIndex).toBe(0);
    });
  });

  describe("calculateTotalMatches", () => {
    it("sums total matches", () => {
      const matches = [
        { resultIndex: 0, count: 2 }, // Term appears 2x
        { resultIndex: 1, count: 1 }, // Term appears 1x
        { resultIndex: 2, count: 1 }, // Term appears 1x
      ];

      const total = calculateTotalMatches(matches);

      expect(total).toBe(4);
    });
  });

  describe("calculateCurrentMatch", () => {
    const matches = [
      { resultIndex: 0, count: 2 }, // Term appears 2x
      { resultIndex: 1, count: 1 }, // Term appears 1x
      { resultIndex: 2, count: 1 }, // Term appears 1x
    ];

    it("calculates correct match position", () => {
      // First "Term" from first result
      let position = calculateCurrentMatch(
        matches,
        { resultIndex: 0, matchIndex: 0 },
        4
      );
      expect(position).toBe(1);

      // Second "Term" from first result
      position = calculateCurrentMatch(
        matches,
        { resultIndex: 0, matchIndex: 1 },
        3
      );
      expect(position).toBe(2);

      // First "Term" from second result
      position = calculateCurrentMatch(
        matches,
        { resultIndex: 1, matchIndex: 0 },
        3
      );
      expect(position).toBe(3);
    });

    it("returns 0 when no matches", () => {
      const position = calculateCurrentMatch(
        matches,
        {
          resultIndex: 0,
          matchIndex: 0,
        },
        0
      );
      expect(position).toBe(0);
    });
  });

  describe("getNextMatch", () => {
    const matches = [
      { resultIndex: 0, count: 2 }, // "Term" appears 2x
      { resultIndex: 1, count: 1 }, // "Term" appears 1x
      { resultIndex: 3, count: 1 }, // "Term" appears 1x (notice the gap in resultIndex)
    ];

    it("navigates forward", () => {
      const current = { resultIndex: 0, matchIndex: 0 };

      const next = getNextMatch("next", matches, current);

      expect(next).toEqual({ resultIndex: 0, matchIndex: 1 });
    });

    it("wraps to start when reaching the end", () => {
      const last = { resultIndex: 3, matchIndex: 0 };

      const next = getNextMatch("next", matches, last);

      expect(next).toEqual({ resultIndex: 0, matchIndex: 0 });
    });

    it("navigates to next result", () => {
      const current = { resultIndex: 0, matchIndex: 1 };

      const next = getNextMatch("next", matches, current);

      expect(next).toEqual({ resultIndex: 1, matchIndex: 0 });
    });

    it("skips gaps between results", () => {
      const current = { resultIndex: 1, matchIndex: 0 };

      const next = getNextMatch("next", matches, current);

      expect(next).toEqual({ resultIndex: 3, matchIndex: 0 });
    });

    it("navigates backward", () => {
      const current = { resultIndex: 0, matchIndex: 1 };

      const previous = getNextMatch("prev", matches, current);

      expect(previous).toEqual({ resultIndex: 0, matchIndex: 0 });
    });

    it("moves to last match of previous result when going backward", () => {
      const current = { resultIndex: 3, matchIndex: 0 };

      const previous = getNextMatch("prev", matches, current);

      expect(previous).toEqual({ resultIndex: 1, matchIndex: 0 });
    });

    it("wraps to last result when going backward from start", () => {
      const first = { resultIndex: 0, matchIndex: 0 };

      const previous = getNextMatch("prev", matches, first);

      expect(previous).toEqual({ resultIndex: 3, matchIndex: 0 });
    });
  });
});
