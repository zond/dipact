import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { common_en } from "@diplicity/common";
// TODO fix this import

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  interpolation: { escapeValue: false },
  lng: "en",
  defaultNS: "common",
  resources: {
    en: {
      common: common_en,
    },
  },
});

export default i18n;