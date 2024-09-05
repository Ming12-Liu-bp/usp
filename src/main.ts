// Plugins
import { registerPlugins } from "@/plugins";

// Components
import "fontsource-roboto";
import App from "./App.vue";
import "vxe-table/styles/cssvar.scss";
import "vxe-pc-ui/styles/cssvar.scss";
import jaJP from "vxe-pc-ui/lib/language/ja-JP";
import { VxeUI } from "vxe-pc-ui";

// Composables
import { createApp } from "vue";

const app = createApp(App);
VxeUI.setI18n("ja-JP", jaJP);
VxeUI.setLanguage("ja-JP");

registerPlugins(app);

// mock スイッチ
if (import.meta.env.VITE_APP_MOCK === "on") {
  console.log("===================MOCK MODEL======================");
  import("@/mock/index");
  setTimeout(() => {
    app.mount("#app");
  }, 1000);
} else {
  app.mount("#app");
}
