import highlightReducer from "@/store/features/search/highlight/highlightSlice";
import searchResultsReducer from "@/store/features/search/searchResults/searchResultsSlice";
import * as highlightUtils from "@/utils/highlight";
import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { useHighlight } from "./useHighlight";

// Mock highlight utils
const mockMatches = [{ resultIndex: 0, count: 2 }];

vi.mock("@/utils/highlight", () => ({
  findMatches: vi.fn(() => mockMatches),
  calculateTotalMatches: vi.fn(() => 2),
  calculateCurrentMatch: vi.fn(() => 1),
  getNextMatch: vi.fn(() => ({ resultIndex: 0, matchIndex: 1 })),
}));

describe("useHighlight", () => {
  const createWrapper = () => {
    const store = configureStore({
      reducer: {
        searchResults: searchResultsReducer,
        highlight: highlightReducer,
      },
      preloadedState: {
        searchResults: {
          results: [{ title: "test test", url: "", category: "" }],
          meta: null,
          isLoading: false,
          error: null,
          searchHistory: [],
          currentQuery: "",
        },
        highlight: {
          searchTerm: "",
          highlightPattern: "test",
          selectedMatch: { resultIndex: 0, matchIndex: 0 },
        },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  it("calls highlight utils with correct parameters", () => {
    const { result } = renderHook(() => useHighlight(), {
      wrapper: createWrapper(),
    });

    // Initial calls
    expect(highlightUtils.findMatches).toHaveBeenCalledWith(
      expect.any(Array),
      "test"
    );
    expect(highlightUtils.calculateTotalMatches).toHaveBeenCalledWith(
      mockMatches
    );
    expect(highlightUtils.calculateCurrentMatch).toHaveBeenCalledWith(
      mockMatches,
      { resultIndex: 0, matchIndex: 0 },
      2
    );

    // Navigate to next match
    act(() => {
      result.current.navigateMatches("next");
    });

    expect(highlightUtils.getNextMatch).toHaveBeenCalledWith(
      "next",
      mockMatches,
      { resultIndex: 0, matchIndex: 0 }
    );
  });
});
