import { beforeEach, describe, expect, it, vi } from "vitest";

const signOut = vi.hoisted(() => vi.fn());
const deleteCookie = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { signOut } }) }));
vi.mock("next/headers", () => ({ cookies: async () => ({ delete: deleteCookie, getAll: () => [{ name: "sb-project-auth-token.0" }, { name: "unrelated" }] }) }));

import { POST } from "./route";

describe("POST /api/v1/auth/logout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("clears the local Supabase session", async () => {
    signOut.mockResolvedValue({ error: null });
    const response = await POST();
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(deleteCookie).toHaveBeenCalledWith("sb-project-auth-token.0");
    expect(response.status).toBe(204);
  });

  it("treats an already-missing session as signed out", async () => {
    signOut.mockResolvedValue({ error: { name: "AuthSessionMissingError" } });
    expect((await POST()).status).toBe(204);
  });

  it("still clears the local session when the provider reports a failure", async () => {
    signOut.mockResolvedValue({ error: { name: "AuthApiError" } });
    expect((await POST()).status).toBe(204);
    expect(deleteCookie).toHaveBeenCalledWith("sb-project-auth-token.0");
  });
});
