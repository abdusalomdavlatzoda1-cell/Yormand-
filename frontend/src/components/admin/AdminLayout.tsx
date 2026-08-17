import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/appointments", label: "Appointments" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/doctors", label: "Doctors" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/before-after", label: "Before & After" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/prices", label: "Prices" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-brand-50">
      <aside className="w-64 bg-brand-900 text-ivory/90 flex flex-col shrink-0">
        <div className="px-6 py-6 text-xl font-display font-semibold text-ivory border-b border-ivory/10">
          Yormand Admin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-700 text-ivory" : "text-ivory/60 hover:bg-brand-800 hover:text-ivory"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-ivory/10 text-sm">
          <div className="text-ivory/80 mb-2 truncate">{admin?.email}</div>
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className="w-full text-left text-ivory/50 hover:text-ivory text-xs"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
