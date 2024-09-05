// i18n/i18n.ts
import { createI18n } from "vue-i18n";
import messages from "./messages";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ja",
  messages,
});

export default i18n;
