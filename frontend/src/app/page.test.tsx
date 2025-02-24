import { render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import Home from "./page";

// Required for testing
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// SearchBar
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    toString: () => "",
  }),
}));

// redux
vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => vi.fn(),
}));

// next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("Home", () => {
  it("should render the complete page with all components", () => {
    render(<Home />);

    expect(screen.getByAltText("Duck Search Logo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /duck search/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your friendly search companion/i)
    ).toBeInTheDocument();

    // SearchBar
    expect(
      screen.getByPlaceholderText("Search DuckDuckGo...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();

    // ThemeToggle
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/search results powered by/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /duckduckgo/i })
    ).toBeInTheDocument();
  });

  it("should maintain correct layout structure", () => {
    render(<Home />);

    const themeToggle = screen.getByRole("button", { name: /toggle theme/i });
    const logo = screen.getByAltText("Duck Search Logo");
    const title = screen.getByRole("heading", { name: /duck search/i });
    const subtitle = screen.getByText(/your friendly search companion/i);
    const searchBar = screen.getByPlaceholderText("Search DuckDuckGo...");
    const footer = screen.getByRole("contentinfo");

    [themeToggle, logo, title, subtitle, searchBar, footer].forEach(
      (element) => {
        expect(element).toBeInTheDocument();
      }
    );

    // Order
    expect(logo.compareDocumentPosition(title)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(title.compareDocumentPosition(subtitle)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(subtitle.compareDocumentPosition(searchBar)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(searchBar.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it("should have correct image attributes for the logo", () => {
    render(<Home />);

    const logo = screen.getByAltText("Duck Search Logo");
    expect(logo).toHaveAttribute("src", "/duck-logo.svg");
    expect(logo).toHaveAttribute("width", "80");
    expect(logo).toHaveAttribute("height", "80");
    expect(logo).toHaveAttribute("alt", "Duck Search Logo");
  });

  it("should have interactive elements working", () => {
    render(<Home />);

    // SearchBar
    const searchInput = screen.getByPlaceholderText("Search DuckDuckGo...");
    expect(searchInput).toBeEnabled();
    expect(searchInput).toHaveAttribute("type", "text");

    // SearchBar Button
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeEnabled();
    expect(searchButton).toHaveAttribute("type", "submit");

    // ThemeToggle
    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toBeEnabled();

    // Footer Link
    const duckduckgoLink = screen.getByRole("link", { name: /duckduckgo/i });
    expect(duckduckgoLink).toHaveAttribute("href", "https://duckduckgo.com");
    expect(duckduckgoLink).toHaveAttribute("target", "_blank");
    expect(duckduckgoLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
