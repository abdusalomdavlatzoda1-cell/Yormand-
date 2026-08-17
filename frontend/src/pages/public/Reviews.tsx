import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { ReviewItem } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import Stars from "../../components/ui/Stars";
import { Loading, EmptyState } from "../../components/ui/States";

export default function Reviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ReviewItem[] | null>(null);

  useEffect(() => {
    api.get("/reviews").then((r) => setReviews(r.data)).catch(() => setReviews([]));
  }, []);

  if (!reviews) return <Loading />;

  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.reviews")} title={t("sections.reviewsTitle")} />
      {reviews.length === 0 ? (
        <EmptyState message="No reviews published yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="card p-6">
              <Stars rating={r.rating} />
              <p className="mt-4 text-brand-900/70 text-sm leading-relaxed">&ldquo;{r.content}&rdquo;</p>
              <div className="mt-4 text-sm font-medium text-brand-900">{r.reviewerName}</div>
              {r.source && <div className="text-xs text-brand-900/40">{r.source}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
