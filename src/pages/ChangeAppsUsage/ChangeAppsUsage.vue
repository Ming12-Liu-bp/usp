<template>
  <div>
    <v-main class="usp-main">
      <v-card class="mx-auto" elevation="6" max-width="1200" raised>
        <v-card-title class="mt-2">
          <strong>Change apps usage</strong>
        </v-card-title>
        <!-- 対象ユーザ情報 -->
        <v-container class="usp-main-container">
          <v-container>
            <v-card-title class="pb-1 pt-1 title"
              >- Change user information -</v-card-title
            >
            <v-card class="usp-border-grey pt-0" variant="outlined">
              <v-container class="pt-3 pl-3 pb-3">
                <p class="mb-0 ml-3">
                  Company name： {{ userDetailInfo.company_name }}
                </p>
                <p class="mb-0 ml-3">
                  User name ： {{ userDetailInfo.last_name }}
                  {{ userDetailInfo.first_name }}
                </p>
              </v-container>
            </v-card>
          </v-container>

          <v-container>
            <v-card-title class="pb-1 pt-3 title usp-app-setting-title"
              >- User's apps setting -</v-card-title
            >
            <!-- アプリ設定 -->
            <v-card
              v-for="(item, index) in selectedServices"
              :key="index"
              class="mb-2 usp-border-grey"
              justify="center"
              variant="outlined"
            >
              <!-- 権限がなく、変更不可なもの -->
              <v-container
                v-if="
                  Object.prototype.hasOwnProperty.call(
                    item,
                    'firstSelectUSP',
                  ) &&
                  !item.selectableUSP.some(
                    (usp: any) => usp.id === item.firstSelectUSP,
                  ) &&
                  item.firstSelectService === item.service_id &&
                  item.usp_role_id !== ''
                "
                class="usp-service-disable-text"
              >
                <v-row>
                  <v-col class="mt-2 mb-0 pt-0 pb-0 pl-2" cols="6">
                    <v-text-field
                      v-model="item.service_name"
                      class="ml-3 mr-5 usp-service-disable"
                      disabled
                      label="Use app"
                      variant="underlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="mb-0 pt-0 pb-0 usp-group-mb pl-2" cols="6">
                    <v-text-field
                      v-model="item.usp_role_name"
                      class="ml-3 mr-5 mb-0 usp-service-disable"
                      disabled
                      label="Group"
                      variant="underlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="mb-0 pt-0 pb-0 pl-2 usp-group-mb" cols="6">
                    <v-text-field
                      v-model="item.app_role_string"
                      class="ml-3 mr-5 mb-0 usp-service-disable"
                      disabled
                      label="Roles"
                      variant="underlined"
                    />
                  </v-col>
                </v-row>
              </v-container>

              <!-- 権限があり、変更可能なもの -->
              <v-container v-else class="pb-3 pt-3">
                <!-- アプリ選択 -->
                <v-row no-gutters>
                  <v-col class="mt-0 mb-0 pt-0 pb-0" cols="6">
                    <v-autocomplete
                      ref="companyAppAutocomplete"
                      v-model="item.service_id"
                      class="ml-2 mr-5 pb-0 mb-0"
                      color="rgb(25,118,210)"
                      :error-messages="item.doubleErrorMessage"
                      item-title="name"
                      item-value="id"
                      :items="selectableServiceHidden"
                      label="Use app"
                      variant="underlined"
                      @update:model-value="serviceChange(item)"
                    />
                  </v-col>
                  <v-icon
                    class="ml-2 base-clearable-icon"
                    size="x-small"
                    @click="clearApp(item)"
                    >mdi-close-circle-outline</v-icon
                  >
                  <v-card-actions class="ml-auto mr-2 mt-0 mb-0 pt-0 pb-0">
                    <v-btn
                      class="base-button-grey"
                      elevation="2"
                      variant="flat"
                      @click="deleteForm(item.id)"
                    >
                      <v-icon small>mdi-close-circle</v-icon>Delete
                    </v-btn>
                  </v-card-actions>
                </v-row>

                <!-- USPロール選択 -->
                <v-row v-if="item.usp" no-gutters>
                  <v-col class="mt-0 mb-0 pt-0 pb-0 pl-0" cols="6">
                    <v-autocomplete
                      ref="companyRoleAutocomplete"
                      v-model="item.usp_role_id"
                      class="ml-2 mr-5 pl-0"
                      color="rgb(25,118,210)"
                      :error-messages="item.errormsg"
                      item-title="name"
                      item-value="id"
                      :items="item.selectableUSP"
                      label="Group"
                      variant="underlined"
                      @update:model-value="USPChange(item)"
                    />
                  </v-col>
                  <v-icon
                    class="ml-2 base-clearable-icon"
                    size="x-small"
                    @click="clearUSProle(item)"
                    >mdi-close-circle-outline</v-icon
                  >
                  <v-col cols="1" />
                  <v-col
                    v-if="item.errormsg !== ''"
                    class="mt-auto mb-auto pt-auto pb-auto"
                    cols="2"
                  >
                    <v-btn color="error" @click="toMail(item)">Mail form</v-btn>
                  </v-col>
                </v-row>

                <!-- アプリロール選択 -->
                <v-row v-if="item.app" no-gutters>
                  <v-col class="mt-0 mb-0 pt-0 pb-0" cols="12">
                    <v-card v-if="displayCheck(item)" hover tile>
                      <v-card-title
                        class="title font-weight-regular usp-role-setting-title pl-3 pt-1"
                        color="grey"
                        >{{ item.service_name }} roles setting</v-card-title
                      >
                      <v-card-text dense>
                        <v-container
                          v-for="(roleGroup, index2) in item.selectableApproles"
                          :key="index2"
                          class="pl-2 pt-4 pb-4 mt-0 mt-0"
                        >
                          <v-container
                            v-if="
                              defaultRoleCheck(roleGroup) &&
                              rigelRoleCheck(item)
                            "
                            class="usp-role-group pl-0"
                          >
                            <v-card-text
                              class="pl-0 pr-0 ml-0 mr-0 pb-0 mb-0 usp-role-group-name"
                            >
                              <strong>{{
                                roleGroup.app_role_group_name
                              }}</strong>
                            </v-card-text>
                            <v-row
                              v-for="(role, index3) in roleGroup.app_role"
                              :key="index3"
                              class="pb-0 mb-0 pt-0 mt-0 ml-1 usp-role-group-item"
                            >
                              <v-checkbox
                                v-model="item.checkApproles"
                                class="pb-0 mb-0 pt-0 mt-0"
                                color="rgb(130, 177, 255)"
                                hide-details
                                :label="role.app_role_name"
                                :value="role.app_role_id"
                              />
                            </v-row>
                          </v-container>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="usp-button-group-inner">
                        <v-btn
                          class="ml-auto mr-2 pl-2 pm-2 usp-button-text-white"
                          color="rgb(0, 200, 83)"
                          elevation="2"
                          variant="flat"
                          width="150px"
                          @click="save(item.checkApproles, item)"
                          >Save</v-btn
                        >
                        <v-btn
                          v-focus
                          class="mr-4 pl-2 pm-2 base-button-grey"
                          elevation="2"
                          variant="flat"
                          width="80px"
                          @click="clearApprole(item)"
                          >Clear</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                    <v-card
                      v-if="item.requirederror"
                      class="mt-2 mb-2 usp-border-grey"
                      variant="outlined"
                    >
                      <v-card-actions>
                        <v-row class="pl-0 ml-0">
                          <v-col class="pt-0 mr-0 text-no-wrap" width="30px">
                            <v-card-text
                              class="pl-0 pr-0 pt-8 pb-8 mr-0 usp-red-text"
                              >{{ requiredErrorMessage[2] }}</v-card-text
                            >
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                    <v-card
                      v-if="item.saving"
                      class="mt-2 mb-2 usp-roles-chips"
                      variant="outlined"
                    >
                      <v-card-actions class="usp-card-actions-roles">
                        <v-row class="pl-0 ml-0">
                          <v-col class="pt-0 mr-0 pr-0" cols="1">
                            <v-card-text class="pl-0 pr-0 mr-0">
                              <strong>Roles :</strong>
                            </v-card-text>
                          </v-col>
                          <v-col class="pl-0 ml-0 mr-auto" cols="11">
                            <v-chip
                              v-for="chip in item.selectedApproles"
                              :key="chip.name"
                              class="pl-2 pr-2 ml-1 mr-1 mb-1 usp-chip"
                              >{{ chip.name }}</v-chip
                            >
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

            <!-- 新規フォーム追加ボタン -->
            <v-card-actions>
              <v-btn
                v-if="addCheck()"
                class="ml-2 mb-2 base-button-grey"
                elevation="2"
                variant="flat"
                @click="addForm"
              >
                <v-icon small>mdi-plus-box-multiple</v-icon>Add
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-container>

        <!-- アプリ利用登録変更ボタン・確認モーダル -->
        <v-card-actions>
          <v-layout justify-center row>
            <SettingConfirmation
              v-if="dialog"
              :checked_validation="checkedValidation"
              :height="height"
              :hidden_selected_services="hiddenSelectedServices"
              :noapps="noapps"
              :selected_services="selectedServices"
              :user_detail_info="userDetailInfo"
              @setting-confirmation-close="settingConfirmationCloseHandler"
            />
          </v-layout>
          <v-card-actions class="usp-button-group-outer">
            <v-btn
              class="ml-auto mr-3 pr-5 mb-2 base-button-green"
              :disabled="disable()"
              elevation="2"
              variant="flat"
              width="200px"
              @click="roleSettingsCheck()"
              >Change settings</v-btn
            >
            <v-btn
              class="mb-2 mr-2 base-button-grey"
              elevation="2"
              variant="flat"
              @click="cancel()"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card-actions>
      </v-card>
    </v-main>

    <!-- status notification pattern -->
    <v-snackbar
      v-if="
        showSnackPattern === 'success' || showSnackPattern === 'success_request'
      "
      v-model="snack"
      class="usp-snack"
      color="success"
      location="top"
      multi-line
      :timeout="time_success"
      vertical
    >
      <!-- Change setting success! -->
      <div v-if="showSnackPattern === 'success'" class="usp-snack-div">
        <span class="usp-snack-span">
          <v-icon dark>mdi-check-circle</v-icon>&ensp;
          <strong>Success !</strong>
        </span>
        <div class="usp-snack-msg">Change settings completed successfully.</div>
        <v-row>
          <v-btn
            class="ml-auto mr-2 usp-snack-btn"
            variant="text"
            @click="snack = false"
            >Close</v-btn
          >
        </v-row>
      </div>

      <!-- limit additional request success! -->
      <div
        v-if="showSnackPattern === 'success_request'"
        class="usp-snack-div usp-snack-limit"
      >
        <span class="usp-snack-span">
          <v-icon dark>mdi-check-circle</v-icon>&ensp;
          <strong>Success !</strong>
        </span>
        <div class="usp-snack-msg mb-9 usp-snack-limit-msg">
          Limit additional request completed successfully . <br />Please wait
          for your application to be approved .
        </div>
        <v-row>
          <v-btn
            class="ml-auto mr-1 usp-snack-btn mb-2"
            small
            variant="text"
            @click="snack = false"
            >Close</v-btn
          >
        </v-row>
      </div>
    </v-snackbar>

    <v-snackbar
      v-if="
        showSnackPattern === 'rolesettingsrolesnotselected' ||
        showSnackPattern === 'nodata' ||
        showSnackPattern === 'nodata_targetuser'
      "
      v-model="snack"
      class="usp-snack"
      color="error"
      location="top"
      multi-line
      :timeout="time_error"
      vertical
    >
      <!-- App roles not selected -->
      <div
        v-if="showSnackPattern === 'rolesettingsrolesnotselected'"
        class="usp-snack-div"
      >
        <span class="usp-snack-span">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : There are unselected items !</strong>
        </span>

        <div class="usp-snack-msg">{{ result_message }}</div>

        <v-btn class="usp-snack-btn" variant="text" @click="snack = false"
          >Close</v-btn
        >
      </div>

      <!-- No data available -->
      <div v-if="showSnackPattern === 'nodata'" class="usp-snack-div">
        <span class="usp-snack-span">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : No data available</strong>
        </span>
        <div class="usp-snack-msg">
          Sorry, we were unable to get your available data . <br />Please try
          again later or contact the system administrator .
        </div>
        <v-btn class="usp-snack-btn" variant="text" @click="snack = false"
          >Close</v-btn
        >
      </div>

      <!-- no data_targetuser -->
      <div
        v-if="showSnackPattern === 'nodata_targetuser'"
        class="usp-snack-div"
      >
        <span class="usp-snack-span">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : Get target user's information error</strong>
        </span>
        <div class="usp-snack-msg">
          Sorry, we were unable to get target user's information . <br />Please
          try again later or contact the system administrator .
        </div>
        <v-btn class="usp-snack-btn" variant="text" @click="snack = false"
          >Close</v-btn
        >
      </div>
    </v-snackbar>
  </div>
</template>
<script setup lang="ts">
import ChangeAppsUsage from "./ChangeAppsUsage";
import SettingConfirmation from "../SettingConfirmation/SettingConfirmation.vue";

const {
  showSnackPattern,
  snack,
  time_success,
  time_error,
  result_message,
  requiredErrorMessage,

  dialog,
  // 確認モーダル内のスクロール範囲の高さ
  height,
  // 登録確認時、選択済みアプリが0件の文言表示
  noapps,
  checkedValidation,

  userDetailInfo,
  hiddenSelectedServices,
  selectedServices,
  selectableServiceHidden,
  companyAppAutocomplete,
  companyRoleAutocomplete,
  serviceChange,
  clearApp,
  deleteForm,
  USPChange,
  clearUSProle,
  toMail,
  displayCheck,
  defaultRoleCheck,
  rigelRoleCheck,
  save,
  clearApprole,
  addCheck,
  addForm,
  disable,
  roleSettingsCheck,
  cancel,
  settingConfirmationCloseHandler,
  vFocus,
} = ChangeAppsUsage();
</script>
<style src="./ChangeAppsUsage.css" scoped></style>
