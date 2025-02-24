import {
  setHighlightPattern,
  setSelectedMatch,
} from "@/store/features/search/highlight/highlightSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import {
  calculateCurrentMatch,
  calculateTotalMatches,
  findMatches,
  getNextMatch,
} from "@/utils/highlight";
import { useEffect, useMemo } from "react";

export function useHighlight() {
  const { results } = useAppSelector((state) => state.searchResults);
  const { highlightPattern, selectedMatch } = useAppSelector(
    (state) => state.highlight
  );
  const dispatch = useAppDispatch();

  const matches = useMemo(
    () => findMatches(results, highlightPattern),
    [results, highlightPattern]
  );

  const totalMatches = useMemo(() => calculateTotalMatches(matches), [matches]);

  const currentMatchNumber = useMemo(
    () => calculateCurrentMatch(matches, selectedMatch, totalMatches),
    [matches, selectedMatch, totalMatches]
  );

  const navigateMatches = (direction: "next" | "prev") => {
    if (totalMatches === 0) return;

    const nextMatch = getNextMatch(direction, matches, selectedMatch);
    dispatch(setSelectedMatch(nextMatch));
    scrollToMatch(nextMatch.resultIndex);
  };

  const scrollToMatch = (resultIndex: number) => {
    const element = document.querySelector(
      `[data-result-index="${resultIndex}"]`
    );
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Reset when the term changes
  useEffect(() => {
    if (matches.length > 0) {
      dispatch(
        setSelectedMatch({
          resultIndex: matches[0].resultIndex,
          matchIndex: 0,
        })
      );
    }
  }, [highlightPattern, matches, dispatch]);

  return {
    highlightPattern,
    totalMatches,
    currentMatchNumber,
    navigateMatches,
    setHighlightPattern: (pattern: string) =>
      dispatch(setHighlightPattern(pattern)),
  };
}
