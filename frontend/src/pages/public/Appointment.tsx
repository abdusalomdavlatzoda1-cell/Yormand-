import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { pickTranslation } from "../../hooks/useTranslated";
import { Service } from "../../types";
import SectionHeading from "../../components/ui/SectionHeading";

export default function Appointment() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceName: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/appointments", form);
      setStatus("success");
      setForm({ name: "", phone: "", serviceName: "", preferredDate: "", preferredTime: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container-px mx-auto py-16 max-w-2xl">
      <SectionHeading eyebrow={t("nav.book")} title={t("appointment.title")} subtitle={t("appointment.subtitle")} />

      {status === "success" && (
        <div className="mb-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 px-5 py-4 text-sm">
          {t("appointment.success")}
        </div>
      )}
      {status === "error" && (
        <div className="mb-8 rounded-xl bg-red-50 border border-red-200 text-red-700 px-5 py-4 text-sm">
          {t("appointment.error")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.name")}</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.phone")}</label>
            <input
              required
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.service")}</label>
          <select
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">—</option>
            {services.map((s) => {
              const tr = pickTranslation(s.translations, locale);
              return (
                <option key={s.id} value={tr?.title}>
                  {tr?.title}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.date")}</label>
            <input
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.time")}</label>
            <input
              type="time"
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-900 mb-1.5">{t("appointment.message")}</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-brand-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
          {status === "submitting" ? "..." : t("buttons.submit")}
        </button>
      </form>
    </div>
  );
}
