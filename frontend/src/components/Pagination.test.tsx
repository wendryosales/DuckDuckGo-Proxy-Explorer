import { createEvent, fireEvent, render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import { PaginationComponent } from "./Pagination";

// Mock next/navigation
const mockPush = vi.fn();
const mockSearchParams = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    toString: () => mockSearchParams(),
    get: vi.fn(),
  }),
}));

// Mock Redux hooks
const mockUseAppSelector = vi.fn();
vi.mock("@/store/hooks/redux", () => ({
  useAppSelector: () => mockUseAppSelector(),
}));

// Mock state helper
const createMockState = (overrides = {}) => ({
  meta: {
    currentPage: 1,
    lastPage: 5,
    prev: null,
    next: 2,
    ...overrides,
  },
});

describe("PaginationComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.mockReturnValue("q=test");
    mockUseAppSelector.mockReturnValue(createMockState());
  });

  it("should not render when meta is null", () => {
    mockUseAppSelector.mockReturnValue({ meta: null });
    const { container } = render(<PaginationComponent />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render pagination with correct number of pages", () => {
    render(<PaginationComponent />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should highlight current page", () => {
    render(<PaginationComponent />);

    const currentPageLink = screen.getByText("1").closest("a");
    expect(currentPageLink).toHaveAttribute("aria-current", "page");
  });

  it("should handle next page navigation", () => {
    render(<PaginationComponent />);

    const nextButton = screen.getByRole("link", { name: /next/i });
    fireEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith("/search?q=test&page=2");
  });

  it("should handle previous page navigation", () => {
    mockUseAppSelector.mockReturnValue(
      createMockState({ currentPage: 2, prev: 1 })
    );

    render(<PaginationComponent />);

    const prevButton = screen.getByRole("link", { name: /previous/i });
    fireEvent.click(prevButton);

    expect(mockPush).toHaveBeenCalledWith("/search?q=test&page=1");
  });

  it("should show ellipsis for many pages", () => {
    mockUseAppSelector.mockReturnValue(
      createMockState({ currentPage: 5, lastPage: 10 })
    );

    render(<PaginationComponent />);

    const ellipses = screen.getAllByLabelText("More pages");
    expect(ellipses).toHaveLength(2);
  });

  it("should not show prev button on first page", () => {
    render(<PaginationComponent />);

    const prevButton = screen.queryByRole("link", { name: /previous/i });
    expect(prevButton).not.toBeInTheDocument();
  });

  it("should not show next button on last page", () => {
    mockUseAppSelector.mockReturnValue(
      createMockState({ currentPage: 5, lastPage: 5, next: null })
    );

    render(<PaginationComponent />);

    const nextButton = screen.queryByRole("link", { name: /next/i });
    expect(nextButton).not.toBeInTheDocument();
  });

  it("should handle page click", () => {
    render(<PaginationComponent />);

    const pageThreeLink = screen.getByText("3");
    fireEvent.click(pageThreeLink);

    expect(mockPush).toHaveBeenCalledWith("/search?q=test&page=3");
  });

  it("should prevent default on link clicks", async () => {
    render(<PaginationComponent />);

    const pageLink = screen.getByText("2").closest("a");
    expect(pageLink).toBeInTheDocument();

    const mockEvent = createEvent.click(pageLink!);
    Object.defineProperty(mockEvent, "preventDefault", { value: vi.fn() });

    fireEvent(pageLink!, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
