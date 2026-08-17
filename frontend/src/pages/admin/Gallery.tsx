import { useEffect, useState } from "react";
import api from "../../services/api";
import { GalleryItem } from "../../types";
import ImageUpload from "../../components/admin/ImageUpload";

const CATEGORIES = ["Clinic", "Reception", "TreatmentRooms", "Equipment", "Team", "Other"];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState({ imageUrl: "", category: "Clinic", title: "" });

  const load = () => api.get("/gallery?all=true").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.imageUrl) return alert("Please upload an image first.");
    await api.post("/gallery", { ...form, order: items.length, visible: true });
    setForm({ imageUrl: "", category: "Clinic", title: "" });
    load();
  };

  const toggleVisible = async (item: GalleryItem) => {
    await api.put(`/gallery/${item.id}`, { visible: !item.visible });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await api.delete(`/gallery/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-6">Gallery</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-brand-900 mb-4">Add photo</h2>
        <div className="grid sm:grid-cols-3 gap-4 items-start">
          <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-brand-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </div>
        <button onClick={add} className="btn-primary mt-4">Add to gallery</button>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((g) => (
          <div key={g.id} className="card overflow-hidden">
            <img src={g.imageUrl} alt={g.title || ""} className="w-full aspect-square object-cover" />
            <div className="p-3">
              <div className="text-xs text-brand-900/50 mb-2">{g.category}</div>
              <div className="flex justify-between items-center">
                <button onClick={() => toggleVisible(g)} className="text-xs text-brand-700">
                  {g.visible ? "Hide" : "Show"}
                </button>
                <button onClick={() => remove(g.id)} className="text-xs text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-brand-900/40 text-sm">No images yet.</div>}
      </div>
    </div>
  );
}
