import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Service } from "../../types";
import { Loading, ErrorState } from "../../components/ui/States";

export default function ServiceDetails() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [service, setService] = useState<Service | null | undefined>(undefined);

  useEffect(() => {
    api
      .get(`/services/${slug}`)
      .then((r) => setService(r.data))
      .catch(() => setService(null));
  }, [slug]);

  if (service === undefined) return <Loading />;
  if (service === null) return <ErrorState message="Service not found." />;

  const tr = pickTranslation(service.translations, locale);

  return (
    <div className="container-px mx-auto py-16 max-w-3xl">
      <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-3">{service.category}</div>
      <h1 className="text-4xl font-display font-semibold text-brand-900">{tr?.title}</h1>
      {tr?.shortDescription && <p className="mt-4 text-lg text-brand-900/60">{tr.shortDescription}</p>}
      {tr?.fullDescription && (
        <div className="mt-8 prose max-w-none text-brand-900/70 leading-relaxed whitespace-pre-line">
          {tr.fullDescription}
        </div>
      )}
      <div className="mt-10 flex flex-wrap items-center gap-6">
        {service.priceVisible && service.price != null ? (
          <div className="text-2xl font-semibold text-brand-800">{service.price} TJS</div>
        ) : (
          <div className="text-brand-900/40 text-sm">{t("placeholder.toBeConfirmed")}</div>
        )}
        <Link to="/appointment" className="btn-primary">{t("buttons.bookNow")}</Link>
      </div>
    </div>
  );
}
