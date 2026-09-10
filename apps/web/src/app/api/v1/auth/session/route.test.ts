import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getClaims: vi.fn(), maybeSingle: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getClaims: mocks.getClaims }, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }) }) }) }));

import { GET } from "./route";

describe("session API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns an anonymous session", async () => {
    mocks.getClaims.mockResolvedValue({ data: null });
    await expect((await GET()).json()).resolves.toEqual({ user: null });
  });

  it("labels a customer session", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { email: "user@example.com", sub: "user-1" } } });
    mocks.maybeSingle.mockResolvedValue({ data: null });
    await expect((await GET()).json()).resolves.toMatchObject({ user: { id: "user-1", role: "user" } });
  });

  it("labels an owner session", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { email: "owner@example.com", sub: "owner-1" } } });
    mocks.maybeSingle.mockResolvedValue({ data: { user_id: "owner-1" } });
    await expect((await GET()).json()).resolves.toMatchObject({ user: { id: "owner-1", role: "owner" } });
  });
});
