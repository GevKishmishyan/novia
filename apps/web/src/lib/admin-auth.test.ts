import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getClaims: vi.fn(), maybeSingle: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getClaims: mocks.getClaims }, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }) }) }) }));

import { getCurrentAdmin } from "./admin-auth";

describe("owner authorization", () => {
  it("returns null without a session", async () => {
    mocks.getClaims.mockResolvedValue({ data: null });
    await expect(getCurrentAdmin()).resolves.toBeNull();
  });

  it("returns null without membership", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { sub: "user-1" } } });
    mocks.maybeSingle.mockResolvedValue({ data: null });
    await expect(getCurrentAdmin()).resolves.toBeNull();
  });

  it("returns the authorized owner", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { email: "owner@example.com", sub: "owner-1" } } });
    mocks.maybeSingle.mockResolvedValue({ data: { user_id: "owner-1" } });
    await expect(getCurrentAdmin()).resolves.toEqual({ email: "owner@example.com", id: "owner-1" });
  });
});
