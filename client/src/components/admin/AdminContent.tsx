import { useState } from "react";
import clsx from "clsx";
import type { ContentPage } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { INITIAL_PAGES } from "../../assets/data";

export function AdminContent() {
  const toast = useToast();
  const [pages, setPages] = useState<ContentPage[]>(INITIAL_PAGES);
  const [editing, setEditing] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const startEdit = (p: ContentPage) => {
    setEditing(p.id);
    setEditContent(p.content);
  };

  const saveEdit = (id: number) => {
    setPages(pages.map(p =>
      p.id === id ? { ...p, content: editContent, updated: "Just now" } : p,
    ));
    setEditing(null);
    toast("Section updated successfully!", "success");
  };

  const toggleStatus = (id: number) => {
    setPages(pages.map(p =>
      p.id === id
        ? { ...p, status: p.status === "Published" ? "Draft" : "Published", updated: "Just now" }
        : p,
    ));
    toast("Status updated", "info");
  };

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">Manage Codnexia website sections</p>
        <Btn
          onClick={() => toast("New section modal would open here", "info")}
          className="py-2.5! px-5! text-[13px]!"
        >
          + New Section
        </Btn>
      </div>

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

              <span onClick={() => toggleStatus(p.id)} className="cursor-pointer">
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
