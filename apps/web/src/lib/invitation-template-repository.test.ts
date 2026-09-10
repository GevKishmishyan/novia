import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ configured: vi.fn(), createClient: vi.fn(), eq: vi.fn(), order: vi.fn() }));
vi.mock("@/lib/supabase/config", () => ({ hasSupabaseConfig: mocks.configured }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));

import { findInvitationTemplate, listInvitationTemplates } from "./invitation-template-repository";

describe("invitation template repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses bundled templates without Supabase configuration", async () => {
    mocks.configured.mockReturnValue(false);
    expect((await listInvitationTemplates()).length).toBe(6);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("maps published database rows", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.eq.mockResolvedValue({ data: [{ accent: "arch", couple: "Anna & David", event_date: "June 1", id: "garden-vows", mood: "Romantic", name: "Garden vows", palette: "Sage", published: true }], error: null });
    mocks.order.mockReturnValue({ eq: mocks.eq });
    mocks.createClient.mockResolvedValue({ from: () => ({ select: () => ({ order: mocks.order }) }) });
    await expect(listInvitationTemplates()).resolves.toEqual([expect.objectContaining({ date: "June 1", id: "garden-vows" })]);
  });

  it("falls back safely when the database is unavailable", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.createClient.mockRejectedValue(new Error("offline"));
    expect((await listInvitationTemplates()).length).toBe(6);
  });

  it("finds a template by ID", async () => {
    mocks.configured.mockReturnValue(false);
    await expect(findInvitationTemplate("golden-hour")).resolves.toMatchObject({ name: "Golden hour" });
  });
});
