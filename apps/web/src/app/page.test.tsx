import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("homepage", () => {
  it("presents the core promise and planning areas", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: /plan beautifully.*celebrate fully/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Guests, gathered" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Budget, balanced" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /start planning/i }).length).toBeGreaterThan(0);
  });
});
