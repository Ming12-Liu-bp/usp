<template>
  <div>
    <v-main>
      <v-card
        class="mx-auto usp-container"
        elevation="10"
        max-width="1000"
        raised
      >
        <v-card-title class="usp-card-title">
          <strong>Add user request</strong>
        </v-card-title>
        <v-card-text class="usp-sub-title"
          >If you want to apply beyond the limit, please send the reason why you
          want to add it and the number of people.
        </v-card-text>
        <v-card>
          <v-container>
            <v-form v-model="valid" class="usp-form">
              <v-row>
                <v-col class="pl-2" cols="8">
                  <v-text-field
                    v-model.number="desiredNumber"
                    color="rgb(25,118,210)"
                    label="Number of users you want to add"
                    min="1"
                    required
                    :rules="desiredNumberRules"
                    type="number"
                    variant="underlined"
                  />
                </v-col>
                <v-col cols="1">
                  <v-icon
                    class="mt-6 base-clearable-icon"
                    size="x-small"
                    @click="desiredNumber = ''"
                    >mdi-close-circle-outline
                  </v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pl-2" cols="8">
                  <v-textarea
                    v-model="desiredReason"
                    class="usp-textarea-reason"
                    counter="1000"
                    persistent-counter
                    placeholder="Reasons"
                    required
                    :rules="desiredReasonRules"
                    variant="solo"
                  />
                </v-col>
                <v-col cols="1">
                  <v-icon
                    class="mt-0 base-clearable-icon"
                    size="x-small"
                    @click="desiredReason = ''"
                  >
                    mdi-close-circle-outline
                  </v-icon>
                </v-col>
              </v-row>
            </v-form>

            <v-card-actions>
              <v-layout justify-center row>
                <v-dialog v-model="dialog" max-width="600px" persistent>
                  <v-card class="usp-dialog-card pt-1 pl-2">
                    <v-card-title class="text-h5">
                      Request mail sending confirmation.
                      <v-card-text>
                        Execute sending limit value change request .
                        <br />
                      </v-card-text>
                    </v-card-title>
                    <v-spacer />
                    <v-card-actions>
                      <v-spacer />
                      <v-progress-circular
                        v-if="isProcessing()"
                        color="blue-grey lighten-3"
                        indeterminate
                      />
                      <v-btn
                        class="ml-2 base-button-green usp-button-transform"
                        color="success"
                        :disabled="isProcessing()"
                        elevation="2"
                        variant="flat"
                        width="180"
                        @click="limitChangeRequest()"
                        >Send
                      </v-btn>
                      <v-btn
                        class="ml-5 base-button-grey"
                        elevation="2"
                        @click="dialog = false"
                        >Cancel</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
              <v-btn
                class="ml-auto mr-5 pr-5 mb-3 base-button-green"
                :disabled="!valid"
                variant="flat"
                width="180px"
                @click="dialog = true"
              >
                Send
              </v-btn>
              <v-btn
                class="mb-2 mr-2 base-button-grey"
                elevation="2"
                @click="cancel"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card>
      </v-card>
    </v-main>

    <v-snackbar
      v-if="
        showSnackPattern === 'systemerror' || showSnackPattern === 'nodata_user'
      "
      v-model="snack"
      class="usp-snackbar"
      color="error"
      location="top"
      multi-line
      :timeout="time_error"
      vertical
    >
      <div v-if="showSnackPattern === 'systemerror'" class="pt-1">
        <span style="width: 100%">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : System error !</strong>
        </span>
        <div class="usp-base-errorBody mb-1">
          <br />Due to a system error, some services could not be used normally
          . <br />Please try again later .
          <br />
        </div>
      </div>

      <div v-if="showSnackPattern === 'nodata_user'" class="pt-1">
        <span style="width: 100%">
          <v-icon dark>mdi-alert</v-icon>&ensp;
          <strong>Error : Get login information error</strong>
        </span>
        <div class="usp-base-errorBody mb-1">
          <br />Sorry, we were unable to get your login information .
          <br />Please try again later or contact the system administrator .
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
import MailForm from "./MailForm";
const {
  showSnackPattern,
  snack,
  time_error,
  dialog,
  valid,
  desiredNumber,
  desiredReason,
  desiredNumberRules,
  desiredReasonRules,
  isProcessing,
  limitChangeRequest,
  cancel,
} = MailForm();
</script>
<style src="./MailForm.css" scoped></style>
