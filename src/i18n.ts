import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,

    lng: "en",
    fallbackLng: "en",
    whitelist: ["en", "de"],

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: "/battlegrid/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
