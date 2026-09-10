import { beforeEach, describe, expect, it, vi } from "vitest";

const signIn = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { signInWithPassword: signIn } }) }));
import { POST } from "./route";

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => vi.clearAllMocks());
  it("rejects invalid credentials before contacting the auth provider", async () => {
    const request = new Request("http://localhost/api/v1/auth/login", { body: JSON.stringify({ email: "invalid", password: "short" }), headers: { "Content-Type": "application/json" }, method: "POST" });
    const response = await POST(request);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: { message: "Check the highlighted fields" } });
  });

  it("rejects incorrect credentials", async () => {
    signIn.mockResolvedValue({ data: { user: null }, error: new Error("invalid") });
    const response = await POST(new Request("http://localhost/api/v1/auth/login", { body: JSON.stringify({ email: "person@example.com", password: "password123" }), method: "POST" }));
    expect(response.status).toBe(401);
  });

  it("returns the authenticated user", async () => {
    signIn.mockResolvedValue({ data: { user: { email: "person@example.com", id: "user-1" } }, error: null });
    const response = await POST(new Request("http://localhost/api/v1/auth/login", { body: JSON.stringify({ email: "person@example.com", password: "password123" }), method: "POST" }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ user: { id: "user-1" } });
  });
});
