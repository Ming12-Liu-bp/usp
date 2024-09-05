/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../stores";
import router from "../router";
import i18n from "@/i18n/i18n";

// Types
import type { App } from "vue";

import {
  VxeAnchor,
  VxeAnchorLink,
  VxeBreadcrumb,
  VxeBreadcrumbItem,
  VxeButton,
  VxeButtonGroup,
  VxeCalendar,
  VxeCard,
  VxeCheckbox,
  VxeCheckboxGroup,
  VxeCol,
  VxeCollapse,
  VxeCollapsePane,
  VxeDatePicker,
  VxeDrawer,
  VxeFlowDesign,
  VxeFlowView,
  VxeForm,
  VxeFormDesign,
  VxeFormGather,
  VxeFormItem,
  VxeFormView,
  VxeIcon,
  VxeInput,
  VxeLayoutAside,
  VxeLayoutBody,
  VxeLayoutContainer,
  VxeLayoutFooter,
  VxeLayoutHeader,
  VxeLink,
  VxeListDesign,
  VxeListView,
  VxeLoading,
  VxeMenu,
  VxeModal,
  VxeNumberInput,
  VxeOptgroup,
  VxeOption,
  VxePager,
  VxePasswordInput,
  VxePrint,
  VxePulldown,
  VxeRadio,
  VxeRadioButton,
  VxeRadioGroup,
  VxeRow,
  VxeSelect,
  VxeSwitch,
  VxeTabPane,
  VxeTabs,
  VxeTextarea,
  VxeTip,
  VxeTooltip,
  VxeTree,
  VxeTreeSelect,
  VxeUpload,
} from "vxe-pc-ui";
import { VxeColgroup, VxeColumn, VxeTable, VxeToolbar } from "vxe-table";

function LazyVxeTable(app: any) {
  app.use(VxeAnchor);
  app.use(VxeAnchorLink);
  app.use(VxeBreadcrumb);
  app.use(VxeBreadcrumbItem);
  app.use(VxeButton);
  app.use(VxeButtonGroup);
  app.use(VxeCalendar);
  app.use(VxeCard);
  app.use(VxeCheckbox);
  app.use(VxeCheckboxGroup);
  app.use(VxeCol);
  app.use(VxeCollapse);
  app.use(VxeCollapsePane);
  app.use(VxeDatePicker);
  app.use(VxeDrawer);
  app.use(VxeFlowDesign);
  app.use(VxeFlowView);
  app.use(VxeForm);
  app.use(VxeFormDesign);
  app.use(VxeFormGather);
  app.use(VxeFormItem);
  app.use(VxeFormView);
  app.use(VxeIcon);
  app.use(VxeInput);
  app.use(VxeLayoutAside);
  app.use(VxeLayoutBody);
  app.use(VxeLayoutContainer);
  app.use(VxeLayoutFooter);
  app.use(VxeLayoutHeader);
  app.use(VxeLink);
  app.use(VxeListDesign);
  app.use(VxeListView);
  app.use(VxeLoading);
  app.use(VxeMenu);
  app.use(VxeModal);
  app.use(VxeNumberInput);
  app.use(VxeOptgroup);
  app.use(VxeOption);
  app.use(VxePager);
  app.use(VxePasswordInput);
  app.use(VxePrint);
  app.use(VxePulldown);
  app.use(VxeRadio);
  app.use(VxeRadioButton);
  app.use(VxeRadioGroup);
  app.use(VxeRow);
  app.use(VxeSelect);
  app.use(VxeSwitch);
  app.use(VxeTabPane);
  app.use(VxeTabs);
  app.use(VxeTextarea);
  app.use(VxeTip);
  app.use(VxeTooltip);
  app.use(VxeTree);
  app.use(VxeTreeSelect);
  app.use(VxeUpload);

  app.use(VxeTable);
  app.use(VxeColumn);
  app.use(VxeColgroup);
  app.use(VxeToolbar);
}

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(i18n).use(LazyVxeTable);
}
