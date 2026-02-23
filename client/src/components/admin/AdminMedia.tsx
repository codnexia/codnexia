import { useState } from "react";
import clsx from "clsx";
import type { MediaFile } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Btn } from "../ui/Btn";
import { Card } from "../ui/Card";

export function AdminMedia() {
  const toast = useToast();
  const [files, setFiles] = useState<MediaFile[]>([
    { id: 1, name: "hero-bg.jpg", size: "2.4 MB", type: "Image", date: "Feb 15" },
    { id: 2, name: "codnexia-logo.svg", size: "12 KB", type: "SVG", date: "Feb 14" },
    { id: 3, name: "team-nairobi.png", size: "1.8 MB", type: "Image", date: "Feb 12" },
    { id: 4, name: "demo-reel.mp4", size: "8.2 MB", type: "Video", date: "Feb 10" },
  ]);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = () => {
    const newFile: MediaFile = { id: Date.now(), name: `upload-${files.length + 1}.png`, size: "1.2 MB", type: "Image", date: "Just now" };
    setFiles([newFile, ...files]);
    toast("File uploaded successfully!", "success");
  };

  const deleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
    toast("File deleted", "info");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-secondary m-0">Upload and manage Codnexia assets &middot; <span className="text-main font-semibold">{files.length} files</span></p>
        <Btn onClick={handleUpload} className="!py-2.5 !px-5 !text-[13px]">+ Upload Files</Btn>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
        onClick={handleUpload}
        className={clsx(
          "border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-all duration-300 cursor-pointer",
          dragOver ? "border-accent bg-accent-dim" : "border-border-light bg-transparent",
        )}
      >
        <div className="text-[44px] mb-3 opacity-60">{"\uD83D\uDCC2"}</div>
        <div className="text-base font-semibold text-main mb-1">Drag & drop files here</div>
        <div className="text-[13px] text-secondary">PNG, JPG, SVG, MP4 up to 10MB &middot; or click to browse</div>
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {files.map(f => (
          <Card key={f.id} hoverable className="!p-[18px] text-center relative">
            <button onClick={() => deleteFile(f.id)} className="absolute top-2 right-2 w-6 h-6 rounded-md bg-surface border border-border text-muted text-xs cursor-pointer flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100">
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
