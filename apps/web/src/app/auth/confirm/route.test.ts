import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ exchange: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { exchangeCodeForSession: mocks.exchange, verifyOtp: mocks.verify } }) }));

import { GET } from "./route";

describe("auth confirmation callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a callback without a token", async () => {
    const response = await GET(new Request("http://localhost:3000/auth/confirm"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=confirmation");
  });

  it("exchanges a PKCE recovery code and keeps the safe destination", async () => {
    mocks.exchange.mockResolvedValue({ error: null });
    const response = await GET(new Request("http://localhost:3000/auth/confirm?code=abc&next=%2Fadmin%2Freset-password"));
    expect(mocks.exchange).toHaveBeenCalledWith("abc");
    expect(response.headers.get("location")).toBe("http://localhost:3000/admin/reset-password");
  });

  it("verifies an email token and rejects external destinations", async () => {
    mocks.verify.mockResolvedValue({ error: null });
    const response = await GET(new Request("http://localhost:3000/auth/confirm?token_hash=hash&type=signup&next=https%3A%2F%2Fevil.example"));
    expect(mocks.verify).toHaveBeenCalledWith({ token_hash: "hash", type: "signup" });
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("returns failed owner recovery to owner login", async () => {
    mocks.exchange.mockResolvedValue({ error: new Error("expired") });
    const response = await GET(new Request("http://localhost:3000/auth/confirm?code=bad&next=%2Fadmin%2Freset-password"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/admin/login?error=recovery");
  });
});
