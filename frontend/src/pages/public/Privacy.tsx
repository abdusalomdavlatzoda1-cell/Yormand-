import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="container-px mx-auto py-16 max-w-2xl prose">
      <h1 className="section-title mb-6">{t("footer.privacy")}</h1>
      <p className="text-brand-900/70 leading-relaxed">
        Yormand Dental Clinic collects the information you submit through the appointment form
        (name, phone number, requested service, preferred date/time, and any message) solely to
        contact you and schedule your visit. We do not sell or share your personal data with third
        parties. Data is stored securely and retained only as long as necessary to provide our
        services. Contact the clinic directly to request access to, correction of, or deletion of
        your data.
      </p>
      <p className="text-xs text-brand-900/40 mt-8">
        This is a placeholder policy. The clinic should review and finalize this text — editable via
        the Admin Panel — to ensure it reflects actual data-handling practices and any applicable
        local regulations.
      </p>
    </div>
  );
}
