<template>
  <div class="usp-base-header">
    <v-app-bar class="usp-base-bar" color="#424242">
      <v-toolbar-title>User Self Portal</v-toolbar-title>
      <v-spacer />
      <div v-if="loginUserInfo.user_id != ''" class="usp-base-header-text">
        {{ loginUserInfo.log_company_name }}
        <br />
        {{ loginUserInfo.log_last_name }} {{ loginUserInfo.log_first_name }} ({{
          loginUserInfo.user_type_name_en
        }})
      </div>

      <v-menu bottom class="menu" left>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" />
        </template>

        <v-list min-width="200px">
          <v-list-item @click="registration()">User registration</v-list-item>
          <v-list-item @click="toSearch()">User search</v-list-item>
          <v-list-item @click="signOut()">Sign out</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <br />
  </div>
</template>

<script setup lang="ts">
import { useBusinessStore } from "@/stores/app";
import { events } from "@/utils/bus";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const loginUserInfo = ref({
  user_id: "",
  user_type_id: "",
  user_type_name_en: "",
  log_last_name: "",
  log_first_name: "",
  log_company_id: "",
  log_company_name: "",
  log_company_name_en: "",
});

events.on("loginUserInfo", (data: any) => {
  loginUserInfo.value.user_id = data.user_id;
  loginUserInfo.value.user_type_id = data.user_type_id;
  loginUserInfo.value.user_type_name_en = data.user_type_name_en;
  loginUserInfo.value.log_last_name = data.last_name;
  loginUserInfo.value.log_first_name = data.first_name;
  loginUserInfo.value.log_company_id = data.company_id;
  loginUserInfo.value.log_company_name = data.company_name;
  loginUserInfo.value.log_company_name_en = data.company_name_en;
});

function registration() {
  appStore.resetStore();
  if (route.name === "regist") {
    events.emit("pageResetFlg", true);
  } else {
    router.push({ name: "regist" });
  }
}

function signOut() {
  appStore.$reset();
  const businessStore = useBusinessStore();
  businessStore.$reset();
  // location.href = "/usp/logout";
  // TODO
  router.push("/usp/logout").then(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", "/usp/logout");
    }
  });
}

function toSearch() {
  appStore.resetStore();
  appStore.restoreflg = true;
  if (route.name === "search") {
    events.emit("resetFlg", true);
  } else {
    router.push({ name: "search" });
  }
}
</script>

<style scoped>
.usp-base-bar {
  position: relative !important;
}
.usp-base-bar:deep(.v-toolbar__content) {
  height: 70px !important;
}
.usp-base-header {
  height: 94px;
}
.usp-base-header:deep(.v-spacer) {
  flex-grow: 0;
}
.usp-base-header-text {
  max-width: 90%;
}
</style>
