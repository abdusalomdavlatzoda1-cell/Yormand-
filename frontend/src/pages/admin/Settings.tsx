import { useEffect, useState } from "react";
import api from "../../services/api";
import { SiteSettings } from "../../types";
import ImageUpload from "../../components/admin/ImageUpload";

const emptySettings: SiteSettings = {
  clinicName: "",
  logo: "",
  favicon: "",
  phone: "",
  whatsapp: "",
  telegram: "",
  instagram: "",
  email: "",
  address: "",
  workingHours: "",
  googleMapsLink: "",
  yandexMapsLink: "",
  landmark: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings({ ...emptySettings, ...r.data }));
  }, []);

  const save = async () => {
    await api.put("/settings", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (key: keyof SiteSettings, label: string) => (
    <div>
      <label className="block text-xs font-medium text-brand-900 mb-1">{label}</label>
      <input
        value={settings[key] || ""}
        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-900 mb-6">Website Settings</h1>

      {saved && <div className="mb-6 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-4 py-2">Settings saved.</div>}

      <div className="card p-6 space-y-6 max-w-2xl">
        <div>
          <label className="block text-xs font-medium text-brand-900 mb-1">Logo</label>
          <ImageUpload value={settings.logo} onChange={(url) => setSettings({ ...settings, logo: url })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {field("clinicName", "Clinic name")}
          {field("email", "Email")}
          {field("phone", "Phone")}
          {field("whatsapp", "WhatsApp")}
          {field("telegram", "Telegram")}
          {field("instagram", "Instagram")}
        </div>

        {field("address", "Address")}
        {field("landmark", "Landmark note")}
        {field("workingHours", "Working hours")}

        <div className="grid sm:grid-cols-2 gap-4">
          {field("googleMapsLink", "Google Maps link")}
          {field("yandexMapsLink", "Yandex Maps link")}
        </div>

        <button onClick={save} className="btn-primary">Save settings</button>
      </div>
    </div>
  );
}
