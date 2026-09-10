import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PasswordRecoveryForm } from "./password-recovery-form";

describe("PasswordRecoveryForm", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("confirms when the private recovery link is sent", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ sent: true }), { status: 200 }));
    render(<PasswordRecoveryForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send private recovery link" }));
    expect(await screen.findByText("Check your inbox")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/v1/admin/password-recovery", { method: "POST" });
  });

  it("shows a delivery failure", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: { message: "Try again later" } }), { status: 500 }));
    render(<PasswordRecoveryForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send private recovery link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Try again later");
  });
});
