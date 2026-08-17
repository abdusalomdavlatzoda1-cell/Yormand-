import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tj from "./locales/tj.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

const savedLang = localStorage.getItem("yormand_lang") || "tj";

i18n.use(initReactI18next).init({
  resources: {
    tj: { translation: tj },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

export default i18n;
