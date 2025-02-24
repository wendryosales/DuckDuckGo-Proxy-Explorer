import { HighlightPosition } from "@/store/features/search/highlight/types";
import { SearchResult } from "@/store/features/search/searchResults/types";

interface Match {
  resultIndex: number;
  count: number;
}

export function findMatches(results: SearchResult[], pattern: string): Match[] {
  if (!pattern) return [];

  return results.reduce((acc, result, resultIndex) => {
    const regex = new RegExp(pattern, "gi");
    const titleMatches = [...result.title.matchAll(regex)];

    if (titleMatches.length > 0) {
      acc.push({
        resultIndex,
        count: titleMatches.length,
      });
    }
    return acc;
  }, [] as Match[]);
}

export function calculateTotalMatches(matches: Match[]): number {
  return matches.reduce((total, { count }) => total + count, 0);
}

/**
 * Calculates the current match position (1-based)
 * Sums all matches from previous results + the position in the current result
 */
export function calculateCurrentMatch(
  matches: Match[],
  selectedMatch: HighlightPosition,
  totalMatches: number
): number {
  if (totalMatches === 0) return 0;

  return matches.reduce((count, match) => {
    if (match.resultIndex < selectedMatch.resultIndex) {
      return count + match.count;
    }
    if (match.resultIndex === selectedMatch.resultIndex) {
      return count + selectedMatch.matchIndex + 1;
    }
    return count;
  }, 0);
}

/**
 * Determines the next match based on the navigation direction
 *
 * Navigation rules:
 * 1. Next match in the same result
 * 2. First match of the next result
 * 3. Go to the beginning if on the last
 * 4. Previous match in the same result
 * 5. Last match of the previous result
 * 6. Go to the last of all if on the first
 */
export function getNextMatch(
  direction: "next" | "prev",
  matches: Match[],
  selectedMatch: HighlightPosition
): HighlightPosition {
  const currentMatch = matches.find(
    (match) => match.resultIndex === selectedMatch.resultIndex
  );

  if (direction === "next") {
    // Next match in the same result
    if (currentMatch && selectedMatch.matchIndex < currentMatch.count - 1) {
      return {
        ...selectedMatch,
        matchIndex: selectedMatch.matchIndex + 1,
      };
    }

    // First match of the next result or go to the beginning
    const nextResultIndex = matches.findIndex(
      (match) => match.resultIndex > selectedMatch.resultIndex
    );
    return {
      resultIndex:
        nextResultIndex !== -1
          ? matches[nextResultIndex].resultIndex
          : matches[0].resultIndex,
      matchIndex: 0,
    };
  }

  // Previous match in the same result
  if (selectedMatch.matchIndex > 0) {
    return {
      ...selectedMatch,
      matchIndex: selectedMatch.matchIndex - 1,
    };
  }

  // Last match of the previous result
  const prevMatch = [...matches]
    .reverse()
    .find((match) => match.resultIndex < selectedMatch.resultIndex);

  if (prevMatch) {
    return {
      resultIndex: prevMatch.resultIndex,
      matchIndex: prevMatch.count - 1,
    };
  }

  // Go to the last match of all
  const lastMatch = matches[matches.length - 1];
  return {
    resultIndex: lastMatch.resultIndex,
    matchIndex: lastMatch.count - 1,
  };
}
