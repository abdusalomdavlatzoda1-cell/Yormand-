import { useEffect, useState } from "react";
import api from "../../services/api";
import { ReviewItem } from "../../types";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [form, setForm] = useState({ reviewerName: "", rating: 5, content: "", source: "" });

  const load = () => api.get("/reviews?all=true").then((r) => setReviews(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.reviewerName || !form.content) return alert("Reviewer name and content are required.");
    await api.post("/reviews", { ...form, order: reviews.length, approved: false });
    setForm({ reviewerName: "", rating: 5, content: "", source: "" });
    load();
  };

  const toggleApproved = async (r: ReviewItem) => {
    await api.put(`/reviews/${r.id}`, { approved: !r.approved });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-2">Reviews</h1>
      <p className="text-sm text-brand-900/50 mb-6">Only add reviews the clinic has actually received. Preserve the original source.</p>

      <div className="card p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-brand-900">Add review</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            placeholder="Reviewer name"
            value={form.reviewerName}
            onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="rounded-lg border border-brand-200 px-3 py-2 text-sm">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <input
            placeholder="Source (e.g. Yandex Maps review)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          placeholder="Review content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          rows={3}
        />
        <button onClick={add} className="btn-primary">Add review (unapproved)</button>
      </div>

      <div className="card divide-y divide-brand-100">
        {reviews.map((r) => (
          <div key={r.id} className="p-5 flex justify-between items-start gap-4">
            <div>
              <div className="font-medium text-brand-900">{r.reviewerName} · {r.rating}★</div>
              <p className="text-sm text-brand-900/60 mt-1">{r.content}</p>
              {r.source && <div className="text-xs text-brand-900/40 mt-1">{r.source}</div>}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button onClick={() => toggleApproved(r)} className={`text-xs ${r.approved ? "text-brand-700" : "text-gold"}`}>
                {r.approved ? "Unapprove" : "Approve"}
              </button>
              <button onClick={() => remove(r.id)} className="text-xs text-red-500">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <div className="p-5 text-brand-900/40 text-sm">No reviews yet.</div>}
      </div>
    </div>
  );
}
