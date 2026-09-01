import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthForm } from "./auth-form";

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

describe("AuthForm", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("uses the private owner endpoint and hides registration", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ user: { id: "owner-1" } }), { status: 200 }));
    render(<AuthForm mode="login" nextPath="/admin" variant="admin" />);
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/v1/admin/login", expect.objectContaining({ method: "POST" })));
    expect(router.push).toHaveBeenCalledWith("/admin");
    expect(screen.queryByRole("link", { name: "Create an account" })).not.toBeInTheDocument();
  });

  it("shows server authentication errors", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: { message: "Email or password is incorrect" } }), { status: 401 }));
    render(<AuthForm mode="login" />);
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect");
  });
});
