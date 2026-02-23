import { useState } from "react";
import clsx from "clsx";
import type { ContactForm } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { HexGrid } from "../ui/HexGrid";

interface ContactSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const SERVICE_OPTIONS = [
  "Web Application Development", "Mobile App Development", "SaaS Product Development",
  "API & System Integrations", "No-Code / Low-Code Solutions", "AI & Automation Systems",
  "System Design & Consulting",
];

export function ContactSection({ sectionRef }: ContactSectionProps) {
  const toast = useToast();
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

  return (
    <section ref={sectionRef} id="contact" className="px-10 py-[90px] max-w-250 mx-auto">
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
                      {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
  );
}
