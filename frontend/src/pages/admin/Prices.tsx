import { useEffect, useState } from "react";
import api from "../../services/api";
import { PriceItem } from "../../types";

export default function AdminPrices() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [form, setForm] = useState({
    label: "",
    price: "" as string | number,
    currency: "TJS",
    priceRange: "",
    onConsultation: false,
  });

  const load = () => api.get("/prices?all=true").then((r) => setPrices(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.label) return alert("Label is required.");
    await api.post("/prices", {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      order: prices.length,
      visible: true,
    });
    setForm({ label: "", price: "", currency: "TJS", priceRange: "", onConsultation: false });
    load();
  };

  const toggleVisible = async (p: PriceItem) => {
    await api.put(`/prices/${p.id}`, { visible: !p.visible });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this price entry?")) return;
    await api.delete(`/prices/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-2">Prices</h1>
      <p className="text-sm text-brand-900/50 mb-6">Actual prices have not been confirmed by the clinic. Add them here once available.</p>

      <div className="card p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-brand-900">Add price entry</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <input
            placeholder="Label (e.g. Teeth Whitening)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm"
            disabled={form.onConsultation}
          />
          <input
            placeholder="Currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </div>
        <input
          placeholder="Price range (optional, e.g. 500–1200 TJS)"
          value={form.priceRange}
          onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.onConsultation} onChange={(e) => setForm({ ...form, onConsultation: e.target.checked })} />
          Price on consultation only
        </label>
        <button onClick={add} className="btn-primary">Add price entry</button>
      </div>

      <div className="card divide-y divide-brand-100">
        {prices.map((p) => (
          <div key={p.id} className="p-5 flex justify-between items-center">
            <div>
              <div className="font-medium text-brand-900">{p.label}</div>
              <div className="text-sm text-brand-900/50">
                {p.onConsultation ? "On consultation" : p.priceRange || (p.price != null ? `${p.price} ${p.currency}` : "—")}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleVisible(p)} className={`text-xs ${p.visible ? "text-brand-700" : "text-gold"}`}>
                {p.visible ? "Hide" : "Show"}
              </button>
              <button onClick={() => remove(p.id)} className="text-xs text-red-500">Delete</button>
            </div>
          </div>
        ))}
        {prices.length === 0 && <div className="p-5 text-brand-900/40 text-sm">No price entries yet.</div>}
      </div>
    </div>
  );
}
