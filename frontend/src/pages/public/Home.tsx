import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Service, Doctor, ReviewItem, GalleryItem, SiteSettings } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";
import Stars from "../../components/ui/Stars";

export default function Home() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data.filter((s: Service) => s.featured).slice(0, 6)));
    api.get("/doctors").then((r) => setDoctors(r.data.slice(0, 3)));
    api.get("/reviews").then((r) => setReviews(r.data.slice(0, 3)));
    api.get("/gallery").then((r) => setGallery(r.data.slice(0, 6)));
    api.get("/settings").then((r) => setSettings(r.data));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-ivory">
        <div className="container-px mx-auto py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-4">
              Yormand Dental Clinic — Dushanbe
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold leading-tight text-brand-900">
              {t("hero.headline")}
            </h1>
            <p className="mt-6 text-lg text-brand-900/60 leading-relaxed max-w-lg">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/appointment" className="btn-primary">{t("hero.cta1")}</Link>
              <a href={`tel:${settings.phone || "+992887876006"}`} className="btn-secondary">{t("hero.cta2")}</a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-brand-900/60">
              <Stars rating={5} />
              <span>5.0 ★ · {t("trust.rating")}</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-brand-100 overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
                alt="Yormand Dental Clinic"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 card p-5 hidden sm:block">
              <div className="text-3xl font-display font-semibold text-brand-800">5.0★</div>
              <div className="text-xs text-brand-900/50 mt-1">Yandex Maps · 19 ratings</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="container-px mx-auto py-20">
        <SectionHeading eyebrow={t("nav.services")} title={t("sections.servicesTitle")} subtitle={t("sections.servicesSubtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const tr = pickTranslation(s.translations, locale);
            return (
              <Link to={`/services/${s.slug}`} key={s.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">{s.category}</div>
                <h3 className="text-lg font-semibold text-brand-900">{tr?.title}</h3>
                {tr?.shortDescription && <p className="mt-2 text-sm text-brand-900/60">{tr.shortDescription}</p>}
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="btn-secondary">{t("buttons.viewAll")}</Link>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-brand-50 py-20">
        <div className="container-px mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-md order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop"
              alt="Yormand clinic interior"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow={t("nav.about")} title={t("sections.aboutTitle")} center={false} />
            <p className="text-brand-900/60 leading-relaxed">
              Yormand is a modern dental clinic located on Pulodi Street in Dushanbe, close to Alisher
              Navoi Park. Patients highlight the clinic's cleanliness, modern equipment, and attentive,
              caring staff.
            </p>
            <Link to="/about" className="btn-primary mt-8 inline-flex">{t("buttons.learnMore")}</Link>
          </div>
        </div>
      </section>

      {/* DOCTORS PREVIEW */}
      <section className="container-px mx-auto py-20">
        <SectionHeading eyebrow={t("nav.doctors")} title={t("sections.doctorsTitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => {
            const tr = pickTranslation(d.translations, locale);
            return (
              <Link to={`/doctors/${d.slug}`} key={d.id} className="card overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-brand-100 flex items-center justify-center text-brand-300 text-sm">
                  {d.photo ? (
                    <img src={d.photo} alt={tr?.fullName} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span>Photo pending</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-brand-900">{tr?.fullName}</h3>
                  <p className="text-sm text-brand-900/50 mt-1">{tr?.specialization}</p>
                  {d.isPlaceholder && (
                    <p className="text-xs text-gold mt-2">{t("placeholder.doctorNote")}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/doctors" className="btn-secondary">{t("buttons.viewAll")}</Link>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="bg-brand-50 py-20">
          <div className="container-px mx-auto">
            <SectionHeading eyebrow={t("nav.gallery")} title={t("sections.galleryTitle")} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="aspect-square rounded-xl overflow-hidden bg-brand-100">
                  <img src={g.imageUrl} alt={g.title || ""} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/gallery" className="btn-secondary">{t("buttons.viewAll")}</Link>
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS PREVIEW */}
      <section className="container-px mx-auto py-20">
        <SectionHeading eyebrow={t("nav.reviews")} title={t("sections.reviewsTitle")} />
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
      </section>

      {/* CTA */}
      <section className="bg-brand-800 text-ivory py-20">
        <div className="container-px mx-auto text-center max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-display font-semibold">{t("sections.ctaTitle")}</h2>
          <p className="mt-4 text-ivory/60">{t("sections.ctaSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/appointment" className="btn-primary !bg-ivory !text-brand-800 hover:!bg-brand-50">{t("hero.cta1")}</Link>
            <a href={`tel:${settings.phone || "+992887876006"}`} className="btn-secondary !border-ivory/40 !text-ivory hover:!bg-white/10">
              {t("hero.cta2")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
