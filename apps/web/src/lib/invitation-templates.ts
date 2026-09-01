export type InvitationTemplate = {
  id: string;
  name: string;
  mood: string;
  palette: string;
  couple: string;
  date: string;
  accent: "arch" | "botanical" | "monogram" | "ribbon" | "minimal" | "terracotta";
};

export type InvitationFont = "inherit" | "serif" | "sans" | "handjet" | "iosevka" | "vrdznagir" | "tumanian" | "gayane" | "grapalat" | "amar" | "emin" | "poqrik" | "bubble" | "mandy" | "faulmann" | "arti" | "dzeragir" | "miami" | "mahacu" | "xarrovv" | "alex-brush" | "allura" | "bodoni" | "cinzel" | "cormorant" | "great-vibes" | "marcellus" | "parisienne" | "playfair" | "sacramento";
export type InvitationFontStyle = Exclude<InvitationFont, "inherit"> | "editorial";

export type InvitationDetails = {
  fontStyle: InvitationFontStyle;
  textStyles: Record<string, InvitationTextStyle>;
  partnerOne: string;
  partnerTwo: string;
  heroEyebrow: string;
  conjunction: string;
  date: string;
  welcomeMessage: string;
  celebrationEyebrow: string;
  celebrationTitle: string;
  ceremonyTitle: string;
  ceremonyTime: string;
  ceremonyVenue: string;
  ceremonyAddress: string;
  receptionTitle: string;
  receptionTime: string;
  receptionVenue: string;
  receptionAddress: string;
  rsvpEyebrow: string;
  rsvpTitle: string;
  rsvpMessage: string;
  guestNameLabel: string;
  guestNamePlaceholder: string;
  acceptLabel: string;
  declineLabel: string;
  guestMessageLabel: string;
  guestMessagePlaceholder: string;
  submitLabel: string;
  closingMessage: string;
  photoUrl?: string;
  audioUrl?: string;
};

export type InvitationTextStyle = {
  font: InvitationFont;
  size: "small" | "standard" | "large";
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export function detailsFromTemplate(template: InvitationTemplate): InvitationDetails {
  const [partnerOne = "Partner one", partnerTwo = "Partner two"] = template.couple.split(" & ");

  return {
    fontStyle: "editorial",
    textStyles: {},
    partnerOne,
    partnerTwo,
    heroEyebrow: "We are getting married",
    conjunction: "and",
    date: template.date,
    welcomeMessage: "Together with our families, we invite you to share in the joy of our wedding day.",
    celebrationEyebrow: "The celebration",
    celebrationTitle: "Our day, with you",
    ceremonyTitle: "Ceremony",
    ceremonyTime: "3:00 PM",
    ceremonyVenue: "St. Anne’s Chapel",
    ceremonyAddress: "Garden Lane, Yerevan",
    receptionTitle: "Dinner & dancing",
    receptionTime: "5:30 PM",
    receptionVenue: "The Orangery",
    receptionAddress: "Willow House, Yerevan",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "Will you join us?",
    rsvpMessage: "Please confirm your attendance and share any details with us.",
    guestNameLabel: "Guest name",
    guestNamePlaceholder: "Your guest’s name",
    acceptLabel: "Joyfully accepts",
    declineLabel: "Sadly declines",
    guestMessageLabel: "Message for the couple",
    guestMessagePlaceholder: "Optional note",
    submitLabel: "Send RSVP",
    closingMessage: "With love,",
  };
}

export const invitationTemplates: InvitationTemplate[] = [
  { id: "evergreen-vows", name: "Evergreen vows", mood: "Editorial", palette: "Forest & parchment", couple: "Amelia & James", date: "SEPTEMBER 14, 2027", accent: "arch" },
  { id: "garden-letter", name: "Garden letter", mood: "Romantic", palette: "Sage & ivory", couple: "Sofia & Daniel", date: "MAY 22, 2027", accent: "botanical" },
  { id: "golden-hour", name: "Golden hour", mood: "Classic", palette: "Warm white & gold", couple: "Nora & David", date: "OCTOBER 02, 2027", accent: "monogram" },
  { id: "softly-tied", name: "Softly tied", mood: "Modern", palette: "Blush & taupe", couple: "Lena & Aram", date: "JUNE 05, 2027", accent: "ribbon" },
  { id: "quiet-type", name: "Quiet type", mood: "Minimal", palette: "Ivory & charcoal", couple: "Maya & Leo", date: "AUGUST 28, 2027", accent: "minimal" },
  { id: "sunset-table", name: "Sunset table", mood: "Warm", palette: "Terracotta & cream", couple: "Clara & Theo", date: "JULY 17, 2027", accent: "terracotta" },
];
