import { render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import { Header } from "./Header";

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
vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => vi.fn(),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("Header", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();
  });

  it("should have correct semantic structure", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const nav = header.querySelector("nav");
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /duck search/i });
    expect(homeLink).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();

    expect(header).toContainElement(nav);
    expect(nav).toContainElement(homeLink);
    expect(nav).toContainElement(searchButton);
    expect(nav).toContainElement(themeButton);
  });

  it("should have accessible navigation elements", () => {
    render(<Header />);

    // Logo and branding
    const logo = screen.getByAltText("Duck Search Logo");
    expect(logo).toHaveAttribute("alt", "Duck Search Logo");
    expect(logo).toHaveAttribute("src", "/duck-logo.svg");

    // Home link
    const homeLink = screen.getByRole("link", { name: /duck search/i });
    expect(homeLink).toHaveAttribute("href", "/");

    // Search functionality
    const searchInput = screen.getByPlaceholderText("Search DuckDuckGo...");
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toBeEnabled();

    // Theme toggle
    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toBeEnabled();
  });

  it("should maintain correct content hierarchy", () => {
    render(<Header />);

    const logo = screen.getByAltText("Duck Search Logo");
    const title = screen.getByText("Duck Search");
    const searchInput = screen.getByPlaceholderText("Search DuckDuckGo...");
    const themeToggle = screen.getByRole("button", { name: /toggle theme/i });

    expect(logo.compareDocumentPosition(title)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(title.compareDocumentPosition(searchInput)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(searchInput.compareDocumentPosition(themeToggle)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
});
