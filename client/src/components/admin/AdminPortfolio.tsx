import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import type { PortfolioProject } from "../../types";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  uploadPortfolioImage,
  removePortfolioImage,
} from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Pill } from "../ui/Pill";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";
import { AdminLoadingState } from "../ui/AdminLoadingState";
import { InlineConfirm } from "../ui/InlineConfirm";

interface PortfolioItem extends PortfolioProject {
  updated: string;
}

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  description: "",
  category: "",
  color: "#2DD4A8",
  tags: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

export function AdminPortfolio() {
  const toast = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newFields, setNewFields] = useState(EMPTY_FORM);
  const [editFields, setEditFields] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await getPortfolios();
      setItems(res.data as PortfolioItem[]);
    } catch {
      toast("Failed to load portfolio projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: PortfolioItem) => {
    setEditing(p.id);
    setEditFields({
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      category: p.category,
      color: p.color,
      tags: p.tags.join(", "),
      liveUrl: p.liveUrl || "",
      repoUrl: p.repoUrl || "",
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
    });
  };

  const saveEdit = async (id: string) => {
    try {
      const tags = editFields.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await updatePortfolio(id, {
        title: editFields.title,
        subtitle: editFields.subtitle,
        description: editFields.description,
        category: editFields.category,
        color: editFields.color,
        tags,
        liveUrl: editFields.liveUrl || undefined,
        repoUrl: editFields.repoUrl || undefined,
        featured: editFields.featured,
        published: editFields.published,
        sortOrder: editFields.sortOrder,
      });
      setEditing(null);
      toast("Portfolio updated!", "success");
      fetchItems();
    } catch {
      toast("Failed to save changes", "error");
    }
  };

  const togglePublished = async (p: PortfolioItem) => {
    try {
      await updatePortfolio(p.id, { published: !p.published });
      toast("Status updated", "info");
      fetchItems();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const toggleFeatured = async (p: PortfolioItem) => {
    try {
      await updatePortfolio(p.id, { featured: !p.featured });
      toast("Featured status updated", "info");
      fetchItems();
    } catch {
      toast("Failed to update featured status", "error");
    }
  };

  const submitNew = async () => {
    if (!newFields.title || !newFields.subtitle || !newFields.description || !newFields.category) {
      toast("Title, subtitle, description, and category are required", "warning");
      return;
    }
    try {
      const tags = newFields.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await createPortfolio({
        title: newFields.title,
        subtitle: newFields.subtitle,
        description: newFields.description,
        category: newFields.category,
        color: newFields.color,
        tags,
        liveUrl: newFields.liveUrl || undefined,
        repoUrl: newFields.repoUrl || undefined,
        featured: newFields.featured,
        published: newFields.published,
        sortOrder: newFields.sortOrder,
      });
      toast("Portfolio project created!", "success");
      setCreating(false);
      setNewFields(EMPTY_FORM);
      fetchItems();
    } catch {
      toast("Failed to create portfolio project", "error");
    }
  };

  const confirmDelete = async (p: PortfolioItem) => {
    try {
      await deletePortfolio(p.id);
      toast("Portfolio project deleted", "info");
      setDeleting(null);
      fetchItems();
    } catch {
      toast("Failed to delete portfolio project", "error");
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploading(id);
    try {
      await uploadPortfolioImage(id, file);
      toast("Image uploaded and optimized!", "success");
      fetchItems();
    } catch {
      toast("Failed to upload image", "error");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (id: string) => {
    try {
      await removePortfolioImage(id);
      toast("Image removed", "info");
      fetchItems();
    } catch {
      toast("Failed to remove image", "error");
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading portfolio projects..." />;
  }

  const gridCols = "grid-cols-[60px_1.5fr_1fr_80px_60px_60px_80px_130px] min-w-200";

  // Reusable form fields renderer
  const renderFormFields = (
    fields: typeof EMPTY_FORM,
    setFields: (f: typeof EMPTY_FORM) => void,
    autoFocus = false,
  ) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Title</label>
          <input
            value={fields.title}
            onChange={(e) => setFields({ ...fields, title: e.target.value })}
            placeholder="Project Name"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
            autoFocus={autoFocus}
          />
        </div>
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Subtitle</label>
          <input
            value={fields.subtitle}
            onChange={(e) => setFields({ ...fields, subtitle: e.target.value })}
            placeholder="Short tagline"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Description</label>
        <textarea
          value={fields.description}
          onChange={(e) => setFields({ ...fields, description: e.target.value })}
          placeholder="Project description..."
          rows={3}
          className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none resize-none focus:border-accent/40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Category</label>
          <input
            value={fields.category}
            onChange={(e) => setFields({ ...fields, category: e.target.value })}
            placeholder="SaaS, Mobile, etc."
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Color</label>
          <input
            value={fields.color}
            onChange={(e) => setFields({ ...fields, color: e.target.value })}
            placeholder="#2DD4A8"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Sort Order</label>
          <input
            type="number"
            value={fields.sortOrder}
            onChange={(e) => setFields({ ...fields, sortOrder: Number(e.target.value) })}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Tags (comma-separated)</label>
          <input
            value={fields.tags}
            onChange={(e) => setFields({ ...fields, tags: e.target.value })}
            placeholder="React, Node.js, PostgreSQL"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="text-[11px] text-muted uppercase tracking-wide mb-1 block">Live URL</label>
          <input
            value={fields.liveUrl}
            onChange={(e) => setFields({ ...fields, liveUrl: e.target.value })}
            placeholder="https://example.com"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-main text-sm font-sans outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
          <input
            type="checkbox"
            checked={fields.featured}
            onChange={(e) => setFields({ ...fields, featured: e.target.checked })}
            className="accent-[#2DD4A8]"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
          <input
            type="checkbox"
            checked={fields.published}
            onChange={(e) => setFields({ ...fields, published: e.target.checked })}
            className="accent-[#2DD4A8]"
          />
          Published
        </label>
      </div>
    </>
  );

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">Manage portfolio projects</p>
        {!creating && (
          <Btn onClick={() => setCreating(true)} className="py-2.5! px-5! text-[13px]!">
            + New Project
          </Btn>
        )}
      </div>

      {/* Inline create form */}
      {creating && (
        <Card className="mb-6 p-5!">
          <h3 className="text-sm font-semibold text-main mb-4">New Portfolio Project</h3>
          {renderFormFields(newFields, setNewFields, true)}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setCreating(false);
                setNewFields(EMPTY_FORM);
              }}
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

      {/* Portfolio table */}
      <Card className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div
            className={`grid ${gridCols} px-5 py-3 border-b border-border text-[11px] text-muted font-semibold uppercase tracking-[0.8px]`}
          >
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Feat.</span>
            <span>Order</span>
            <span>Updated</span>
            <span></span>
          </div>

          {items.length === 0 && (
            <div className="px-5 py-10 text-center text-secondary text-sm">
              No portfolio projects yet. Click &ldquo;+ New Project&rdquo; to add one.
            </div>
          )}

          {/* Table rows */}
          {items.map((p, i) => (
            <div key={p.id}>
              {editing === p.id ? (
                /* Expanded edit form */
                <div className="px-5 py-4 bg-surface-hover border-b border-border">
                  <h4 className="text-sm font-semibold text-main mb-3">Edit: {p.title}</h4>
                  {renderFormFields(editFields, setEditFields)}

                  {/* Image upload section */}
                  <div className="mb-4">
                    <label className="text-[11px] text-muted uppercase tracking-wide mb-2 block">
                      Project Image
                    </label>
                    <div className="flex items-center gap-3">
                      {p.thumbnailUrl ? (
                        <img
                          src={p.thumbnailUrl}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg border border-border bg-surface flex items-center justify-center text-muted text-xs">
                          None
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(p.id, file);
                            e.target.value = "";
                          }}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading === p.id}
                          className="py-1.5 px-3 rounded-md bg-accent-dim border border-accent/27 text-accent text-[11px] font-semibold cursor-pointer font-sans disabled:opacity-50"
                        >
                          {uploading === p.id ? "Uploading..." : "Upload"}
                        </button>
                        {p.imageUrl && (
                          <button
                            onClick={() => handleRemoveImage(p.id)}
                            className="py-1.5 px-3 rounded-md bg-surface border border-border text-error text-[11px] cursor-pointer font-sans"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="py-2 px-4 rounded-md bg-accent-dim border border-accent/27 text-accent text-xs font-semibold cursor-pointer font-sans"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="py-2 px-4 rounded-md bg-surface border border-border text-muted text-xs cursor-pointer font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Compact row */
                <div
                  className={clsx(
                    `grid ${gridCols} px-5 py-3.5 items-center transition-colors duration-200`,
                    i < items.length - 1 && deleting !== p.id && "border-b border-border",
                    "hover:bg-surface-hover",
                  )}
                >
                  {/* Thumbnail */}
                  <div>
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-xs"
                        style={{ background: `${p.color}18`, color: p.color }}
                      >
                        &#9674;
                      </div>
                    )}
                  </div>

                  {/* Title + Subtitle */}
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-main truncate block">{p.title}</span>
                    <span className="text-[11px] text-muted truncate block">{p.subtitle}</span>
                  </div>

                  {/* Category */}
                  <span className="text-xs text-secondary truncate">{p.category}</span>

                  {/* Published status */}
                  <span onClick={() => togglePublished(p)} className="cursor-pointer">
                    <Pill color={p.published ? "#2DD4A8" : "#F5A623"}>
                      {p.published ? "Live" : "Draft"}
                    </Pill>
                  </span>

                  {/* Featured */}
                  <span
                    onClick={() => toggleFeatured(p)}
                    className={clsx(
                      "cursor-pointer text-sm",
                      p.featured ? "text-accent" : "text-muted",
                    )}
                    title={p.featured ? "Featured" : "Not featured"}
                  >
                    {p.featured ? "\u2605" : "\u2606"}
                  </span>

                  {/* Sort order */}
                  <span className="text-xs text-secondary">{p.sortOrder}</span>

                  {/* Updated */}
                  <span className="text-xs text-secondary">{p.updated}</span>

                  {/* Actions */}
                  <div className="flex gap-1.5 justify-end">
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
                  </div>
                </div>
              )}

              {/* Inline delete confirmation */}
              {deleting === p.id && (
                <InlineConfirm
                  message={`Delete portfolio project \u201C${p.title}\u201D?`}
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
