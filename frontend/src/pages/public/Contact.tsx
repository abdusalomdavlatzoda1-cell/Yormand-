import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { SiteSettings } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";

export default function Contact() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.contact")} title={t("contact.title")} />
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="card p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">{t("contact.address")}</div>
            <p className="text-brand-900">{settings.address || "Pulodi Street 4, Dushanbe, Tajikistan"}</p>
            {settings.landmark && <p className="text-sm text-brand-900/50 mt-1">{settings.landmark}</p>}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">{t("contact.phone")}</div>
            <a href={`tel:${settings.phone}`} className="text-brand-900 hover:text-brand-700">
              {settings.phone || "+992 88 787 6006"}
            </a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">{t("contact.hours")}</div>
            <p className="text-brand-900">{settings.workingHours || "Daily, approximately 08:00–21:00"}</p>
          </div>
          <Link to="/appointment" className="btn-primary inline-flex">{t("buttons.bookNow")}</Link>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-brand-100 min-h-[320px]">
          <iframe
            title="Yormand Dental Clinic location"
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            src="https://www.google.com/maps?q=Pulodi+Street+4,+Dushanbe,+Tajikistan&output=embed"
          />
        </div>
      </div>
    </div>
  );
}
