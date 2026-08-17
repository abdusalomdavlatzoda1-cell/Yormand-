import { useEffect, useState } from "react";
import api from "../../services/api";
import { BeforeAfterItem } from "../../types";
import ImageUpload from "../../components/admin/ImageUpload";

export default function AdminBeforeAfter() {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [form, setForm] = useState({ beforeImage: "", afterImage: "", treatmentName: "", description: "" });

  const load = () => api.get("/before-after?all=true").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.beforeImage || !form.afterImage || !form.treatmentName) {
      return alert("Before image, after image, and treatment name are required.");
    }
    await api.post("/before-after", { ...form, order: items.length, published: false });
    setForm({ beforeImage: "", afterImage: "", treatmentName: "", description: "" });
    load();
  };

  const togglePublish = async (item: BeforeAfterItem) => {
    await api.put(`/before-after/${item.id}`, { published: !item.published });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this case?")) return;
    await api.delete(`/before-after/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-2">Before & After</h1>
      <p className="text-sm text-gold mb-6">
        Only publish patient images after obtaining appropriate consent.
      </p>

      <div className="card p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-brand-900">Add case</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-brand-900 mb-1">Before image</label>
            <ImageUpload value={form.beforeImage} onChange={(url) => setForm({ ...form, beforeImage: url })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-900 mb-1">After image</label>
            <ImageUpload value={form.afterImage} onChange={(url) => setForm({ ...form, afterImage: url })} />
          </div>
        </div>
        <input
          placeholder="Treatment name"
          value={form.treatmentName}
          onChange={(e) => setForm({ ...form, treatmentName: e.target.value })}
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          rows={2}
        />
        <button onClick={add} className="btn-primary">Add case (unpublished)</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((i) => (
          <div key={i.id} className="card overflow-hidden">
            <div className="grid grid-cols-2">
              <img src={i.beforeImage} alt="Before" className="w-full aspect-square object-cover" />
              <img src={i.afterImage} alt="After" className="w-full aspect-square object-cover" />
            </div>
            <div className="p-4">
              <div className="font-medium text-brand-900">{i.treatmentName}</div>
              <div className="flex justify-between items-center mt-3">
                <button onClick={() => togglePublish(i)} className={`text-xs ${i.published ? "text-brand-700" : "text-gold"}`}>
                  {i.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => remove(i.id)} className="text-xs text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-brand-900/40 text-sm">No cases yet.</div>}
      </div>
    </div>
  );
}
