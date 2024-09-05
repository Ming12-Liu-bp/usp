<template>
  <div class="usp-text">
    <!-- User registration -->
    <v-main>
      <v-container class="usp-container pl-0 pr-0">
        <v-card class="mx-auto usp-card elevation-10" raised>
          <v-card-title class="mt-2 ml-0">
            <strong>User registration</strong>
          </v-card-title>
          <v-stepper alt-labels :model-value="nowstep">
            <!-- タイトル -->
            <v-stepper-header class="pt-2">
              <!-- step 1 -->
              <v-stepper-item
                class="pb-5"
                :color="nowstep >= '1' ? 'success' : ''"
                :complete="nowstep > '1'"
                value="1"
                ><span class="usp-regist-title"
                  >Select compamy</span
                ></v-stepper-item
              >
              <v-divider></v-divider>
              <!-- step 2 -->
              <v-stepper-item
                class="pb-5"
                :color="nowstep >= '2' ? 'success' : ''"
                :complete="nowstep > '2'"
                value="2"
                ><span class="usp-regist-title">User info</span></v-stepper-item
              >
              <v-divider></v-divider>
              <!-- step 3 -->
              <v-stepper-item
                class="pb-5"
                :color="nowstep >= '3' ? 'success' : ''"
                :complete="nowstep > '3'"
                value="3"
                ><span class="usp-regist-title"
                  >User info(option)</span
                ></v-stepper-item
              >
            </v-stepper-header>

            <v-stepper-window :model-value="nowstep">
              <!-- step1 select company -->
              <v-stepper-window-item value="1">
                <v-card-text class="text-h6 pb-0 pl-1">
                  <strong>-Select company-</strong>
                </v-card-text>
                <v-card border="sm" variant="outlined">
                  <v-form v-model="valid_step1">
                    <v-card-text class="pb-0 mb-0 pt-5">
                      Select the company to which the user belongs.
                      <v-row no-gutters>
                        <v-col class="font-weight pb-0 pl-0 mb-0" cols="8">
                          <v-autocomplete
                            v-model="selectedCompany"
                            class="usp-drop-down-list"
                            color="#1976D2"
                            item-title="name"
                            item-value="id"
                            :items="companies"
                            return-object
                            :rules="companyRules"
                            variant="underlined"
                          >
                            <template #label>
                              <div>
                                <span class="usp-item-title">Company</span>
                                <span class="usp-required">
                                  &lt;required&gt;
                                </span>
                              </div>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-icon
                          class="base-clearable-icon ml-2"
                          small
                          @click="selectedCompany = firstSelectedCompany"
                          >mdi-close-circle-outline</v-icon
                        >
                      </v-row>
                      <v-row no-gutters>
                        <v-col class="font-weight pb-3 pt-1" cols="8">
                          <v-text-field
                            v-model="department"
                            color="#1976D2"
                            :counter="50"
                            persistent-counter
                            :rules="departmentRules"
                            variant="underlined"
                          >
                            <template #label>
                              <div>Department</div>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-icon
                          class="base-clearable-icon ml-2"
                          small
                          @click="department = ''"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </v-row>
                    </v-card-text>
                  </v-form>
                </v-card>
                <v-card-actions>
                  <v-btn
                    v-if="valid_step1"
                    class="mt-0 mr-0 mb-0 ml-auto usp-next-btn base-button-green"
                    @click="toStep2"
                    >Next</v-btn
                  >
                  <v-btn
                    v-else
                    class="mt-0 mr-0 mb-0 ml-auto usp-next-btn usp-button-grey"
                    :disabled="!valid_step1"
                    @click="toStep2"
                    >Next</v-btn
                  >
                </v-card-actions>
              </v-stepper-window-item>

              <!-- step2 user information -->
              <v-stepper-window-item value="2">
                <v-container class="pl-3 pb-0">
                  <v-card-text class="text-h6 pb-0 pl-1 pt-3">
                    <strong>-User information-</strong>
                  </v-card-text>
                  <v-card border="sm" class="mb-0" variant="outlined">
                    <v-form :ref="getStep2" v-model="valid_step2">
                      <v-container class="font-weight pt-0 pb-0 pl-3">
                        <v-row no-gutters>
                          <v-col class="font-weight pb-1 pt-3" cols="8">
                            <v-text-field
                              v-model="lastname"
                              class="usp-drop-down-list"
                              color="#1976D2"
                              :counter="50"
                              hint="(only use half-width alphanumeric , hyphens and spaces)"
                              persistent-counter
                              persistent-hint
                              required
                              :rules="lnameRules"
                              variant="underlined"
                            >
                              <template #label>
                                <div>
                                  <span class="usp-item-title"
                                    >Last name (姓)</span
                                  >
                                  <span class="text-error">
                                    &lt;required&gt;
                                  </span>
                                </div>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-icon
                            class="base-clearable-icon ml-2"
                            small
                            @click="lastname = ''"
                          >
                            mdi-close-circle-outline
                          </v-icon>
                        </v-row>

                        <v-row no-gutters>
                          <v-col class="font-weight pb-1 pt-1" cols="8">
                            <v-text-field
                              v-model="firstname"
                              class="usp-drop-down-list"
                              color="#1976D2"
                              :counter="50"
                              hint="(only use half-width alphanumeric , hyphens and spaces)"
                              persistent-counter
                              persistent-hint
                              required
                              :rules="fnameRules"
                              variant="underlined"
                            >
                              <template #label>
                                <div>
                                  <span class="usp-item-title"
                                    >First name (名)</span
                                  >
                                  <span class="text-error">
                                    &lt;required&gt;
                                  </span>
                                </div>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-icon
                            class="base-clearable-icon ml-2"
                            small
                            @click="firstname = ''"
                          >
                            mdi-close-circle-outline
                          </v-icon>
                        </v-row>

                        <v-row no-gutters>
                          <v-col class="font-weight pb-1 pt-1" cols="8">
                            <v-text-field
                              v-model="mailadd"
                              class="usp-drop-down-list"
                              color="#1976D2"
                              :counter="75"
                              persistent-counter
                              required
                              :rules="mailRules"
                              variant="underlined"
                            >
                              <template #label>
                                <div>
                                  <span class="usp-item-title"
                                    >Mail address</span
                                  >
                                  <span class="text-error">
                                    &lt;required&gt;
                                  </span>
                                </div>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-icon
                            class="base-clearable-icon ml-2"
                            small
                            @click="mailadd = ''"
                          >
                            mdi-close-circle-outline
                          </v-icon>
                        </v-row>
                        <v-card-actions>
                          <v-btn
                            v-if="valid_step2"
                            class="mt-0 mr-0 mb-0 ml-auto usp-next-btn base-button-green"
                            :disabled="!valid_step2"
                            @click="nowstep = '3'"
                            >Next</v-btn
                          >
                          <v-btn
                            v-else
                            class="mt-0 mr-0 mb-0 ml-auto usp-next-btn usp-button-grey"
                            :disabled="!valid_step2"
                            @click="nowstep = '3'"
                            >Next</v-btn
                          >
                          <v-btn
                            class="ml-5 base-button-grey"
                            @click="nowstep = '1'"
                            >Back</v-btn
                          >
                        </v-card-actions>
                      </v-container>
                    </v-form>
                  </v-card>
                </v-container>
              </v-stepper-window-item>

              <!-- step3 option information -->
              <v-stepper-window-item value="3">
                <v-card-text class="text-h6 pb-0 pl-1">
                  <strong>-User information(option)-</strong>
                </v-card-text>
                <v-card border="sm" variant="outlined">
                  <v-form v-model="valid_step3">
                    <v-container class="pl-3 pb-3">
                      <v-row no-gutters>
                        <v-col class="font-weight pb-1 pt-1" cols="8">
                          <v-text-field
                            v-model="phone"
                            color="#1976D2"
                            :counter="15"
                            hint="(only use half-width numbers)"
                            persistent-counter
                            persistent-hint
                            :rules="phoneRules"
                            variant="underlined"
                          >
                            <template #label>
                              <div>Phone number</div>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-icon
                          class="base-clearable-icon ml-2"
                          small
                          @click="phone = ''"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </v-row>

                      <v-row no-gutters>
                        <v-col class="font-weight pb-1 pt-1" cols="8">
                          <v-select
                            v-model="selectedLanguage"
                            color="#1976D2"
                            item-title="name"
                            item-value="id"
                            :items="languages"
                            return-object
                            variant="underlined"
                          >
                            <template #label>
                              <div>Language</div>
                            </template>
                          </v-select>
                        </v-col>
                        <v-icon
                          class="base-clearable-icon ml-2"
                          small
                          @click="setDefaultLanguage"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </v-row>

                      <v-row no-gutters>
                        <v-col class="font-weight pb-1 pt-1" cols="8">
                          <v-select
                            v-model="selectedCountry"
                            color="#1976D2"
                            item-title="name"
                            item-value="id"
                            :items="countries"
                            variant="underlined"
                          >
                            <template #label>
                              <div>Country</div>
                            </template>
                          </v-select>
                        </v-col>
                        <v-icon
                          class="base-clearable-icon ml-2"
                          small
                          @click="selectedCountry = undefined"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </v-row>

                      <!-- チェックを入れると初期パスワードメールを送信しない
                        デフォルトではチェックなし（メール飛ぶ）-->
                      <v-row v-if="judgeSelectedCompany()" no-gutters>
                        <v-col class="font-weight pb-1 pt-1" cols="8">
                          <v-checkbox
                            v-model="selectedOktaUser"
                            class="pb-0 mb-0 pt-1 mt-0"
                            label="Used Okta auth"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>

                <v-card-actions>
                  <v-dialog v-model="dialog" class="usp-dialog" persistent>
                    <template #activator="{ props }">
                      <v-btn
                        v-if="valid_step3"
                        class="mt-0 mr-0 mb-0 ml-auto usp-next-btn base-button-green"
                        :disabled="!valid_step3"
                        v-bind="props"
                      >
                        Register
                      </v-btn>
                      <v-btn
                        v-else
                        class="mt-0 mr-0 mb-0 ml-auto usp-next-btn usp-button-grey"
                        :disabled="!valid_step3"
                        v-bind="props"
                      >
                        Register
                      </v-btn>
                    </template>
                    <v-card class="usp-regist-dialog-card">
                      <v-card-title class="text-h5 pt-3 pl-5">
                        Registration confirmation.
                      </v-card-title>
                      <v-card-text class="text-grey text-body-2 pt-0 pl-5">
                        Execute user registration with the entered information.
                      </v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-progress-circular
                          v-if="isProcessing()"
                          color="blue-grey lighten-3"
                          indeterminate
                        ></v-progress-circular>
                        <v-btn
                          class="ml-2 usp-register-btn base-button-green"
                          :disabled="isProcessing()"
                          @click="userRegist"
                          >Register
                        </v-btn>
                        <v-btn class="base-button-grey" @click="dialog = false">
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn class="ml-5 base-button-grey" @click="nowstep = '2'">
                    Back
                  </v-btn>
                </v-card-actions>
              </v-stepper-window-item>
            </v-stepper-window>
          </v-stepper>
        </v-card>
      </v-container>
    </v-main>
    <!-- status notification pattern -->

    <!-- regist success! -->
    <v-snackbar
      v-if="showSnackPattern === 'success'"
      v-model="snack"
      class="usp-snackbar"
      color="success"
      location="top"
      multi-line
      :timeout="time_success"
      vertical
    >
      <span class="usp-success-span">
        <v-icon dark>mdi-check-circle</v-icon>&ensp;
        <strong>Success !</strong>
      </span>
      <div class="usp-success-regist-div">
        <br />Registration completed successfully. <br />If you want to continue
        setting up applications for this user,&nbsp; <br />please press the "
        Apps setting " button.
        <br />
      </div>
      <v-row>
        <v-btn
          class="ml-auto mr-2 usp-success-regist-btn"
          small
          variant="text"
          @click="continueRegistration"
        >
          Continue registration
        </v-btn>
        <v-btn small variant="outlined" @click="toChangePage">
          <v-icon dark small>mdi-subdirectory-arrow-right</v-icon>Apps setting
        </v-btn>
      </v-row>
    </v-snackbar>

    <!-- regist error -->
    <v-snackbar
      v-if="showSnackPattern != 'success'"
      v-model="snack"
      class="usp-snackbar"
      color="error"
      location="top"
      multi-line
      :timeout="time_error"
      vertical
    >
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
        <span>
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : You can't execute user registraion !</strong>
        </span>
        <div class="usp-base-errorBody">
          <br />You don't have permission to regist for users .
          <br />
        </div>
      </div>

      <!-- System error! -->
      <div v-if="showSnackPattern === 'systemerror'" class="pt-1">
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
import UserRegistration from "./UserRegistration";
const {
  nowstep,
  valid_step1,
  valid_step2,
  valid_step3,
  companyRules,
  companies,
  selectedCompany,
  firstSelectedCompany,
  department,
  departmentRules,
  lastname,
  lnameRules,
  firstname,
  fnameRules,
  mailadd,
  mailRules,
  phone,
  phoneRules,
  languages,
  selectedLanguage,
  setDefaultLanguage,
  countries,
  selectedCountry,
  judgeSelectedCompany,
  selectedOktaUser,
  dialog,
  isProcessing,
  userRegist,
  showSnackPattern,
  snack,
  time_success,
  time_error,
  toChangePage,
  continueRegistration,
  getStep2,
  toStep2,
} = UserRegistration();
</script>
<style scoped src="./UserRegistration.css" />
