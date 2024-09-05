import { events } from "../../utils/bus";
import {
  limitChangeParamsAPi,
  loginUserAPi,
} from "../../constants/apiConstants";

export default function MailForm() {
  const { t } = useI18n();
  const router = useRouter();

  // display
  const snack = ref(false); // snackbar
  const dialog = ref(false); // confirm
  // snackbar pattern
  const showSnackPattern = ref("");
  // snackbar timeout
  const time_error = ref(-1);
  const valid = ref(true);
  const processing = ref(false);

  // login user
  const user_id = ref("");
  const user_type_id = ref("");

  const company_id = ref();
  const trigger_user_id = ref();
  const usp_role_id = ref();
  const desiredNumber = ref("");
  const desiredReason = ref("");
  // Vuetifyで上限を設定していない？ようなので不具合を避けるため100000未満で設定
  const desiredNumberRules = [
    (v: any) => !!v || t("message.MSG00001"),
    (v: any) => /^\d*$/.test(v) || t("message.MSG00002"),
    (v: any) => v < 100000 || t("message.MSG00003"),
  ];
  const desiredReasonRules = ref([
    (v: any) => !!v || t("message.MSG00004"),
    (v: any) => v.length <= 1000 || t("message.MSG00005"),
  ]);

  onMounted(() => {
    loginUserSet();
    if (useBusinessStore().getContents("mail")) {
      company_id.value = useBusinessStore().getContents("mail").company_id;
      trigger_user_id.value =
        useBusinessStore().getContents("mail").trigger_user_id;
      usp_role_id.value = useBusinessStore().getContents("mail").usp_role_id;
    }
  });

  function startProcessing() {
    processing.value = true;
  }

  function endProcessing() {
    processing.value = false;
  }

  function isProcessing() {
    return processing.value;
  }

  function loginUserSet() {
    axiosGet(loginUserAPi, {}).then(function (response: any) {
      user_id.value = response.data.user_id;
      user_type_id.value = response.data.user_type_id;
      if (user_id.value === undefined || user_type_id.value === undefined) {
        showSnackPattern.value = "nodata_user";
        snack.value = true;
      }
      // ログインユーザ情報取得APIが実行できたら'loginUserInfo'イベントを発砲し、レスポンス内容を送る
      events.emit("loginUserInfo", response.data);
    });
  }

  function limitChangeRequest() {
    const cid = company_id.value;
    const uspid = usp_role_id.value;
    const params = {
      trigger_user_id: trigger_user_id.value,
      desired_number: desiredNumber.value,
      desired_reason: desiredReason.value,
    };
    startProcessing();
    const urlParams = { company_id: cid, usp_role_id: uspid };
    const url = formatUrl(limitChangeParamsAPi, urlParams);
    axiosPost(url, params)
      .then(function (res: any) {
        if (!Object.prototype.hasOwnProperty.call(res, "transaction_id")) {
          showSnackPattern.value = "systemerror";
          snack.value = true;
        } else {
          useBusinessStore().removeContents("mail");
          useBusinessStore().setContents({
            pageId: "change",
            content: {
              showSnackPattern: "success_request",
              snack: "true",
              userId: trigger_user_id.value,
            },
          });
          router.push({
            name: "change",
            params: {
              userId: trigger_user_id.value,
            },
          });
        }
      })
      .catch(() => {});
    endProcessing();
    dialog.value = false;
  }

  function cancel() {
    router.go(-1);
  }

  return {
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
  };
}
