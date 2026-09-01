import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountMenu } from "./account-menu";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
afterEach(cleanup);

describe("AccountMenu", () => {
  it("shows account navigation and explicit sign out", () => {
    render(<AccountMenu user={{ email: "couple@example.com", id: "user-id" }} />);
    expect(screen.getByText("couple@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/account");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("shows only administration navigation to an owner", () => {
    render(<AccountMenu user={{ email: "owner@example.com", id: "owner-id", role: "owner" }} />);
    expect(screen.getByRole("link", { name: "Owner dashboard" })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: "Invitation templates" })).toHaveAttribute("href", "/admin/templates");
    expect(screen.queryByRole("link", { name: "My templates" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });
});
