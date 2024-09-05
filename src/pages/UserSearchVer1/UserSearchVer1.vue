<template>
  <div>
    <!-- 現行のユーザ検索画面 User Search -->
    <v-main class="pt-0">
      <v-card
        class="mx-auto usp-container pb-5"
        elevation="10"
        max-width="1200"
      >
        <v-card-title class="mt-2">
          <!-- User search ver1 -->
          <strong>User search</strong>
        </v-card-title>
        <v-container class="pl-3 pt-5">
          <v-card border="sm" class="pb-1 mb-5 pb-0" variant="outlined">
            <v-form ref="searchForm">
              <v-card-text class="mb-0 pb-0 pt-0">
                <v-row no-gutters>
                  <v-col class="pb-0 pt-1 mb-0" cols="8" dense>
                    <v-autocomplete
                      ref="companyAutocomplete"
                      v-model="selectedSearchCompany"
                      class="pb-0 pt-0 mb-0 mt-0"
                      color="#1976D2"
                      hide-details
                      item-title="name"
                      item-value="id"
                      :items="searchCompanies"
                      label="Company name :"
                      variant="underlined"
                      @update:model-value="saveSelectedCompany()"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-icon
                    class="base-clearable-icon mt-9 ml-2"
                    small
                    @click="clearCompany"
                  >
                    mdi-close-circle-outline
                  </v-icon>
                </v-row>
                <v-row class="mb-1" no-gutters>
                  <v-col class="pb-0 pt-1 mb-0 mt-0" cols="8" dense>
                    <v-text-field
                      v-model="searchName"
                      class="pb-0 pt-0 mb-0 mt-0"
                      color="#1976D2"
                      dense
                      hide-details
                      label="Name :"
                      variant="underlined"
                      @update:model-value="saveSearchName()"
                    ></v-text-field>
                  </v-col>
                  <v-icon
                    class="base-clearable-icon mt-9 ml-2"
                    small
                    @click="clearName"
                  >
                    mdi-close-circle-outline
                  </v-icon>
                </v-row>
                <v-row no-gutters>
                  <v-col class="pb-0 pt-0 mb-0 mt-0" cols="8" dense>
                    <v-text-field
                      v-model="searchEmail"
                      class="pb-0 pt-0 mb-0 mt-0"
                      color="#1976D2"
                      dense
                      hide-details
                      label="Mail address :"
                      variant="underlined"
                      @update:model-value="saveSearchEmail()"
                    ></v-text-field>
                  </v-col>
                  <v-icon
                    class="base-clearable-icon mt-9 ml-2"
                    small
                    @click="clearEmail"
                  >
                    mdi-close-circle-outline
                  </v-icon>
                </v-row>
                <v-row class="mb-1" no-gutters>
                  <v-col class="pb-0 pt-0 mb-0 mt-0" cols="8" dense>
                    <v-autocomplete
                      ref="servicesAutocomplete"
                      v-model="selectedSearchService"
                      class="pb-0 pt-0 mb-0 mt-0"
                      color="#1976D2"
                      hide-details
                      item-title="name"
                      item-value="id"
                      :items="searchServices"
                      label="Use apps :"
                      variant="underlined"
                      @update:model-value="saveSelectedService()"
                    ></v-autocomplete>
                  </v-col>
                  <v-icon
                    class="base-clearable-icon mt-9 ml-2"
                    small
                    @click="clearService"
                  >
                    mdi-close-circle-outline
                  </v-icon>
                </v-row>
                <v-row class="usp-search-checkbox-row" no-gutters>
                  <v-col class="pb-0 pt-0 mb-0 mt-4" cols="8" dense>
                    <v-checkbox
                      v-model="usertype"
                      class="usp-search-checkbox"
                      color="#1976D2"
                      label="Organization-admin user only"
                      @update:model-value="saveUsertype()"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
            <v-card-actions class="pt-0 pb-5">
              <v-btn
                v-if="!search_disable_flg"
                class="mt-3 mr-1 mb-1 ml-auto usp-search-btn base-button-grey"
                @click="
                  checkShowRolesTable();
                  resetPagination();
                "
              >
                <v-icon>mdi-magnify</v-icon>Search
              </v-btn>
              <v-btn
                v-else
                class="mt-3 mr-1 mb-1 ml-auto usp-search-btn usp-button-grey"
                :disabled="search_disable_flg"
                @click="
                  checkShowRolesTable();
                  resetPagination();
                "
              >
                <v-icon>mdi-magnify</v-icon>Search
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>

        <!-- 検索結果一覧 -->
        <v-container class="mb-1 pt-0 pl-3">
          <v-progress-linear
            v-if="!show && !snack && searching"
            color="#1976D2"
            indeterminate
          ></v-progress-linear>
          <v-card v-if="show" border="sm" class="mt-1" variant="outlined">
            <!-- default -->
            <v-data-table
              v-model:items-per-page="pagination.rowsPerPage"
              v-model:page="pagination.page"
              v-model:sort-by="pagination.sortBy"
              class="elevation-1"
              fixed-header
              :headers="headers_d"
              height="310"
              hover
              :items="userList"
              :items-per-page-options="itemsPerPageOptions"
              items-per-page-text="Rows per page: "
              multi-sort
              @click:row="openUserDetailDialog"
              @update:options="savePaginationPageInStore()"
            >
              <template #item.companyName="{ item }">
                <span class="d-inline-block mt-1 usp-table-item-companyName">{{
                  item.companyName
                }}</span>
              </template>
              <template #item.name="{ item }">
                <span class="d-inline-block mt-1 usp-table-item">{{
                  item.name
                }}</span>
              </template>
              <template #item.email="{ item }">
                <v-tooltip class="usp-tooltip" location="top">
                  <template #activator="{ props }">
                    <span
                      v-bind="props"
                      class="d-inline-block text-truncate mt-1 usp-table-item"
                      >{{ item.email }}</span
                    >
                  </template>
                  <span class="usp-table-item">{{ item.email }}</span>
                </v-tooltip>
              </template>
              <template #item.serviceList="{ item }">
                <v-tooltip class="usp-tooltip" location="top">
                  <template #activator="{ props }">
                    <span
                      v-bind="props"
                      class="d-inline-block text-truncate mt-1 usp-table-item"
                      >{{ item.serviceList }}</span
                    >
                  </template>
                  <span class="usp-table-item">{{ item.serviceList }}</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <!-- 表示出し分け要検討 -->
            <v-card-text
              v-if="maxUserSize != null"
              class="usp-card-text-maximum"
            >
              Maximum number of available users : {{ maxUserSize }}
            </v-card-text>

            <router-link
              class="usp-rolestable-link"
              :to="{ name: 'rolestable' }"
            >
              <v-card-actions>
                <v-btn
                  v-if="showRolesTable"
                  class="mt-0 mr-2 mb-2 ml-auto usp-show-roles-btn"
                  @click="changeRestore(false)"
                  >Show roles table</v-btn
                >
              </v-card-actions>
            </router-link>
          </v-card>
        </v-container>
        <!-- 検索結果詳細 -->
        <UserDetailDialog
          ref="userDetailDialogRef"
          @change_restore="changeRestore"
          @get_user_list="getUserList"
          @user_detail_error="userDetailError"
        />
      </v-card>
    </v-main>
    <!-- status notification pattern -->

    <!-- User delete success! -->
    <v-snackbar
      v-if="showSnackPattern === 'success'"
      v-model="snack"
      class="usp-snackbar"
      color="success"
      location="top"
      multi-line
      :timeout="time_success"
    >
      <span class="usp-snackbar-span">
        <v-icon dark>mdi-check-circle</v-icon>&ensp;
        <strong>Success !</strong>
      </span>
      <div class="usp-snackbar-delete-body">
        <br />User delete completed successfully.
        <br />
      </div>
      <v-row>
        <v-btn class="ml-auto mr-1" small variant="text" @click="snack = false">
          Close
        </v-btn>
      </v-row>
    </v-snackbar>

    <!-- Change setting success! -->
    <v-snackbar
      v-if="showSnackPattern === 'success_appSetting'"
      v-model="snack"
      class="usp-snackbar"
      color="success"
      location="top"
      multi-line
      :timeout="time_success"
    >
      <span class="usp-snackbar-span">
        <v-icon dark>mdi-check-circle</v-icon>&ensp;
        <strong>Success !</strong>
      </span>
      <div class="usp-snackbar-change-body">
        <br />Change settings completed successfully.
        <br />
        <br />
      </div>
      <v-row>
        <v-btn class="ml-auto mr-2" small variant="text" @click="snack = false">
          Close
        </v-btn>
      </v-row>
    </v-snackbar>

    <!-- error -->
    <v-snackbar
      v-if="
        showSnackPattern != 'success_appSetting' &&
        showSnackPattern != 'success'
      "
      v-model="snack"
      class="usp-snackbar"
      color="error"
      location="top"
      multi-line
      :timeout="time_error"
      vertical
    >
      <!-- nodata -->
      <div v-if="showSnackPattern === 'nodata'" class="pt-1">
        <span>
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : No data available</strong>
        </span>
        <div class="usp-base-errorBody mb-1">
          <br />Sorry, we were unable to get your available data . <br />Please
          try again later or contact the system administrator .
          <br />
        </div>
      </div>

      <!-- no data_user -->
      <div v-if="showSnackPattern === 'nodata_user'" class="pt-1">
        <span>
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : Get login information error</strong>
        </span>
        <div class="usp-base-errorBody mt-5 mb-1">
          Sorry, we were unable to get your login information .
          <br />
          Please try again later or contact the system administrator .
        </div>
      </div>

      <!-- not registable error! -->
      <div v-if="showSnackPattern === 'notregisterable'" class="pt-1">
        <span style="width: 100%">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : You can't execute user search !</strong>
        </span>
        <div class="usp-base-errorBody">
          <br />You don't have permission to search for users .
          <br />
        </div>
      </div>

      <!-- System error! -->
      <div v-if="showSnackPattern === 'systemerror'">
        <span>
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : System error !</strong>
        </span>
        <div class="usp-base-errorBody">
          <br />Due to a system error, some services could not be used normally
          . <br />Please try again later .
          <br />
        </div>
      </div>

      <template #actions>
        <v-btn @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
// イベントバス用インスタンス生成
import UserSearchVer1 from "./UserSearchVer1";
const {
  searchCompanies,
  selectedSearchCompany,
  clearCompany,
  searchName,
  clearName,
  searchEmail,
  clearEmail,
  selectedSearchService,
  searchServices,
  clearService,
  getUserList,
  usertype,
  checkShowRolesTable,
  resetPagination,
  search_disable_flg,
  showRolesTable,
  searching,
  snack,
  headers_d,
  userList,
  pagination,
  savePaginationPageInStore,
  maxUserSize,
  changeRestore,
  showSnackPattern,
  time_success,
  time_error,
  show,
  itemsPerPageOptions,
  UserDetailDialog,
  openUserDetailDialog,
  userDetailError,
  userDetailDialogRef,
  companyAutocomplete,
  servicesAutocomplete,
  saveSelectedCompany,
  saveSearchName,
  saveSearchEmail,
  saveSelectedService,
  saveUsertype,
} = UserSearchVer1();
</script>
<style scoped src="./UserSearchVer1.css" />
