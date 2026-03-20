interface ClientFooterProps {
  onOpenCareers?: () => void;
}

export function ClientFooter({ onOpenCareers }: ClientFooterProps = {}) {
  const footerLinks = [
    { title: "Services", items: ["Web Apps", "Mobile Apps", "SaaS", "API & Integrations"] },
    { title: "Company", items: ["About Us", "Our Process", "Careers", "Blog"] },
    { title: "Support", items: ["Contact", "Documentation", "Status", "Privacy Policy"] },
  ];

  return (
    <footer className="px-4 md:px-10 pt-10 pb-8 border-t border-border max-w-250 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 md:gap-10 mb-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/codnexialogo.png" alt="Codnexia Software" className="h-10 w-auto" />
          </div>
          <p className="text-[13px] text-secondary leading-[1.7]">
            Engineering the next generation of software. Global code, African excellence.
          </p>
        </div>

        {/* Link columns */}
        {footerLinks.map((col, i) => (
          <div key={i}>
            <h4 className="text-xs font-bold text-main mb-3 uppercase tracking-[0.8px]">
              {col.title}
            </h4>
            {col.items.map(item =>
              item === "Careers" ? (
                <button
                  key={item}
                  type="button"
                  className="text-[13px] text-secondary py-1 cursor-pointer hover:text-accent transition-colors duration-200 bg-transparent border-none p-0 text-left font-inherit block"
                  onClick={onOpenCareers}
                >
                  {item}
                </button>
              ) : (
                <div key={item} className="text-[13px] text-secondary py-1">
                  {item}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center pt-5 border-t border-border">
        <span className="text-xs text-muted">
          &copy; 2026 Codnexia Software. All rights reserved.
        </span>
        <span className="text-[11px] text-accent font-semibold opacity-70">
          Global Code. African Excellence.
        </span>
      </div>
    </footer>
  );
}
