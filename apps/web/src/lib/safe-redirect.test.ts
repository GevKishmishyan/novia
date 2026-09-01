import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("keeps local paths and rejects external redirects", () => {
    expect(safeRedirectPath("/invitations/evergreen-vows/customize")).toBe("/invitations/evergreen-vows/customize");
    expect(safeRedirectPath(undefined, "/admin")).toBe("/admin");
    expect(safeRedirectPath("https://example.com/steal-session")).toBe("/dashboard");
    expect(safeRedirectPath("//example.com/steal-session")).toBe("/dashboard");
    expect(safeRedirectPath("/safe\\redirect")).toBe("/dashboard");
  });
});
