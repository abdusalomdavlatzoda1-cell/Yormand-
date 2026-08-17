import { useEffect, useState } from "react";
import api from "../../services/api";
import { Appointment } from "../../types";

const STATUSES = ["NEW", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [note, setNote] = useState("");

  const load = () => {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    api.get("/appointments", { params }).then((r) => setAppointments(r.data));
  };

  useEffect(load, [status, search]);

  const updateStatus = async (id: string, newStatus: string) => {
    await api.put(`/appointments/${id}`, { status: newStatus });
    load();
  };

  const saveNote = async () => {
    if (!selected) return;
    await api.put(`/appointments/${selected.id}`, { internalNote: note });
    setSelected(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    await api.delete(`/appointments/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-6">Appointments</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-brand-200 px-4 py-2 text-sm w-64"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-brand-200 px-4 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-brand-100 text-brand-900/50">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Preferred</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Note</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b border-brand-50 last:border-0">
                <td className="px-5 py-3 font-medium text-brand-900">{a.name}</td>
                <td className="px-5 py-3">{a.phone}</td>
                <td className="px-5 py-3">{a.serviceName || "—"}</td>
                <td className="px-5 py-3">{[a.preferredDate, a.preferredTime].filter(Boolean).join(" ") || "—"}</td>
                <td className="px-5 py-3">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className="rounded-lg border border-brand-200 px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => { setSelected(a); setNote(a.internalNote || ""); }}
                    className="text-brand-700 text-xs underline"
                  >
                    {a.internalNote ? "Edit note" : "Add note"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(a.id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-brand-900/40">No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-brand-900 mb-4">Internal note — {selected.name}</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-brand-200 px-4 py-2.5 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary">Cancel</button>
              <button onClick={saveNote} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
