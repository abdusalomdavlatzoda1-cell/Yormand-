import { useTranslation } from "react-i18next";
import SectionHeading from "../../components/ui/SectionHeading";
import { Link } from "react-router-dom";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="container-px mx-auto py-16">
      <SectionHeading eyebrow={t("nav.about")} title={t("sections.aboutTitle")} center={false} />
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="prose max-w-none text-brand-900/70 leading-relaxed space-y-4">
          <p>
            Yormand Dental Clinic is located on Pulodi Street 4, Dushanbe, near Alisher Navoi Park.
            The clinic offers general, aesthetic, orthodontic, prosthetic, surgical, and diagnostic
            dental services.
          </p>
          <p>
            Patients frequently highlight the clinic's cleanliness, modern equipment, and the attentive,
            caring approach of the staff — who take time to explain treatment plans clearly.
          </p>
          <p className="text-sm text-brand-900/40">
            This page reflects information gathered from public sources (Yandex Maps and aggregated
            reviews). The clinic can edit and expand this content at any time from the Admin Panel.
          </p>
        </div>
        <div className="aspect-video rounded-3xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
            alt="Clinic"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="text-center mt-14">
        <Link to="/appointment" className="btn-primary">{t("buttons.bookNow")}</Link>
      </div>
    </div>
  );
}
