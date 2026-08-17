import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Service } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import { Loading, EmptyState } from "../../components/ui/States";

export default function Services() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [services, setServices] = useState<Service[] | null>(null);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => setServices([]));
  }, []);

  const categories = useMemo(() => {
    if (!services) return [];
    return Array.from(new Set(services.map((s) => s.category)));
  }, [services]);

  const filtered = useMemo(() => {
    if (!services) return [];
    return category === "all" ? services : services.filter((s) => s.category === category);
  }, [services, category]);

  if (!services) return <Loading />;

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.services")} title={t("sections.servicesTitle")} subtitle={t("sections.servicesSubtitle")} />

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setCategory("all")}
          className={`px-4 py-1.5 rounded-full text-sm border ${category === "all" ? "bg-brand-700 text-ivory border-brand-700" : "border-brand-200 text-brand-700"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm border ${category === c ? "bg-brand-700 text-ivory border-brand-700" : "border-brand-200 text-brand-700"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No services in this category yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => {
            const tr = pickTranslation(s.translations, locale);
            return (
              <Link to={`/services/${s.slug}`} key={s.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">{s.category}</div>
                <h3 className="text-lg font-semibold text-brand-900">{tr?.title}</h3>
                {tr?.shortDescription && <p className="mt-2 text-sm text-brand-900/60">{tr.shortDescription}</p>}
                {s.priceVisible && s.price != null && (
                  <div className="mt-4 text-brand-700 font-semibold">{s.price} TJS</div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
