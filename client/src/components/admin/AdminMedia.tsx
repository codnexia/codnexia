import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import type { MediaFile } from "../../types";
import { getMediaFiles, uploadMediaFile, deleteMediaFile } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";

export function AdminMedia() {
  const toast = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media files from the API on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getMediaFiles();
      setFiles(data);
    } catch {
      toast("Failed to load media files", "error");
    } finally {
      setLoading(false);
    }
  };

  // Upload file(s) via the API
  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    for (const file of Array.from(fileList)) {
      try {
        await uploadMediaFile(file);
        toast(`${file.name} uploaded!`, "success");
      } catch {
        toast(`Failed to upload ${file.name}`, "error");
      }
    }
    fetchFiles(); // refresh after uploads
  };

  // Delete a file via the API
  const handleDelete = async (id: string) => {
    try {
      await deleteMediaFile(id);
      toast("File deleted", "info");
      fetchFiles();
    } catch {
      toast("Failed to delete file", "error");
    }
  };

  // Open the native file picker
  const openFilePicker = () => fileInputRef.current?.click();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 text-secondary text-sm">
        Loading media...
      </div>
    );
  }

  return (
    <div>
      {/* Hidden file input for the native picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-secondary m-0">
          Upload and manage Codnexia assets &middot;{" "}
          <span className="text-main font-semibold">{files.length} files</span>
        </p>
        <Btn onClick={openFilePicker} className="py-2.5! px-5! text-[13px]!">
          + Upload Files
        </Btn>
      </div>

      {/* Drag & drop upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        onClick={openFilePicker}
        className={clsx(
          "border-2 border-dashed rounded-2xl p-6 md:p-12 text-center mb-6 transition-all duration-300 cursor-pointer",
          dragOver ? "border-accent bg-accent-dim" : "border-border-light bg-transparent",
        )}
      >
        <div className="text-[44px] mb-3 opacity-60">{"\uD83D\uDCC2"}</div>
        <div className="text-base font-semibold text-main mb-1">Drag & drop files here</div>
        <div className="text-[13px] text-secondary">
          PNG, JPG, SVG, MP4 up to 50MB &middot; or click to browse
        </div>
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {files.map(f => (
          <Card key={f.id} hoverable className="p-4.5! text-center relative">
            <button
              onClick={() => handleDelete(f.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md bg-surface border border-border text-muted text-xs cursor-pointer flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
            >
              {"\u2715"}
            </button>
            <div className="w-full h-20 rounded-[10px] bg-surface mb-3 flex items-center justify-center text-[28px] text-muted">
              {f.type === "Video" ? "\u25B6" : f.type === "SVG" ? "\u25C7" : "\u25FB"}
            </div>
            <div className="text-[13px] font-semibold text-main mb-0.5 truncate">{f.name}</div>
            <div className="text-[11px] text-muted">{f.size} &middot; {f.date}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
