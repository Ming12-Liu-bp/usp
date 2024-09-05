/// <reference types="vite/client" />
declare module "mockjs2";
declare module "vxe-pc-ui";
declare module "vxe-table";
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
