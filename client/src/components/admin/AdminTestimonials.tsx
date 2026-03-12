import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Testimonial } from "../../types";
import { getTestimonials, updateTestimonial, createTestimonial, deleteTestimonial } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";
import { InlineConfirm } from "../ui/InlineConfirm";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="cursor-pointer p-0 bg-transparent border-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill={star <= value ? "#F5A623" : "none"}
            stroke={star <= value ? "#F5A623" : "#3E5280"}
            strokeWidth="1.5"
          >
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
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

export function AdminTestimonials() {
  const toast = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({ author: "", company: "", role: "", content: "", rating: 5 });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newFields, setNewFields] = useState({ author: "", company: "", role: "", content: "", rating: 5 });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await getTestimonials();
      setItems(res.data);
    } catch {
      toast("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t.id);
    setEditFields({ author: t.author, company: t.company, role: t.role, content: t.content, rating: t.rating });
  };

  const saveEdit = async (id: string) => {
    try {
      await updateTestimonial(id, editFields);
      setEditing(null);
      toast("Testimonial updated!", "success");
      fetchItems();
    } catch {
      toast("Failed to save changes", "error");
    }
  };

  const togglePublished = async (t: Testimonial) => {
    try {
      await updateTestimonial(t.id, { published: !t.published });
      toast("Status updated", "info");
      fetchItems();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const submitNew = async () => {
    if (!newFields.author || !newFields.company || !newFields.content) {
      toast("Author, company and quote are required", "warning");
      return;
    }
    try {
      await createTestimonial(newFields);
      toast("Testimonial created!", "success");
      setCreating(false);
      setNewFields({ author: "", company: "", role: "", content: "", rating: 5 });
      fetchItems();
    } catch {
      toast("Failed to create testimonial", "error");
    }
  };

  const confirmDelete = async (t: Testimonial) => {
    try {
      await deleteTestimonial(t.id);
      toast("Testimonial deleted", "info");
      setDeleting(null);
      fetchItems();
    } catch {
      toast("Failed to delete testimonial", "error");
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading testimonials..." />;
  }

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">Manage client testimonials</p>
        {!creating && (
          <Btn onClick={() => setCreating(true)} className="py-2.5! px-5! text-[13px]!">
            + New Testimonial
          </Btn>
        )}
      </div>

      {/* Inline create form */}
      {creating && (
        <Card className="mb-6 p-5!">
          <h3 className="text-sm font-semibold text-main mb-4">New Testimonial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Author</label>
              <input
                value={newFields.author}
                onChange={(e) => setNewFields({ ...newFields, author: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Company</label>
              <input
                value={newFields.company}
                onChange={(e) => setNewFields({ ...newFields, company: e.target.value })}
                placeholder="Acme Inc."
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Role</label>
              <input
                value={newFields.role}
                onChange={(e) => setNewFields({ ...newFields, role: e.target.value })}
                placeholder="CEO, CTO, etc."
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Quote</label>
            <textarea
              value={newFields.content}
              onChange={(e) => setNewFields({ ...newFields, content: e.target.value })}
              placeholder="Their testimonial quote..."
              rows={3}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none resize-none focus:border-accent/40"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-[11px] text-muted uppercase tracking-wide">Rating</label>
            <StarInput value={newFields.rating} onChange={(v) => setNewFields({ ...newFields, rating: v })} />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setCreating(false); setNewFields({ author: "", company: "", role: "", content: "", rating: 5 }); }}
              className="py-2 px-4 rounded-md bg-surface border border-border text-muted text-xs cursor-pointer font-sans"
            >
              Cancel
            </button>
            <button
              onClick={submitNew}
              className="py-2 px-4 rounded-md bg-accent-dim border border-accent/27 text-accent text-xs font-semibold cursor-pointer font-sans"
            >
              Create
            </button>
          </div>
        </Card>
      )}

      {/* Testimonials table */}
      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_2fr_60px_80px_90px_130px] min-w-200 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>Author</span>
            <span>Company</span>
            <span>Role</span>
            <span>Quote</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Updated</span>
            <span></span>
          </div>

          {items.length === 0 && (
            <div className="px-5 py-10 text-center text-secondary text-sm">
              No testimonials yet. Click &ldquo;+ New Testimonial&rdquo; to add one.
            </div>
          )}

          {/* Table rows */}
          {items.map((t, i) => (
            <div key={t.id}>
              <div
                className={clsx(
                  "grid grid-cols-[1.2fr_1fr_0.8fr_2fr_60px_80px_90px_130px] min-w-200 px-5 py-3.5 items-center transition-colors duration-200",
                  i < items.length - 1 && deleting !== t.id && "border-b border-border",
                  editing === t.id ? "bg-surface-hover" : "hover:bg-surface-hover",
                )}
              >
                {editing === t.id ? (
                  <input
                    value={editFields.author}
                    onChange={(e) => setEditFields({ ...editFields, author: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[90%]"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-semibold text-main truncate">{t.author}</span>
                )}

                {editing === t.id ? (
                  <input
                    value={editFields.company}
                    onChange={(e) => setEditFields({ ...editFields, company: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[90%]"
                  />
                ) : (
                  <span className="text-xs text-secondary truncate">{t.company}</span>
                )}

                {editing === t.id ? (
                  <input
                    value={editFields.role}
                    onChange={(e) => setEditFields({ ...editFields, role: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[90%]"
                  />
                ) : (
                  <span className="text-xs text-secondary truncate">{t.role || "—"}</span>
                )}

                {editing === t.id ? (
                  <input
                    value={editFields.content}
                    onChange={(e) => setEditFields({ ...editFields, content: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[95%]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(t.id);
                    }}
                  />
                ) : (
                  <span className="text-xs text-secondary truncate">{t.content}</span>
                )}

                {editing === t.id ? (
                  <StarInput value={editFields.rating} onChange={(v) => setEditFields({ ...editFields, rating: v })} />
                ) : (
                  <StarDisplay rating={t.rating} />
                )}

                <span onClick={() => togglePublished(t)} className="cursor-pointer">
                  <Pill color={t.published ? "#2DD4A8" : "#F5A623"}>
                    {t.published ? "Live" : "Draft"}
                  </Pill>
                </span>

                <span className="text-xs text-secondary">{t.updated}</span>

                <div className="flex gap-1.5 justify-end">
                  {editing === t.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="py-1.25 px-3 rounded-md bg-accent-dim border border-accent/27 text-accent text-[11px] font-semibold cursor-pointer font-sans"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="py-1.25 px-3 rounded-md bg-surface border border-border text-muted text-[11px] cursor-pointer font-sans"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(t)}
                        className="py-1.25 px-3.5 rounded-md bg-surface border border-border text-secondary text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-accent/27 hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(deleting === t.id ? null : t.id)}
                        className="py-1.25 px-3 rounded-md bg-surface border border-border text-error text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-error/27"
                      >
                        Del
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline delete confirmation */}
              {deleting === t.id && (
                <InlineConfirm
                  message={`Delete testimonial from \u201C${t.author}\u201D?`}
                  onCancel={() => setDeleting(null)}
                  onConfirm={() => confirmDelete(t)}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
