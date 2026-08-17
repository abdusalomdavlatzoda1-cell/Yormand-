import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { PriceItem } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import { Loading, EmptyState } from "../../components/ui/States";

export default function Prices() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<PriceItem[] | null>(null);

  useEffect(() => {
    api.get("/prices").then((r) => setPrices(r.data)).catch(() => setPrices([]));
  }, []);

  if (!prices) return <Loading />;

  return (
    <div className="container-px mx-auto py-16 max-w-3xl">
      <SectionHeading eyebrow={t("nav.prices")} title={t("nav.prices")} />
      {prices.length === 0 ? (
        <EmptyState message="Prices have not been confirmed by the clinic yet. Please contact us for a consultation." />
      ) : (
        <div className="card divide-y divide-brand-100">
          {prices.map((p) => (
            <div key={p.id} className="flex justify-between items-center px-6 py-4">
              <span className="text-brand-900">{p.label}</span>
              <span className="font-semibold text-brand-800">
                {p.onConsultation
                  ? t("placeholder.toBeConfirmed")
                  : p.priceRange || (p.price != null ? `${p.price} ${p.currency}` : t("placeholder.toBeConfirmed"))}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="text-center mt-10">
        <Link to="/appointment" className="btn-primary">{t("buttons.bookNow")}</Link>
      </div>
    </div>
  );
}
