import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Locale } from "../../types";

const langs: { code: Locale; label: string }[] = [
  { code: "tj", label: "TJ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export default function Header() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    { to: "/doctors", label: t("nav.doctors") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/reviews", label: t("nav.reviews") },
    { to: "/prices", label: t("nav.prices") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur border-b border-brand-100">
      <div className="container-px mx-auto flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-semibold text-brand-800">Yormand</span>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-gold border-l border-brand-200 pl-2">Dental Clinic</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-brand-700" : "text-brand-900/70 hover:text-brand-700"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 border border-brand-200 rounded-full p-1">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                  locale === l.code ? "bg-brand-700 text-ivory" : "text-brand-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <Link to="/appointment" className="hidden sm:inline-flex btn-primary">
            {t("nav.book")}
          </Link>
          <button className="lg:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden container-px pb-4 flex flex-col gap-3 bg-ivory">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-brand-900/80 py-1">
              {l.label}
            </NavLink>
          ))}
          <div className="flex gap-2 pt-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  locale === l.code ? "bg-brand-700 text-ivory border-brand-700" : "border-brand-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <Link to="/appointment" onClick={() => setOpen(false)} className="btn-primary mt-2">
            {t("nav.book")}
          </Link>
        </div>
      )}
    </header>
  );
}
