import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import type { ClientSiteProps, ContactForm } from "../../types";
import { SECTIONS } from "../../constants";
import { useToast } from "../../context/ToastContext";
import { AnimNum } from "../ui/AnimNum";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { HexGrid } from "../ui/HexGrid";

export function ClientSite({ onSwitchToAdmin }: ClientSiteProps) {
  const toast = useToast();
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const handler = () => {
      setScrollY(el.scrollTop);
      const offsets = SECTIONS.map(s => {
        const ref = sectionRefs.current[s.id];
        return ref ? { id: s.id, top: ref.offsetTop - 100 } : null;
      }).filter(Boolean) as { id: string; top: number }[];
      const current = offsets.reverse().find(o => el.scrollTop >= o.top);
      if (current) setActiveSection(current.id);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const headerOpacity = Math.min(scrollY / 80, 0.96);

  // ─── Contact Form State ───
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", company: "", service: "", budget: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.message.trim()) e.message = "Please describe your project";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitForm = () => {
    if (!validateForm()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast("Message sent successfully! We'll be in touch soon.", "success");
      setTimeout(() => { setSent(false); setForm({ name: "", email: "", company: "", service: "", budget: "", message: "" }); }, 3000);
    }, 1500);
  };

  const serviceOptions = [
    "Web Application Development", "Mobile App Development", "SaaS Product Development",
    "API & System Integrations", "No-Code / Low-Code Solutions", "AI & Automation Systems",
    "System Design & Consulting",
  ];

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-bg relative scroll-smooth">

      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-100 px-10 h-16 flex items-center justify-between transition-[border-color] duration-300"
        style={{
          background: `rgba(6,11,24,${headerOpacity})`,
          backdropFilter: headerOpacity > 0.1 ? "blur(24px) saturate(1.2)" : "none",
          borderBottom: `1px solid ${headerOpacity > 0.3 ? "#162040" : "transparent"}`,
        }}
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
          <div className="w-[34px] h-[34px] rounded-lg bg-grad flex items-center justify-center text-[13px] font-extrabold text-main shadow-[0_0_20px_var(--color-primary-glow)]">{"</>"}</div>
          <span className="text-[17px] font-bold text-main -tracking-[0.5px]">
            Codnexia<span className="text-accent font-normal ml-1">Software</span>
          </span>
        </div>

        <nav className="flex gap-1.5">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className={clsx(
              "px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all duration-250 font-sans",
              activeSection === s.id ? "bg-accent-dim text-accent" : "bg-transparent text-secondary",
            )}>{s.label}</button>
          ))}
        </nav>

        <div className="flex gap-2.5 items-center">
          <button onClick={onSwitchToAdmin} className="px-3.5 py-[7px] rounded-lg bg-transparent border border-border text-secondary text-xs font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-border-light">
            Admin
          </button>
          <Btn onClick={() => scrollTo("contact")} className="!px-5 !py-2 !text-[13px]">Start a Project</Btn>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section ref={(el) => { sectionRefs.current.hero = el; }} id="hero" className="px-10 pt-[100px] pb-[90px] text-center relative overflow-hidden">
        <HexGrid />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] blur-[100px] opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(30,58,138,0.35) 0%, transparent 60%)" }} />
        <div className="absolute top-[60%] left-[30%] w-[400px] h-[400px] blur-[80px] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(45,212,168,0.22) 0%, transparent 60%)" }} />
        <SectionReveal className="relative z-[1]">
          <Pill color="#2DD4A8">Global Code &middot; African Excellence</Pill>
          <h1 className="text-[64px] font-extrabold text-main leading-[1.05] -tracking-[3px] mt-[26px] mb-5 mx-auto max-w-[740px]">
            Engineering the<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #2DD4A8, #4A9FF5)" }}>Next Generation</span> of Software
          </h1>
          <p className="text-[17px] text-secondary leading-[1.7] max-w-[540px] mx-auto mb-10">
            A global software development company built on African excellence. We design, build, and scale impactful technology products for startups and enterprises worldwide.
          </p>
          <div className="flex gap-3.5 justify-center">
            <Btn onClick={() => scrollTo("contact")}>Get a Quote &rarr;</Btn>
            <Btn variant="ghost" onClick={() => scrollTo("services")}>Our Services</Btn>
          </div>
          <div className="flex gap-12 justify-center mt-16">
            {[{ v: 50, s: "+", l: "Projects Delivered" }, { v: 20, s: "+", l: "Global Clients" }, { v: 99, s: "%", l: "Client Satisfaction" }].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-[32px] font-extrabold text-accent -tracking-[1px]"><AnimNum value={m.v} suffix={m.s} /></div>
                <div className="text-xs text-muted mt-1 font-medium">{m.l}</div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ─── ABOUT ─── */}
      <section ref={(el) => { sectionRefs.current.about = el; }} id="about" className="px-10 py-[90px] max-w-[1000px] mx-auto">
        <SectionReveal>
          <Pill>About Codnexia</Pill>
          <h2 className="text-[40px] font-bold text-main mt-4 mb-3.5 -tracking-[1.5px]">
            Transforming ideas into<br /><span className="text-accent">reliable software</span>
          </h2>
          <p className="text-base text-secondary leading-[1.8] max-w-[640px] mb-11">
            Codnexia Software is a global software development company delivering modern, scalable, and intelligent digital solutions. Built on African excellence and driven by innovation, we partner with startups, enterprises, and organizations worldwide to design, build, and scale impactful technology products.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-3 gap-4 mb-11">
          {[
            { icon: "\u25CE", title: "Mission", desc: "To build high-quality, scalable, and innovative software solutions that empower businesses globally while showcasing African engineering excellence.", color: "#2DD4A8" },
            { icon: "\u25C8", title: "Vision", desc: "To become a globally trusted technology company originating from Africa, shaping the future of digital innovation and software development.", color: "#4A9FF5" },
            { icon: "\u2726", title: "Values", desc: "Innovation First \u00B7 Engineering Excellence \u00B7 Integrity & Trust \u00B7 Global Mindset \u00B7 African Excellence", color: "#F5A623" },
          ].map((f, i) => (
            <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <Card hoverable className="relative overflow-hidden p-7 h-full">
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full" style={{ background: `radial-gradient(circle, ${f.color}15, transparent)` }} />
                <div className="text-2xl mb-3.5" style={{ color: f.color }}>{f.icon}</div>
                <div className="text-base font-bold text-main mb-2">{f.title}</div>
                <div className="text-[13px] text-secondary leading-[1.7]">{f.desc}</div>
              </Card>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <div className="flex gap-2.5 flex-wrap">
            {["Innovation First", "Engineering Excellence", "Integrity & Trust", "Global Mindset", "African Excellence"].map(v => (
              <span key={v} className="px-4 py-2 rounded-[20px] bg-surface border border-border text-xs text-secondary font-medium transition-all duration-200 cursor-default hover:border-accent/27 hover:text-accent">
                {v}
              </span>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ─── HOW WE WORK ─── */}
      <section ref={(el) => { sectionRefs.current.how = el; }} id="how" className="px-10 py-[90px] max-w-[1000px] mx-auto">
        <SectionReveal>
          <Pill>Our Process</Pill>
          <h2 className="text-[40px] font-bold text-main mt-4 mb-12 -tracking-[1.5px]">How we deliver results</h2>
        </SectionReveal>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: "01", title: "Discovery & Design", desc: "Understand your vision, define scope, wireframe solutions and plan the architecture.", icon: "\uD83D\uDD0D" },
            { step: "02", title: "Build & Develop", desc: "Agile sprints with clean, scalable code. REST APIs, WebSockets, mobile & web UIs.", icon: "\u2699\uFE0F" },
            { step: "03", title: "Test & Integrate", desc: "Comprehensive QA, security audits, CI/CD pipelines and system integrations.", icon: "\uD83E\uDDEA" },
            { step: "04", title: "Deploy & Scale", desc: "Containerized deployment, monitoring dashboards, and ongoing support for growth.", icon: "\uD83D\uDE80" },
          ].map((s, i) => (
            <SectionReveal key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <Card hoverable className="relative h-full !p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[34px] font-extrabold text-primary font-mono -tracking-[2px] opacity-50">{s.step}</span>
                  <span className="text-[26px]">{s.icon}</span>
                </div>
                <div className="text-[15px] font-bold text-main mb-2">{s.title}</div>
                <div className="text-[13px] text-secondary leading-[1.7]">{s.desc}</div>
                {i < 3 && <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-lg text-muted z-[2]">&rarr;</div>}
              </Card>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section ref={(el) => { sectionRefs.current.services = el; }} id="services" className="px-10 py-[90px] max-w-[1000px] mx-auto">
        <SectionReveal>
          <Pill>Services</Pill>
          <h2 className="text-[40px] font-bold text-main mt-4 mb-12 -tracking-[1.5px]">What we build</h2>
        </SectionReveal>
        <div className="grid grid-cols-3 gap-3.5">
          {[
            { icon: "\uD83C\uDF10", title: "Web Applications", desc: "Modern, responsive web apps with React, NestJS, and scalable backends. From SPAs to full-stack platforms.", tag: "Frontend + Backend" },
            { icon: "\uD83D\uDCF1", title: "Mobile Apps", desc: "Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.", tag: "iOS \u00B7 Android" },
            { icon: "\u2601\uFE0F", title: "SaaS Products", desc: "End-to-end SaaS platforms with multi-tenancy, subscription billing, dashboards, and analytics.", tag: "Cloud" },
            { icon: "\uD83D\uDD17", title: "API & Integrations", desc: "RESTful APIs, GraphQL, third-party integrations, webhooks, and data pipeline orchestration.", tag: "Backend" },
            { icon: "\u26A1", title: "No-Code / Low-Code", desc: "Rapid prototyping and business automation with Bubble, Retool, and custom low-code platforms.", tag: "Rapid" },
            { icon: "\uD83E\uDD16", title: "AI & Automation", desc: "AI-driven systems, LLM integrations, intelligent workflows, chatbots, and process automation.", tag: "AI/ML" },
            { icon: "\uD83D\uDCD0", title: "System Design & Consulting", desc: "Architecture consulting, tech audits, infrastructure planning, and team augmentation.", tag: "Consulting" },
          ].map((s, i) => (
            <SectionReveal key={i} style={{ transitionDelay: `${i * 0.06}s`, ...(i === 6 ? { gridColumn: "2 / 3" } : {}) }}>
              <Card hoverable className="h-full">
                <div className="flex justify-between items-start mb-3.5">
                  <span className="text-[30px]">{s.icon}</span>
                  <Pill color="#4A9FF5">{s.tag}</Pill>
                </div>
                <div className="text-base font-bold text-main mb-1.5">{s.title}</div>
                <div className="text-[13px] text-secondary leading-[1.7]">{s.desc}</div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section ref={(el) => { sectionRefs.current.contact = el; }} id="contact" className="px-10 py-[90px] max-w-250 mx-auto">
        <SectionReveal>
          <Pill>Contact Us</Pill>
          <h2 className="text-[40px] font-bold text-main mt-4 mb-12 -tracking-[1.5px]">
            Let's build something <span className="text-accent">great</span>
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 gap-6">
          {/* Form */}
          <SectionReveal>
            <Card className="!p-8">
              <h3 className="text-lg font-bold text-main mb-1">Send us a message</h3>
              <p className="text-[13px] text-secondary mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

              {sent ? (
                <div className="text-center py-10 px-5">
                  <div className="text-5xl mb-4">&check;</div>
                  <h3 className="text-xl font-bold text-accent mb-2">Message Sent!</h3>
                  <p className="text-sm text-secondary">We'll review your inquiry and respond shortly.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name *" placeholder="John Doe" value={form.name} onChange={v => setForm({ ...form, name: v })} error={formErrors.name} />
                    <Input label="Email Address *" placeholder="john@company.com" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" error={formErrors.email} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Company" placeholder="Acme Inc." value={form.company} onChange={v => setForm({ ...form, company: v })} />
                    <div className="mb-[18px]">
                      <label className="text-xs text-secondary block mb-1.5 font-semibold">Service Interested In</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className={clsx(
                          "w-full px-4 py-[11px] rounded-[10px] bg-surface border border-border text-sm font-sans outline-none appearance-none cursor-pointer box-border",
                          form.service ? "text-main" : "text-muted",
                        )}
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-[18px]">
                    <label className="text-xs text-secondary block mb-2 font-semibold">Budget Range</label>
                    <div className="flex gap-2 flex-wrap">
                      {["< $5K", "$5K - $15K", "$15K - $50K", "$50K+", "Not sure"].map(b => (
                        <button key={b} onClick={() => setForm({ ...form, budget: b })} className={clsx(
                          "px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer font-sans transition-all duration-200",
                          form.budget === b
                            ? "border-accent/40 bg-accent-dim text-accent"
                            : "border-border bg-surface text-secondary",
                        )}>{b}</button>
                      ))}
                    </div>
                  </div>
                  <Input label="Project Details *" placeholder="Tell us about your project, goals, and timeline..." value={form.message} onChange={v => setForm({ ...form, message: v })} textarea error={formErrors.message} />
                  <Btn onClick={submitForm} disabled={sending} className="!w-full !py-3.5 !px-0">
                    {sending ? "Sending..." : "Send Message \u2192"}
                  </Btn>
                </>
              )}
            </Card>
          </SectionReveal>

          {/* Contact Info */}
          <SectionReveal style={{ transitionDelay: "0.15s" }}>
            <div className="flex flex-col gap-4">
              <Card className="!p-7">
                <h3 className="text-base font-bold text-main mb-4">Get in Touch</h3>
                {[
                  { icon: "\u2709", label: "Email", value: "info@codnexia.com", sub: "We respond within 24 hours" },
                  { icon: "\u25CE", label: "Website", value: "www.codnexia.com", sub: "Visit our portfolio & blog" },
                  { icon: "\u25C8", label: "Location", value: "Africa", sub: "Serving clients globally" },
                  { icon: "\u23F1", label: "Availability", value: "Mon - Fri", sub: "9:00 AM - 6:00 PM EAT" },
                ].map((c, i) => (
                  <div key={i} className={clsx("flex gap-3.5 items-start py-3", i < 3 && "border-b border-border")}>
                    <div className="w-9 h-9 rounded-[10px] bg-accent-dim flex items-center justify-center text-base text-accent shrink-0">{c.icon}</div>
                    <div>
                      <div className="text-[11px] text-muted font-semibold uppercase tracking-[0.5px] mb-0.5">{c.label}</div>
                      <div className="text-sm text-main font-semibold">{c.value}</div>
                      <div className="text-xs text-secondary mt-px">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="!p-7 relative overflow-hidden">
                <HexGrid />
                <div className="relative z-[1]">
                  <h3 className="text-base font-bold text-main mb-2">Follow Us</h3>
                  <p className="text-[13px] text-secondary mb-4">Stay updated with our latest projects and insights.</p>
                  <div className="flex gap-2.5">
                    {[
                      { name: "Twitter", icon: "\uD835\uDD4F" }, { name: "GitHub", icon: "\u2318" },
                      { name: "LinkedIn", icon: "in" }, { name: "Dribbble", icon: "\u25C9" },
                    ].map(s => (
                      <button key={s.name} onClick={() => toast(`Opening ${s.name}...`, "info")} className="w-[42px] h-[42px] rounded-[10px] bg-surface border border-border flex items-center justify-center text-base text-secondary cursor-pointer transition-all duration-200 font-sans hover:border-accent/27 hover:text-accent">
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-10 pt-10 pb-8 border-t border-border max-w-[1000px] mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-grad flex items-center justify-center text-[10px] font-extrabold text-main">{"</>"}</div>
              <span className="text-[15px] font-bold text-main">Codnexia <span className="text-accent font-normal">Software</span></span>
            </div>
            <p className="text-[13px] text-secondary leading-[1.7]">Engineering the next generation of software. Global code, African excellence.</p>
          </div>
          {[
            { title: "Services", items: ["Web Apps", "Mobile Apps", "SaaS", "API & Integrations"] },
            { title: "Company", items: ["About Us", "Our Process", "Careers", "Blog"] },
            { title: "Support", items: ["Contact", "Documentation", "Status", "Privacy Policy"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-[0.8px]">{col.title}</h4>
              {col.items.map(item => (
                <div key={item} className="text-[13px] text-secondary py-1 cursor-pointer transition-colors duration-200 hover:text-accent">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-5 border-t border-border">
          <span className="text-xs text-muted">&copy; 2026 Codnexia Software. All rights reserved.</span>
          <span className="text-[11px] text-accent font-semibold opacity-70">Global Code. African Excellence.</span>
        </div>
      </footer>
    </div>
  );
}
