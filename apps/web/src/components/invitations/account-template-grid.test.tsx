import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TemplatePreview } from "./template-preview";
import { invitationTemplates } from "@/lib/invitation-templates";

describe("account invitation templates", () => {
  it("renders a selected template preview", () => {
    render(<TemplatePreview template={invitationTemplates[0]} />);
    expect(screen.getByText("Amelia")).toBeInTheDocument();
    expect(screen.getByText("SEPTEMBER 14, 2027")).toBeInTheDocument();
  });
});
