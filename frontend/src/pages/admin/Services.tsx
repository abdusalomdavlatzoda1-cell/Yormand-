import { useEffect, useState } from "react";
import api from "../../services/api";
import { Service, Translation } from "../../types";

const emptyTranslations: Translation[] = [
  { locale: "tj", title: "", shortDescription: "", fullDescription: "" },
  { locale: "ru", title: "", shortDescription: "", fullDescription: "" },
  { locale: "en", title: "", shortDescription: "", fullDescription: "" },
];

const emptyForm = {
  slug: "",
  category: "",
  price: "" as string | number,
  priceVisible: false,
  featured: false,
  active: true,
  translations: emptyTranslations,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showModal, setShowModal] = useState(false);

  const load = () => api.get("/services?all=true").then((r) => setServices(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      slug: s.slug,
      category: s.category,
      price: s.price ?? "",
      priceVisible: s.priceVisible,
      featured: s.featured,
      active: s.active,
      translations: ["tj", "ru", "en"].map(
        (loc) => s.translations.find((t) => t.locale === loc) || { locale: loc, title: "", shortDescription: "", fullDescription: "" }
      ),
    });
    setShowModal(true);
  };

  const updateTranslation = (locale: string, field: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      translations: f.translations.map((t: Translation) => (t.locale === locale ? { ...t, [field]: value } : t)),
    }));
  };

  const save = async () => {
    const payload = { ...form, price: form.price === "" ? null : Number(form.price) };
    if (editing) {
      await api.put(`/services/${editing.id}`, payload);
    } else {
      await api.post("/services", payload);
    }
    setShowModal(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-brand-900">Services</h1>
        <button onClick={openNew} className="btn-primary">+ New Service</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-brand-100 text-brand-900/50">
              <th className="px-5 py-3">Title (RU)</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-brand-50 last:border-0">
                <td className="px-5 py-3 font-medium text-brand-900">{s.translations.find((t) => t.locale === "ru")?.title || s.slug}</td>
                <td className="px-5 py-3">{s.category}</td>
                <td className="px-5 py-3">{s.featured ? "Yes" : "—"}</td>
                <td className="px-5 py-3">{s.active ? "Yes" : "No"}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button onClick={() => openEdit(s)} className="text-brand-700 text-xs">Edit</button>
                  <button onClick={() => remove(s.id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="card p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-brand-900 mb-4">{editing ? "Edit Service" : "New Service"}</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-brand-900 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-900 mb-1">Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-brand-900 mb-1">Price (TJS)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.priceVisible} onChange={(e) => setForm({ ...form, priceVisible: e.target.checked })} />
                Show price
              </label>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured
              </label>
            </div>

            {form.translations.map((t: Translation) => (
              <div key={t.locale} className="mb-4 border-t border-brand-100 pt-4">
                <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">{t.locale}</div>
                <input
                  placeholder="Title"
                  value={t.title}
                  onChange={(e) => updateTranslation(t.locale, "title", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm mb-2"
                />
                <textarea
                  placeholder="Short description"
                  value={t.shortDescription}
                  onChange={(e) => updateTranslation(t.locale, "shortDescription", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm mb-2"
                  rows={2}
                />
                <textarea
                  placeholder="Full description"
                  value={t.fullDescription}
                  onChange={(e) => updateTranslation(t.locale, "fullDescription", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
