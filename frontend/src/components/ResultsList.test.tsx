import { render, screen } from "@/test/test-utils";
import { describe, expect, it } from "vitest";
import { ResultsList } from "./ResultsList";

interface MockState {
  searchResults: {
    results: Array<{
      title: string;
      url: string;
      category?: string;
    }>;
    isLoading: boolean;
    error: string | null;
    currentQuery: string;
    meta: null;
    searchHistory: string[];
  };
  highlight: {
    highlightPattern: string;
    selectedMatch: {
      resultIndex: number;
      matchIndex: number;
    };
  };
}

const createMockState = (overrides: Partial<MockState> = {}): MockState => ({
  searchResults: {
    results: [],
    isLoading: false,
    error: null,
    currentQuery: "",
    meta: null,
    searchHistory: [],
    ...overrides.searchResults,
  },
  highlight: {
    highlightPattern: "",
    selectedMatch: {
      resultIndex: 0,
      matchIndex: 0,
    },
    ...overrides.highlight,
  },
});

describe("ResultsList", () => {
  describe("createSingleChunk", () => {
    it("should create a non-highlighted chunk from title", () => {
      render(<ResultsList />, {
        preloadedState: {
          searchResults: {
            results: [{ title: "Test Title", url: "https://test.com" }],
            isLoading: false,
            error: null,
            currentQuery: "",
            meta: null,
            searchHistory: [],
          },
          highlight: {
            highlightPattern: "",
            selectedMatch: {
              resultIndex: 0,
              matchIndex: 0,
            },
          },
        },
      });

      const heading = screen.getByRole("heading");
      const span = heading.querySelector("span");

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("Test Title");
      expect(span).not.toHaveAttribute("class");
    });
  });

  it("should show loading skeletons when loading", () => {
    render(<ResultsList />, {
      preloadedState: {
        searchResults: {
          results: [],
          isLoading: true,
          error: null,
          currentQuery: "",
          meta: null,
          searchHistory: [],
        },
        highlight: {
          highlightPattern: "",
          selectedMatch: {
            resultIndex: 0,
            matchIndex: 0,
          },
        },
      },
    });

    const skeletons = screen.getAllByTestId("loading-skeleton");
    expect(skeletons).toHaveLength(7);
  });

  it("should show error message when there is an error", () => {
    const errorMessage = "Something went wrong";
    render(<ResultsList />, {
      preloadedState: {
        searchResults: {
          error: errorMessage,
          isLoading: false,
          results: [],
          currentQuery: "",
          meta: null,
          searchHistory: [],
        },
        highlight: {
          highlightPattern: "",
          selectedMatch: {
            resultIndex: 0,
            matchIndex: 0,
          },
        },
      },
    });

    expect(
      screen.getByText(/error: something went wrong/i)
    ).toBeInTheDocument();
  });

  it("should show no results message when there are no results", () => {
    render(<ResultsList />, {
      preloadedState: createMockState({
        searchResults: {
          results: [],
          isLoading: false,
          error: null,
          currentQuery: "test",
          meta: null,
          searchHistory: [],
        },
      }),
    });

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("should render results with correct attributes", () => {
    const mockResults = [
      { title: "Test Result", url: "https://test.com", category: "Test" },
    ];

    render(<ResultsList />, {
      preloadedState: {
        searchResults: {
          results: mockResults,
          isLoading: false,
          error: null,
          currentQuery: "test",
          meta: null,
          searchHistory: [],
        },
        highlight: {
          highlightPattern: "test",
          selectedMatch: {
            resultIndex: 0,
            matchIndex: 0,
          },
        },
      },
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://test.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    // Check for both parts of the title separately
    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent(/test.*result/i);

    expect(screen.getByText(/in test/i)).toBeInTheDocument();
  });

  it("should highlight matching text", () => {
    render(<ResultsList />, {
      preloadedState: {
        searchResults: {
          results: [{ title: "Test Result", url: "https://test.com" }],
          isLoading: false,
          error: null,
          currentQuery: "test",
          meta: null,
          searchHistory: [],
        },
        highlight: {
          highlightPattern: "test",
          selectedMatch: {
            resultIndex: 0,
            matchIndex: 0,
          },
        },
      },
    });

    const highlightedText = screen.getByText("Test");
    expect(highlightedText).toHaveClass("search-highlight");
    expect(highlightedText).toHaveClass("ring-2");
    expect(highlightedText).toHaveClass("ring-purple-500/50");
  });
});
