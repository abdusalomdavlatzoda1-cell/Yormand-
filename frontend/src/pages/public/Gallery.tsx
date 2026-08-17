import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { GalleryItem } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import { Loading, EmptyState } from "../../components/ui/States";

const CATEGORIES = ["Clinic", "Reception", "TreatmentRooms", "Equipment", "Team", "Other"];

export default function Gallery() {
  const { t } = useTranslation();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [category, setCategory] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    api.get("/gallery").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    return category === "all" ? items : items.filter((i) => i.category === category);
  }, [items, category]);

  if (!items) return <Loading />;

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.gallery")} title={t("sections.galleryTitle")} />
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button onClick={() => setCategory("all")} className={`px-4 py-1.5 rounded-full text-sm border ${category === "all" ? "bg-brand-700 text-ivory border-brand-700" : "border-brand-200 text-brand-700"}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-sm border ${category === c ? "bg-brand-700 text-ivory border-brand-700" : "border-brand-200 text-brand-700"}`}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No photos in this category yet." />
      ) : (
        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {filtered.map((g) => (
            <button
              key={g.id}
              onClick={() => setLightbox(g.imageUrl)}
              className="block w-full rounded-xl overflow-hidden bg-brand-100 break-inside-avoid"
            >
              <img src={g.imageUrl} alt={g.title || ""} className="w-full h-auto object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
