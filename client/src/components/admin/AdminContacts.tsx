import { useState, useEffect } from "react";
import clsx from "clsx";
import { getContacts } from "../../lib/api";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  createdAt: string;
}

export function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await getContacts(page, limit);
        setContacts(res.data);
        setTotal(res.total);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  if (loading) return <AdminLoadingState label="Loading contacts..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[15px] font-bold text-main">Contact Submissions</span>
          <span className="ml-2 text-xs text-muted">({total} total)</span>
        </div>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-sm text-muted">No contact submissions yet.</div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((c) => (
            <Card
              key={c.id}
              className="p-0! overflow-hidden cursor-pointer"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            >
              {/* Header row */}
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center text-accent text-sm font-bold shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-main truncate">{c.name}</div>
                    <div className="text-xs text-accent truncate">{c.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {c.service && (
                    <span className="px-2.5 py-1 rounded-md bg-surface text-[11px] font-semibold text-secondary">
                      {c.service}
                    </span>
                  )}
                  {c.budget && (
                    <span className="px-2.5 py-1 rounded-md bg-accent-dim text-[11px] font-semibold text-accent">
                      {c.budget}
                    </span>
                  )}
                  <span className="text-[11px] text-muted">{timeAgo(c.createdAt)}</span>
                  <span className={clsx("text-muted text-xs transition-transform", expanded === c.id && "rotate-180")}>
                    &#9662;
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === c.id && (
                <div className="px-5 pb-4 border-t border-border pt-4">
                  {c.company && (
                    <div className="mb-2">
                      <span className="text-[11px] text-muted uppercase tracking-wider">Company</span>
                      <p className="text-sm text-main mt-0.5">{c.company}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-muted uppercase tracking-wider">Message</span>
                    <p className="text-sm text-secondary mt-0.5 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex gap-2">
                    <a
                      href={`mailto:${c.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-1.5 rounded-md bg-accent-dim text-accent text-xs font-semibold no-underline"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-md bg-surface border border-border text-xs text-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-sans"
          >
            Previous
          </button>
          <span className="text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-md bg-surface border border-border text-xs text-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-sans"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
