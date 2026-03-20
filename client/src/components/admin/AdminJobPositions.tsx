import { useState, useEffect } from "react";
import clsx from "clsx";
import type { JobPosition } from "../../types";
import { getJobPositions, createJobPosition, updateJobPosition, deleteJobPosition } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";
import { InlineConfirm } from "../ui/InlineConfirm";

const EMPTY_FORM = { title: "", type: "Full-time", mode: "Remote", department: "", description: "", requirements: "" };

export function AdminJobPositions() {
  const toast = useToast();
  const [items, setItems] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newFields, setNewFields] = useState(EMPTY_FORM);
  const [editFields, setEditFields] = useState(EMPTY_FORM);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await getJobPositions();
      setItems(res.data);
    } catch {
      toast("Failed to load job positions", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitNew = async () => {
    if (!newFields.title.trim()) { toast("Title is required", "warning"); return; }
    try {
      await createJobPosition(newFields);
      toast("Position created!", "success");
      setCreating(false);
      setNewFields(EMPTY_FORM);
      fetchItems();
    } catch {
      toast("Failed to create position", "error");
    }
  };

  const startEdit = (p: JobPosition) => {
    setEditing(p.id);
    setEditFields({
      title: p.title,
      type: p.type,
      mode: p.mode,
      department: p.department || "",
      description: p.description || "",
      requirements: p.requirements || "",
    });
  };

  const saveEdit = async (id: string) => {
    try {
      await updateJobPosition(id, editFields);
      setEditing(null);
      toast("Position updated!", "success");
      fetchItems();
    } catch {
      toast("Failed to save changes", "error");
    }
  };

  const toggleOpen = async (p: JobPosition) => {
    try {
      await updateJobPosition(p.id, { open: !p.open });
      toast(p.open ? "Position closed" : "Position opened", "info");
      fetchItems();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const confirmDelete = async (p: JobPosition) => {
    try {
      await deleteJobPosition(p.id);
      toast("Position deleted", "info");
      setDeleting(null);
      fetchItems();
    } catch {
      toast("Failed to delete position", "error");
    }
  };

  if (loading) return <AdminLoadingState label="Loading job positions..." />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">
          Manage open positions shown on the careers page &middot;{" "}
          <span className="text-main font-semibold">{items.filter(p => p.open).length} open</span> /{" "}
          <span className="text-muted">{items.length} total</span>
        </p>
        {!creating && (
          <Btn onClick={() => setCreating(true)} className="py-2.5! px-5! text-[13px]!">
            + New Position
          </Btn>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <Card className="mb-6 p-5!">
          <h3 className="text-sm font-semibold text-main mb-4">New Position</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Title *</label>
              <input
                value={newFields.title}
                onChange={e => setNewFields({ ...newFields, title: e.target.value })}
                placeholder="Senior Frontend Engineer"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Type</label>
              <select
                value={newFields.type}
                onChange={e => setNewFields({ ...newFields, type: e.target.value })}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none appearance-none cursor-pointer"
              >
                {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(t => (
                  <option key={t} value={t} className="bg-surface">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Mode</label>
              <select
                value={newFields.mode}
                onChange={e => setNewFields({ ...newFields, mode: e.target.value })}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none appearance-none cursor-pointer"
              >
                {["Remote", "Hybrid", "On-site", "Remote / Hybrid"].map(m => (
                  <option key={m} value={m} className="bg-surface">{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Department</label>
              <input
                value={newFields.department}
                onChange={e => setNewFields({ ...newFields, department: e.target.value })}
                placeholder="Engineering"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Description</label>
              <input
                value={newFields.description}
                onChange={e => setNewFields({ ...newFields, description: e.target.value })}
                placeholder="Brief role description..."
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Requirements (for AI screening)</label>
            <textarea
              value={newFields.requirements}
              onChange={e => setNewFields({ ...newFields, requirements: e.target.value })}
              placeholder="Required skills, experience level, qualifications..."
              rows={3}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40 resize-y"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setCreating(false); setNewFields(EMPTY_FORM); }}
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

      {/* Table */}
      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px_100px_120px] min-w-175 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>Title</span>
            <span>Type</span>
            <span>Mode</span>
            <span>Department</span>
            <span>Status</span>
            <span>Updated</span>
            <span></span>
          </div>

          {items.length === 0 && (
            <div className="px-5 py-10 text-center text-secondary text-sm">
              No positions yet. Click &ldquo;+ New Position&rdquo; to add one.
            </div>
          )}

          {items.map((p, i) => (
            <div key={p.id}>
              <div
                className={clsx(
                  "grid grid-cols-[2fr_1fr_1fr_1fr_80px_100px_120px] min-w-175 px-5 py-3.5 items-center transition-colors duration-200",
                  i < items.length - 1 && deleting !== p.id && "border-b border-border",
                  editing === p.id ? "bg-surface-hover" : "hover:bg-surface-hover",
                )}
              >
                {editing === p.id ? (
                  <input
                    value={editFields.title}
                    onChange={e => setEditFields({ ...editFields, title: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[90%]"
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(p.id); }}
                  />
                ) : (
                  <span className="text-sm font-semibold text-main truncate">{p.title}</span>
                )}

                {editing === p.id ? (
                  <select
                    value={editFields.type}
                    onChange={e => setEditFields({ ...editFields, type: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2 py-1.5 text-main text-xs font-sans outline-none w-[90%] appearance-none"
                  >
                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(t => (
                      <option key={t} value={t} className="bg-surface">{t}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-secondary">{p.type}</span>
                )}

                {editing === p.id ? (
                  <select
                    value={editFields.mode}
                    onChange={e => setEditFields({ ...editFields, mode: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2 py-1.5 text-main text-xs font-sans outline-none w-[90%] appearance-none"
                  >
                    {["Remote", "Hybrid", "On-site", "Remote / Hybrid"].map(m => (
                      <option key={m} value={m} className="bg-surface">{m}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-secondary">{p.mode}</span>
                )}

                {editing === p.id ? (
                  <input
                    value={editFields.department}
                    onChange={e => setEditFields({ ...editFields, department: e.target.value })}
                    className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-[90%]"
                  />
                ) : (
                  <span className="text-xs text-secondary truncate">{p.department || "\u2014"}</span>
                )}

                <span onClick={() => toggleOpen(p)} className="cursor-pointer">
                  <Pill color={p.open ? "#2DD4A8" : "#E84855"}>
                    {p.open ? "Open" : "Closed"}
                  </Pill>
                </span>

                <span className="text-xs text-secondary">
                  {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>

                <div className="flex gap-1.5 justify-end">
                  {editing === p.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(p.id)}
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
                        onClick={() => startEdit(p)}
                        className="py-1.25 px-3.5 rounded-md bg-surface border border-border text-secondary text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-accent/27 hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(deleting === p.id ? null : p.id)}
                        className="py-1.25 px-3 rounded-md bg-surface border border-border text-error text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-error/27"
                      >
                        Del
                      </button>
                    </>
                  )}
                </div>
              </div>

              {deleting === p.id && (
                <InlineConfirm
                  message={`Delete position \u201C${p.title}\u201D?`}
                  onCancel={() => setDeleting(null)}
                  onConfirm={() => confirmDelete(p)}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
