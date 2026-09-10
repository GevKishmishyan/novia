// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSession } from "./proxy";

const getClaims = vi.fn();
const maybeSingle = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getClaims },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle })),
      })),
    })),
  })),
}));

vi.mock("./config", () => ({
  getSupabaseConfig: () => ({ publishableKey: "key", url: "https://example.supabase.co" }),
  hasSupabaseConfig: () => true,
}));

describe("Supabase route protection", () => {
  beforeEach(() => {
    getClaims.mockReset();
    maybeSingle.mockReset();
  });

  it("sends an anonymous customer to login and preserves the full destination", async () => {
    getClaims.mockResolvedValue({ data: { claims: null } });

    const response = await updateSession(new NextRequest("http://localhost/dashboard?tab=tasks"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login?next=%2Fdashboard%3Ftab%3Dtasks");
  });

  it("sends an anonymous visitor to the dedicated owner login", async () => {
    getClaims.mockResolvedValue({ data: { claims: null } });

    const response = await updateSession(new NextRequest("http://localhost/admin/templates"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin/login?next=%2Fadmin%2Ftemplates");
  });

  it("keeps a customer in the customer application", async () => {
    getClaims.mockResolvedValue({ data: { claims: { sub: "customer-id" } } });
    maybeSingle.mockResolvedValue({ data: null });

    const response = await updateSession(new NextRequest("http://localhost/invitations/golden-hour/customize"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects an owner away from customer-only pages", async () => {
    getClaims.mockResolvedValue({ data: { claims: { sub: "owner-id" } } });
    maybeSingle.mockResolvedValue({ data: { user_id: "owner-id" } });

    const response = await updateSession(new NextRequest("http://localhost/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin");
  });
});
