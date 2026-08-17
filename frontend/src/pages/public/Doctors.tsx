import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Doctor } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import { Loading } from "../../components/ui/States";

export default function Doctors() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);

  useEffect(() => {
    api.get("/doctors").then((r) => setDoctors(r.data)).catch(() => setDoctors([]));
  }, []);

  if (!doctors) return <Loading />;

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.doctors")} title={t("sections.doctorsTitle")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((d) => {
          const tr = pickTranslation(d.translations, locale);
          return (
            <Link to={`/doctors/${d.slug}`} key={d.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-brand-100 flex items-center justify-center text-brand-300 text-sm">
                {d.photo ? (
                  <img src={d.photo} alt={tr?.fullName} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span>Photo pending</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-brand-900">{tr?.fullName}</h3>
                <p className="text-sm text-brand-900/50 mt-1">{tr?.specialization}</p>
                {d.isPlaceholder && <p className="text-xs text-gold mt-2">{t("placeholder.doctorNote")}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
