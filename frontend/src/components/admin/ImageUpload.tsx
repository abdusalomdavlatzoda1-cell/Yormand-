import { useRef, useState } from "react";
import api from "../../services/api";

export default function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
    } catch {
      alert("Upload failed. Check file type (jpeg/png/webp/gif) and size (max 5MB).");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <img src={value} alt="" className="w-20 h-20 rounded-lg object-cover border border-brand-200" />
      ) : (
        <div className="w-20 h-20 rounded-lg bg-brand-50 border border-dashed border-brand-200 flex items-center justify-center text-xs text-brand-300">
          None
        </div>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary text-xs !px-4 !py-2" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload image"}
        </button>
      </div>
    </div>
  );
}
