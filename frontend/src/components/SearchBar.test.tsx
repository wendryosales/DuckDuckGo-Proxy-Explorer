import { fireEvent, render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import { SearchBar } from "./SearchBar";

// Mock next/navigation
const mockPush = vi.fn();
const mockUseSearchParams = vi.fn().mockReturnValue({
  get: () => null,
  toString: () => "",
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock Redux hooks
const mockDispatch = vi.fn();
vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: () => null,
      toString: () => "",
    });
  });

  it("should render successfully", () => {
    const { baseElement } = render(<SearchBar />);
    expect(baseElement).toBeTruthy();
  });

  it("should render search input and button", () => {
    render(<SearchBar />);

    expect(
      screen.getByPlaceholderText("Search DuckDuckGo...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search DuckDuckGo...");
    fireEvent.change(input, { target: { value: "test query" } });

    expect(input).toHaveValue("test query");
  });

  it("should perform search when form is submitted", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search DuckDuckGo...");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/search?q=test+query");
  });

  it("should not perform search if query is empty", () => {
    render(<SearchBar />);

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should initialize with URL query parameter", () => {
    mockUseSearchParams.mockReturnValue({
      get: (param: string) => (param === "q" ? "initial query" : null),
      toString: () => "q=initial+query",
    });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search DuckDuckGo...");
    expect(input).toHaveValue("initial query");
  });

  it("should handle page parameter from URL", () => {
    mockUseSearchParams.mockReturnValue({
      get: (param: string) => {
        if (param === "q") return "test query";
        if (param === "page") return "2";
        return null;
      },
      toString: () => "q=test+query&page=2",
    });

    render(<SearchBar />);
    expect(mockPush).toHaveBeenCalledWith("/search?q=test+query&page=2");
  });
});
