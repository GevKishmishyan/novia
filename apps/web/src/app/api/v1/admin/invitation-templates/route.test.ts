import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ admin: vi.fn(), insert: vi.fn(), order: vi.fn(), selectAfterInsert: vi.fn(), single: vi.fn() }));

vi.mock("@/lib/admin-auth", () => ({ getCurrentAdmin: mocks.admin }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      insert: mocks.insert,
      select: () => ({ order: mocks.order }),
    }),
  }),
}));

import { GET, POST } from "./route";

const validTemplate = { accent: "arch", couple: "Anna & David", date: "June 1", id: "garden-vows", mood: "Romantic", name: "Garden vows", palette: "Sage & ivory", published: false };

describe("admin invitation template API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.insert.mockReturnValue({ select: mocks.selectAfterInsert });
    mocks.selectAfterInsert.mockReturnValue({ single: mocks.single });
  });

  it("rejects non-owner access", async () => {
    mocks.admin.mockResolvedValue(null);
    expect((await GET()).status).toBe(403);
    expect((await POST(new Request("http://localhost/api/v1/admin/invitation-templates", { body: JSON.stringify(validTemplate), method: "POST" }))).status).toBe(403);
  });

  it("validates template input", async () => {
    mocks.admin.mockResolvedValue({ id: "owner-1" });
    const response = await POST(new Request("http://localhost/api/v1/admin/invitation-templates", { body: JSON.stringify({ ...validTemplate, id: "Bad ID" }), method: "POST" }));
    expect(response.status).toBe(400);
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("creates a template for the owner", async () => {
    mocks.admin.mockResolvedValue({ id: "owner-1" });
    mocks.single.mockResolvedValue({ data: { id: validTemplate.id }, error: null });
    const response = await POST(new Request("http://localhost/api/v1/admin/invitation-templates", { body: JSON.stringify(validTemplate), method: "POST" }));
    expect(response.status).toBe(201);
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({ created_by: "owner-1", event_date: "June 1", id: "garden-vows" }));
  });

  it("reports duplicate URL IDs", async () => {
    mocks.admin.mockResolvedValue({ id: "owner-1" });
    mocks.single.mockResolvedValue({ data: null, error: { code: "23505" } });
    expect((await POST(new Request("http://localhost/api/v1/admin/invitation-templates", { body: JSON.stringify(validTemplate), method: "POST" }))).status).toBe(409);
  });
});
