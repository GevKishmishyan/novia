import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvitationsPage from "./page";

describe("invitation templates", () => {
  it("offers original templates as the first planning step", async () => {
    render(await InvitationsPage());
    expect(screen.getByRole("heading", { level: 1, name: "Choose the feeling of your day." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evergreen vows" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Garden letter" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Romantic" }));
    expect(screen.getByText("Showing 1 template")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Evergreen vows" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    fireEvent.click(screen.getByRole("button", { name: /Evergreen vows/i }));
    expect(screen.getByRole("dialog", { name: "Evergreen vows invitation preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desktop view" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Mobile view" }));
    expect(screen.getByRole("button", { name: "Mobile view" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /Customize this template/i })).toHaveAttribute("href", "/invitations/evergreen-vows/customize");
    fireEvent.click(screen.getByRole("button", { name: "Close preview" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
