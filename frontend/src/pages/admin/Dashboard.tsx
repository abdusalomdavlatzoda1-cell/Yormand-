import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface Stats {
  totalAppointments: number;
  pending: number;
  confirmed: number;
  totalServices: number;
  totalDoctors: number;
  galleryImages: number;
  reviews: number;
  recent: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [appointments, services, doctors, gallery, reviews] = await Promise.all([
        api.get("/appointments"),
        api.get("/services?all=true"),
        api.get("/doctors?all=true"),
        api.get("/gallery?all=true"),
        api.get("/reviews?all=true"),
      ]);
      const list = appointments.data;
      setStats({
        totalAppointments: list.length,
        pending: list.filter((a: any) => a.status === "PENDING" || a.status === "NEW").length,
        confirmed: list.filter((a: any) => a.status === "CONFIRMED").length,
        totalServices: services.data.length,
        totalDoctors: doctors.data.length,
        galleryImages: gallery.data.length,
        reviews: reviews.data.length,
        recent: list.slice(0, 5),
      });
    })();
  }, []);

  if (!stats) return <div className="text-brand-500">Loading dashboard...</div>;

  const cards = [
    { label: "Total Appointments", value: stats.totalAppointments },
    { label: "New / Pending", value: stats.pending },
    { label: "Confirmed", value: stats.confirmed },
    { label: "Services", value: stats.totalServices },
    { label: "Doctors", value: stats.totalDoctors },
    { label: "Gallery Images", value: stats.galleryImages },
    { label: "Reviews", value: stats.reviews },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="text-3xl font-display font-semibold text-brand-800">{c.value}</div>
            <div className="text-sm text-brand-900/50 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-brand-900">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-sm text-brand-700">View all →</Link>
        </div>
        <div className="divide-y divide-brand-100">
          {stats.recent.map((a) => (
            <div key={a.id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <div className="font-medium text-brand-900">{a.name}</div>
                <div className="text-brand-900/50">{a.phone} · {a.serviceName || "—"}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs bg-brand-100 text-brand-700">{a.status}</span>
            </div>
          ))}
          {stats.recent.length === 0 && <div className="text-brand-900/40 py-4 text-sm">No appointments yet.</div>}
        </div>
      </div>
    </div>
  );
}
