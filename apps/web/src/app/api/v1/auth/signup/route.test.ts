import { beforeEach, describe, expect, it, vi } from "vitest";

const signUp = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { signUp } }) }));
import { POST } from "./route";

describe("POST /api/v1/auth/signup", () => {
  beforeEach(() => vi.clearAllMocks());
  it("rejects an invalid signup payload", async () => {
    const request = new Request("http://localhost/api/v1/auth/signup", { body: JSON.stringify({ email: "person@example.com", fullName: "", password: "123" }), headers: { "Content-Type": "application/json" }, method: "POST" });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("creates an account with a safe confirmation redirect", async () => {
    signUp.mockResolvedValue({ data: { session: null, user: { email: "person@example.com", id: "user-1" } }, error: null });
    const response = await POST(new Request("http://localhost:3000/api/v1/auth/signup?next=https%3A%2F%2Fevil.example", { body: JSON.stringify({ email: "person@example.com", fullName: "Person Name", password: "password123" }), method: "POST" }));
    expect(response.status).toBe(201);
    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({ options: expect.objectContaining({ emailRedirectTo: "http://localhost:3000/auth/confirm?next=%2Fdashboard" }) }));
    await expect(response.json()).resolves.toMatchObject({ needsEmailConfirmation: true });
  });
});
