// Plugins
import Vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Fonts from "unplugin-fonts/vite";
import Components from "unplugin-vue-components/vite";
import { lazyImport, VxeResolver } from "vite-plugin-lazy-import";

// Utilities
import { defineConfig } from "vite";
import Layouts from "vite-plugin-vue-layouts";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { formatUrl } from "./src/constants/apiConstants";

export default defineConfig({
  plugins: [
    lazyImport({
      resolvers: [
        VxeResolver({
          libraryName: "vxe-table",
        }),
        VxeResolver({
          libraryName: "vxe-pc-ui",
        }),
      ],
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        "vue-i18n",
        {
          "vue-router/auto": ["useRoute", "useRouter"],
          "@/utils/request": [
            "axiosGet",
            "axiosDelete",
            "axiosPost",
            "axiosGetPDF",
            "axiosPostCsv",
            "axiosPostForm",
          ],
          "@/stores/app.ts": [
            "useAppStore",
            "usePageStore",
            "useBusinessStore",
          ],
          "@/constants/apiConstants": ["formatUrl"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: "src/components.d.ts",
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        // drop_console: true,
        // drop_debugger: true
      },
    },
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
    host: "localhost",
    cors: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api", ""),
      },
    },
  },
});
