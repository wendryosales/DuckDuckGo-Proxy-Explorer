import { render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import SearchPage from "./page";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    toString: () => "",
  }),
}));

// Mock redux hooks
vi.mock("@/store/hooks/redux", () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: any) => {
    // Mock the Redux state
    const state = {
      searchResults: {
        results: [],
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
    };
    return selector(state);
  },
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("SearchPage", () => {
  it("should render the complete page with all components", () => {
    render(<SearchPage />);

    // Header
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByAltText("Duck Search Logo")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search DuckDuckGo...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();

    // Main content area
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("container");

    // Highlight search component
    expect(
      screen.getByPlaceholderText("Highlight text...")
    ).toBeInTheDocument();

    // Results list (empty state)
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();

    // Query history sidebar
    expect(screen.getByText("Search History")).toBeInTheDocument();

    // Footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText(/search results powered by/i)).toBeInTheDocument();
  });

  it("should maintain correct layout structure", () => {
    render(<SearchPage />);

    const header = screen.getByRole("banner");
    const main = screen.getByRole("main");
    const footer = screen.getByRole("contentinfo");

    // Verify layout order
    expect(header.compareDocumentPosition(main)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(main.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    // Verify main content structure
    expect(main).toContainElement(
      screen.getByPlaceholderText("Highlight text...")
    );
    expect(main).toContainElement(screen.getByText(/no results found/i));
    expect(main).toContainElement(screen.getByText("Search History"));
  });

  it("should have sticky header and highlight search", () => {
    render(<SearchPage />);

    // Header should be sticky at the top
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");

    // The highlight search container should be sticky below the header
    const highlightContainer = screen
      .getByPlaceholderText("Highlight text...")
      .closest("div[class*='sticky']");
    expect(highlightContainer).toHaveClass("sticky");
    expect(highlightContainer).toHaveClass("top-20");
    expect(highlightContainer).toHaveClass("bg-background/95");
  });

  it("should have responsive sidebar", () => {
    render(<SearchPage />);

    const sidebar = screen.getByText("Search History").closest("aside");
    expect(sidebar).toHaveClass("hidden", "lg:block");
  });
});
