import { useHighlight } from "@/hooks/useHighlight";
import { fireEvent, render, screen } from "@/test/test-utils";
import { Mock, vi } from "vitest";
import { HighlightSearch } from "./HighlightSearch";

const mockNavigate = vi.fn();
const mockSetPattern = vi.fn();

const defaultMockState = {
  highlightPattern: "test",
  totalMatches: 2,
  currentMatchNumber: 1,
  navigateMatches: mockNavigate,
  setHighlightPattern: mockSetPattern,
};

// Mock the hook
vi.mock("@/hooks/useHighlight", () => ({
  useHighlight: vi.fn(() => defaultMockState),
}));

describe("HighlightSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useHighlight as Mock).mockImplementation(() => defaultMockState);
  });

  it("renders correctly", () => {
    render(<HighlightSearch />);

    expect(
      screen.getByPlaceholderText("Highlight text...")
    ).toBeInTheDocument();
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("shows navigation buttons", () => {
    render(<HighlightSearch />);

    const prevButton = screen.getByLabelText("Go to previous match");
    const nextButton = screen.getByLabelText("Go to next match");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("shows no matches when total is 0", () => {
    (useHighlight as Mock).mockImplementation(() => ({
      ...defaultMockState,
      totalMatches: 0,
      currentMatchNumber: 0,
    }));

    render(<HighlightSearch />);

    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("calls navigateMatches when clicking next", () => {
    render(<HighlightSearch />);

    const nextButton = screen.getByLabelText("Go to next match");
    fireEvent.click(nextButton);

    expect(mockNavigate).toHaveBeenCalledWith("next");
  });

  it("calls navigateMatches when clicking previous", () => {
    render(<HighlightSearch />);

    const prevButton = screen.getByLabelText("Go to previous match");
    fireEvent.click(prevButton);

    expect(mockNavigate).toHaveBeenCalledWith("prev");
  });

  it("updates pattern when typing", () => {
    render(<HighlightSearch />);

    fireEvent.change(screen.getByPlaceholderText("Highlight text..."), {
      target: { value: "new" },
    });

    expect(mockSetPattern).toHaveBeenCalledWith("new");
  });

  it("disables navigation buttons when no matches", () => {
    (useHighlight as Mock).mockImplementation(() => ({
      ...defaultMockState,
      totalMatches: 0,
      currentMatchNumber: 0,
    }));

    render(<HighlightSearch />);

    const prevButton = screen.getByLabelText("Go to previous match");
    const nextButton = screen.getByLabelText("Go to next match");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
