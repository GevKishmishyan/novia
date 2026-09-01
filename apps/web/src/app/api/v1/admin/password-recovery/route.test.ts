import { describe, expect, it, vi } from "vitest";

const resetPasswordForEmail = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }));

vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { resetPasswordForEmail } }) }));

import { POST } from "./route";

describe("POST /api/v1/admin/password-recovery", () => {
  it("sends recovery only to the configured owner", async () => {
    const response = await POST(new Request("http://localhost:3000/api/v1/admin/password-recovery", { method: "POST" }));
    expect(response.status).toBe(200);
    expect(resetPasswordForEmail).toHaveBeenCalledWith("kishmishyan.gevorg@gmail.com", {
      redirectTo: "http://localhost:3000/auth/confirm?next=%2Fadmin%2Freset-password",
    });
  });
});
