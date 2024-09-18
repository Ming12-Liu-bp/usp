import { events } from "@/utils/bus";
import {
  appRoleListParamsAPi,
  loginUserAPi,
  servicesListParamsAPi,
  userDetailParamsAPi,
  uspRoleListParamsAPi,
} from "@/constants/apiConstants";
import { envConstants } from "@/constants/envConstants";

export default function ChangeAppsUsage() {
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();

  const showSnackPattern = ref("noerror");
  const snack = ref(false);
  const time_success = ref(20000);
  const time_error = ref(-1);
  const result_message = ref("");
  const requiredErrorMessage = ref([
    t("message.MSG00006"),
    t("message.MSG00007"),
    t("message.MSG00008"),
  ]);
  const companyAppAutocomplete = ref<any>(null);
  const companyRoleAutocomplete = ref<any>(null);

  const dialog = ref(false); // confirm
  // 確認モーダル内のスクロール範囲の高さ
  const height = ref("300px");
  // 登録確認時、選択済みアプリが0件の文言表示
  const noapps = ref(false);
  const checkedValidation = ref(false);

  const userDetailInfo = ref<any>([]);
  const hiddenSelectedServices = ref<any>([]);
  const selectedServices = ref<any>([]);
  const selectableServiceHidden = computed(() => {
    return selectableServices.value.filter(function (el: any) {
      return !envConstants().hidden.some((e: any) => e == el.id);
    });
  });

  let user_id = "";
  let user_type_id = "";

  let userDetailInfoService = <any>[];
  const selectableServices = ref<any>([]);
  // let selectableUSPs = <any>[];
  // let selectableAppRoleGroup = <any>[];

  const firstSelectUSPs = <any>[];
  const firstSelectServices = <any>[];

  let isClear = false;
  const vFocus = {
    mounted: (el: any) => {
      if (isClear) {
        el.focus();
      }
    },
  };

  onMounted(() => {
    first();
    if (useBusinessStore().getContents("change")) {
      showSnackPattern.value =
        useBusinessStore().getContents("change").showSnackPattern;
      snack.value = Boolean(useBusinessStore().getContents("change").snack);
      useBusinessStore().removeContents("change");
    }
    if (showSnackPattern.value == undefined) {
      showSnackPattern.value = "noerror";
    }
  });

  function cancel() {
    appStore.restoreflg = false;
    router.go(-1);
  }

  function detailServiceHidden() {
    const dsh = userDetailInfoService;
    for (const service in dsh.services) {
      if (
        envConstants().hidden.some(
          (e: any) => e == dsh.services[service].service_id,
        )
      ) {
        const cutting = dsh.services.splice(service, 1)[0];
        hiddenSelectedServices.value.push({
          service_id: cutting.service_id,
          service_name: cutting.service_name,
          usp_role_id: cutting.usp_role_id,
          usp_role_name: cutting.usp_role_name,
          app_role: cutting.app_role,
        });
      }
    }
    return dsh;
  }
  // ユーザ情報取得API実行メソッド（引数：対象ユーザのユーザID）
  async function getUserDetail(id: any) {
    const url = formatUrl(userDetailParamsAPi, { userId: id });
    try {
      const res: any = await axiosGet(url, {});
      userDetailInfoService = res.data;
      userDetailInfo.value = detailServiceHidden();
      if (
        !Object.prototype.hasOwnProperty.call(userDetailInfo.value, "services")
      ) {
        showSnackPattern.value = "nodata_targetuser";
        snack.value = true;
      } else {
        // 登録可能アプリ一覧を取得し、登録済みで変更可能なアプリ用の選択肢を設定
        for (const service in userDetailInfo.value.services) {
          selectedServices.value.push({
            id: Number(service) + 1,
            service_id: userDetailInfo.value.services[service].service_id,
            service_name: userDetailInfo.value.services[service].service_name,
            usp_role_id: userDetailInfo.value.services[service].usp_role_id,
            usp_role_name: userDetailInfo.value.services[service].usp_role_name,
            app_role: userDetailInfo.value.services[service].app_role,
            app_role_string: showAppRole(
              userDetailInfo.value.services[service].app_role,
            ),
            checkApproles: userDetailInfo.value.services[service].app_role,
            selectedApproles: [],
            firstSelectService:
              userDetailInfo.value.services[service].service_id,
            firstSelectUSP: userDetailInfo.value.services[service].usp_role_id,
            selectableUSP: [],
            selectableApproles: [],
            usp: true,
            app: true,
            saving: true,
            errormsg: "",
            requirederror: false,
            doubleErrorMessage: "",
          });
          firstSelectServices.push(
            userDetailInfo.value.services[service].service_id,
          );
          firstSelectUSPs.push(
            userDetailInfo.value.services[service].usp_role_id,
          );
          if (
            showSnackPattern.value === "noerror" ||
            showSnackPattern.value === "success_request"
          ) {
            await serviceSet(user_id, userDetailInfo.value.company_id);
            await USProleSet(
              user_id,
              userDetailInfo.value.company_id,
              selectedServices.value[service].service_id,
              selectedServices.value[selectedServices.value.length - 1].id,
            );
            // 表示が活性のものはアプリロールの選択肢を取得
            if (
              selectedServices.value[service].selectableUSP.some(
                (e: any) => e.id == selectedServices.value[service].usp_role_id,
              )
            ) {
              appRoleSet(
                userDetailInfo.value.company_id,
                selectedServices.value[service].usp_role_id,
                selectedServices.value[selectedServices.value.length - 1].id,
              );
              selectedServices.value[service].app = true;
            }

            // 選択済みアプリロールのロールIDをcheckApprolesへ詰める
            const checkedAR = [];
            for (const list2 in selectedServices.value[service].app_role) {
              checkedAR.push(
                selectedServices.value[service].app_role[list2].app_role_id,
              );
              selectedServices.value[service].checkApproles = checkedAR;

              selectedServices.value[service].selectedApproles.push({
                id: selectedServices.value[service].app_role[list2].app_role_id,
                name: selectedServices.value[service].app_role[list2]
                  .app_role_name,
              });
            }
          }
        }
      }
    } catch {}
  }

  // 登録可能アプリ一覧取得API実行メソッド
  async function serviceSet(uid: any, cid: any) {
    const url = formatUrl(servicesListParamsAPi, { userId: uid });
    try {
      const res: any = await axiosGet(url, {
        company_id: cid,
      });

      selectableServices.value = [];
      const selectableServiceInfo = res.data.service;
      if (selectableServiceInfo.length !== 0) {
        for (const list in selectableServiceInfo) {
          selectableServices.value.push({
            name: selectableServiceInfo[list].name,
            id: selectableServiceInfo[list].id,
            registerable_status:
              selectableServiceInfo[list].registerable_status,
          });
        }
      } else {
        showSnackPattern.value = "nodata";
        snack.value = true;
      }
    } catch {
      showSnackPattern.value = "error";
    }
  }
  // 登録可能USPロール一覧取得API実行メソッド
  async function USProleSet(uid: any, cid: any, sid: any, formid: any) {
    const urlParams = {
      user_id: uid,
      company_id: cid,
      service_id: sid,
    };
    const url = formatUrl(uspRoleListParamsAPi, urlParams);
    try {
      const res: any = await axiosGet(url, {});
      const selectableUSPs = <any>[];
      const selectableUSPInfo = res.data.usp_role;
      if (selectableUSPInfo !== undefined) {
        for (const list in selectableUSPInfo) {
          selectableUSPs.push({
            name: selectableUSPInfo[list].name,
            id: selectableUSPInfo[list].id,
            sort_order: selectableUSPInfo[list].sort_order,
            registerable_status: selectableUSPInfo[list].registerable_status,
            default_app_role_id: selectableUSPInfo[list].default_app_role_id,
          });
        }
        let arrayid = -1;
        for (const index in selectedServices.value) {
          if (selectedServices.value[index].id === formid) {
            arrayid = Number(index);
          }
        }
        if (arrayid >= 0) {
          selectedServices.value[arrayid].selectableUSP = selectableUSPs;
        }
        selectedServices.value[arrayid].selectableUSP.sort(function (
          a: any,
          b: any,
        ) {
          if (Number(a.sort_order) < Number(b.sort_order)) return 1;
          if (Number(a.sort_order) > Number(b.sort_order)) return -1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      } else {
        showSnackPattern.value = "nodata";
        snack.value = true;
      }
    } catch {
      showSnackPattern.value = "error";
    }
  }

  // 登録可能アプリロール一覧取得API実行メソッド
  async function appRoleSet(cid: any, uspid: any, formid: any) {
    let count = 0;
    const urlParams = {
      company_id: cid,
      usp_role_id: uspid,
    };
    const url = formatUrl(appRoleListParamsAPi, urlParams);
    try {
      const res: any = await axiosGet(url, {});

      const selectableAppRoleGroup = <any>[];
      const selectableAppInfo = res.data.app_role_group;
      // 選択肢のグループ名、グループに属するロールをセット
      if (selectableAppInfo !== undefined) {
        let arrayid = -1;
        for (const list in selectableAppInfo) {
          selectableAppRoleGroup.push({
            app_role_group_name: selectableAppInfo[list].app_role_group_name,
            sort_order: selectableAppInfo[list].sort_order,
            app_role: selectableAppInfo[list].app_role,
          });
        }
        selectableAppRoleGroup.sort(function (a: any, b: any) {
          if (Number(a.sort_order) < Number(b.sort_order)) return 1;
          if (Number(a.sort_order) > Number(b.sort_order)) return -1;
          if (a.app_role_group_name > b.app_role_group_name) return 1;
          if (a.app_role_group_name < b.app_role_group_name) return -1;
          return 0;
        });
        // 選択肢のロールの順番を整理する
        for (const list2 in selectableAppRoleGroup) {
          selectableAppRoleGroup[list2].app_role.sort(function (
            a: any,
            b: any,
          ) {
            if (Number(a.sort_order) < Number(b.sort_order)) {
              return 1;
            } else {
              return -1;
            }
          });
          for (const index in selectedServices.value) {
            if (selectedServices.value[index].id === formid) {
              arrayid = Number(index);
            }
          }
          // デフォルトアプリロールをcheckApprolesへ追加する
          for (const list3 in selectableAppRoleGroup[list2].app_role) {
            if (
              selectableAppRoleGroup[list2].app_role[list3].default_flg ===
                "1" &&
              Object.keys(selectedServices.value[arrayid].checkApproles)
                .length === 0
            ) {
              count += 1;
              pushArray(
                selectedServices.value[arrayid].checkApproles,
                selectableAppRoleGroup[list2].app_role[list3].app_role_id,
              );
            }
          }
          // RIGELアプリロール対応はここに差し込む
        }
        selectedServices.value[arrayid].selectableApproles =
          selectableAppRoleGroup;
        if (count > 0) {
          save(
            selectedServices.value[arrayid].checkApproles,
            selectedServices.value[arrayid],
          );
        }
      } else {
        showSnackPattern.value = "nodata";
        snack.value = true;
      }
    } catch {
      showSnackPattern.value = "error";
    }
  }
  // Change settings押下時のApp roles必須チェック
  function roleSettingsCheck() {
    showSnackPattern.value = "noerror";
    appStore.showSnack = false;
    for (const list in selectedServices.value) {
      if (selectedServices.value[list].service_id == "") {
        showSnackPattern.value = "rolesettingsrolesnotselected";
        result_message.value = requiredErrorMessage.value[0];
        snack.value = true;
        break;
      }
      if (selectedServices.value[list].usp_role_id == "") {
        showSnackPattern.value = "rolesettingsrolesnotselected";
        result_message.value = requiredErrorMessage.value[1];
        snack.value = true;
        break;
      }
      if (
        selectedServices.value[list].selectedApproles.map((e: any) => e.id) ==
        ""
      ) {
        showSnackPattern.value = "rolesettingsrolesnotselected";
        result_message.value = requiredErrorMessage.value[2];
        snack.value = true;
        break;
      }
    }
    if (showSnackPattern.value == "noerror") {
      checkedValidation.value = true;
      calcHeight();
      dialog.value = true;
    }
  }

  // 登録済みで変更不可のアプリロールを配列から取り出してカンマ区切りで表示
  function showAppRole(array: any) {
    const approle = [];
    for (const list in array) {
      approle.push(array[list].app_role_name);
    }
    return approle.join(", ");
  }
  // アプリロール選択カード内のsaveを押下したときの処理
  function save(array: any, item: any) {
    item.selectedApproles = [];
    for (const i in array) {
      for (const j in item.selectableApproles) {
        for (const k in item.selectableApproles[j].app_role) {
          if (array[i] === item.selectableApproles[j].app_role[k].app_role_id) {
            item.selectedApproles.push({
              id: item.selectableApproles[j].app_role[k].app_role_id,
              name: item.selectableApproles[j].app_role[k].app_role_name,
            });
          }
        }
      }
    }
    if (item.selectedApproles.length > 0) {
      item.requirederror = false;
      item.saving = true;
    } else {
      item.requirederror = true;
      item.saving = false;
    }
  }
  // 閾値チェック
  function limitErrorCheck(item: any) {
    USProleSet(
      user_id,
      userDetailInfo.value.company_id,
      item.service_id,
      item.id,
    );
    let id = -1;
    for (const num in item.selectableUSP) {
      if (item.selectableUSP[num].id === item.usp_role_id) {
        id = Number(num);
      }
    }
    if (id !== -1) {
      if (item.selectableUSP[id].registerable_status === "1") {
        if (firstSelectUSPs.some((e: any) => e === item.selectableUSP[id].id)) {
          showSnackPattern.value = "noerror";
          appRoleSet(
            userDetailInfo.value.company_id,
            item.usp_role_id,
            item.id,
          );
          item.errormsg = "";
          item.app = true;
        } else {
          item.errormsg = t("message.MSG00009");
          item.app = false;
          item.app_role = [];
          item.checkApproles = [];
          item.selectedApproles = [];
          item.selectableApproles = [];
          item.saving = false;
        }
      } else {
        showSnackPattern.value = "noerror";
        appRoleSet(userDetailInfo.value.company_id, item.usp_role_id, item.id);
        item.errormsg = "";
        item.app = true;
      }
    }
  }
  // 閾値チェック（アプリ）
  function appLimitErrorCheck(item: any) {
    serviceSet(user_id, userDetailInfo.value.company_id);
    let id = -1;
    for (const num in selectableServiceHidden.value) {
      if (selectableServiceHidden.value[num].id === item.service_id) {
        id = Number(num);
      }
    }
    if (id !== -1) {
      if (selectableServiceHidden.value[id].registerable_status === "1") {
        if (
          firstSelectServices.some(
            (e: any) => e === selectableServiceHidden.value[id].id,
          )
        ) {
          showSnackPattern.value = "noerror";
          USProleSet(
            user_id,
            userDetailInfo.value.company_id,
            item.service_id,
            item.id,
          );
          item.doubleErrorMessage = "";
          item.usp = true;
        } else {
          item.doubleErrorMessage = t("message.MSG00024");
          item.usp = false;
          item.app = false;
          item.usp_role_id = "";
          item.selectableUSP = [];
          item.app_role = [];
          item.checkApproles = [];
          item.selectedApproles = [];
          item.selectableApproles = [];
          item.saving = false;
        }
      } else {
        showSnackPattern.value = "noerror";
        USProleSet(
          user_id,
          userDetailInfo.value.company_id,
          item.service_id,
          item.id,
        );
        item.doubleErrorMessage = "";
        item.usp = true;
      }
    }
  }
  // アプリ選択を変更した際の処理
  function serviceChange(item: any) {
    item.app = false;
    item.usp_role_id = "";
    item.usp_role_name = "";
    item.app_role = [];
    item.checkApproles = [];
    item.selectedApproles = [];
    item.selectableUSP = [];
    item.selectableApproles = [];
    item.saving = false;
    item.errormsg = "";
    item.requirederror = false;

    for (const list2 in selectableServiceHidden.value) {
      if (selectableServiceHidden.value[list2].id === item.service_id) {
        item.service_name = selectableServiceHidden.value[list2].name;
      } else {
        continue;
      }
    }
    const service = [];
    for (const list in selectedServices.value) {
      service.push(selectedServices.value[list].service_id);
    }
    if (hasDuplicates(service)) {
      item.doubleErrorMessage = "This application is already registered .";
      item.usp = false;
    } else {
      appLimitErrorCheck(item);
      if (item.selectableUSP.length === 1) {
        item.usp_role_id = item.selectableUSP[0].id;
        limitErrorCheck(item);
      }
    }
  }
  // アプリ選択横のクリアボタン押下時
  function clearApp(item: any) {
    item.service_id = undefined;
    item.usp = false;
    item.app = false;
    item.usp_role_id = "";
    item.usp_role_name = "";
    item.app_role = [];
    item.checkApproles = [];
    item.selectedApproles = [];
    item.selectableUSP = [];
    item.selectableApproles = [];
    item.saving = false;
    item.errormsg = "";
    item.requirederror = false;
    for (const formItem in companyAppAutocomplete.value) {
      companyAppAutocomplete.value[formItem].search = null;
    }
  }
  // （登録済みでも新規でも）USPロールを変更した際の処理
  function USPChange(item: any) {
    item.app_role = [];
    item.checkApproles = [];
    item.selectedApproles = [];
    item.selectableApproles = [];
    item.saving = false;
    item.requirederror = false;
    for (const i in item.selectableUSP) {
      if (item.selectableUSP[i].id == item.usp_role_id) {
        item.usp_role_name = item.selectableUSP[i].name;
      }
    }
    limitErrorCheck(item);
  }
  // USPロール選択横のクリアボタン押下時
  function clearUSProle(item: any) {
    item.app = false;
    item.usp_role_id = undefined;
    item.usp_role_name = "";
    item.app_role = [];
    item.checkApproles = [];
    item.selectedApproles = [];
    item.selectableApproles = [];
    item.saving = false;
    item.errormsg = "";
    item.requirederror = false;
    for (const formItem in companyRoleAutocomplete.value) {
      companyRoleAutocomplete.value[formItem].search = null;
    }
  }
  // アプリロール選択横のクリアボタン押下時
  function clearApprole(item: any) {
    isClear = true;
    item.checkApproles = [];
    item.selectedApproles = [];
    item.selectableApproles = [];
    item.saving = false;
    item.errormsg = "";
    item.requirederror = false;
    appRoleSet(userDetailInfo.value.company_id, item.usp_role_id, item.id);
  }
  // デフォルトアプリロールを含むアプリロールグループは非表示にする
  function defaultRoleCheck(roleGroup: any) {
    return !roleGroup.app_role.some((appRG: any) => appRG.default_flg === "1");
  }
  // RIGELのアプリロールはUSPの画面上表示させない
  function rigelRoleCheck(item: any) {
    return !(item.service_id == envConstants().rigel_id);
  }
  // アプリ設定のカードを追加
  function addForm() {
    let num = 1;
    if (selectedServices.value.length > 0) {
      num += Math.max.apply(
        null,
        selectedServices.value.map(function (ids: any) {
          return ids.id;
        }),
      );
    }
    const additionalForm = {
      id: num,
      service_id: undefined,
      service_name: undefined,
      usp_role_id: undefined,
      usp_role_name: undefined,
      checkApproles: [],
      selectedApproles: [{ id: "", name: "" }],
      selectableUSP: [],
      selectableApproles: [],
      usp: false,
      app: false,
      saving: false,
      requirederror: false,
      errormsg: "",
      doubleErrorMessage: "",
    };
    selectedServices.value.push(additionalForm);
    serviceSet(user_id, userDetailInfo.value.company_id);
  }
  // アプリ設定のカードを削除
  function deleteForm(id: any) {
    for (let i = 0; i < selectedServices.value.length; ) {
      if (selectedServices.value[i].id === id) {
        selectedServices.value.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  // 重複を避けて配列に追加する
  function pushArray(array: any, value: any) {
    if (!isArrayExists(array, value)) {
      array.push(value);
    }
    return true;
  }

  // arrayの中にvalueが存在するかチェック
  function isArrayExists(array: any, value: any) {
    return array.some((e: any) => e === value);
  }

  // 表示するアプリロールグループがない時にはアプリロール選択のカードを非表示にする
  // （デフォルトアプリロールのみの場合）
  function displayCheck(item: any) {
    if (item.service_id == envConstants().rigel_id) {
      // RIGELが選択されている場合、デフォルトロールの有無にかわらずアプリロール選択画面は一律非表示
      return false;
    } else {
      // デフォルトアプリロールのみの場合 false
      for (const list in item.selectableApproles) {
        if (
          !item.selectableApproles[list].app_role.some(
            (appRG: any) => appRG.default_flg === "1",
          )
        ) {
          return true;
        }
      }
      return false;
    }
  }
  // 重複チェック（同じアプリを2つ以上登録できない）
  function hasDuplicates(array: any) {
    return new Set(array).size !== array.length;
  }
  // 次のフォームの追加を許すかチェック （アプリロール選択のカードが開いていなければ次は追加させない）
  function addCheck() {
    return !selectedServices.value.some((app: any) => app.app === false);
  }
  function disable() {
    const str = showSnackPattern.value;
    const regex = /nodata/gi;
    return regex.test(str);
  }
  // 閾値超えのリクエストメールフォームへ遷移
  function toMail(item: any) {
    useBusinessStore().setContents({
      pageId: "mail",
      content: {
        company_id: userDetailInfo.value.company_id,
        trigger_user_id: userDetailInfo.value.user_id,
        usp_role_id: item.usp_role_id,
      },
    });
    router.push({
      name: "mail",
    });
  }
  function first() {
    axiosGet(loginUserAPi, {})
      .then(async function (response: any) {
        user_id = response.data.user_id;
        user_type_id = response.data.user_type_id;
        if (user_id === undefined || user_type_id === undefined) {
          appStore.showSnack = true;
          appStore.showSnackPattern = "nodata_user";
          showSnackPattern.value = "nodata_user";
        }
        await getUserDetail(route.params.userId);
        // ログインユーザ情報取得APIが実行できたら'loginUserInfo'イベントを発砲し、レスポンス内容を送る
        events.emit("loginUserInfo", response.data);
      })
      .catch(() => {});
  }
  function calcHeight() {
    const maxHeight = document.documentElement.clientHeight - 250;
    let rowCount = 0;
    for (const list in selectedServices.value) {
      rowCount += selectedServices.value[list].checkApproles.length;
    }
    rowCount += selectedServices.value.length * 2 + 1;
    const value = rowCount * 35;
    if (value == 0) {
      noapps.value = true;
      height.value = "60px";
    } else if (value < 200) {
      height.value = "200px";
    } else if (value > maxHeight) {
      height.value = maxHeight + "px";
    } else {
      height.value = value + "px";
    }
  }
  function settingConfirmationCloseHandler() {
    dialog.value = false;
  }

  return {
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
  };
}
