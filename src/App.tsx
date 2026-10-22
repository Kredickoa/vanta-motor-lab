import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { ArrowRight, Menu } from "lucide-react";
import { cn } from "./lib/utils";
import CarSequence from "./CarSequence";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }} className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 mix-blend-difference text-white pointer-events-none">
      <button type="button" onClick={() => scrollToSection('top')} aria-label="Vanta Motor Lab — home" className="text-[11px] font-medium tracking-[0.2em] uppercase pointer-events-auto">
        Vanta Motor Lab
      </button>
      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] opacity-80">
          <button type="button" onClick={() => scrollToSection('zakres')} className="uppercase hover:opacity-100 transition-opacity">Services</button>
          <button type="button" onClick={() => scrollToSection('proces')} className="uppercase hover:opacity-100 transition-opacity">Process</button>
          <button type="button" onClick={() => scrollToSection('pakiety')} className="uppercase hover:opacity-100 transition-opacity">Packages</button>
          <button type="button" onClick={() => scrollToSection('kontakt')} className="uppercase hover:opacity-100 transition-opacity">Contact</button>
        </div>
        <button type="button" aria-expanded={menuOpen} aria-controls="vanta-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(open => !open)} className="flex md:hidden items-center gap-2 hover:opacity-70 transition-opacity">
          <span className="text-[10px] uppercase tracking-[0.15em] hidden sm:block">Menu</span>
          <Menu className="w-4 h-4" />
        </button>
      </div>
      {menuOpen && (
        <div id="vanta-menu" className="absolute right-6 top-full pointer-events-auto rounded-2xl border border-white/20 bg-black p-6 flex md:hidden flex-col gap-5 text-xs uppercase tracking-widest">
          {[['zakres', 'Services'], ['proces', 'Process'], ['pakiety', 'Packages'], ['kontakt', 'Contact']].map(([id, label]) => (
            <button key={id} type="button" className="text-left uppercase" onClick={() => { setMenuOpen(false); scrollToSection(id); }}>{label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const width = useTransform(scrollYProgress, [0, .15], ["calc(100% - 48px)", "calc(100% - 0px)"]);
  const height = useTransform(scrollYProgress, [0, .15], ["calc(100vh - 352px)", "calc(100vh - 0px)"]);
  const borderRadius = useTransform(scrollYProgress, [0, .15], ["24px", "0px"]);

  return (
    <section id="hero" className="w-full bg-studio-bg">
      <div className="relative flex w-full flex-col items-center px-4 pb-8 pt-24 text-center">
          <h1 className="text-[clamp(2.75rem,5.3vw,5.25rem)] font-medium tracking-tighter text-studio-ink leading-[0.95] mb-4 max-w-6xl">
            Every car. <br className="md:hidden" /> Every <span className="text-studio-gray">detail.</span>
          </h1>
          <p className="text-base md:text-lg text-studio-gray max-w-2xl font-light leading-relaxed mb-6 px-4">
            Premium automotive preparation and presentation. Paint, light, interiors and form, brought together with precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button type="button" onClick={() => scrollToSection('kontakt')} className="bg-studio-ink text-white px-7 py-3 rounded-full text-[11px] font-medium hover:bg-studio-ink/90 transition-colors uppercase tracking-[0.15em]">
              Book a consultation
            </button>
            <button type="button" onClick={() => scrollToSection('proces')} className="text-studio-ink border border-studio-border px-7 py-3 rounded-full text-[11px] font-medium hover:bg-studio-border/50 transition-colors uppercase tracking-[0.15em]">
              Explore the process
            </button>
          </div>
      </div>
      <div ref={containerRef} className="relative h-[260vh] w-full">
        <div className="sticky top-0 flex h-screen w-full justify-center overflow-hidden">
          <motion.div style={{ width, height, borderRadius }} className="min-h-[240px] overflow-hidden bg-[#efefef] shadow-2xl origin-top">
            <CarSequence progress={scrollYProgress} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) {
  return (
    <div className={cn("mb-16 md:mb-24", className)}>
      {subtitle && <h3 className="text-[10px] uppercase font-medium tracking-[0.2em] text-studio-gray mb-4">{subtitle}</h3>}
      <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-studio-ink">{title}</h2>
    </div>
  );
}

const services = [
  { title: "Premium vehicle preparation", desc: "Thorough cleaning and meticulous surface preparation that preserves the original character of your car.", image: "service-preparation" },
  { title: "Ceramic coatings & PPF", desc: "Advanced paint protection for a durable shield and a deep, glass-like finish.", image: "service-protection" },
  { title: "Paint correction", desc: "Multi-stage polishing to restore colour depth and remove imperfections from the paintwork.", image: "service-paint-correction" },
  { title: "Collector presentation", desc: "Preparation for photoshoots, auctions and exhibitions, where every detail shapes the final impression.", image: "service-collector" }
];

function Services() {
  return (
    <section id="zakres" className="py-32 px-6 md:px-12 w-full bg-white relative z-30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Expertise" title="Our Services" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {services.map((svc, idx) => (
            <div key={idx} className="group relative border-t border-studio-border pt-8 flex flex-col items-start">
               <div className="w-full aspect-[16/9] mb-8 overflow-hidden rounded-xl bg-studio-bg relative">
                 <img loading="lazy" decoding="async"
                   src={`./images/${svc.image}.webp`}
                   alt={svc.title}
                   className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                 />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
               </div>
               <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-3 flex items-center justify-between w-full">
                 {svc.title}
                 <ArrowRight className="w-5 h-5 text-studio-gray opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
               </h3>
               <p className="text-studio-gray font-light text-sm md:text-base leading-relaxed max-w-sm">
                 {svc.desc}
               </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  { num: "01", title: "Vehicle assessment", text: "A detailed assessment of paint condition, coating thickness and interior finishes under dedicated inspection lighting." },
  { num: "02", title: "A tailored plan", text: "Techniques and tools selected for your model, paint finish and year of manufacture." },
  { num: "03", title: "Studio finish", text: "Focused, meticulous work in the controlled environment of our studio, from initial correction to the finishing touches." },
  { num: "04", title: "Handover & documentation", text: "A personal handover with a photographic record of the process and clear guidance on caring for your car." },
];

function Process() {
  return (
    <section id="proces" className="py-32 px-6 md:px-12 w-full bg-studio-bg border-t border-studio-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
           <div className="sticky top-32">
             <SectionHeading subtitle="Our approach" title="The Process" className="mb-8" />
             <p className="text-studio-gray font-light leading-relaxed max-w-md">
               We restore surfaces, protect finishes and prepare cars for their next chapter. Each project receives its own carefully considered approach.
             </p>
           </div>
        </div>
        <div className="lg:col-span-7 flex flex-col gap-12">
          {processSteps.map((step, idx) => (
            <div key={idx} className="flex gap-6 md:gap-12 group">
              <div className="font-sans text-3xl md:text-5xl font-light text-studio-gray/30 group-hover:text-studio-ink transition-colors duration-500">
                {step.num}
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <h4 className="text-xl md:text-2xl font-medium tracking-tight text-studio-ink">{step.title}</h4>
                <p className="text-studio-gray font-light leading-relaxed text-sm md:text-base max-w-sm">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const packages = [
  { name: "Essential", for: "For new and well-maintained cars", price: "From PLN 3,500", features: ["Multi-stage cleaning", "Single-stage paint enhancement", "One-year protective coating", "Essential interior detailing"] },
  { name: "Signature", for: "The Vanta Studio standard", price: "From PLN 6,000", features: ["Multi-stage cleaning", "Full multi-stage paint correction", "Ceramic coating (3–5 years)", "Exterior trim protection", "Advanced interior detailing"] },
  { name: "Collector", for: "For classics and investment cars", price: "Bespoke quotation", features: ["Specialist vehicle inspection", "Bespoke detailing throughout", "Restoration and spot repairs", "Paint protection film (optional)", "Complete photographic documentation"] },
];

function Packages() {
  return (
    <section id="pakiety" className="py-32 px-6 md:px-12 w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Our standards" title="Detailing Packages" className="text-center md:text-left" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div key={idx} className="border border-studio-border rounded-3xl p-8 lg:p-10 flex flex-col hover:border-studio-gray/30 transition-colors bg-studio-bg/50">
               <div className="mb-12">
                 <h4 className="text-2xl font-medium tracking-tight mb-2">{pkg.name}</h4>
                 <p className="text-[11px] uppercase tracking-widest text-studio-gray">{pkg.for}</p>
               </div>
               <div className="text-xl md:text-2xl font-light text-studio-ink mb-12">
                 {pkg.price}
               </div>
               <div className="flex flex-col gap-4 mb-16 flex-grow">
                 {pkg.features.map((feat, fidx) => (
                   <div key={fidx} className="flex gap-3 items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-studio-border mt-2 shrink-0"></div>
                     <span className="text-sm font-light text-studio-gray leading-tight">{feat}</span>
                   </div>
                 ))}
               </div>
               <button type="button" onClick={() => scrollToSection('kontakt')} className="w-full py-4 border border-studio-ink text-studio-ink rounded-full text-[11px] uppercase tracking-widest font-medium hover:bg-studio-ink hover:text-white transition-colors">
                 Choose package
               </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseNotes() {
  const images = [
    { src: "./images/case-silver-coupe.webp", alt: "Silver classic coupe in the studio", span: "col-span-1 md:col-span-2 row-span-2" },
    { src: "./images/case-green-grand-tourer.webp", alt: "Deep green grand touring coupe in the studio", span: "col-span-1 md:col-span-1 row-span-1" },
    { src: "./images/case-white-performance-sedan.webp", alt: "White performance sedan, rear three-quarter view", span: "col-span-1 md:col-span-1 row-span-1" },
    { src: "./images/case-burgundy-supercar.webp", alt: "Burgundy classic supercar in the studio", span: "col-span-1 md:col-span-2 row-span-1" },
  ];

  return (
    <section className="py-32 px-6 md:px-12 w-full bg-studio-bg border-t border-studio-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 md:mb-24">
          <div>
            <h3 className="text-[10px] uppercase font-medium tracking-[0.2em] text-studio-gray mb-4">Portfolio</h3>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-studio-ink">Case Notes</h2>
          </div>
          <button type="button" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hidden md:flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase hover:opacity-70 transition-opacity">
            About this project <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {images.map((img, idx) => (
            <div key={idx} className={cn("overflow-hidden rounded-2xl bg-black group relative", img.span)}>
               <img loading="lazy" decoding="async"
                 src={img.src}
                 alt={img.alt}
                 className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-in-out"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end p-6">
                 <span className="text-white text-[10px] uppercase tracking-widest font-medium">Model / Detail</span>
               </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="md:hidden mt-12 w-full flex justify-center items-center gap-2 border border-studio-border py-4 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-studio-border/50 transition-colors">
            About this project
        </button>
      </div>
    </section>
  );
}

function BoutiqueContact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="kontakt" className="py-32 px-6 md:px-12 w-full bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-[10px] uppercase font-medium tracking-[0.2em] text-white/50 mb-6">Start a conversation</h3>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-8 max-w-md">Tell us about your car.</h2>
          <p className="text-white/60 font-light leading-relaxed max-w-md mb-12">
            Every project begins with a conversation about your car and the finish you have in mind.
            Share a few details so we can recommend the right approach.
          </p>
          <div className="flex flex-col gap-4 text-sm font-light text-white/80">
             <div className="flex justify-between border-b border-white/10 pb-4">
               <span>Email</span>
               <button type="button" aria-haspopup="dialog" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hover:text-white transition-colors">studio@vantamotorlab.pl</button>
             </div>
             <div className="flex justify-between border-b border-white/10 pb-4">
               <span>Phone (by appointment)</span>
               <button type="button" aria-haspopup="dialog" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hover:text-white transition-colors">+48 000 000 000</button>
             </div>
          </div>
        </div>

        <div className="bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10">
          <form className="flex flex-col gap-6" onInput={() => setSubmitted(false)} onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50 pl-2">Make and model</label>
                <input name="model" aria-label="Make and model" type="text" required pattern=".*\S.*" className="bg-transparent border-b border-white/20 pb-3 text-sm focus:outline-none focus:border-white transition-colors" placeholder="e.g. Porsche 911" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50 pl-2">Year of manufacture</label>
                <input name="year" aria-label="Year of manufacture" type="number" required min={1886} max={new Date().getFullYear() + 1} className="bg-transparent border-b border-white/20 pb-3 text-sm focus:outline-none focus:border-white transition-colors" placeholder="e.g. 2023" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-[10px] uppercase tracking-widest text-white/50 pl-2">Project goal (choose one)</label>
              <select className="bg-transparent border-b border-white/20 pb-3 text-sm focus:outline-none focus:border-white transition-colors text-white/80 appearance-none rounded-none cursor-pointer">
                <option value="collection" className="bg-[#111111]">Collection / private garage</option>
                <option value="daily" className="bg-[#111111]">Daily driving</option>
                <option value="sale" className="bg-[#111111]">Preparation for sale</option>
                <option value="event" className="bg-[#111111]">Event / exhibition preparation</option>
                <option value="new" className="bg-[#111111]">New car delivery</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-[10px] uppercase tracking-widest text-white/50 pl-2">Current condition and project goals</label>
              <textarea name="description" aria-label="Condition and goals" required minLength={10} rows={3} className="bg-transparent border-b border-white/20 pb-3 text-sm focus:outline-none focus:border-white transition-colors resize-none" placeholder="What would you like us to achieve for your car?" />
            </div>

            <button type="submit" className="mt-8 relative overflow-hidden bg-white text-black py-4 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Preview enquiry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            {submitted && <p role="status" className="text-sm leading-relaxed text-white/60">Your enquiry is ready to preview. This is a demo — no information has been sent or saved.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white/40 pb-12 pt-24 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12 font-light text-xs tracking-wider uppercase">
      <div>
        <p>© {new Date().getFullYear()} VANTA Motor Lab.</p>
      </div>
      <div className="flex gap-8">
        <button type="button" aria-haspopup="dialog" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hover:text-white transition-colors">Instagram</button>
        <button type="button" aria-haspopup="dialog" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hover:text-white transition-colors">Privacy policy</button>
        <button type="button" aria-haspopup="dialog" onClick={() => document.querySelector<HTMLDialogElement>('#demo-info')?.showModal()} className="hover:text-white transition-colors">Terms & conditions</button>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <div id="top" className="w-full font-sans bg-studio-bg text-studio-ink selection:bg-studio-ink selection:text-white">
      <Navbar />
      <HeroReveal />
      <Services />
      <Process />
      <Packages />
      <CaseNotes />
      <BoutiqueContact />
      <Footer />

      <dialog id="demo-info" aria-labelledby="demo-info-title" className="max-w-md rounded-2xl border border-white/20 bg-neutral-950 p-8 text-stone-100 shadow-2xl backdrop:bg-black/60">
        <h2 id="demo-info-title" className="text-xl font-medium mb-4">Portfolio concept</h2>
        <p className="text-sm leading-relaxed text-stone-300">This is a demonstration portfolio project. Contact details are placeholders; bookings and messages are not submitted.</p>
        <form method="dialog" className="mt-6">
          <button className="rounded-full bg-white px-5 py-2 text-sm text-black">Close</button>
        </form>
      </dialog>
</div>
  );
}
