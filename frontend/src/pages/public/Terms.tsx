import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="container-px mx-auto py-16 max-w-2xl prose">
      <h1 className="section-title mb-6">{t("footer.terms")}</h1>
      <p className="text-brand-900/70 leading-relaxed">
        By using this website, you agree to provide accurate information when submitting an
        appointment request. Submitting a request does not guarantee a confirmed appointment time —
        the clinic will contact you to confirm details. All content on this site (text, images,
        pricing) is subject to change without notice and does not constitute a medical diagnosis or
        treatment plan.
      </p>
      <p className="text-xs text-brand-900/40 mt-8">
        This is a placeholder policy. The clinic should review and finalize this text — editable via
        the Admin Panel.
      </p>
    </div>
  );
}
