import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ admin: vi.fn(), findTemplate: vi.fn(), getClaims: vi.fn(), order: vi.fn(), single: vi.fn(), upsert: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ getCurrentAdmin: mocks.admin }));
vi.mock("@/lib/invitation-template-repository", () => ({ findInvitationTemplate: mocks.findTemplate }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getClaims: mocks.getClaims },
    from: () => ({ select: () => ({ order: mocks.order }), upsert: mocks.upsert }),
  }),
}));

import { GET, POST } from "./route";
import { detailsFromTemplate, invitationTemplates } from "@/lib/invitation-templates";

const postRequest = () => new Request("http://localhost/api/v1/invitations", { body: JSON.stringify({ details: detailsFromTemplate(invitationTemplates[2]), templateId: "golden-hour" }), method: "POST" });

describe("customer invitation API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.admin.mockResolvedValue(null);
    mocks.findTemplate.mockResolvedValue({ id: "golden-hour" });
    mocks.upsert.mockReturnValue({ select: () => ({ single: mocks.single }) });
  });

  it("blocks owner accounts", async () => {
    mocks.admin.mockResolvedValue({ id: "owner-1" });
    expect((await GET()).status).toBe(403);
    expect((await POST(postRequest())).status).toBe(403);
  });

  it("requires customer authentication", async () => {
    mocks.getClaims.mockResolvedValue({ data: null });
    expect((await GET()).status).toBe(401);
    expect((await POST(postRequest())).status).toBe(401);
  });

  it("rejects an unknown template", async () => {
    mocks.findTemplate.mockResolvedValue(undefined);
    expect((await POST(postRequest())).status).toBe(404);
  });

  it("saves a validated draft for the authenticated customer", async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: { sub: "user-1" } } });
    mocks.single.mockResolvedValue({ data: { id: "draft-1" }, error: null });
    const response = await POST(postRequest());
    expect(response.status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ template_id: "golden-hour", user_id: "user-1" }), { onConflict: "user_id,template_id" });
  });
});
