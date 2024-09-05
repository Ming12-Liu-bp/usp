<template>
  <div class="usp-base-header">
    <v-dialog
      v-if="checkedValidation"
      v-model="dialogVisible"
      max-width="600px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline usp-headline">
          Setting confirmation.
          <v-card-text class="pt-2 pb-0"
            >Execute changing application usage with the entered
            information.</v-card-text
          >
        </v-card-title>
        <v-divider />
        <v-card-text class="scroll-y" :style="{ height: height }">
          <v-card-text v-if="noapps" class="pb-0"
            >― No apps selected . ―</v-card-text
          >
          <v-card-text v-if="!noapps" class="py-2 usp-grey-text"
            >― Selected apps ―</v-card-text
          >
          <v-table
            v-for="item in selectedServices"
            :key="item.id"
            class="usp-table pl-0"
            hover
          >
            <template #default>
              <tbody>
                <tr class="mb-0 pb-0 mt-3 pt-3">
                  <td
                    class="text-left mb-0 pb-0 mt-3 pt-3 pl-4 usp-none-border"
                    width="5%"
                  />
                  <td
                    class="text-left mb-0 pb-0 mt-3 pt-3 pl-4 usp-none-border"
                    width="15%"
                  >
                    App
                  </td>
                  <td
                    class="text-left mb-0 pb-0 mt-3 pt-3 pl-4 usp-none-border"
                    width="50%"
                  >
                    <strong>{{ item.service_name }}</strong>
                  </td>
                </tr>
                <tr class="my-0 py-0">
                  <td
                    class="text-left mb-0 pb-0 mt-3 pt-3 pl-4 usp-none-border"
                    width="5%"
                  />
                  <td
                    class="text-left my-0 py-0 pl-4 usp-none-border"
                    width="15%"
                  >
                    Group
                  </td>
                  <td
                    class="text-left my-0 py-0 pl-4 usp-none-border"
                    width="50%"
                  >
                    {{ item.usp_role_name }}
                  </td>
                </tr>
                <tr class="my-0 py-0">
                  <td
                    class="text-left mb-0 pb-0 pl-4 mt-3 pt-3 usp-none-border"
                    rowspan="100"
                    width="5%"
                  />
                  <td
                    class="text-left my-0 py-0 pl-4 usp-none-border"
                    rowspan="100"
                    valign="top"
                    width="15%"
                  >
                    Roles
                  </td>
                </tr>
                <tr v-for="app in item.selectedApproles" :key="app.id">
                  <td
                    class="text-left my-0 py-0 pl-4 usp-none-border"
                    width="50%"
                  >
                    {{ app.name }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-progress-circular
            v-if="isProcessing()"
            color="blue-grey lighten-3"
            indeterminate
          />
          <v-btn
            class="ml-2"
            color="success"
            :disabled="isProcessing()"
            elevation="2"
            variant="flat"
            width="180"
            @click="appsUsageRegist()"
            >Change settings</v-btn
          >
          <v-btn
            class="ml-5 base-button-grey"
            elevation="2"
            variant="flat"
            @click="clickCancel"
            >cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import SettingConfirmation from "./SettingConfirmation";

const emit = defineEmits(["setting-confirmation-close"]);
const props = defineProps({
  hidden_selected_services: Array<any>,
  user_detail_info: Object,
  selected_services: Array<any>,
  noapps: Boolean,
  height: String,
  checked_validation: Boolean,
});

const {
  checkedValidation,
  dialogVisible,
  height,
  selectedServices,
  noapps,
  isProcessing,
  appsUsageRegist,
  clickCancel,
} = SettingConfirmation(emit, props);
</script>
<style src="./SettingConfirmation.css" scoped></style>
