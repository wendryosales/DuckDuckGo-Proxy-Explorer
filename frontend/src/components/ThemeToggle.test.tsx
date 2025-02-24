"use client";

import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockTheme = "light";
    mockSetTheme.mockClear();
  });

  it("should render successfully", () => {
    const { baseElement } = render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it("should have the correct aria-label", () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeTruthy();
  });

  it("should toggle theme when clicked", async () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await button.click();

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("should display correct icon based on theme", () => {
    const { rerender } = render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );

    // light theme
    const sunIcon = screen.getByTestId("sun-icon");
    const moonIcon = screen.getByTestId("moon-icon");
    expect(sunIcon).toHaveClass("rotate-0");
    expect(moonIcon).toHaveClass("rotate-90");

    // change to dark theme
    mockTheme = "dark";
    rerender(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(sunIcon).toHaveClass("dark:-rotate-90");
    expect(moonIcon).toHaveClass("dark:rotate-0");
  });
});
