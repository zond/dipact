import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common_en from "./en/common.json";

i18n.use(initReactI18next).init({
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
