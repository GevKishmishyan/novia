import { z } from "zod";

export const eventIdSchema = z.uuid();
export type EventId = z.infer<typeof eventIdSchema>;

export const loginRequestSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupRequestSchema = loginRequestSchema.extend({
  fullName: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const updatePasswordRequestSchema = z.object({
  password: z.string().min(10, "Password must be at least 10 characters").max(128, "Password is too long"),
  passwordConfirmation: z.string(),
}).refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;

export const invitationDetailsSchema = z.object({
  fontStyle: z.enum(["editorial", "serif", "sans", "handjet", "iosevka", "vrdznagir", "tumanian", "gayane", "grapalat", "amar", "emin", "poqrik", "bubble", "mandy", "faulmann", "arti", "dzeragir", "miami", "mahacu", "xarrovv", "alex-brush", "allura", "bodoni", "cinzel", "cormorant", "great-vibes", "marcellus", "parisienne", "playfair", "sacramento"]),
  textStyles: z.record(z.string().max(80), z.object({
    font: z.enum(["inherit", "serif", "sans", "handjet", "iosevka", "vrdznagir", "tumanian", "gayane", "grapalat", "amar", "emin", "poqrik", "bubble", "mandy", "faulmann", "arti", "dzeragir", "miami", "mahacu", "xarrovv", "alex-brush", "allura", "bodoni", "cinzel", "cormorant", "great-vibes", "marcellus", "parisienne", "playfair", "sacramento"]),
    size: z.enum(["small", "standard", "large"]),
    bold: z.boolean(),
    italic: z.boolean(),
    underline: z.boolean(),
  })).refine((styles) => Object.keys(styles).length <= 40, "Too many text styles"),
  partnerOne: z.string().trim().min(1).max(80),
  partnerTwo: z.string().trim().min(1).max(80),
  heroEyebrow: z.string().trim().min(1).max(120),
  conjunction: z.string().trim().min(1).max(40),
  date: z.string().trim().min(1).max(80),
  welcomeMessage: z.string().trim().min(1).max(500),
  celebrationEyebrow: z.string().trim().min(1).max(120),
  celebrationTitle: z.string().trim().min(1).max(160),
  ceremonyTitle: z.string().trim().min(1).max(120),
  ceremonyTime: z.string().trim().max(80),
  ceremonyVenue: z.string().trim().max(160),
  ceremonyAddress: z.string().trim().max(240),
  receptionTitle: z.string().trim().min(1).max(120),
  receptionTime: z.string().trim().max(80),
  receptionVenue: z.string().trim().max(160),
  receptionAddress: z.string().trim().max(240),
  rsvpEyebrow: z.string().trim().min(1).max(120),
  rsvpTitle: z.string().trim().min(1).max(160),
  rsvpMessage: z.string().trim().min(1).max(500),
  guestNameLabel: z.string().trim().min(1).max(120),
  guestNamePlaceholder: z.string().trim().min(1).max(160),
  acceptLabel: z.string().trim().min(1).max(120),
  declineLabel: z.string().trim().min(1).max(120),
  guestMessageLabel: z.string().trim().min(1).max(120),
  guestMessagePlaceholder: z.string().trim().min(1).max(160),
  submitLabel: z.string().trim().min(1).max(120),
  closingMessage: z.string().trim().min(1).max(120),
});

export const saveInvitationDraftSchema = z.object({
  templateId: z.string().trim().regex(/^[a-z0-9-]+$/).max(80),
  details: invitationDetailsSchema,
});

export type SavedInvitationDetails = z.infer<typeof invitationDetailsSchema>;
export type SaveInvitationDraftRequest = z.infer<typeof saveInvitationDraftSchema>;

export const invitationTemplateAccentSchema = z.enum(["arch", "botanical", "monogram", "ribbon", "minimal", "terracotta"]);

export const createInvitationTemplateSchema = z.object({
  id: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  name: z.string().trim().min(2).max(80),
  mood: z.string().trim().min(2).max(60),
  palette: z.string().trim().min(2).max(100),
  couple: z.string().trim().min(3).max(170),
  date: z.string().trim().min(2).max(80),
  accent: invitationTemplateAccentSchema,
  published: z.boolean(),
});

export type CreateInvitationTemplateRequest = z.infer<typeof createInvitationTemplateSchema>;
