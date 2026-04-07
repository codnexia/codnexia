import { useState, useEffect, useRef, useCallback } from "react";
import type { Testimonial } from "../../types";
import { getPublishedTestimonials } from "../../lib/api";
import { FALLBACK_TESTIMONIALS } from "../../assets/data";
import { Card } from "../ui/Card";
import { SectionReveal } from "../ui/SectionReveal";

interface TestimonialsSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const AVATAR_COLORS = ["#2DD4A8", "#4A9FF5", "#F5A623", "#E84855", "#8B5CF6", "#EC4899"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={star <= rating ? "#F5A623" : "none"}
          stroke={star <= rating ? "#F5A623" : "#3E5280"}
          strokeWidth="1.5"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, colorIndex }: { testimonial: Testimonial; colorIndex: number }) {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const initial = testimonial.author.charAt(0).toUpperCase();

  return (
    <Card hoverable className="h-full flex flex-col justify-between">
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>
      <p className="text-[13px] md:text-sm text-secondary leading-[1.8] mb-6 flex-1">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-main text-sm font-semibold truncate">{testimonial.author}</div>
          <div className="text-muted text-xs truncate">
            {testimonial.role ? `${testimonial.role}, ` : ""}{testimonial.company}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TestimonialsSection({ sectionRef }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll <= 0 ? 0 : el.scrollLeft / maxScroll);
  }, []);

  useEffect(() => {
    getPublishedTestimonials()
      .then((items) => {
        if (items && items.length > 0) setTestimonials(items);
      })
      .catch(() => {});
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="px-4 py-14 md:px-10 md:py-22.5 max-w-250 mx-auto"
    >
      <SectionReveal>
        <div className="mb-12">
          <h2 className="text-[28px] md:text-[40px] font-bold text-main mb-3 -tracking-[1.5px]">
            What Clients Say
          </h2>
          <p className="text-secondary text-sm md:text-base max-w-160 leading-relaxed">
            Real feedback from teams we've partnered with to build, ship, and scale their products.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {testimonials.map((t, i) => (
            <div key={t.id} className="w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] shrink-0 snap-start">
              <TestimonialCard testimonial={t} colorIndex={i} />
            </div>
          ))}
        </div>
      </SectionReveal>

      {testimonials.length > 3 && (
        <div className="flex justify-center mt-6">
          <div className="w-12 h-1 rounded-full bg-muted/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full w-5 rounded-full bg-accent transition-all duration-300"
              style={{ left: `${scrollProgress * (48 - 20)}px` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
