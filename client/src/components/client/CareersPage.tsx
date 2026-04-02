import { useState, useEffect, useRef, useId } from "react";
import clsx from "clsx";
import type { JobPosition, ParsedResume } from "../../types";
import { useToast } from "../../context/ToastContext";
import { submitCareerApplication, getOpenJobPositions, uploadResume } from "../../lib/api";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { Pill } from "../ui/Pill";
import { HexGrid } from "../ui/HexGrid";

interface CareersPageProps {
  onBack: () => void;
}

const STEPS = [
  { label: "Personal Info", icon: "\uD83D\uDC64", desc: "Name, contact & online profiles" },
  { label: "Professional", icon: "\uD83D\uDCBC", desc: "Experience, role & preferences" },
  { label: "Skills & Education", icon: "\uD83C\uDFAF", desc: "Tech stack & qualifications" },
  { label: "Motivation", icon: "\uD83D\uDCDD", desc: "Why Codnexia & your story" },
  { label: "Review & Submit", icon: "\uD83E\uDD16", desc: "Review your application" },
];

const TECH_STACKS = [
  "React", "Next.js", "Vue.js", "Angular", "TypeScript", "Node.js", "NestJS",
  "Python", "Django", "FastAPI", "Java", "Spring Boot", "Go", "Rust",
  "React Native", "Flutter", "Swift", "Kotlin",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  "TensorFlow", "PyTorch", "LangChain", "OpenAI",
  "Figma", "UI/UX Design", "Product Management",
];

const POSITIONS = [
  "Senior Frontend Engineer", "Senior Backend Engineer", "Full-Stack Developer",
  "Mobile Developer (React Native/Flutter)", "DevOps / Infrastructure Engineer",
  "AI/ML Engineer", "UI/UX Designer", "Product Manager",
  "QA / Test Engineer", "Technical Lead / Architect", "Other",
];


const INITIAL_DATA = {
  firstName: "", lastName: "", email: "", phone: "", countryCode: "+254",
  country: "", city: "", nationality: "",
  linkedin: "", github: "", portfolio: "", website: "",
  currentRole: "", company: "", experience: "", noticePeriod: "",
  employmentType: "", workMode: "", salaryExpectation: "", salaryCurrency: "USD",
  primaryStack: [] as string[], otherSkills: "", proficiency: "",
  languages: "", certifications: "",
  degree: "", field: "", university: "", gradYear: "",
  position: "", coverLetter: "", heardFrom: "", availability: "",
  callDate: "", callTime: "", timezone: "", callTopics: [] as string[],
  resumeUrl: "", resumeParsed: null as ParsedResume | null,
};


// ── Small form components ──

function FieldInput({ label, placeholder, value, onChange, type = "text", error, autoFocus = false }: {
  label?: string; placeholder?: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string; autoFocus?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="text-xs text-secondary block mb-1.5 font-semibold">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          "w-full px-4 py-2.75 rounded-[10px] bg-surface border text-main text-sm font-sans outline-none transition-colors duration-200 box-border",
          error ? "border-error" : "border-border focus:border-accent/40",
        )}
      />
      {error && <span id={errorId} className="text-[11px] text-error mt-1 block" role="alert">{error}</span>}
    </div>
  );
}

function FieldTextarea({ label, placeholder, value, onChange, error }: {
  label?: string; placeholder?: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="text-xs text-secondary block mb-1.5 font-semibold">{label}</label>}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          "w-full px-4 py-3 rounded-[10px] bg-surface border text-main text-sm font-sans outline-none transition-colors duration-200 resize-y min-h-25 box-border",
          error ? "border-error" : "border-border focus:border-accent/40",
        )}
      />
      {error && <span id={errorId} className="text-[11px] text-error mt-1 block" role="alert">{error}</span>}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, placeholder, error }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: (string | { value: string; label: string })[]; placeholder?: string; error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="text-xs text-secondary block mb-1.5 font-semibold">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          "w-full px-4 py-2.75 rounded-[10px] bg-surface border text-sm font-sans outline-none appearance-none cursor-pointer box-border",
          value ? "text-main" : "text-muted",
          error ? "border-error" : "border-border",
        )}
      >
        <option value="" className="bg-surface">{placeholder || "Select..."}</option>
        {options.map(o => typeof o === "string"
          ? <option key={o} value={o} className="bg-surface">{o}</option>
          : <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>
        )}
      </select>
      {error && <span id={errorId} className="text-[11px] text-error mt-1 block" role="alert">{error}</span>}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, multi = true, error, color = "accent", label }: {
  options: string[]; selected: string | string[]; onToggle: (v: string) => void;
  multi?: boolean; error?: string; color?: string; label?: string;
}) {
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label}>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => {
          const active = multi ? (selected as string[]).includes(o) : selected === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o)}
              className={clsx(
                "py-1.75 px-3.75 rounded-lg text-xs font-semibold cursor-pointer font-sans transition-all duration-200 border",
                active
                  ? color === "info"
                    ? "bg-info/10 border-info/33 text-info"
                    : "bg-accent-dim border-accent/33 text-accent"
                  : "bg-surface border-border text-secondary",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
      {error && <span className="text-[11px] text-error mt-1.5 block">{error}</span>}
    </div>
  );
}

// ── Main Component ──

export function CareersPage({ onBack }: CareersPageProps) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [openPositions, setOpenPositions] = useState<JobPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState(INITIAL_DATA);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getOpenJobPositions()
      .then(setOpenPositions)
      .catch(() => {})
      .finally(() => setPositionsLoading(false));
  }, []);

  const up = (field: string, value: string | string[]) => setData(d => ({ ...d, [field]: value }));
  const toggleArr = (field: "primaryStack" | "callTopics", val: string) =>
    setData(d => ({
      ...d,
      [field]: d[field].includes(val) ? d[field].filter(v => v !== val) : [...d[field], val],
    }));

  const handleResumeUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast("File too large. Maximum size is 5MB.", "warning");
      return;
    }
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast("Only PDF and DOCX files are accepted.", "warning");
      return;
    }
    setResumeUploading(true);
    try {
      const result = await uploadResume(file);
      setResumeFile(file.name);
      const parsed = result.resumeParsed || {};
      // Auto-fill form fields from parsed resume
      setData(d => ({
        ...d,
        resumeUrl: result.resumeUrl,
        resumeParsed: parsed as ParsedResume,
        firstName: parsed.firstName || d.firstName,
        lastName: parsed.lastName || d.lastName,
        email: parsed.email || d.email,
        phone: parsed.phone || d.phone,
        country: parsed.country || d.country,
        city: parsed.city || d.city,
        linkedin: parsed.linkedin || d.linkedin,
        github: parsed.github || d.github,
        portfolio: parsed.portfolio || d.portfolio,
        currentRole: parsed.currentRole || d.currentRole,
        company: parsed.company || d.company,
        experience: parsed.experience || d.experience,
        primaryStack: parsed.primaryStack?.length ? parsed.primaryStack : d.primaryStack,
        otherSkills: parsed.otherSkills || d.otherSkills,
        degree: parsed.degree || d.degree,
        field: parsed.field || d.field,
        university: parsed.university || d.university,
        gradYear: parsed.gradYear || d.gradYear,
      }));
      toast("Resume parsed! Fields have been auto-filled.", "success");
    } catch {
      toast("Failed to parse resume. You can still fill in the form manually.", "warning");
    } finally {
      setResumeUploading(false);
    }
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!data.email.trim()) e.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Invalid email";
      if (!data.phone.trim()) e.phone = "Required";
      if (!data.country.trim()) e.country = "Required";
    }
    if (step === 1) {
      if (!data.currentRole.trim()) e.currentRole = "Required";
      if (!data.experience) e.experience = "Required";
      if (!data.employmentType) e.employmentType = "Required";
      if (!data.workMode) e.workMode = "Required";
    }
    if (step === 2) {
      if (data.primaryStack.length === 0) e.primaryStack = "Select at least one";
      if (!data.degree) e.degree = "Required";
    }
    if (step === 3) {
      if (!data.position) e.position = "Required";
      if (!data.coverLetter.trim()) e.coverLetter = "Required";
    }
    if (step === 4) {
      // Review step — no additional required fields
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 4));
      contentRef.current?.scrollTo(0, 0);
    } else {
      toast("Please fill in all required fields", "warning");
    }
  };

  const prev = () => {
    setStep(s => Math.max(s - 1, 0));
    contentRef.current?.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast("Please complete all required fields", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await submitCareerApplication(data);
      setSubmitted(true);
      toast("Application submitted! We'll review it and get back to you.", "success");
    } catch {
      toast("Failed to submit application. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Intro Screen ──
  if (!showForm && !submitted) {
    return (
      <div className="h-full overflow-auto bg-bg">
        {/* Header */}
        <header className="sticky top-0 z-50 px-4 md:px-10 h-16 flex items-center justify-between border-b border-border bg-surface">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="py-1.75 px-4 rounded-lg bg-card border border-border text-secondary text-[13px] font-semibold cursor-pointer font-sans flex items-center gap-1.5 transition-all duration-200 hover:border-accent/27 hover:text-accent"
            >
              &larr; Back
            </button>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <img src="/codnexiafav.png" alt="Codnexia" className="w-7 h-7" />
              <span className="text-[15px] font-bold text-main">
                Codnexia <span className="text-accent font-normal">Careers</span>
              </span>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <div className="max-w-250 mx-auto px-4 md:px-10 py-16 md:py-22">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-14 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            <HexGrid />
            <div className="absolute -top-15 -right-15 w-60 h-60 bg-[radial-gradient(circle,rgba(74,159,245,0.13),transparent)] blur-[60px]" />
            <div className="absolute -bottom-10 -left-10 w-45 h-45 bg-[radial-gradient(circle,rgba(45,212,168,0.22),transparent)] blur-[50px]" />

            <div className="relative z-1">
              <Pill color="#4A9FF5">We're Hiring</Pill>
              <h1 className="text-3xl md:text-[42px] font-extrabold text-main mt-4 mb-3 -tracking-[1.5px] leading-tight">
                Join the <span className="text-accent">Codnexia</span> Team
              </h1>
              <p className="text-[15px] text-secondary leading-[1.7] mb-8">
                We're looking for talented engineers, designers, and problem-solvers who share our passion
                for building world-class software from Africa. Work on cutting-edge projects with a globally distributed team.
              </p>
            </div>

            <div className="relative z-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "\uD83C\uDF0D", title: "Remote-First", desc: "Work from anywhere in the world" },
                  { icon: "\uD83D\uDCC8", title: "Career Growth", desc: "Clear paths for advancement" },
                  { icon: "\uD83E\uDD1D", title: "Great Culture", desc: "Collaborative, diverse team" },
                  { icon: "\uD83D\uDCA1", title: "Innovation", desc: "Work on cutting-edge projects" },
                ].map((p, i) => (
                  <div key={i} className="p-3.5 md:p-4 rounded-xl bg-surface border border-border">
                    <div className="text-[22px] mb-2">{p.icon}</div>
                    <div className="text-[13px] font-bold text-main mb-0.5">{p.title}</div>
                    <div className="text-[11px] text-muted leading-[1.5]">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Open positions */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-main mb-6 -tracking-[0.5px]">Open Positions</h2>
            {positionsLoading ? (
              <div className="text-sm text-secondary py-8 text-center">Loading positions...</div>
            ) : openPositions.length === 0 ? (
              <Card className="p-8! text-center">
                <div className="text-3xl mb-3 opacity-50">{"\uD83D\uDCCB"}</div>
                <h3 className="text-base font-bold text-main mb-1">No Open Positions Right Now</h3>
                <p className="text-sm text-secondary">
                  We don't have any open roles at the moment, but we're always looking for great talent.
                  Submit a general application and we'll reach out when a matching role opens up.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {openPositions.map(job => (
                  <Card
                    key={job.id}
                    hoverable
                    className="p-5! cursor-pointer"
                    onClick={() => {
                      setData(d => ({ ...d, position: job.title }));
                      setShowForm(true);
                    }}
                  >
                    <div className="text-sm font-bold text-main mb-1">{job.title}</div>
                    {job.department && (
                      <div className="text-[11px] text-muted mb-2">{job.department}</div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <Pill color="#2DD4A8">{job.type}</Pill>
                      <Pill color="#4A9FF5">{job.mode}</Pill>
                    </div>
                    <div className="text-[11px] text-accent mt-3 font-medium">Apply for this role &rarr;</div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          {openPositions.length > 0 && (
            <div className="mt-12 text-center p-10 rounded-2xl bg-surface border border-border">
              <h3 className="text-lg font-bold text-main mb-2">Ready to make an impact?</h3>
              <p className="text-sm text-secondary">Browse our open positions above and click on a role to start your application.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="h-full overflow-auto bg-bg">
        <div className="max-w-155 mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">{"\uD83C\uDF89"}</div>
          <h1 className="text-3xl font-extrabold text-main mb-2 -tracking-[1px]">Application Submitted!</h1>
          <p className="text-base text-secondary leading-[1.7] mb-9">
            Thank you, <span className="text-accent font-bold">{data.firstName}</span>. Your application for{" "}
            <span className="text-accent font-bold">{data.position}</span> has been received.
          </p>

          <Card className="p-8! text-left mb-6 relative overflow-hidden">
            <HexGrid />
            <div className="relative z-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-grad flex items-center justify-center text-[22px]">{"\uD83E\uDD16"}</div>
                <div>
                  <h3 className="text-[17px] font-bold text-main">What Happens Next</h3>
                  <p className="text-xs text-secondary">Our AI recruitment pipeline is on it</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { icon: "\uD83D\uDD0D", title: "AI Screening", desc: "Your application is being screened by AI right now" },
                  { icon: "\uD83D\uDCE7", title: "Interview Invitation", desc: "If shortlisted, you'll receive an email with your AI interview link" },
                  { icon: "\uD83D\uDCAC", title: "AI Interview", desc: "Complete the interview at your own pace — 8 questions, no time pressure" },
                  { icon: "\uD83C\uDFC6", title: "Results", desc: "Our team reviews AI evaluations and reaches out with next steps" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-[10px] bg-surface border border-border">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-[13px] font-bold text-main">{item.title}</div>
                      <div className="text-xs text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-[10px] bg-accent-dim border border-accent/13">
                <div className="text-[13px] text-accent font-semibold">
                  {"\uD83D\uDCE7"} Confirmation sent to <span className="font-mono">{data.email}</span>
                </div>
                <div className="text-xs text-secondary mt-1">Check your inbox (and spam folder) for the confirmation email.</div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 justify-center">
            <Btn onClick={onBack}>Back to Website</Btn>
            <Btn variant="ghost" onClick={() => { setSubmitted(false); setStep(0); setData(INITIAL_DATA); }}>
              Submit Another
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <header className="px-4 md:px-8 h-16 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="py-1.75 px-4 rounded-lg bg-card border border-border text-secondary text-[13px] font-semibold cursor-pointer font-sans flex items-center gap-1.5 transition-all duration-200 hover:border-accent/27 hover:text-accent"
          >
            &larr; Back
          </button>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <img src="/codnexiafav.png" alt="Codnexia" className="w-7 h-7" />
            <span className="text-[15px] font-bold text-main">
              Codnexia <span className="text-accent font-normal">Careers</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted hidden sm:inline">Step {step + 1} / {STEPS.length}</span>
          <div className="w-24 md:w-30 h-1.5 rounded-sm bg-bg overflow-hidden">
            <div
              className="h-full bg-grad rounded-sm transition-[width] duration-400 ease-out"
              style={{ width: `${((step + 1) / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs text-accent font-bold">{Math.round(((step + 1) / 5) * 100)}%</span>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="px-4 md:px-8 py-4 border-b border-border bg-surface flex justify-center gap-1 shrink-0 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { if (i < step) setStep(i); }}
            className={clsx(
              "flex items-center gap-2.5 py-2.5 px-3 md:px-5 rounded-xl border-none font-sans shrink-0",
              i <= step ? "cursor-pointer" : "cursor-default",
              step === i ? "bg-accent-dim" : "bg-transparent",
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0 border",
                i < step
                  ? "bg-accent/13 text-accent border-accent/20"
                  : step === i
                    ? "bg-grad text-main border-accent/20"
                    : "bg-card text-muted border-border",
              )}
            >
              {i < step ? "\u2713" : s.icon}
            </div>
            <div className="text-left hidden md:block">
              <div className={clsx("text-[13px] font-bold", step === i ? "text-main" : i < step ? "text-accent" : "text-muted")}>
                {s.label}
              </div>
              <div className="text-[10px] text-muted mt-px">{s.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div ref={contentRef} className="flex-1 overflow-auto flex justify-center">
        <div className="w-full max-w-170 px-6 pt-10 pb-30">
          {/* Step Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{STEPS[step].icon}</span>
              <div>
                <h2 className="text-2xl font-extrabold text-main -tracking-[0.5px]">{STEPS[step].label}</h2>
                <p className="text-sm text-secondary">{STEPS[step].desc}</p>
              </div>
            </div>
            <div className="h-px bg-border mt-4" />
          </div>

          {/* Step 0: Personal */}
          {step === 0 && (
            <div>
              {/* Resume Upload */}
              <Card className="p-5! mb-6 bg-surface! border-dashed!">
                <div className="text-center">
                  <div className="text-2xl mb-2">{"\uD83D\uDCC4"}</div>
                  <h4 className="text-sm font-bold text-main mb-1">Upload Resume (Optional)</h4>
                  <p className="text-xs text-muted mb-3">Upload a PDF or DOCX to auto-fill the form</p>
                  {resumeFile ? (
                    <div className="text-xs text-accent font-semibold">{"\u2713"} {resumeFile}</div>
                  ) : (
                    <label className={clsx(
                      "inline-block py-2.5 px-6 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200",
                      resumeUploading
                        ? "bg-surface text-muted border border-border"
                        : "bg-accent-dim text-accent border border-accent/27 hover:bg-accent/20",
                    )}>
                      {resumeUploading ? "Parsing..." : "Choose File"}
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        disabled={resumeUploading}
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) handleResumeUpload(f);
                        }}
                      />
                    </label>
                  )}
                </div>
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5">
                <FieldInput label="First Name *" placeholder="John" value={data.firstName} onChange={v => up("firstName", v)} error={errors.firstName} autoFocus />
                <FieldInput label="Last Name *" placeholder="Doe" value={data.lastName} onChange={v => up("lastName", v)} error={errors.lastName} />
              </div>
              <FieldInput label="Email Address *" placeholder="john.doe@email.com" value={data.email} onChange={v => up("email", v)} type="email" error={errors.email} />
              <div className="grid grid-cols-[110px_1fr] gap-3.5">
                <FieldSelect label="Code" value={data.countryCode} onChange={v => up("countryCode", v)} options={[
                  { value: "+254", label: "\uD83C\uDDF0\uD83C\uDDEA +254" },
                  { value: "+234", label: "\uD83C\uDDF3\uD83C\uDDEC +234" },
                  { value: "+27", label: "\uD83C\uDDFF\uD83C\uDDE6 +27" },
                  { value: "+256", label: "\uD83C\uDDFA\uD83C\uDDEC +256" },
                  { value: "+255", label: "\uD83C\uDDF9\uD83C\uDDFF +255" },
                  { value: "+233", label: "\uD83C\uDDEC\uD83C\uDDED +233" },
                  { value: "+1", label: "\uD83C\uDDFA\uD83C\uDDF8 +1" },
                  { value: "+44", label: "\uD83C\uDDEC\uD83C\uDDE7 +44" },
                  { value: "+49", label: "\uD83C\uDDE9\uD83C\uDDEA +49" },
                  { value: "+91", label: "\uD83C\uDDEE\uD83C\uDDF3 +91" },
                  { value: "+971", label: "\uD83C\uDDE6\uD83C\uDDEA +971" },
                ]} />
                <FieldInput label="Phone Number *" placeholder="712 345 678" value={data.phone} onChange={v => up("phone", v)} error={errors.phone} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3.5">
                <FieldInput label="Country *" placeholder="Kenya" value={data.country} onChange={v => up("country", v)} error={errors.country} />
                <FieldInput label="City" placeholder="Nairobi" value={data.city} onChange={v => up("city", v)} />
                <FieldInput label="Nationality" placeholder="Kenyan" value={data.nationality} onChange={v => up("nationality", v)} />
              </div>
              <Card className="p-5! mt-2 bg-surface!">
                <h4 className="text-sm font-bold text-main mb-1">Online Profiles</h4>
                <p className="text-xs text-muted mb-4">Optional but strongly recommended.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5">
                  <FieldInput label="LinkedIn" placeholder="linkedin.com/in/johndoe" value={data.linkedin} onChange={v => up("linkedin", v)} />
                  <FieldInput label="GitHub" placeholder="github.com/johndoe" value={data.github} onChange={v => up("github", v)} />
                  <FieldInput label="Portfolio / Website" placeholder="johndoe.dev" value={data.portfolio} onChange={v => up("portfolio", v)} />
                  <FieldInput label="Other (Dribbble, Behance...)" placeholder="dribbble.com/johndoe" value={data.website} onChange={v => up("website", v)} />
                </div>
              </Card>
            </div>
          )}

          {/* Step 1: Professional */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5">
                <FieldInput label="Current / Most Recent Role *" placeholder="Senior Software Engineer" value={data.currentRole} onChange={v => up("currentRole", v)} error={errors.currentRole} autoFocus />
                <FieldInput label="Company" placeholder="Acme Corp" value={data.company} onChange={v => up("company", v)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5">
                <FieldSelect label="Years of Experience *" value={data.experience} onChange={v => up("experience", v)} error={errors.experience} options={[
                  "Less than 1 year", "1 - 2 years", "3 - 5 years", "5 - 8 years", "8 - 12 years", "12+ years",
                ]} placeholder="Select experience" />
                <FieldSelect label="Notice Period" value={data.noticePeriod} onChange={v => up("noticePeriod", v)} options={[
                  "Immediately available", "2 weeks", "1 month", "2 months", "3 months", "Currently serving notice",
                ]} placeholder="Select notice period" />
              </div>
              <div className="mb-5">
                <label className="text-xs text-secondary block mb-2.5 font-semibold">Employment Type *</label>
                <ChipGroup options={["Full-time", "Part-time", "Contract", "Freelance", "Internship"]} selected={data.employmentType} onToggle={v => up("employmentType", v)} multi={false} error={errors.employmentType} label="Employment Type" />
              </div>
              <div className="mb-5">
                <label className="text-xs text-secondary block mb-2.5 font-semibold">Preferred Work Mode *</label>
                <ChipGroup options={["Remote", "Hybrid", "On-site", "Flexible"]} selected={data.workMode} onToggle={v => up("workMode", v)} multi={false} error={errors.workMode} label="Preferred Work Mode" />
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3.5">
                <FieldSelect label="Currency" value={data.salaryCurrency} onChange={v => up("salaryCurrency", v)} options={[
                  { value: "USD", label: "$ USD" }, { value: "EUR", label: "\u20AC EUR" }, { value: "GBP", label: "\u00A3 GBP" },
                  { value: "KES", label: "KSh KES" }, { value: "NGN", label: "\u20A6 NGN" },
                ]} />
                <FieldInput label="Expected Annual Salary" placeholder="e.g. 60,000" value={data.salaryExpectation} onChange={v => up("salaryExpectation", v)} />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Education */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <label className="text-xs text-secondary block mb-1 font-semibold">
                  Primary Tech Stack * <span className="font-normal text-muted">&mdash; select all that apply</span>
                </label>
                <div className="text-xs text-accent mb-2.5 font-semibold">{data.primaryStack.length} selected</div>
                <ChipGroup options={TECH_STACKS} selected={data.primaryStack} onToggle={v => toggleArr("primaryStack", v)} error={errors.primaryStack} label="Primary Tech Stack" />
              </div>
              <FieldInput label="Other Skills / Tools" placeholder="e.g. Jira, Notion, Terraform, Datadog..." value={data.otherSkills} onChange={v => up("otherSkills", v)} />
              <FieldSelect label="Overall Proficiency Level" value={data.proficiency} onChange={v => up("proficiency", v)} options={[
                "Junior (0-2 years)", "Mid-level (2-5 years)", "Senior (5-8 years)", "Staff / Principal (8+ years)", "Lead / Architect",
              ]} placeholder="Select level" />
              <FieldInput label="Languages Spoken" placeholder="e.g. English (fluent), Swahili (native), French (basic)" value={data.languages} onChange={v => up("languages", v)} />
              <FieldInput label="Certifications" placeholder="e.g. AWS Solutions Architect, Scrum Master..." value={data.certifications} onChange={v => up("certifications", v)} />
              <Card className="p-5! mt-2 bg-surface!">
                <h4 className="text-sm font-bold text-main mb-4">Education</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5">
                  <FieldSelect label="Highest Degree *" value={data.degree} onChange={v => up("degree", v)} error={errors.degree} options={[
                    "High School / Secondary", "Diploma / Certificate", "Associate Degree",
                    "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Bootcamp / Self-taught", "Other",
                  ]} placeholder="Select degree" />
                  <FieldInput label="Field of Study" placeholder="Computer Science" value={data.field} onChange={v => up("field", v)} />
                  <FieldInput label="University / Institution" placeholder="University of Nairobi" value={data.university} onChange={v => up("university", v)} />
                  <FieldSelect label="Graduation Year" value={data.gradYear} onChange={v => up("gradYear", v)} options={
                    Array.from({ length: 20 }, (_, i) => String(2026 - i))
                  } placeholder="Select year" />
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Motivation */}
          {step === 3 && (
            <div>
              <FieldSelect label="Position Applying For *" value={data.position} onChange={v => up("position", v)} error={errors.position} options={
                openPositions.length > 0
                  ? [...openPositions.map(p => p.title), "Other"]
                  : POSITIONS
              } placeholder="Select a role" />
              <FieldTextarea
                label="Cover Letter / Motivation *"
                placeholder={"Tell us:\n\u2022 Why you're interested in Codnexia\n\u2022 What excites you about this role\n\u2022 A standout project you've worked on\n\u2022 What you'd bring to the team"}
                value={data.coverLetter}
                onChange={v => up("coverLetter", v)}
                error={errors.coverLetter}
              />
              <div className="mb-5">
                <label className="text-xs text-secondary block mb-2.5 font-semibold">When can you start?</label>
                <ChipGroup options={["Immediately", "In 2 weeks", "In 1 month", "In 2 months", "In 3+ months"]} selected={data.availability} onToggle={v => up("availability", v)} multi={false} label="Availability" />
              </div>
              <FieldSelect label="How did you hear about us?" value={data.heardFrom} onChange={v => up("heardFrom", v)} options={[
                "LinkedIn", "Twitter/X", "GitHub", "Job Board (Indeed, Glassdoor)", "Referral from employee",
                "Tech community / Meetup", "University career fair", "Google Search", "Other",
              ]} placeholder="Select source" />
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div>
              <Card className="bg-surface! p-6! mb-7">
                <div className="flex gap-4 items-start">
                  <div className="w-13 h-13 rounded-[14px] bg-grad flex items-center justify-center text-[26px] shrink-0">{"\uD83E\uDD16"}</div>
                  <div>
                    <h4 className="text-base font-bold text-main mb-1.5">AI-Powered Review Process</h4>
                    <p className="text-sm text-secondary leading-[1.8]">
                      After you submit, our AI will screen your application automatically. If shortlisted,
                      you'll receive an email invitation to complete an AI-powered interview at your convenience &mdash;
                      no scheduling needed.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <div className="space-y-4">
                <Card className="p-5!">
                  <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">{"\uD83D\uDC64"} Personal</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div><span className="text-muted">Name:</span> <span className="text-main">{data.firstName} {data.lastName}</span></div>
                    <div><span className="text-muted">Email:</span> <span className="text-main">{data.email}</span></div>
                    <div><span className="text-muted">Phone:</span> <span className="text-main">{data.countryCode} {data.phone}</span></div>
                    <div><span className="text-muted">Location:</span> <span className="text-main">{[data.city, data.country].filter(Boolean).join(", ")}</span></div>
                  </div>
                </Card>

                <Card className="p-5!">
                  <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">{"\uD83D\uDCBC"} Professional</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div><span className="text-muted">Role:</span> <span className="text-main">{data.currentRole}</span></div>
                    <div><span className="text-muted">Experience:</span> <span className="text-main">{data.experience}</span></div>
                    <div><span className="text-muted">Type:</span> <span className="text-main">{data.employmentType}</span></div>
                    <div><span className="text-muted">Mode:</span> <span className="text-main">{data.workMode}</span></div>
                  </div>
                </Card>

                <Card className="p-5!">
                  <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">{"\uD83C\uDFAF"} Skills</h4>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {data.primaryStack.map(t => <Pill key={t} color="#4A9FF5">{t}</Pill>)}
                  </div>
                  <div className="text-xs"><span className="text-muted">Degree:</span> <span className="text-main">{data.degree}{data.field ? ` in ${data.field}` : ''}</span></div>
                </Card>

                <Card className="p-5!">
                  <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-wide">{"\uD83D\uDCDD"} Application</h4>
                  <div className="text-xs mb-1.5"><span className="text-muted">Position:</span> <span className="text-accent font-semibold">{data.position}</span></div>
                  <div className="text-xs text-secondary leading-[1.7] bg-card p-3 rounded-lg border border-border whitespace-pre-wrap max-h-30 overflow-auto">
                    {data.coverLetter}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="px-4 md:px-8 py-4 border-t border-border bg-surface flex justify-between items-center shrink-0">
        <div>
          {step > 0 ? (
            <Btn variant="ghost" onClick={prev} className="py-2.5! px-6! text-[13px]!">&larr; Previous Step</Btn>
          ) : (
            <Btn variant="ghost" onClick={onBack} className="py-2.5! px-6! text-[13px]!">&larr; Back to Website</Btn>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-medium hidden sm:inline">
            {step < 4 ? `${4 - step} steps remaining` : "Final step!"}
          </span>
          {step < 4 ? (
            <Btn onClick={next} className="py-2.75! px-8! text-sm!">Continue &rarr;</Btn>
          ) : (
            <Btn onClick={handleSubmit} disabled={submitting} className="py-3! px-9! text-sm!">
              {submitting ? "Submitting..." : "Submit Application"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
