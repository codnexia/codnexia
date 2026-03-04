import { useState, useEffect } from "react";
import type { PortfolioProject } from "../../types";
import { getPublishedPortfolios } from "../../lib/api";
import { FALLBACK_PORTFOLIOS } from "../../assets/data";
import { Pill } from "../ui/Pill";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";
import { Btn } from "../ui/Btn";

interface PortfolioSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

// Mockup placeholder when no image is available
function MockupPlaceholder({ color, title }: { color: string; title: string }) {
  return (
    <div
      className="w-full h-full min-h-48 rounded-xl flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)` }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }} />
      <div className="text-center z-10">
        <div className="text-4xl mb-2 opacity-40" style={{ color }}>&#9674;</div>
        <div className="text-xs text-secondary font-semibold uppercase tracking-wider">{title}</div>
      </div>
    </div>
  );
}

export function PortfolioSection({ sectionRef }: PortfolioSectionProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PORTFOLIOS);

  useEffect(() => {
    getPublishedPortfolios()
      .then((data) => {
        if (data && data.length > 0) setProjects(data as PortfolioProject[]);
      })
      .catch(() => {
        // API unavailable — keep fallback data
      });
  }, []);

  const featured = projects.find((p) => p.featured) || projects[0];
  const rest = projects.filter((p) => p.id !== featured.id);
  const gridItems = rest.slice(0, 3);
  const wideItems = rest.slice(3, 5);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      {/* Header */}
      <SectionReveal>
        <Pill>Portfolio</Pill>
        <h2 className="text-[28px] md:text-[40px] font-bold text-main mt-4 mb-3 -tracking-[1.5px]">
          What we've built
        </h2>
        <p className="text-secondary text-sm md:text-base mb-12 max-w-160 leading-relaxed">
          Real products we've designed, built, and shipped for clients across Africa and beyond.
        </p>
      </SectionReveal>

      {/* Featured Project */}
      <SectionReveal>
        <Card hoverable className="mb-3.5 p-0! overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image / Placeholder */}
            <div className="p-4 md:p-6 lg:p-8">
              {featured.imageUrl ? (
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <MockupPlaceholder color={featured.color} title={featured.title} />
              )}
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Pill color={featured.color}>{featured.category}</Pill>
                <Pill color="#2DD4A8">Featured</Pill>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-main mb-1 -tracking-[0.5px]">
                {featured.title}
              </h3>
              <p className="text-sm text-accent mb-3 font-medium">{featured.subtitle}</p>
              <p className="text-[13px] text-secondary leading-[1.7] mb-5">
                {featured.description}
              </p>

              {/* Metrics */}
              {featured.metrics.length > 0 && (
                <div className="flex gap-5 mb-5">
                  {featured.metrics.map((m, i) => (
                    <div key={i}>
                      <div className="text-lg font-bold text-main">{m.v}</div>
                      <div className="text-[11px] text-muted">{m.l}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-surface text-[11px] text-secondary font-medium border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {featured.liveUrl && (
                <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Btn variant="ghost" className="text-[13px]! py-2.5! px-5!">
                    View Project &rarr;
                  </Btn>
                </a>
              )}
            </div>
          </div>
        </Card>
      </SectionReveal>

      {/* Project Grid (3 columns) */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
          {gridItems.map((p, i) => (
            <SectionReveal key={p.id} style={{ transitionDelay: `${i * 0.06}s` }}>
              <Card hoverable className="h-full">
                {/* Image / Placeholder */}
                <div className="mb-4 rounded-xl overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.thumbnailUrl || p.imageUrl}
                      alt={p.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-40">
                      <MockupPlaceholder color={p.color} title={p.title} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Pill color={p.color}>{p.category}</Pill>
                </div>

                <h3 className="text-base font-bold text-main mb-1">{p.title}</h3>
                <p className="text-[12px] text-accent mb-2 font-medium">{p.subtitle}</p>
                <p className="text-[13px] text-secondary leading-[1.7] mb-4 line-clamp-3">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-muted font-medium border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-muted font-medium border border-border">
                      +{p.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Metrics */}
                {p.metrics.length > 0 && (
                  <div className="flex gap-4 pt-3 border-t border-border">
                    {p.metrics.map((m, j) => (
                      <div key={j}>
                        <div className="text-sm font-bold text-main">{m.v}</div>
                        <div className="text-[10px] text-muted">{m.l}</div>
                      </div>
                    ))}
                  </div>
                )}

                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-[12px] text-accent font-semibold hover:underline"
                  >
                    View Project &rarr;
                  </a>
                )}
              </Card>
            </SectionReveal>
          ))}
        </div>
      )}

      {/* Wide Cards Row (2 columns) */}
      {wideItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-12">
          {wideItems.map((p, i) => (
            <SectionReveal key={p.id} style={{ transitionDelay: `${i * 0.06}s` }}>
              <Card hoverable className="h-full">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image / Placeholder */}
                  <div className="sm:w-40 shrink-0 rounded-xl overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.thumbnailUrl || p.imageUrl}
                        alt={p.title}
                        className="w-full h-32 sm:h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-32 sm:h-full">
                        <MockupPlaceholder color={p.color} title={p.title} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill color={p.color}>{p.category}</Pill>
                    </div>
                    <h3 className="text-base font-bold text-main mb-1">{p.title}</h3>
                    <p className="text-[12px] text-accent mb-2 font-medium">{p.subtitle}</p>
                    <p className="text-[13px] text-secondary leading-[1.7] mb-3 line-clamp-2">
                      {p.description}
                    </p>

                    {/* Tags + Metrics row */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-muted font-medium border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {p.metrics.length > 0 && (
                      <div className="flex gap-4 pt-2 border-t border-border">
                        {p.metrics.map((m, j) => (
                          <div key={j}>
                            <div className="text-sm font-bold text-main">{m.v}</div>
                            <div className="text-[10px] text-muted">{m.l}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[12px] text-accent font-semibold hover:underline"
                      >
                        View Project &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      )}

      {/* CTA */}
      <SectionReveal>
        <div className="text-center mt-8">
          <p className="text-secondary text-sm mb-4">
            Interested in working together? Let's build something great.
          </p>
          <a href="#contact">
            <Btn>Start a Project</Btn>
          </a>
        </div>
      </SectionReveal>
    </section>
  );
}
