import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getClaims: vi.fn(), updateUser: vi.fn() }));
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: () => true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: mocks }) }));

import { POST } from "./route";

const request = () => new Request("http://localhost/api/v1/admin/password", { body: JSON.stringify({ password: "new-password-123", passwordConfirmation: "new-password-123" }), method: "POST" });

describe("owner password update API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects invalid password confirmation", async () => {
    const response = await POST(new Request("http://localhost/api/v1/admin/password", { body: JSON.stringify({ password: "new-password-123", passwordConfirmation: "different" }), method: "POST" }));
    expect(response.status).toBe(400);
  });

  it("rejects a recovery session for another account", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { email: "user@example.com" } } });
    expect((await POST(request())).status).toBe(403);
  });

  it("updates the approved owner password", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { email: "KISHMISHYAN.GEVORG@GMAIL.COM" } } });
    mocks.updateUser.mockResolvedValue({ error: null });
    expect((await POST(request())).status).toBe(200);
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: "new-password-123" });
  });
});
