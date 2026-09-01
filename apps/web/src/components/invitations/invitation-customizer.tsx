"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bold, Check, ChevronDown, ImagePlus, Italic, Monitor, Music2, PanelLeftClose, PanelLeftOpen, RotateCcw, Save, Smartphone, Tablet, Underline, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { InvitationExperience, type EditableTextField } from "@/components/invitations/invitation-gallery";
import { detailsFromTemplate, type InvitationDetails, type InvitationFont, type InvitationFontStyle, type InvitationTemplate, type InvitationTextStyle } from "@/lib/invitation-templates";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "mobile";

const FONT_OPTIONS: { category: "Wedding calligraphy" | "Elegant serif" | "Modern"; id: InvitationFontStyle; label: string }[] = [
  { category: "Wedding calligraphy", id: "great-vibes", label: "Great Vibes" },
  { category: "Wedding calligraphy", id: "alex-brush", label: "Alex Brush" },
  { category: "Wedding calligraphy", id: "allura", label: "Allura" },
  { category: "Wedding calligraphy", id: "parisienne", label: "Parisienne" },
  { category: "Wedding calligraphy", id: "sacramento", label: "Sacramento" },
  { category: "Elegant serif", id: "bodoni", label: "Bodoni Moda" },
  { category: "Elegant serif", id: "cormorant", label: "Cormorant Garamond" },
  { category: "Elegant serif", id: "playfair", label: "Playfair Display" },
  { category: "Elegant serif", id: "cinzel", label: "Cinzel" },
  { category: "Elegant serif", id: "marcellus", label: "Marcellus" },
  { category: "Elegant serif", id: "editorial", label: "Editorial" },
  { category: "Elegant serif", id: "serif", label: "Noto Serif" },
  { category: "Modern", id: "sans", label: "Noto Sans" },
];
const SELECTABLE_FONT_STYLE_IDS = new Set<InvitationFontStyle>(FONT_OPTIONS.map(({ id }) => id));
const SELECTABLE_TEXT_FONT_IDS = new Set<InvitationFont>(["inherit", ...FONT_OPTIONS.filter(({ id }) => id !== "editorial").map(({ id }) => id as InvitationFont)]);

export function InvitationCustomizer({ initialDetails, template }: { initialDetails?: InvitationDetails; template: InvitationTemplate }) {
  const defaults = useMemo(() => {
    const merged = { ...detailsFromTemplate(template), ...initialDetails };
    return {
      ...merged,
      fontStyle: SELECTABLE_FONT_STYLE_IDS.has(merged.fontStyle) ? merged.fontStyle : "editorial",
      textStyles: Object.fromEntries(Object.entries(merged.textStyles).map(([field, style]) => [field, SELECTABLE_TEXT_FONT_IDS.has(style.font) ? style : { ...style, font: "inherit" }])),
    } as InvitationDetails;
  }, [initialDetails, template]);
  const { control, getValues, register, setValue } = useForm<InvitationDetails>({ defaultValues: defaults });
  const details = useWatch({ control }) as InvitationDetails;
  const [device, setDevice] = useState<Device>("desktop");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTextField, setActiveTextField] = useState<EditableTextField | null>(null);
  const [previewFontStyle, setPreviewFontStyle] = useState<InvitationFontStyle | null>(null);
  const [previewTextFont, setPreviewTextFont] = useState<InvitationFont | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    void fetch("/api/v1/invitations", {
      body: JSON.stringify({ details: defaults, templateId: template.id }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  }, [defaults, template.id]);

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const chooseFile = (file: File | undefined, kind: "photo" | "audio") => {
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    if (kind === "photo") {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(nextUrl);
    } else {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(nextUrl);
    }
  };

  const save = async () => {
    setSaveState("saving");
    const response = await fetch("/api/v1/invitations", {
      body: JSON.stringify({ details: getValues(), templateId: template.id }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setSaveState(response.ok ? "saved" : "error");
  };

  const activeStyle = activeTextField ? details.textStyles?.[activeTextField] : undefined;
  const normalizedStyle: InvitationTextStyle = activeStyle ?? { bold: false, font: "inherit", italic: false, size: "standard", underline: false };
  const updateTextStyle = (patch: Partial<InvitationTextStyle>) => {
    if (!activeTextField) return;
    setValue("textStyles", { ...getValues("textStyles"), [activeTextField]: { ...normalizedStyle, ...patch } }, { shouldDirty: true });
  };
  const resetTextStyle = () => {
    if (!activeTextField) return;
    const nextStyles = { ...getValues("textStyles") };
    delete nextStyles[activeTextField];
    setValue("textStyles", nextStyles, { shouldDirty: true });
  };
  const previewTextStyles = previewTextFont && activeTextField ? { ...details.textStyles, [activeTextField]: { ...normalizedStyle, font: previewTextFont } } : details.textStyles;

  return (
    <div className={cn("grid min-h-[calc(100vh-6rem)]", sidebarVisible && "lg:grid-cols-[400px_1fr]")}>
      <aside className={cn("border-r border-forest/10 bg-warm-white px-5 py-8 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:px-8", !sidebarVisible && "hidden")}>
        <div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[.2em] text-taupe">Editing · {template.name}</p><button aria-label="Hide editor sidebar" className="inline-flex min-h-9 items-center gap-2 rounded-full border border-forest/15 px-3 text-xs font-semibold hover:bg-parchment/50" onClick={() => setSidebarVisible(false)} type="button"><PanelLeftClose size={15} /> Close editor</button></div>
        <h1 className="mt-3 font-display text-4xl">Make it yours</h1>
        <p className="mt-3 text-sm leading-6 text-taupe">Changes appear instantly. Save when you are happy with this draft.</p>

        <button className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-warm-white disabled:opacity-60" disabled={saveState === "saving"} onClick={save} type="button">{saveState === "saved" ? <Check className="mr-2" size={16} /> : <Save className="mr-2" size={16} />}{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Changes saved" : "Save changes"}</button>
        {saveState === "error" && <p className="mt-3 text-sm text-terracotta" role="alert">We couldn’t save this draft. Please try again.</p>}

        <form className="mt-8 space-y-8" onSubmit={(event) => event.preventDefault()}>
          <Fieldset legend="Typography">
            <FontDropdown onPreview={setPreviewFontStyle} onSelect={(fontStyle) => setValue("fontStyle", fontStyle, { shouldDirty: true })} value={details.fontStyle} />
            <p className="text-xs leading-5 text-taupe">Wedding calligraphy is designed for English names and short headings. Use an elegant serif or modern face for longer text.</p>
          </Fieldset>
          <Fieldset legend="Your story">
            <div className="grid grid-cols-2 gap-3"><Field label="Partner one" {...register("partnerOne")} /><Field label="Partner two" {...register("partnerTwo")} /></div>
            <Field label="Opening line" {...register("heroEyebrow")} />
            <Field label="Name conjunction" {...register("conjunction")} />
            <Field label="Wedding date" {...register("date")} />
            <label className="block text-sm font-semibold">Welcome message<textarea className="editor-input mt-2 min-h-24 resize-y" {...register("welcomeMessage")} /></label>
          </Fieldset>
          <Fieldset legend="Celebration wording">
            <Field label="Section label" {...register("celebrationEyebrow")} />
            <Field label="Section heading" {...register("celebrationTitle")} />
          </Fieldset>
          <Fieldset legend="Ceremony">
            <Field label="Event title" {...register("ceremonyTitle")} /><Field label="Time" {...register("ceremonyTime")} /><Field label="Venue" {...register("ceremonyVenue")} /><Field label="Address" {...register("ceremonyAddress")} />
          </Fieldset>
          <Fieldset legend="Reception">
            <Field label="Event title" {...register("receptionTitle")} /><Field label="Time" {...register("receptionTime")} /><Field label="Venue" {...register("receptionVenue")} /><Field label="Address" {...register("receptionAddress")} />
          </Fieldset>
          <Fieldset legend="RSVP wording">
            <Field label="Section label" {...register("rsvpEyebrow")} /><Field label="Section heading" {...register("rsvpTitle")} />
            <label className="block text-sm font-semibold">RSVP message<textarea className="editor-input mt-2 min-h-24 resize-y" {...register("rsvpMessage")} /></label>
            <Field label="Guest name label" {...register("guestNameLabel")} /><Field label="Guest name placeholder" {...register("guestNamePlaceholder")} />
            <div className="grid grid-cols-2 gap-3"><Field label="Accept option" {...register("acceptLabel")} /><Field label="Decline option" {...register("declineLabel")} /></div>
            <Field label="Message label" {...register("guestMessageLabel")} /><Field label="Message placeholder" {...register("guestMessagePlaceholder")} /><Field label="Submit button" {...register("submitLabel")} />
          </Fieldset>
          <Fieldset legend="Closing">
            <Field label="Closing message" {...register("closingMessage")} />
          </Fieldset>
          <Fieldset legend="Photos & music">
            <Upload accept="image/jpeg,image/png,image/webp" icon={ImagePlus} label="Upload a photo" name="photo" onChoose={(file) => chooseFile(file, "photo")} status={photoUrl ? "Photo added" : "JPG, PNG or WebP"} />
            <Upload accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg" icon={Music2} label="Add optional music" name="audio" onChoose={(file) => chooseFile(file, "audio")} status={audioUrl ? "Music added" : "MP3, M4A, WAV or OGG"} />
          </Fieldset>
        </form>
      </aside>

      <section className="min-w-0 bg-[#d8d2c8] p-3 sm:p-6 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="sticky top-3 z-10 mx-auto mb-5 flex w-fit items-center gap-1 rounded-full border border-forest/10 bg-warm-white p-1 shadow-sm">
          {!sidebarVisible && <><button aria-label="Show editor sidebar" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-forest px-4 text-xs font-semibold text-warm-white" onClick={() => setSidebarVisible(true)} type="button"><PanelLeftOpen size={16} /> Open editor</button><span aria-hidden="true" className="mx-1 h-6 w-px bg-forest/10" /></>}
          <DeviceButton active={device === "desktop"} icon={Monitor} label="Desktop view" onClick={() => setDevice("desktop")} />
          <DeviceButton active={device === "tablet"} icon={Tablet} label="Tablet view" onClick={() => setDevice("tablet")} />
          <DeviceButton active={device === "mobile"} icon={Smartphone} label="Mobile view" onClick={() => setDevice("mobile")} />
          <span aria-hidden="true" className="mx-1 h-6 w-px bg-forest/10" />
          <button aria-label="Save changes from preview" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-forest px-4 text-xs font-semibold text-warm-white disabled:opacity-60" disabled={saveState === "saving"} onClick={save} type="button">{saveState === "saved" ? <Check size={15} /> : <Save size={15} />}{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save changes"}</button>
        </div>
        <div className={cn("mx-auto overflow-hidden bg-warm-white shadow-xl transition-[max-width]", device === "desktop" && "max-w-5xl", device === "tablet" && "max-w-[768px]", device === "mobile" && "max-w-[390px]")} onPointerDown={(event) => { const target = event.target as HTMLElement; if (!target.closest('[role="textbox"]') && !target.closest('[role="dialog"]')) { setActiveTextField(null); setPreviewTextFont(null); } }}>
          <InvitationExperience activeTextField={activeTextField} details={{ ...detailsFromTemplate(template), ...details, fontStyle: previewFontStyle ?? details.fontStyle, photoUrl, audioUrl, textStyles: previewTextStyles }} device={device} onTextChange={(field, value) => setValue(field, value, { shouldDirty: true })} onTextFocus={(field) => { setPreviewTextFont(null); setActiveTextField(field); }} renderTextFormatting={() => <TextFormattingPopover onClose={() => { setPreviewTextFont(null); setActiveTextField(null); }} onPreview={setPreviewTextFont} onReset={resetTextStyle} onUpdate={updateTextStyle} style={normalizedStyle} />} template={template} />
        </div>
      </section>
    </div>
  );
}

function FontDropdown({ onPreview, onSelect, value }: { onPreview: (font: InvitationFontStyle | null) => void; onSelect: (font: InvitationFontStyle) => void; value: InvitationFontStyle }) {
  const [open, setOpen] = useState(false);
  const selected = FONT_OPTIONS.find((font) => font.id === value) ?? FONT_OPTIONS.find((font) => font.id === "editorial")!;
  return <div className="relative"><p className="text-sm font-semibold">Invitation font</p><button aria-controls="invitation-font-options" aria-expanded={open} aria-haspopup="listbox" aria-label="Invitation font" className="editor-input mt-2 flex items-center justify-between gap-3 text-left" onClick={() => { setOpen((current) => !current); onPreview(null); }} role="combobox" type="button"><span>{selected.label}</span><ChevronDown className={cn("shrink-0 transition-transform", open && "rotate-180")} size={17} /></button>{open && <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-forest/15 bg-warm-white p-2 shadow-[0_14px_35px_rgba(23,53,37,.16)]" id="invitation-font-options" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); onPreview(null); } }} onMouseLeave={() => onPreview(null)} role="listbox">{(["Wedding calligraphy", "Elegant serif", "Modern"] as const).map((category) => <div key={category}><p className="px-2 pb-1 pt-2 text-[.62rem] font-semibold uppercase tracking-[.14em] text-taupe">{category}</p>{FONT_OPTIONS.filter((font) => font.category === category).map((font) => <button aria-selected={value === font.id} className={cn("w-full rounded-lg px-3 py-2 text-left text-sm transition", value === font.id ? "bg-forest text-warm-white" : "hover:bg-parchment focus:bg-parchment")} key={font.id} onBlur={() => onPreview(null)} onClick={() => { onSelect(font.id); onPreview(null); setOpen(false); }} onFocus={() => onPreview(font.id)} onMouseEnter={() => onPreview(font.id)} role="option" type="button">{font.label}</button>)}</div>)}</div>}</div>;
}

function InlineFontDropdown({ onPreview, onSelect, value }: { onPreview: (font: InvitationFont | null) => void; onSelect: (font: InvitationFont) => void; value: InvitationFont }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const options: { id: InvitationFont; label: string }[] = [{ id: "inherit", label: "Template" }, ...FONT_OPTIONS.filter(({ id }) => id !== "editorial").map(({ id, label }) => ({ id: id as InvitationFont, label }))];
  const selected = options.find((font) => font.id === value) ?? options[0];
  const lockTextBox = () => {
    const host = rootRef.current?.closest<HTMLElement>("[data-inline-text-host]");
    if (!host || host.dataset.previewLocked) return;
    const { height, width } = host.getBoundingClientRect();
    host.dataset.previewLocked = "true";
    host.style.height = `${height}px`;
    host.style.width = `${width}px`;
  };
  const unlockTextBox = () => {
    const host = rootRef.current?.closest<HTMLElement>("[data-inline-text-host]");
    if (!host) return;
    delete host.dataset.previewLocked;
    host.style.height = "";
    host.style.width = "";
  };
  const preview = (font: InvitationFont | null) => { if (font) lockTextBox(); else unlockTextBox(); onPreview(font); };
  return <span className="relative text-left" ref={rootRef}><span className="block text-[.65rem] font-semibold uppercase tracking-[.12em] text-taupe">Font</span><button aria-controls="inline-font-options" aria-expanded={open} aria-haspopup="listbox" aria-label="Selected text font" className="mt-1 flex h-9 min-w-36 max-w-44 items-center justify-between gap-2 rounded-lg border border-forest/15 bg-warm-white px-2 text-xs text-forest" onClick={() => { setOpen((current) => !current); preview(null); }} role="combobox" type="button"><span className="truncate">{selected.label}</span><ChevronDown className={cn("shrink-0 transition-transform", open && "rotate-180")} size={14} /></button>{open && <span className="absolute left-0 top-[calc(100%+.4rem)] z-[60] max-h-72 min-w-52 overflow-y-auto rounded-xl border border-forest/15 bg-warm-white p-2 shadow-[0_14px_35px_rgba(23,53,37,.2)]" id="inline-font-options" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); preview(null); } }} onMouseLeave={() => preview(null)} role="listbox">{options.map((font) => <button aria-selected={value === font.id} className={cn("block w-full rounded-lg px-3 py-2 text-left text-xs", value === font.id ? "bg-forest text-warm-white" : "hover:bg-parchment focus:bg-parchment")} key={font.id} onBlur={() => preview(null)} onClick={() => { onSelect(font.id); preview(null); setOpen(false); }} onFocus={() => preview(font.id)} onMouseEnter={() => preview(font.id)} role="option" type="button">{font.label}</button>)}</span>}</span>;
}

function TextFormattingPopover({ onClose, onPreview, onReset, onUpdate, style }: { onClose: () => void; onPreview: (font: InvitationFont | null) => void; onReset: () => void; onUpdate: (patch: Partial<InvitationTextStyle>) => void; style: InvitationTextStyle }) {
  return <span aria-label="Text formatting" className="absolute left-1/2 top-[calc(100%+.65rem)] z-40 flex w-max max-w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 flex-wrap items-end gap-2 rounded-2xl border border-forest/10 bg-warm-white p-3 font-sans text-base font-normal not-italic tracking-normal text-forest shadow-[0_12px_35px_rgba(23,53,37,.18)]" role="dialog"><InlineFontDropdown onPreview={onPreview} onSelect={(font) => onUpdate({ font })} value={style.font} /><label className="text-[.65rem] font-semibold uppercase tracking-[.12em] text-taupe">Size<select aria-label="Selected text size" className="mt-1 block h-9 rounded-lg border border-forest/15 bg-warm-white px-2 text-xs normal-case tracking-normal text-forest" onChange={(event) => onUpdate({ size: event.target.value as InvitationTextStyle["size"] })} value={style.size}><option value="small">Small</option><option value="standard">Standard</option><option value="large">Large</option></select></label><FormatButton active={style.bold} icon={Bold} label="Bold" onClick={() => onUpdate({ bold: !style.bold })} /><FormatButton active={style.italic} icon={Italic} label="Italic" onClick={() => onUpdate({ italic: !style.italic })} /><FormatButton active={style.underline} icon={Underline} label="Underline" onClick={() => onUpdate({ underline: !style.underline })} /><button aria-label="Reset formatting" className="grid size-9 place-items-center rounded-lg border border-forest/15 text-taupe hover:bg-parchment" onClick={onReset} title="Reset formatting" type="button"><RotateCcw size={15} /></button><button aria-label="Close formatting" className="grid size-9 place-items-center rounded-lg text-taupe hover:bg-parchment" onClick={onClose} type="button"><X size={16} /></button></span>;
}

function FormatButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Bold; label: string; onClick: () => void }) {
  return <button aria-label={label} aria-pressed={active} className={cn("grid size-9 place-items-center rounded-lg border border-forest/15", active ? "bg-forest text-warm-white" : "text-taupe hover:bg-parchment")} onClick={onClick} title={label} type="button"><Icon size={15} /></button>;
}

function Fieldset({ children, legend }: { children: React.ReactNode; legend: string }) {
  return <fieldset className="space-y-4"><legend className="mb-4 w-full border-b border-forest/10 pb-2 font-display text-2xl">{legend}</legend>{children}</fieldset>;
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="block text-sm font-semibold">{label}<input className="editor-input mt-2" {...props} /></label>;
}

function Upload({ accept, icon: Icon, label, name, onChoose, status }: { accept: string; icon: typeof ImagePlus; label: string; name: string; onChoose: (file?: File) => void; status: string }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-forest/25 p-4 transition-colors hover:bg-parchment/40"><span className="grid size-10 place-items-center rounded-full bg-parchment"><Icon size={18} /></span><span><span className="block text-sm font-semibold">{label}</span><span className="text-xs text-taupe">{status}</span></span><input accept={accept} className="sr-only" name={name} onChange={(event) => onChoose(event.target.files?.[0])} type="file" /></label>;
}

function DeviceButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Monitor; label: string; onClick: () => void }) {
  return <button aria-label={label} aria-pressed={active} className={cn("grid size-10 place-items-center rounded-full", active ? "bg-forest text-warm-white" : "text-taupe hover:bg-parchment")} onClick={onClick} type="button"><Icon size={17} /></button>;
}
