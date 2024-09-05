<template>
  <!-- 検索結果詳細 -->
  <v-layout justify-center row>
    <v-dialog v-model="detailDialog" class="usp-detail-dialog" scrollable>
      <v-card>
        <v-card-text class="usp-card-text pt-0 pr-15">
          <v-row justify="center" no-gutters>
            <v-col cols="11">
              <v-card border="sm" class="mt-3 usp-card pl-0" variant="outlined">
                <v-card-text class="text-h6 text-grey-darken-2 pl-2 pt-3 pb-3"
                  >User information</v-card-text
                >
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">
                      <strong>Name</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2"
                      >{{ userDetailInfo.last_name }}
                      {{ userDetailInfo.first_name }}</v-card-text
                    >
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">
                      <strong>Company name</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">{{
                      userDetailInfo.company_name
                    }}</v-card-text>
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">
                      <strong>Department</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">{{
                      userDetailInfo.department
                    }}</v-card-text>
                  </v-col>
                </v-row>

                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">
                      <strong>Mail Address</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">{{
                      userDetailInfo.email
                    }}</v-card-text>
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">
                      <strong>Phone number</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">{{
                      userDetailInfo.phone_number
                    }}</v-card-text>
                  </v-col>
                </v-row>

                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">
                      <strong>Language</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">{{
                      userDetailInfo.language_name
                    }}</v-card-text>
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pt-0 mt-0 pl-2">
                      <strong>Country</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pt-0 mt-0 pl-2">{{
                      userDetailInfo.country_name
                    }}</v-card-text>
                  </v-col>
                </v-row>

                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2">
                      <strong>Applicant</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pl-2"
                      >{{ userDetailInfo.applicant_last_name }}
                      {{ userDetailInfo.applicant_first_name }}</v-card-text
                    >
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pt-0 mt-0 pl-2">
                      <strong>Application date</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pt-0 mt-0 pl-2">{{
                      userDetailInfo.application_date
                    }}</v-card-text>
                  </v-col>
                </v-row>

                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">
                      <strong>Approver</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2"
                      >{{ userDetailInfo.approver_last_name }}
                      {{ userDetailInfo.approver_first_name }}</v-card-text
                    >
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="4">
                    <v-card-text class="font-weight pt-0 mt-0 pt-0 mt-0 pl-2">
                      <strong>Approval date</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0 pt-0 mt-0" cols="5">
                    <v-card-text class="font-weight pt-0 mt-0 pl-2">{{
                      userDetailInfo.approval_date
                    }}</v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <v-row
            v-for="(item, index) in userDetailInfo.services"
            :key="index"
            justify="center"
            no-gutters
          >
            <v-col cols="11">
              <v-card border="sm" class="mt-3 usp-card" variant="outlined">
                <v-card-text class="text-h6 text-grey-darken-2 pl-2 pt-3">{{
                  item.service_name
                }}</v-card-text>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">
                      <strong>Group</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-0 mb-0" cols="5">
                    <v-card-text class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2">{{
                      item.usp_role_name
                    }}</v-card-text>
                  </v-col>
                </v-row>
                <v-row class="usp-card-row" no-gutters>
                  <v-col class="font-weight pb-0 mb-0" cols="4">
                    <v-card-text class="font-weight pb-0 mb-2 pt-0 mt-0 pl-2">
                      <strong>Roles</strong>
                    </v-card-text>
                  </v-col>
                  <v-col class="font-weight pb-3 mb-0" cols="5">
                    <v-card-text
                      v-for="(role, roleIndex) in item.app_role"
                      :key="roleIndex"
                      class="font-weight pb-0 mb-0 pt-0 mt-0 pl-2"
                      >{{ role.app_role_name }}</v-card-text
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="ml-2 mt-3 mb-3 usp-button-grey"
            color="#000000DE"
            width="120"
            @click="appsetting"
            >App setting</v-btn
          >
          <v-btn
            class="mt-3 mb-3 mr-2 ml-2 usp-button-grey"
            color="#000000DE"
            :disabled="deleteAuthorityCheck()"
            @click="(detailDialog = false), (deleteDialog = true)"
            >Delete User</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

  <v-layout justify-center row>
    <v-dialog v-model="deleteDialog" class="usp-deleteDialog-dialog" persistent>
      <v-card min-width="600">
        <v-card-title class="text-h5 pt-3">Delete confirmation.</v-card-title>
        <v-card-text class="text-grey text-body-2 pt-0 pl-4"
          >Are you sure you want to delete this user ?</v-card-text
        >
        <v-card-text class="pb-2 text-grey text-body-2 pt-0 pl-4"
          >This user uses the following apps.</v-card-text
        >
        <v-card-text
          v-for="(item, index) in userDetailInfo.services"
          :key="index"
          class="mt-0 mb-0 pl-4 pt-0 pb-0 text-grey text-body-2"
          >・{{ item.service_name }}</v-card-text
        >

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
            v-if="isProcessing()"
            color="blue-grey lighten-3"
            indeterminate
          ></v-progress-circular>
          <v-btn
            class="ml-2 base-button-green"
            :disabled="isProcessing()"
            width="120"
            @click="userDelete()"
            >Delete</v-btn
          >
          <v-btn class="ml-5 base-button-grey" @click="deleteDialog = false">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup lang="ts">
// イベントバス用インスタンス生成
import UserDetailDialog from "./UserDetailDialog";
const emit = defineEmits([
  "change_restore",
  "get_user_list",
  "user_detail_error",
]);

const {
  getUserDetail,
  detailDialog,
  userDetailInfo,
  selectedUserId,
  deleteDialog,
  userDelete,
  isProcessing,
  deleteAuthorityCheck,
  appsetting,
  user_type_id,
  searchCompanies,
} = UserDetailDialog(emit);

defineExpose({
  getUserDetail,
  selectedUserId,
  user_type_id,
  searchCompanies,
  detailDialog,
});
</script>
<style scoped src="./UserDetailDialog.css" />
