import { useState, useEffect } from "react";
import clsx from "clsx";
import type { ContentPage } from "../../types";
import { getContentPages, updateContentPage, createContentPage } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";

export function AdminContent() {
  const toast = useToast();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // Fetch content pages from the API on mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await getContentPages();
      setPages(data);
    } catch {
      toast("Failed to load content pages", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: ContentPage) => {
    setEditing(p.id);
    setEditContent(p.content);
  };

  // Save edited content to the backend
  const saveEdit = async (id: string) => {
    try {
      await updateContentPage(id, { content: editContent });
      setEditing(null);
      toast("Section updated successfully!", "success");
      fetchPages(); // refresh the list
    } catch {
      toast("Failed to save changes", "error");
    }
  };

  // Toggle published/draft status via API
  const toggleStatus = async (p: ContentPage) => {
    const newStatus = p.status === "Published" ? "Draft" : "Published";
    try {
      await updateContentPage(p.id, { status: newStatus });
      toast("Status updated", "info");
      fetchPages();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  // Create a new content page via API
  const submitNewSection = async () => {
    if (!newName.trim()) {
      toast("Section name is required", "warning");
      return;
    }
    try {
      await createContentPage({ name: newName.trim(), content: "", status: "Draft" });
      toast("New section created!", "success");
      setCreating(false);
      setNewName("");
      fetchPages();
    } catch {
      toast("Failed to create section", "error");
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading content..." />;
  }

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">Manage Codnexia website sections</p>
        {!creating && (
          <Btn onClick={() => setCreating(true)} className="py-2.5! px-5! text-[13px]!">
            + New Section
          </Btn>
        )}
      </div>

      {/* Inline create form */}
      {creating && (
        <Card className="mb-6 p-5!">
          <h3 className="text-sm font-semibold text-main mb-3">New Section</h3>
          <div className="mb-4">
            <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Section Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Pricing, FAQ..."
              className="w-full max-w-sm bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewSection();
              }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setCreating(false); setNewName(""); }}
              className="py-2 px-4 rounded-md bg-surface border border-border text-muted text-xs cursor-pointer font-sans"
            >
              Cancel
            </button>
            <button
              onClick={submitNewSection}
              className="py-2 px-4 rounded-md bg-accent-dim border border-accent/27 text-accent text-xs font-semibold cursor-pointer font-sans"
            >
              Create
            </button>
          </div>
        </Card>
      )}

      {/* Content table */}
      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] min-w-150 px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]">
            <span>Section</span>
            <span>Content Preview</span>
            <span>Status</span>
            <span>Updated</span>
            <span></span>
          </div>

          {/* Table rows */}
          {pages.map((p, i) => (
            <div
              key={p.id}
              className={clsx(
                "grid grid-cols-[2fr_2fr_1fr_1fr_120px] min-w-150 px-5 py-3.5 items-center transition-colors duration-200",
                i < pages.length - 1 && "border-b border-border",
                editing === p.id ? "bg-surface-hover" : "hover:bg-surface-hover",
              )}
            >
              <span className="text-sm font-semibold text-main">{p.name}</span>

              {editing === p.id ? (
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-surface border border-accent/27 rounded-md px-2.5 py-1.5 text-main text-xs font-sans outline-none w-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(p.id);
                  }}
                />
              ) : (
                <span className="text-xs text-secondary truncate">{p.content}</span>
              )}

              <span onClick={() => toggleStatus(p)} className="cursor-pointer">
                <Pill color={p.status === "Published" ? "#2DD4A8" : "#F5A623"}>
                  {p.status}
                </Pill>
              </span>

              <span className="text-xs text-secondary">{p.updated}</span>

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
                  <button
                    onClick={() => startEdit(p)}
                    className="py-1.25 px-3.5 rounded-md bg-surface border border-border text-secondary text-[11px] font-semibold cursor-pointer font-sans transition-all duration-200 hover:border-accent/27 hover:text-accent"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
