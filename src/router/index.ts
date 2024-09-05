// Composables
import HomeView from "@/layouts/HomeView.vue";
import { createWebHashHistory } from "vue-router";
import { createRouter } from "vue-router/auto";

const commonRoutes = [
  {
    path: "/",
    component: HomeView,
    redirect: "/search",
    children: [
      {
        path: "/mail",
        name: "mail",
        component: () => import("../pages/MailForm/MailForm.vue"),
      },
      {
        path: "/change/:userId",
        name: "change",
        component: () => import("../pages/ChangeAppsUsage/ChangeAppsUsage.vue"),
      },
      {
        path: "/rolestable",
        name: "rolestable",
        component: () => import("../pages/RIGELRolesTable/RIGELRolesTable.vue"),
      },
      {
        path: "/regist",
        name: "regist",
        component: () =>
          import("../pages/UserRegistration/UserRegistration.vue"),
      },
      {
        path: "/search",
        name: "search",
        component: () => import("../pages/UserSearchVer1/UserSearchVer1.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: commonRoutes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
