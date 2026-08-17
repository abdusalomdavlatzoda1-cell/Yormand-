import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Doctor } from "../../types";
import { Loading, ErrorState } from "../../components/ui/States";

export default function DoctorDetails() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [doctor, setDoctor] = useState<Doctor | null | undefined>(undefined);

  useEffect(() => {
    api.get(`/doctors/${slug}`).then((r) => setDoctor(r.data)).catch(() => setDoctor(null));
  }, [slug]);

  if (doctor === undefined) return <Loading />;
  if (doctor === null) return <ErrorState message="Doctor not found." />;

  const tr = pickTranslation(doctor.translations, locale);

  return (
    <div className="container-px mx-auto py-16 max-w-3xl">
      <div className="grid sm:grid-cols-3 gap-8 items-start">
        <div className="aspect-square rounded-2xl bg-brand-100 overflow-hidden flex items-center justify-center text-brand-300 text-sm">
          {doctor.photo ? (
            <img src={doctor.photo} alt={tr?.fullName} className="w-full h-full object-cover" />
          ) : (
            <span>Photo pending</span>
          )}
        </div>
        <div className="sm:col-span-2">
          <h1 className="text-3xl font-display font-semibold text-brand-900">{tr?.fullName}</h1>
          <p className="text-brand-700 mt-1">{tr?.specialization}</p>
          {doctor.isPlaceholder && (
            <p className="text-xs text-gold mt-3">{t("placeholder.doctorNote")}</p>
          )}
          {tr?.biography && <p className="mt-6 text-brand-900/70 leading-relaxed">{tr.biography}</p>}
          {tr?.education && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-brand-900">Education</div>
              <p className="text-sm text-brand-900/60">{tr.education}</p>
            </div>
          )}
          {doctor.experience && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-brand-900">Experience</div>
              <p className="text-sm text-brand-900/60">{doctor.experience}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
