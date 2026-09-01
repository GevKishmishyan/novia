import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { signInWithPassword: mocks.signInWithPassword, signOut: mocks.signOut },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }) }),
  }),
}));

import { POST } from "./route";

describe("POST /api/v1/admin/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("signs a valid but non-owner account back out", async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { email: "guest@example.com", id: "user-1" } }, error: null });
    mocks.maybeSingle.mockResolvedValue({ data: null });

    const response = await POST(new Request("http://localhost/api/v1/admin/login", {
      body: JSON.stringify({ email: "guest@example.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }));

    expect(response.status).toBe(403);
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });

  it("allows an authenticated owner", async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { email: "kishmishyan.gevorg@gmail.com", id: "owner-1" } }, error: null });
    mocks.maybeSingle.mockResolvedValue({ data: { user_id: "owner-1" } });

    const response = await POST(new Request("http://localhost/api/v1/admin/login", {
      body: JSON.stringify({ email: "kishmishyan.gevorg@gmail.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ user: { email: "kishmishyan.gevorg@gmail.com", id: "owner-1" } });
  });
});
