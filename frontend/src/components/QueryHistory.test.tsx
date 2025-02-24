import { fireEvent, render, screen } from "@/test/test-utils";
import { vi } from "vitest";
import { QueryHistory } from "./QueryHistory";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Redux hooks
const mockDispatch = vi.fn();
vi.mock("@/store/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({
    searchHistory: ["react", "typescript", "nextjs"],
  }),
}));

describe("QueryHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders successfully", () => {
    const { baseElement } = render(<QueryHistory />);
    expect(baseElement).toBeTruthy();
  });

  it("renders the title correctly", () => {
    render(<QueryHistory />);
    expect(screen.getByText("Search History")).toBeInTheDocument();
  });

  it("renders all history items with search icons", () => {
    render(<QueryHistory />);

    const historyItems = screen.getAllByRole("button");
    expect(historyItems).toHaveLength(3);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });

  it("dispatches actions and navigates when clicking a history item", () => {
    render(<QueryHistory />);

    const firstHistoryItem = screen.getByText("react");
    fireEvent.click(firstHistoryItem);

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining("setSearchTerm"),
        payload: "react",
      })
    );

    expect(mockPush).toHaveBeenCalledWith("/search?q=react");
  });

  it("fetches history on mount", () => {
    render(<QueryHistory />);

    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });
});
