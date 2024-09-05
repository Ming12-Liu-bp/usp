import { events } from "../../utils/bus";
import { envConstants } from "../../constants/envConstants";
import { onBeforeRouteLeave } from "vue-router";
import {
  applicationsUsersAPi,
  companiesListAPi,
  countryListAPi,
  languageListAPi,
  loginUserAPi,
} from "@/constants/apiConstants";

export default function UserRegistration() {
  const { t } = useI18n();
  const router = useRouter();

  const nowstep = ref("1");
  const valid_step1 = ref(true);
  const valid_step2 = ref(true);
  const valid_step3 = ref(false);

  // step1
  const companyRules = ref([
    (v: any) => {
      if (v) {
        return (
          Object.prototype.hasOwnProperty.call(v, "name") ||
          t("message.MSG00010")
        );
      } else {
        return false || t("message.MSG00010");
      }
    },
  ]);
  const companies = ref<any[]>([]);
  const selectedCompany = ref<any>(undefined);
  const firstSelectedCompany = ref({});
  const department = ref("");
  const departmentRules = ref([
    (v: any) => /^[\x20-\x7F]*$/.test(v) || t("message.MSG00011"),
    (v: any) => v.length <= 50 || t("message.MSG00012"),
  ]);

  // step2
  const step2 = ref();
  const lastname = ref("");
  const lnameRules = ref([
    (v: any) => !!v || t("message.MSG00013"),
    (v: any) => /^[a-zA-Z-0-9- ]+$/.test(v) || t("message.MSG00014"),
    (v: any) => v.length <= 50 || t("message.MSG00015"),
  ]);

  const firstname = ref("");
  const fnameRules = ref([
    (v: any) => !!v || t("message.MSG00023"),
    (v: any) => /^[a-zA-Z0-9- ]+$/.test(v) || t("message.MSG00016"),
    (v: any) => v.length <= 50 || t("message.MSG00017"),
  ]);

  const mailadd = ref("");
  const mailRules = ref([
    (v: any) => !!v || t("message.MSG00018"),
    (v: any) =>
      /^[A-Za-z0-9]+[0-9a-zA-Z-._]+@+[A-Za-z0-9]+[0-9a-zA-Z-._]+\.[0-9a-zA-Z-._]{2,}$/.test(
        v,
      ) || t("message.MSG00019"),
    (v: any) => v.length <= 75 || t("message.MSG00020"),
  ]);

  // step 3
  const phone = ref("");
  const phoneRules = ref([
    (v: any) => /^\d*$/.test(v) || t("message.MSG00021"),
    (v: any) => v.length <= 15 || t("message.MSG00022"),
  ]);
  const languages = ref<any[]>([]);
  const selectedLanguage = ref(envConstants().default_language);
  const countries = ref<any[]>([]);
  const selectedCountry: any = ref(undefined);
  const selectedOktaUser = ref(false);
  const dialog = ref(false);
  // error display pattern
  const showSnackPattern = ref("");
  // snackbar display
  const snack = ref(false);

  // regist success
  const time_success = ref(20000);
  const registered_user_id = ref("");

  // error
  const time_error = ref(-1);

  let processing = false;
  let companyInfo: any[] = [];
  let languageInfo: any[] = [];
  let countryInfo: any[] = [];
  let user_id = "";
  let user_type_id = "";
  let status_flg = 0;
  const isFrirst = ref(true);

  onBeforeRouteLeave((to, from, next) => {
    if (status_flg === 1) {
      showSnackPattern.value = "success";
      snack.value = true;
    }
    events.off("pageResetFlg");
    next();
  });

  onMounted(() => {
    if (useBusinessStore().getContents("registMenu")) {
      registered_user_id.value =
        useBusinessStore().getContents("registMenu").registered_user_id;
      useBusinessStore().removeContents("registMenu");
    }
    loginUserSet();
    countrySet();
    languageSet();
  });

  // 処理開始
  function startProcessing() {
    processing = true;
  }
  // 処理終了
  function endProcessing() {
    processing = false;
  }

  // 処理状態判定
  function isProcessing() {
    return processing;
  }

  // ログインユーザ情報取得API実行メソッド
  function loginUserSet() {
    status_flg = 0;
    axiosGet(loginUserAPi, {})
      .then(function (response: any) {
        user_id = response.data.user_id;
        user_type_id = response.data.user_type_id;
        if (user_id === undefined || user_type_id === undefined) {
          showSnackPattern.value = "nodata_user";
          snack.value = true;
        } else {
          companySet(user_id);
        }
        // ログインユーザ情報取得APIが実行できたら'loginUserInfo'イベントを発砲し、レスポンス内容を送る
        events.emit("loginUserInfo", response.data);
      })
      .catch(() => {});
  }

  // 登録可能企業一覧取得API実行メソッド
  function companySet(userId: any) {
    const url = formatUrl(companiesListAPi, { userId: userId as string });
    axiosGet(url, {})
      .then(function (response: any) {
        companyInfo = response.data.company;
        if (companyInfo.length === 0) {
          showSnackPattern.value = "notregisterable";
          snack.value = true;
        } else {
          for (const list in companyInfo) {
            companies.value.push({
              name: companyInfo[list].company_name,
              id: companyInfo[list].id,
            });
            if (companyInfo[list].main_flg === "1") {
              selectedCompany.value = {
                name: companyInfo[list].company_name,
                id: companyInfo[list].id,
              };
              firstSelectedCompany.value = selectedCompany.value;
            }
          }
        }
      })
      .catch(() => {});
  }

  // COUNTRY一覧取得API実行メソッド
  function countrySet() {
    axiosGet(countryListAPi, {})
      .then(function (res: any) {
        countryInfo = res.data;
        if (countryInfo.length === 0) {
          showSnackPattern.value = "systemerror";
          snack.value = true;
        } else {
          for (const list in countryInfo) {
            countries.value.push({
              name: countryInfo[list].name,
              id: countryInfo[list].id,
            });
          }
        }
      })
      .catch(() => {});
  }

  // LANGUAGE一覧取得API実行メソッド
  function languageSet() {
    axiosGet(languageListAPi, {})
      .then(function (res: any) {
        languageInfo = res.data;
        if (languageInfo.length === 0) {
          showSnackPattern.value = "systemerror";
          snack.value = true;
        } else {
          for (const list in languageInfo) {
            languages.value.push({
              name: languageInfo[list].name,
              id: languageInfo[list].id,
            });
          }
        }
      })
      .catch(() => {});
  }
  // ユーザ登録API実行メソッド
  function userRegist() {
    startProcessing();
    const params = {
      company_id: selectedCompany.value.id,
      department: department.value,
      first_name: firstname.value,
      last_name: lastname.value,
      email: mailadd.value,
      phone: phone.value,
      language: selectedLanguage.value.id,
      country_id: selectedCountry.value,
      send_password_initialize: !selectedOktaUser.value,
    };

    axiosPost(applicationsUsersAPi, params)
      .then(function (res: any) {
        registered_user_id.value = res.user_id;
        status_flg = 1;

        endProcessing();
        dialog.value = false;

        if (status_flg === 1) {
          showSnackPattern.value = "success";
          snack.value = true;
        }
        pageReset();
      })
      .catch(() => {});
  }

  // デフォルト言語設定
  function setDefaultLanguage() {
    selectedLanguage.value = envConstants().default_language;
  }

  // 選択企業判定
  function judgeSelectedCompany() {
    return envConstants().okta_target.some(
      (value: any) => value === selectedCompany.value.id,
    );
  }

  // Change画面へ遷移
  function toChangePage() {
    router.push({
      name: "change",
      params: {
        userId: registered_user_id.value,
      },
    });
  }
  // 登録を続行
  function continueRegistration() {
    snack.value = false;
    useBusinessStore().removeContents("registMenu");
  }

  // Step2へ遷移
  function toStep2() {
    nowstep.value = "2";
    isFrirst.value = false;
  }

  // Step2のRef取得
  function getStep2(el: any) {
    if (!isFrirst.value) {
      step2.value = el;
      return el;
    }
  }

  // 変数初期化メソッド（）
  function pageReset() {
    loginUserSet();
    nowstep.value = "1";
    valid_step1.value = false;
    valid_step2.value = false;
    valid_step3.value = true;
    // step1
    selectedCompany.value = {};
    companies.value = [];
    department.value = "";

    // setp2
    lastname.value = "";
    firstname.value = "";
    mailadd.value = "";

    if (!isFrirst.value) {
      step2.value.resetValidation();
    }
    // step3
    phone.value = "";
    selectedLanguage.value = { name: "English", id: "2" };
    languages.value = [];
    languageSet();
    selectedCountry.value = undefined;
    countries.value = [];
    countrySet();
    selectedOktaUser.value = false;
  }
  events.on("pageResetFlg", (data: any) => {
    if (data) {
      pageReset();
      isFrirst.value = true;
      showSnackPattern.value = "";
      snack.value = false;
    }
  });
  return {
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
    isFrirst,
    step2,
    toStep2,
  };
}
