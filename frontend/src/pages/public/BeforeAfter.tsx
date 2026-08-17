import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { BeforeAfterItem } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import { Loading, EmptyState } from "../../components/ui/States";

export default function BeforeAfter() {
  const { t } = useTranslation();
  const [items, setItems] = useState<BeforeAfterItem[] | null>(null);

  useEffect(() => {
    api.get("/before-after").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  if (!items) return <Loading />;

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.beforeAfter")} title={t("sections.beforeAfterTitle")} />
      {items.length === 0 ? (
        <EmptyState message="Before & after cases will appear here once published by the clinic." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-8">
          {items.map((i) => (
            <div key={i.id} className="card overflow-hidden">
              <div className="grid grid-cols-2">
                <img src={i.beforeImage} alt="Before" className="w-full aspect-square object-cover" />
                <img src={i.afterImage} alt="After" className="w-full aspect-square object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-brand-900">{i.treatmentName}</h3>
                {i.description && <p className="text-sm text-brand-900/60 mt-1">{i.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
