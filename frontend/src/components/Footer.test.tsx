import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeTruthy();
  });

  it("should display the correct text content", () => {
    render(<Footer />);
    expect(screen.getByText(/search results powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/developed by/i)).toBeInTheDocument();
    expect(screen.getByText("Wendryo Sales")).toBeInTheDocument();
  });

  it("should have correct links with attributes", () => {
    render(<Footer />);

    const duckduckgoLink = screen.getByRole("link", { name: /duckduckgo/i });
    const authorLink = screen.getByRole("link", { name: "Wendryo Sales" });

    [duckduckgoLink, authorLink].forEach((link) => {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    expect(duckduckgoLink).toHaveAttribute("href", "https://duckduckgo.com");
    expect(authorLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/wendryosales/"
    );
  });
});
