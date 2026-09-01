"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Church, Clock3, MapPin, Monitor, Smartphone, Tablet, X } from "lucide-react";
import Link from "next/link";
import { TemplatePreview } from "@/components/invitations/template-preview";
import type { InvitationTemplate } from "@/lib/invitation-templates";
import { cn } from "@/lib/utils";

type PreviewDevice = "desktop" | "tablet" | "mobile";

export function InvitationGallery({ templates }: { templates: InvitationTemplate[] }) {
  const [activeMood, setActiveMood] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const moods = ["All", ...Array.from(new Set(templates.map((template) => template.mood)))];
  const filteredTemplates = activeMood === "All" ? templates : templates.filter((template) => template.mood === activeMood);
  const selected = selectedIndex === null ? null : filteredTemplates[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + filteredTemplates.length) % filteredTemplates.length);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % filteredTemplates.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredTemplates.length, selectedIndex]);

  const move = (direction: -1 | 1) => setSelectedIndex((current) => current === null ? null : (current + direction + filteredTemplates.length) % filteredTemplates.length);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Template categories" role="group">
        {moods.map((mood) => <button aria-pressed={activeMood === mood} className={activeMood === mood ? "rounded-full bg-forest px-4 py-2 text-sm text-warm-white" : "rounded-full border border-forest/15 px-4 py-2 text-sm text-taupe transition-colors hover:border-forest/35 hover:text-forest"} key={mood} onClick={() => { setActiveMood(mood); setSelectedIndex(null); }} type="button">{mood}</button>)}
      </div>
      <p aria-live="polite" className="mt-5 text-sm text-taupe">Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? "template" : "templates"}</p>
      <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => (
          <article key={template.id}>
            <button className="group block w-full text-left" onClick={() => setSelectedIndex(index)} type="button">
              <div className="transition-transform duration-300 group-hover:-translate-y-1"><TemplatePreview template={template} /></div>
              <div className="mt-5 flex items-start justify-between gap-4"><div><h3 className="font-display text-3xl">{template.name}</h3><p className="mt-1 text-sm text-taupe">{template.mood} · {template.palette}</p></div><span className="grid size-11 shrink-0 place-items-center rounded-full border border-forest/20 transition-colors group-hover:bg-forest group-hover:text-warm-white"><ArrowRight size={17} /></span></div>
            </button>
          </article>
        ))}
      </div>

      {selected && selectedIndex !== null && (
        <div aria-label={`${selected.name} invitation preview`} aria-modal="true" className="fixed inset-0 z-50 flex bg-forest/70 p-0 backdrop-blur-sm md:p-6" onMouseDown={() => setSelectedIndex(null)} role="dialog">
          <div className="relative m-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-warm-white md:h-[calc(100vh-3rem)] md:rounded-[2rem]" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex min-h-18 shrink-0 items-center justify-between gap-3 border-b border-forest/10 px-4 py-3 md:px-7">
              <div><p className="font-display text-2xl">{selected.name}</p><p className="hidden text-xs text-taupe sm:block">Invitation preview · {selectedIndex + 1} of {filteredTemplates.length}</p></div>
              <div className="flex items-center gap-2">
                <div aria-label="Preview device" className="hidden items-center rounded-full border border-forest/15 p-1 sm:flex" role="group"><DeviceButton active={previewDevice === "desktop"} device="desktop" icon={Monitor} label="Desktop view" onSelect={setPreviewDevice} /><DeviceButton active={previewDevice === "tablet"} device="tablet" icon={Tablet} label="Tablet view" onSelect={setPreviewDevice} /><DeviceButton active={previewDevice === "mobile"} device="mobile" icon={Smartphone} label="Mobile view" onSelect={setPreviewDevice} /></div>
                <button aria-label="Previous invitation" className="grid size-10 place-items-center rounded-full border border-forest/15 hover:bg-parchment" onClick={() => move(-1)} type="button"><ArrowLeft size={17} /></button><button aria-label="Next invitation" className="grid size-10 place-items-center rounded-full border border-forest/15 hover:bg-parchment" onClick={() => move(1)} type="button"><ArrowRight size={17} /></button><button aria-label="Close preview" className="ml-1 grid size-10 place-items-center rounded-full bg-forest text-warm-white" onClick={() => setSelectedIndex(null)} type="button"><X size={18} /></button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#d8d2c8] p-0 sm:p-5">
              <div className={cn("mx-auto min-h-full overflow-hidden bg-warm-white shadow-[0_12px_40px_rgba(23,53,37,.12)] transition-[max-width] duration-300", previewDevice === "desktop" && "max-w-full", previewDevice === "tablet" && "max-w-[768px]", previewDevice === "mobile" && "max-w-[390px]")}>
                <InvitationExperience device={previewDevice} template={selected} />
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-forest/10 bg-warm-white px-4 py-3 md:px-7"><p className="hidden text-sm text-taupe sm:block">Like this direction? Personalize every detail next.</p><Link className="ml-auto inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white" href={`/invitations/${selected.id}/customize`}>Customize this template <ArrowRight className="ml-2" size={16} /></Link></div>
          </div>
        </div>
      )}
    </>
  );
}

function DeviceButton({ active, device, icon: Icon, label, onSelect }: { active: boolean; device: PreviewDevice; icon: typeof Monitor; label: string; onSelect: (device: PreviewDevice) => void }) {
  return <button aria-label={label} aria-pressed={active} className={cn("grid size-9 place-items-center rounded-full transition-colors", active ? "bg-forest text-warm-white" : "text-taupe hover:bg-parchment")} onClick={() => onSelect(device)} title={label} type="button"><Icon size={16} /></button>;
}

export type EditableTextField = Exclude<keyof import("@/lib/invitation-templates").InvitationDetails, "audioUrl" | "fontStyle" | "photoUrl" | "textStyles">;

export function InvitationExperience({ activeTextField, device, template, details, onTextChange, onTextFocus, renderTextFormatting }: { activeTextField?: EditableTextField | null; device: PreviewDevice; template: InvitationTemplate; details?: import("@/lib/invitation-templates").InvitationDetails; onTextChange?: (field: EditableTextField, value: string) => void; onTextFocus?: (field: EditableTextField) => void; renderTextFormatting?: (field: EditableTextField) => React.ReactNode }) {
  const [defaultFirstName, defaultSecondName] = template.couple.split(" & ");
  const firstName = details?.partnerOne ?? defaultFirstName;
  const secondName = details?.partnerTwo ?? defaultSecondName;
  const compact = device !== "desktop";
  const edit = (field: EditableTextField, label: string, value: string, className?: string) => <InlineText className={className} formatting={activeTextField === field ? renderTextFormatting?.(field) : undefined} label={label} onChange={onTextChange ? (nextValue) => onTextChange(field, nextValue) : undefined} onFocus={onTextFocus ? () => onTextFocus(field) : undefined} style={details?.textStyles?.[field]} value={value} />;
  return (
    <div className={cn("bg-[#f4efe5] text-center", `invitation-font-${details?.fontStyle ?? "editorial"}`)}>
      <section className={cn("relative grid place-items-center overflow-hidden px-6", compact ? "min-h-[560px] py-16" : "min-h-[620px] py-20")}>
        <div className="absolute inset-x-[12%] bottom-0 top-12 rounded-t-[50%] border border-forest/15" />
        {details?.photoUrl && <div aria-label="Uploaded couple photograph" className="absolute inset-0 bg-cover bg-center opacity-20" role="img" style={{ backgroundImage: `url(${details.photoUrl})` }} />}
        <div className="relative"><p className="text-[.65rem] font-semibold uppercase tracking-[.28em] text-taupe">{edit("heroEyebrow", "Edit opening line", details?.heroEyebrow ?? "We are getting married")}</p><h2 className={cn("mt-8 font-display leading-[.72] tracking-[-.05em]", compact ? "text-6xl" : "text-8xl")}>{edit("partnerOne", "Edit partner one in preview", firstName, "mx-auto block w-fit min-w-32 px-3")}{edit("conjunction", "Edit name conjunction", details?.conjunction ?? "and", cn("mx-auto block w-fit px-3 italic text-gold", compact ? "text-3xl" : "text-5xl"))}{edit("partnerTwo", "Edit partner two in preview", secondName, "mx-auto block w-fit min-w-32 px-3")}</h2><p className="mx-auto mt-10 max-w-md leading-7 text-taupe">{edit("welcomeMessage", "Edit welcome message", details?.welcomeMessage ?? "Together with our families, we invite you to share in the joy of our wedding day.")}</p><div className="mt-9 inline-flex items-center gap-3 border-y border-forest/15 py-3 text-xs font-semibold tracking-[.18em]"><CalendarDays size={16} /> {edit("date", "Edit wedding date", details?.date ?? template.date)}</div>{details?.audioUrl && <audio aria-label="Invitation music" className="mx-auto mt-6 w-full max-w-xs" controls src={details.audioUrl} />}</div>
      </section>

      <section className="bg-warm-white px-5 py-20"><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">{edit("celebrationEyebrow", "Edit celebration label", details?.celebrationEyebrow ?? "The celebration")}</p><h3 className="mt-4 font-display text-5xl">{edit("celebrationTitle", "Edit celebration heading", details?.celebrationTitle ?? "Our day, with you")}</h3><div className={cn("mx-auto mt-12 grid max-w-3xl gap-5", !compact && "grid-cols-2")}><ScheduleCard address={details?.ceremonyAddress ?? "Garden Lane, Yerevan"} addressField="ceremonyAddress" edit={edit} icon={Church} place={details?.ceremonyVenue ?? "St. Anne’s Chapel"} placeField="ceremonyVenue" time={details?.ceremonyTime ?? "3:00 PM"} timeField="ceremonyTime" title={details?.ceremonyTitle ?? "Ceremony"} titleField="ceremonyTitle" /><ScheduleCard address={details?.receptionAddress ?? "Willow House, Yerevan"} addressField="receptionAddress" edit={edit} icon={Clock3} place={details?.receptionVenue ?? "The Orangery"} placeField="receptionVenue" time={details?.receptionTime ?? "5:30 PM"} timeField="receptionTime" title={details?.receptionTitle ?? "Dinner & dancing"} titleField="receptionTitle" /></div></section>

      <section className="bg-parchment px-5 py-20"><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">{edit("rsvpEyebrow", "Edit RSVP label", details?.rsvpEyebrow ?? "Kindly reply")}</p><h3 className="mt-4 font-display text-5xl">{edit("rsvpTitle", "Edit RSVP heading", details?.rsvpTitle ?? "Will you join us?")}</h3><p className="mx-auto mt-4 max-w-md leading-7 text-taupe">{edit("rsvpMessage", "Edit RSVP message", details?.rsvpMessage ?? "Please confirm your attendance and share any details with us.")}</p><div className="mx-auto mt-10 grid max-w-xl gap-4 text-left"><PreviewField edit={edit} label={details?.guestNameLabel ?? "Guest name"} labelField="guestNameLabel" placeholderField="guestNamePlaceholder" value={details?.guestNamePlaceholder ?? "Your guest’s name"} /><div className="grid gap-4 sm:grid-cols-2"><PreviewOption field="acceptLabel" label={details?.acceptLabel ?? "Joyfully accepts"} edit={edit} /><PreviewOption field="declineLabel" label={details?.declineLabel ?? "Sadly declines"} edit={edit} /></div><PreviewField edit={edit} label={details?.guestMessageLabel ?? "Message for the couple"} labelField="guestMessageLabel" placeholderField="guestMessagePlaceholder" value={details?.guestMessagePlaceholder ?? "Optional note"} /><div aria-disabled="true" className="mt-2 min-h-12 rounded-full bg-forest px-4 py-3 text-center text-sm font-semibold text-warm-white/60">{edit("submitLabel", "Edit RSVP button text", details?.submitLabel ?? "Send RSVP")}</div></div></section>

      <section className="bg-forest px-5 py-16 text-warm-white"><p className="font-display text-5xl italic">{edit("closingMessage", "Edit closing message", details?.closingMessage ?? "With love,")}</p><p className="mt-3 font-display text-3xl">{edit("partnerOne", "Edit partner one in closing", firstName)} &amp; {edit("partnerTwo", "Edit partner two in closing", secondName)}</p></section>
    </div>
  );
}

function InlineText({ className, formatting: formattingControls, label, onChange, onFocus, style, value }: { className?: string; formatting?: React.ReactNode; label: string; onChange?: (value: string) => void; onFocus?: () => void; style?: import("@/lib/invitation-templates").InvitationTextStyle; value: string }) {
  const formatting = cn(style?.font && style.font !== "inherit" && `invitation-text-${style.font}`, style?.bold && "font-bold", style?.italic && "italic", style?.underline && "underline decoration-1 underline-offset-4");
  const fontSize = style?.size === "small" ? ".86em" : style?.size === "large" ? "1.14em" : undefined;
  if (!onChange) return <span className={cn(formatting, className)} style={{ fontSize }}>{value}</span>;
  return <span className={cn("relative inline-block", className)} data-inline-text-host><span aria-label={label} className={cn("inline-block min-w-[2ch] cursor-text rounded-md outline-none transition-colors hover:bg-gold/10 focus:bg-warm-white/70 focus:ring-2 focus:ring-gold/60", formatting)} contentEditable onBlur={(event) => { const nextValue = event.currentTarget.textContent ?? ""; if (!nextValue.trim()) { event.currentTarget.textContent = value; return; } onChange(nextValue); }} onFocus={onFocus} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} role="textbox" style={{ fontSize }} suppressContentEditableWarning>{value}</span>{formattingControls}</span>;
}

type EditRenderer = (field: EditableTextField, label: string, value: string, className?: string) => React.ReactNode;

function ScheduleCard({ icon: Icon, time, title, place, address, edit, timeField, titleField, placeField, addressField }: { icon: typeof MapPin; time: string; title: string; place: string; address: string; edit: EditRenderer; timeField: EditableTextField; titleField: EditableTextField; placeField: EditableTextField; addressField: EditableTextField }) {
  return <div className="rounded-[1.5rem] border border-forest/10 bg-[#f4efe5] p-8 text-left"><Icon className="text-gold" size={24} strokeWidth={1.4} /><p className="mt-8 text-xs font-semibold tracking-[.18em] text-taupe">{edit(timeField, `Edit ${title} time`, time)}</p><p className="mt-3 font-display text-3xl">{edit(titleField, "Edit event title", title)}</p><p className="mt-5 font-semibold">{edit(placeField, `Edit ${title} venue`, place)}</p><p className="mt-1 flex items-center gap-2 text-sm text-taupe"><MapPin className="shrink-0" size={14} /> {edit(addressField, `Edit ${title} address`, address)}</p></div>;
}

function PreviewField({ label, value, edit, labelField, placeholderField }: { label: string; value: string; edit: EditRenderer; labelField: EditableTextField; placeholderField: EditableTextField }) {
  return <div className="text-xs font-semibold uppercase tracking-[.14em] text-taupe">{edit(labelField, "Edit field label", label)}<span className="mt-2 block rounded-xl border border-forest/15 bg-warm-white px-4 py-4 text-sm font-normal normal-case tracking-normal text-taupe/65">{edit(placeholderField, "Edit field placeholder", value)}</span></div>;
}

function PreviewOption({ label, edit, field }: { label: string; edit: EditRenderer; field: EditableTextField }) {
  return <div className="flex items-center gap-3 rounded-xl border border-forest/15 bg-warm-white px-4 py-4 text-sm text-taupe"><span className="size-4 shrink-0 rounded-full border border-forest/30" /> {edit(field, "Edit RSVP option", label)}</div>;
}
