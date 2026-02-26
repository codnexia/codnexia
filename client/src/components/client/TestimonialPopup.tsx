import { useState, useEffect, useRef, useCallback } from "react";
import { getPublishedTestimonials } from "../../lib/api";
import type { Testimonial } from "../../types";

const INITIAL_DELAY = 3000;
const CYCLE_INTERVAL = 7000;
const ANIM_DURATION = 400;

export function TestimonialPopup() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState<"in" | "out" | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch published testimonials on mount
  useEffect(() => {
    getPublishedTestimonials()
      .then((items) => setTestimonials(items))
      .catch(() => {});
  }, []);

  // Show popup after initial delay
  useEffect(() => {
    if (testimonials.length === 0 || dismissed) return;
    const t = setTimeout(() => {
      setVisible(true);
      setAnimating("in");
      setTimeout(() => setAnimating(null), ANIM_DURATION);
    }, INITIAL_DELAY);
    return () => clearTimeout(t);
  }, [testimonials, dismissed]);

  // Auto-cycle through testimonials
  const cycleNext = useCallback(() => {
    if (testimonials.length <= 1) return;
    setAnimating("out");
    setTimeout(() => {
      setIndex((i) => (i + 1) % testimonials.length);
      setRevealed(false);
      setAnimating("in");
      setTimeout(() => setAnimating(null), ANIM_DURATION);
    }, ANIM_DURATION);
  }, [testimonials.length]);

  useEffect(() => {
    if (!visible || dismissed || testimonials.length <= 1) return;
    timerRef.current = setInterval(cycleNext, CYCLE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [visible, dismissed, cycleNext, testimonials.length]);

  const dismiss = () => {
    setAnimating("out");
    setTimeout(() => {
      setDismissed(true);
      setVisible(false);
    }, ANIM_DURATION);
  };

  const goTo = (i: number) => {
    if (i === index) return;
    clearInterval(timerRef.current);
    setAnimating("out");
    setTimeout(() => {
      setIndex(i);
      setRevealed(false);
      setAnimating("in");
      setTimeout(() => setAnimating(null), ANIM_DURATION);
      // Restart auto-cycle after manual navigation
      if (testimonials.length > 1) {
        timerRef.current = setInterval(cycleNext, CYCLE_INTERVAL);
      }
    }, ANIM_DURATION);
  };

  if (!visible || testimonials.length === 0 || dismissed) return null;

  const t = testimonials[index];
  const initial = t.author.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => !revealed && setRevealed(true)}
      className={`fixed bottom-24 right-6 z-50 w-80 rounded-xl border border-border bg-surface/95 backdrop-blur-sm p-4 shadow-lg shadow-black/30 ${!revealed ? "cursor-pointer" : ""} ${
        animating === "in"
          ? "animate-testimonial-in"
          : animating === "out"
          ? "animate-testimonial-out"
          : ""
      }`}
    >
      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="absolute top-2 right-2 text-muted hover:text-main text-sm leading-none cursor-pointer w-5 h-5 flex items-center justify-center"
      >
        &times;
      </button>

      {/* Quote */}
      <div className="text-secondary text-sm leading-relaxed mb-3 pr-4">
        &ldquo;{t.content}&rdquo;
      </div>

      {/* Author — revealed on card click */}
      {revealed && (
        <div className="flex items-center gap-3 animate-testimonial-in">
          <div className="w-8 h-8 rounded-full bg-grad flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-main text-sm font-medium truncate">{t.author}</div>
            <div className="text-muted text-xs truncate">{t.company}</div>
          </div>
        </div>
      )}

      {/* Dot indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                i === index ? "bg-accent" : "bg-muted/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
