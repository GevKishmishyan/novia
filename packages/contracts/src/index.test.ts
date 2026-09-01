import { describe, expect, it } from "vitest";
import { createInvitationTemplateSchema, invitationDetailsSchema, loginRequestSchema, saveInvitationDraftSchema, signupRequestSchema, updatePasswordRequestSchema } from "./index";

const details = {
  acceptLabel: "Joyfully accepts", celebrationEyebrow: "Celebrate", celebrationTitle: "Our day", ceremonyAddress: "1 Main St", ceremonyTime: "4 PM", ceremonyTitle: "Ceremony", ceremonyVenue: "Garden", closingMessage: "With love", conjunction: "and", date: "June 1", declineLabel: "Sadly declines", fontStyle: "editorial", guestMessageLabel: "Message", guestMessagePlaceholder: "Optional note", guestNameLabel: "Guest name", guestNamePlaceholder: "Your name", heroEyebrow: "We are getting married", partnerOne: "Anna", partnerTwo: "David", receptionAddress: "2 Main St", receptionTime: "6 PM", receptionTitle: "Reception", receptionVenue: "Hall", rsvpEyebrow: "Reply", rsvpMessage: "Please reply", rsvpTitle: "Join us", submitLabel: "Send", textStyles: {}, welcomeMessage: "Together with our families",
} as const;

describe("shared API contracts", () => {
  it("validates login and signup boundaries", () => {
    expect(loginRequestSchema.safeParse({ email: "person@example.com", password: "password" }).success).toBe(true);
    expect(loginRequestSchema.safeParse({ email: "bad", password: "short" }).success).toBe(false);
    expect(signupRequestSchema.safeParse({ email: "person@example.com", fullName: "A", password: "password" }).success).toBe(false);
  });

  it("requires matching strong replacement passwords", () => {
    expect(updatePasswordRequestSchema.safeParse({ password: "strong-password", passwordConfirmation: "strong-password" }).success).toBe(true);
    expect(updatePasswordRequestSchema.safeParse({ password: "strong-password", passwordConfirmation: "different-password" }).success).toBe(false);
  });

  it("validates complete invitation drafts", () => {
    expect(invitationDetailsSchema.safeParse(details).success).toBe(true);
    expect(saveInvitationDraftSchema.safeParse({ details, templateId: "golden-hour" }).success).toBe(true);
    expect(saveInvitationDraftSchema.safeParse({ details: { ...details, partnerOne: "" }, templateId: "Golden Hour!" }).success).toBe(false);
  });

  it("restricts template IDs and supported layouts", () => {
    const template = { accent: "arch", couple: "Anna & David", date: "June 1", id: "garden-vows", mood: "Romantic", name: "Garden vows", palette: "Sage & ivory", published: false };
    expect(createInvitationTemplateSchema.safeParse(template).success).toBe(true);
    expect(createInvitationTemplateSchema.safeParse({ ...template, id: "Garden Vows" }).success).toBe(false);
    expect(createInvitationTemplateSchema.safeParse({ ...template, accent: "unknown" }).success).toBe(false);
  });
});
