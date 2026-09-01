import { cn } from "@/lib/utils";
import type { InvitationTemplate } from "@/lib/invitation-templates";

const surfaces: Record<InvitationTemplate["accent"], string> = {
  arch: "bg-[#e9dfcf]",
  botanical: "bg-[#f2f0e8]",
  monogram: "bg-[#f7f3e8]",
  ribbon: "bg-[#eadbd6]",
  minimal: "bg-[#f5f2ec]",
  terracotta: "bg-[#d9a087]",
};

export function TemplatePreview({ template }: { template: InvitationTemplate }) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[1.5rem] p-8", surfaces[template.accent])}>
      {template.accent === "arch" && <div className="absolute inset-x-10 bottom-0 top-12 rounded-t-full border border-forest/30" />}
      {template.accent === "botanical" && <><span className="absolute -left-10 top-6 h-44 w-24 rotate-[28deg] rounded-[100%] border border-forest/25" /><span className="absolute -right-8 bottom-8 h-48 w-24 -rotate-[32deg] rounded-[100%] border border-forest/25" /></>}
      {template.accent === "monogram" && <div className="absolute left-1/2 top-[22%] grid size-20 -translate-x-1/2 place-items-center rounded-full border border-gold/60 font-display text-3xl italic text-gold">N·D</div>}
      {template.accent === "ribbon" && <div className="absolute -right-16 top-12 h-16 w-64 -rotate-12 border-y border-taupe/20 bg-warm-white/35" />}
      {template.accent === "terracotta" && <div className="absolute inset-5 rounded-[45%_45%_1rem_1rem] border border-warm-white/45" />}
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <p className="text-[.58rem] font-semibold uppercase tracking-[.24em] text-taupe">Together with their families</p>
        <p className={cn("mt-6 font-display text-4xl leading-[.82] tracking-[-0.04em]", template.accent === "terracotta" && "text-warm-white")}>{template.couple.replace(" & ", "\n&\n").split("\n").map((part) => <span className="block" key={part}>{part}</span>)}</p>
        <div className="my-6 h-px w-10 bg-gold" />
        <p className={cn("text-[.62rem] tracking-[.17em] text-taupe", template.accent === "terracotta" && "text-warm-white/80")}>{template.date}</p>
        <p className={cn("mt-2 font-display text-sm italic text-taupe", template.accent === "terracotta" && "text-warm-white/80")}>Celebrate with us</p>
      </div>
    </div>
  );
}
