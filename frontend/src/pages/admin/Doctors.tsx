import { useEffect, useState } from "react";
import api from "../../services/api";
import { Doctor, Translation } from "../../types";
import ImageUpload from "../../components/admin/ImageUpload";

const emptyTranslations: Translation[] = [
  { locale: "tj", fullName: "", specialization: "", biography: "", education: "" },
  { locale: "ru", fullName: "", specialization: "", biography: "", education: "" },
  { locale: "en", fullName: "", specialization: "", biography: "", education: "" },
];

const emptyForm = {
  slug: "",
  photo: "",
  isPlaceholder: false,
  experience: "",
  active: true,
  translations: emptyTranslations,
};

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [showModal, setShowModal] = useState(false);

  const load = () => api.get("/doctors?all=true").then((r) => setDoctors(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (d: Doctor) => {
    setEditing(d);
    setForm({
      slug: d.slug,
      photo: d.photo || "",
      isPlaceholder: d.isPlaceholder,
      experience: d.experience || "",
      active: d.active,
      translations: ["tj", "ru", "en"].map(
        (loc) => d.translations.find((t) => t.locale === loc) || { locale: loc, fullName: "", specialization: "", biography: "", education: "" }
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
    if (editing) {
      await api.put(`/doctors/${editing.id}`, form);
    } else {
      await api.post("/doctors", form);
    }
    setShowModal(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    await api.delete(`/doctors/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-brand-900">Doctors</h1>
        <button onClick={openNew} className="btn-primary">+ New Doctor</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-brand-100 text-brand-900/50">
              <th className="px-5 py-3">Name (RU)</th>
              <th className="px-5 py-3">Specialization</th>
              <th className="px-5 py-3">Placeholder</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => {
              const ru = d.translations.find((t) => t.locale === "ru");
              return (
                <tr key={d.id} className="border-b border-brand-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-brand-900">{ru?.fullName || d.slug}</td>
                  <td className="px-5 py-3">{ru?.specialization}</td>
                  <td className="px-5 py-3">{d.isPlaceholder ? "Yes" : "—"}</td>
                  <td className="px-5 py-3">{d.active ? "Yes" : "No"}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(d)} className="text-brand-700 text-xs">Edit</button>
                    <button onClick={() => remove(d.id)} className="text-red-500 text-xs">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="card p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-brand-900 mb-4">{editing ? "Edit Doctor" : "New Doctor"}</h2>

            <div className="mb-5">
              <label className="block text-xs font-medium text-brand-900 mb-1">Photo</label>
              <ImageUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-brand-900 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-900 mb-1">Experience</label>
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm mb-5">
              <input type="checkbox" checked={form.isPlaceholder} onChange={(e) => setForm({ ...form, isPlaceholder: e.target.checked })} />
              Mark as unconfirmed placeholder (info pending clinic confirmation)
            </label>

            {form.translations.map((t: Translation) => (
              <div key={t.locale} className="mb-4 border-t border-brand-100 pt-4">
                <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">{t.locale}</div>
                <input
                  placeholder="Full name"
                  value={t.fullName}
                  onChange={(e) => updateTranslation(t.locale, "fullName", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm mb-2"
                />
                <input
                  placeholder="Specialization"
                  value={t.specialization}
                  onChange={(e) => updateTranslation(t.locale, "specialization", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm mb-2"
                />
                <textarea
                  placeholder="Biography"
                  value={t.biography}
                  onChange={(e) => updateTranslation(t.locale, "biography", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm mb-2"
                  rows={2}
                />
                <textarea
                  placeholder="Education"
                  value={t.education}
                  onChange={(e) => updateTranslation(t.locale, "education", e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
                  rows={2}
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
