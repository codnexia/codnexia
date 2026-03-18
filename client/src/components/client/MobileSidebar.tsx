import clsx from "clsx";
import { SECTIONS } from "../../constants";
import { Btn } from "../ui/Btn";

interface MobileSidebarProps {
  activeSection: string;
  scrollTo: (id: string) => void;
  onClose: () => void;
  onOpenCareers?: () => void;
}

export function MobileSidebar({
  activeSection,
  scrollTo,
  onClose,
  onOpenCareers,
}: MobileSidebarProps) {
  const handleNav = (id: string) => {
    scrollTo(id);
    onClose();
  };

  return (
    <nav
      className="fixed inset-x-0 top-16 bottom-0 flex flex-col z-999 items-center pt-12 gap-2 md:hidden bg-bg"
      aria-label="Mobile navigation"
    >
      {SECTIONS.filter((s) => s.nav).map((s) => (
        <button
          key={s.id}
          onClick={() => handleNav(s.id)}
          className={clsx(
            "px-6 py-3 rounded-lg border-none cursor-pointer text-base font-semibold transition-all duration-200 font-sans w-60 text-center",
            activeSection === s.id
              ? "bg-accent-dim text-accent"
              : "bg-transparent text-secondary",
          )}
        >
          {s.label}
        </button>
      ))}
      <button
        onClick={() => { onOpenCareers?.(); onClose(); }}
        className="px-6 py-3 rounded-lg border-none cursor-pointer text-base font-semibold transition-all duration-200 font-sans w-60 text-center bg-transparent text-secondary"
      >
        Careers
      </button>
      <Btn onClick={() => handleNav("contact")} className="mt-4 px-8! py-3!">
        Start a Project
      </Btn>
    </nav>
  );
}
