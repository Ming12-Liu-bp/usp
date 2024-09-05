<template>
  <v-app>
    <AppHeader />
    <v-main class="usp-base-main">
      <router-view />
    </v-main>
    <AppFooter />
    <v-overlay
      v-model="appStore.overlay"
      class="usp-loading"
      :persistent="true"
    >
      <v-progress-circular color="rgb(45, 85, 233)" indeterminate :size="64" />
    </v-overlay>
  </v-app>
  <v-snackbar
    v-model="appStore.showSnack"
    color="error"
    location="top"
    multi-line
    :timeout="-1"
    vertical
  >
    <!-- System error! -->
    <div v-if="appStore.showSnackPattern === 'systemerror'">
      <span>
        <v-icon dark>mdi-alert</v-icon>&ensp;
        <strong>Error : System error !</strong>
      </span>
      <div class="usp-base-errorBody">
        Due to a system error, some services could not be used normally .
        <br />Please try again later .
      </div>
    </div>

    <!-- no data_user -->
    <div v-if="appStore.showSnackPattern === 'nodata_user'">
      <span>
        <v-icon dark>mdi-alert</v-icon>&ensp;
        <strong>Error : Get login information error</strong>
      </span>
      <div class="usp-base-errorBody">
        Sorry, we were unable to get your login information .
        <br />
        Please try again later or contact the system administrator .
      </div>
    </div>

    <!-- System error! (with code, id) -->
    <div
      v-if="appStore.showSnackPattern === 'systemerror_code_id'"
      class="pt-1"
    >
      <span>
        <v-icon dark>mdi-alert</v-icon>&ensp;
        <strong>Error : System error !</strong>
      </span>
      <div class="usp-base-systemerrorCode-errorBody">
        Status : {{ appStore.statusCode }}
        <br />
        Transuction ID : {{ appStore.transactionId }}
        <br />
        {{ appStore.resultMessage }}
      </div>
    </div>

    <!-- 400 : Bad request -->
    <div v-if="appStore.showSnackPattern === 'badrequest'" class="pt-1">
      <span>
        <v-icon dark>mdi-alert</v-icon>&ensp;
        <strong>Error : Bad request</strong>
      </span>
      <div class="usp-base-badRequest-errorBody">
        {{ appStore.resultMessage }}
        <br />
        ( Transuction ID : {{ appStore.transactionId }} )
      </div>
    </div>

    <template #actions>
      <v-btn @click="appStore.showSnack = false"> Close </v-btn>
    </template>
  </v-snackbar>

  <!-- 401 : Unauthorized -->
  <v-dialog
    v-if="appStore.showSnackPattern === 'unauthorized'"
    v-model="appStore.errorModal"
    max-width="600"
    persistent
  >
    <v-card color="error">
      <v-card-title class="pt-4">
        <v-icon dark>mdi-alert-outline</v-icon>
        <span class="white--text">&ensp;Error : Unauthorized</span>
      </v-card-title>
      <v-card-text
        class="white--text text-body-2 usp-base-unauthorized-errorBody"
      >
        The session has expired.
        <br />Please log in again.
      </v-card-text>
      <v-card-actions>
        <v-btn class="ml-auto mr-2" dark max-width="150" @click="redirect()">
          <v-icon dark small>mdi-subdirectory-arrow-right</v-icon>To login page
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();

function redirect() {
  appStore.errorModal = false;
  location.href = appStore.redirectUrl;
}
</script>

<style scoped>
.usp-loading:deep(.v-overlay__content) {
  margin: auto;
  position: unset;
}
.usp-base-main {
  padding: 0;
  min-height: calc(100% - 130px);
}
.usp-base-errorBody {
  padding: 17px 0;
}
.usp-base-badRequest-errorBody {
  padding-top: 25px;
  letter-spacing: normal;
}
.usp-base-unauthorized-errorBody {
  padding: 0 24px 20px !important;
  letter-spacing: normal;
}
.usp-base-systemerrorCode-errorBody {
  padding-top: 22px;
  letter-spacing: normal;
  line-height: 21px;
}
</style>
