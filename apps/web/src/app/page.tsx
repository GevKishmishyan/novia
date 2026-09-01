import Image from "next/image";
import { ArrowRight, CalendarCheck, CircleDollarSign, HeartHandshake, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

const features = [
  { icon: UsersRound, number: "01", title: "Guests, gathered", copy: "Manage your list, track every RSVP, and keep the details close without the spreadsheet sprawl." },
  { icon: CalendarCheck, number: "02", title: "Plans, in motion", copy: "Turn a long list into thoughtful next steps, with every task and deadline in one reassuring view." },
  { icon: CircleDollarSign, number: "03", title: "Budget, balanced", copy: "Know what is planned, paid, and still ahead—so the numbers never steal the joy." },
];

export default function Home() {
  return (
    <main>
      <Header />
      <section className="min-h-[760px] overflow-hidden bg-parchment pt-32 md:min-h-[760px] md:pt-32">
        <div className="shell grid items-center gap-8 md:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-[1] py-12 md:py-10">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-taupe">Your day, beautifully organized</p>
            <h1 className="font-display text-[clamp(4.5rem,9vw,8.5rem)] font-medium leading-[.76] tracking-[-0.055em]">Plan beautifully.<br /><span className="italic">Celebrate fully.</span></h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-taupe md:text-lg">Novia brings your guests, budget, and to-dos into one calm, considered place—so you can spend less time managing and more time feeling it all.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><ButtonLink href="/invitations">Start planning <ArrowRight className="ml-2" size={16} /></ButtonLink><a className="text-sm font-semibold underline decoration-gold underline-offset-8" href="#how-it-works">See how it works</a></div>
          </div>
          <div className="relative mx-auto h-[510px] w-full max-w-[520px] self-end text-forest md:h-[650px]">
            <div className="absolute inset-8 rounded-[50%_50%_4rem_4rem] border border-forest/10 bg-warm-white/25" />
            <Image alt="Editorial line illustration of a bride" className="object-contain" fill priority sizes="(min-width: 768px) 46vw, 100vw" src="/brand/novia-bride.svg" />
            <p className="absolute bottom-6 right-0 max-w-28 rotate-[-4deg] font-display text-2xl italic leading-6 text-taupe">made for your kind of magic</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" id="features">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-2"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">Everything in its place</p><h2 className="font-display text-5xl leading-[.95] tracking-[-0.04em] md:text-7xl">A little less planning.<br /><span className="italic">A lot more present.</span></h2></div>
          <div className="mt-16 grid border-t border-forest/15 md:grid-cols-3">
            {features.map(({ icon: Icon, number, title, copy }) => <article className="border-b border-forest/15 py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" key={title}><div className="flex items-center justify-between text-taupe"><Icon strokeWidth={1.4} /><span className="font-display text-lg italic">{number}</span></div><h3 className="mt-12 font-display text-4xl">{title}</h3><p className="mt-4 max-w-sm text-sm leading-6 text-taupe">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-forest py-24 text-warm-white md:py-32" id="how-it-works">
        <div className="shell grid items-center gap-16 md:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">How it works</p><h2 className="mt-6 font-display text-6xl leading-[.9] tracking-[-0.04em] md:text-8xl">From “yes”<br />to <span className="italic">I do.</span></h2><p className="mt-7 max-w-md leading-7 text-warm-white/65">Begin with the essentials, invite your people, and let Novia gently keep everything moving toward the day.</p><ButtonLink className="mt-9" href="/invitations" variant="light">Choose your invitation</ButtonLink></div>
          <ol className="border-t border-warm-white/20">
            {["Choose your invitation", "Collect guest responses", "Plan each detail with ease"].map((item, index) => <li className="flex items-center gap-6 border-b border-warm-white/20 py-7" key={item}><span className="font-display text-2xl italic text-sage">0{index + 1}</span><span className="font-display text-3xl">{item}</span></li>)}
          </ol>
        </div>
      </section>

      <section className="py-24 text-center md:py-32" id="about"><HeartHandshake className="mx-auto text-gold" size={32} strokeWidth={1.4} /><p className="mx-auto mt-8 max-w-3xl font-display text-4xl leading-tight md:text-6xl">“The best celebrations feel effortless. The planning should feel a little more like that, too.”</p><p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-taupe">The idea behind Novia</p></section>
      <section className="bg-parchment py-20 text-center"><h2 className="font-display text-5xl tracking-[-0.04em] md:text-7xl">Your beautiful beginning.</h2><p className="mt-4 text-taupe">Start bringing the day you imagine into view.</p><ButtonLink className="mt-8" href="/invitations">Explore invitations <ArrowRight className="ml-2" size={16} /></ButtonLink></section>
      <Footer />
    </main>
  );
}
