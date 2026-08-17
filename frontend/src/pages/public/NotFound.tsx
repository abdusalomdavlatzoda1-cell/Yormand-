import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container-px mx-auto py-32 text-center">
      <div className="text-7xl font-display font-semibold text-brand-200 mb-6">404</div>
      <h1 className="text-2xl font-semibold text-brand-900">{t("notFound.title")}</h1>
      <p className="text-brand-900/60 mt-3">{t("notFound.subtitle")}</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">{t("notFound.back")}</Link>
    </div>
  );
}
