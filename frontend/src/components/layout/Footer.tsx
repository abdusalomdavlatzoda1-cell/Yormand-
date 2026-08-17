import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SiteSettings } from "../../types";

export default function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-brand-900 text-ivory/90 mt-24">
      <div className="container-px mx-auto py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-2xl font-display font-semibold text-ivory mb-3">Yormand</div>
          <p className="text-sm text-ivory/60 leading-relaxed">
            {settings.address || "Pulodi Street 4, Dushanbe, Tajikistan"}
          </p>
          <p className="text-sm text-ivory/60 mt-2">{settings.phone || "+992 88 787 6006"}</p>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wider text-gold mb-3">{t("nav.services")}</div>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/services">{t("nav.services")}</Link></li>
            <li><Link to="/doctors">{t("nav.doctors")}</Link></li>
            <li><Link to="/prices">{t("nav.prices")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wider text-gold mb-3">{t("contact.title")}</div>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/gallery">{t("nav.gallery")}</Link></li>
            <li><Link to="/reviews">{t("nav.reviews")}</Link></li>
            <li><Link to="/contact">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wider text-gold mb-3">{t("contact.hours")}</div>
          <p className="text-sm text-ivory/70">{settings.workingHours || "08:00–21:00"}</p>
          <Link to="/appointment" className="btn-secondary !border-ivory/40 !text-ivory mt-4 hover:!bg-white/10">
            {t("nav.book")}
          </Link>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6">
        <div className="container-px mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} Yormand Dental Clinic. {t("footer.rights")}</span>
          <div className="flex gap-4">
            <Link to="/privacy">{t("footer.privacy")}</Link>
            <Link to="/terms">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
