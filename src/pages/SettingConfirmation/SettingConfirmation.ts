import {
  appRoleListParamsAPi,
  servicesListParamsAPi,
  userListAPi,
  userServicesListParamsAPi,
  uspRoleListParamsAPi,
} from "../../constants/apiConstants";
import { envConstants } from "../../constants/envConstants";

export default function SettingConfirmationBox(emit: any, props: any) {
  const { t } = useI18n();
  const appStore = useAppStore();
  const router = useRouter();

  // props
  const userDetailInfo = props.user_detail_info;
  const hiddenSelectedServices = props.hidden_selected_services;
  const selectedServices = props.selected_services;
  const checkedValidation = props.checked_validation;
  const height = props.height;
  const noapps = props.noapps;

  const firstSelectServices = <any>[];
  const firstSelectUSPs = <any>[];

  let selectableServices = <any>[];

  // computed
  const selectedSearchCompany = computed(() => appStore.selectedSearchCompany);
  const selectedSearchService = computed(() => appStore.selectedSearchService);
  const searchName = computed(() => appStore.searchName);
  const searchEmail = computed(() => appStore.searchEmail);
  const userList = computed(() => appStore.userList);
  const usertype = computed(() => appStore.usertype);
  const selectableServiceHidden = computed(() => {
    return selectableServices.filter(function (el: any) {
      return !envConstants().hidden.some((e: any) => e == el.id);
    });
  });

  const dialogVisible = ref(true);
  const processing = ref(false);

  const showSnackPattern = ref("noerror");
  const snack = ref(false);

  // response
  const result_code = ref("");
  const result_message = ref("");
  const result_code_limit = ref("");
  const result_message_limit = ref("");

  const users = <any>[];

  function startProcessing() {
    processing.value = true;
  }
  function endProcessing() {
    processing.value = false;
  }
  function isProcessing() {
    return processing.value;
  }

  onMounted(() => {
    for (const service in userDetailInfo.services) {
      firstSelectServices.push(userDetailInfo.services[service].service_id);
      firstSelectUSPs.push(userDetailInfo.services[service].usp_role_id);
    }
  });

  // アプリ利用登録API実行メソッド
  async function appsUsageRegist() {
    const uid = userDetailInfo.user_id;
    const request: any = { services: [] };
    startProcessing();

    for (const selectedService in selectedServices.value) {
      request.services.push({
        service_id: selectedServices.value[selectedService].service_id,
        usp_role_id: selectedServices.value[selectedService].usp_role_id,
        app_role_ids: selectedServices.value[
          selectedService
        ].selectedApproles.map((e: any) => e.id),
      });
    }
    for (const hiddenSelectedService in hiddenSelectedServices.value) {
      request.services.push({
        service_id:
          hiddenSelectedServices.value[hiddenSelectedService].service_id,
        usp_role_id:
          hiddenSelectedServices.value[hiddenSelectedService].usp_role_id,
        app_role_ids: hiddenSelectedServices.value[
          hiddenSelectedService
        ].app_role.map((e: any) => e.app_role_id),
      });
    }

    const url = formatUrl(userServicesListParamsAPi, { user_id: uid });
    try {
      const res: any = await axiosPost(url, request);
      if (!Object.prototype.hasOwnProperty.call(res, "transaction_id")) {
        appStore.showSnackPattern = "systemerror";
        appStore.showSnack = true;
      } else {
        appStore.restoreflg = false;
        getUserList();
        useBusinessStore().setContents({
          pageId: "search",
          content: {
            showSnackPattern: "success_appSetting",
            snack: true,
            restoreflg: false,
          },
        });
        router.push({
          name: "search",
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          appStore.showSnackPattern = "badrequest";
          appStore.showSnack = true;
        } else if (error.response.status === 401) {
          appStore.showSnackPattern = "unauthorized";
          appStore.errorModal = true;
        } else {
          appStore.showSnackPattern = "systemerror_code_id";
          appStore.showSnack = true;
        }
        appStore.statusCode = error.response.status;
        result_code.value = error.response.data.result_code;
        appStore.resultMessage = error.response.data.result_message;
        if (result_code.value == "135") {
          result_code_limit.value = result_code.value;
          result_message_limit.value = result_message.value;
          for (const a in selectedServices.value) {
            await USProleSet(
              userDetailInfo.user_id,
              userDetailInfo.value.company_id,
              selectedServices.value[a].service_id,
              selectedServices.value[a].id,
            );
            let id = -1;
            for (const num in selectedServices.value[a].selectableUSP) {
              if (
                selectedServices.value[a].selectableUSP[num].id ===
                selectedServices.value[a].usp_role_id
              ) {
                id = Number(num);
              }
            }
            if (id !== -1) {
              if (
                selectedServices.value[a].selectableUSP[id]
                  .registerable_status === "1"
              ) {
                if (
                  firstSelectUSPs.value.some(
                    (e: any) =>
                      e === selectedServices.value[a].selectableUSP[id].id,
                  )
                ) {
                  showSnackPattern.value = "noerror";
                  await appRoleSet(
                    userDetailInfo.value.company_id,
                    selectedServices.value[a].usp_role_id,
                    selectedServices.value[a].id,
                  );
                  selectedServices.value[a].errormsg = "";
                  selectedServices.value[a].app = true;
                } else {
                  selectedServices.value[a].errormsg = t("message.MSG00009");
                  selectedServices.value[a].app = false;
                  selectedServices.value[a].app_role = [];
                  selectedServices.value[a].checkApproles = [];
                  selectedServices.value[a].selectedApproles = [];
                  selectedServices.value[a].selectableApproles = [];
                  selectedServices.value[a].saving = false;
                }
              } else {
                showSnackPattern.value = "noerror";
                await appRoleSet(
                  userDetailInfo.value.company_id,
                  selectedServices.value[a].usp_role_id,
                  selectedServices.value[a].id,
                );
                selectedServices.value[a].errormsg = "";
                selectedServices.value[a].app = true;
              }
            }
          }
          result_code.value = result_code_limit.value;
          result_message.value = result_message_limit.value;
          appStore.showSnackPattern = "badrequest";
          appStore.showSnack = true;
        }
        if (result_code.value == "137") {
          result_code_limit.value = result_code.value;
          result_message_limit.value = result_message.value;
          for (const a2 in selectedServices.value) {
            await serviceSet(
              userDetailInfo.user_id,
              userDetailInfo.value.company_id,
            );
            let id2 = -1;
            for (const num2 in selectableServiceHidden.value) {
              if (
                selectableServiceHidden.value[num2].id ===
                selectedServices.value[a2].service_id
              ) {
                id2 = Number(num2);
              }
            }
            if (id2 !== -1) {
              if (
                selectableServiceHidden.value[id2].registerable_status === "1"
              ) {
                if (
                  firstSelectServices.some(
                    (e: any) => e === selectableServiceHidden.value[id2].id,
                  )
                ) {
                  showSnackPattern.value = "noerror";
                  await USProleSet(
                    userDetailInfo.user_id,
                    userDetailInfo.value.company_id,
                    selectedServices.value[a2].service_id,
                    selectedServices.value[a2].id,
                  );
                  selectedServices.value[a2].doubleErrorMessage = "";
                  selectedServices.value[a2].usp = true;
                } else {
                  selectedServices.value[a2].doubleErrorMessage =
                    t("message.MSG00024");
                  selectedServices.value[a2].usp = false;
                  selectedServices.value[a2].app = false;
                  selectedServices.value[a2].usp_role_id = "";
                  selectedServices.value[a2].selectableUSP = [];
                  selectedServices.value[a2].app_role = [];
                  selectedServices.value[a2].checkApproles = [];
                  selectedServices.value[a2].selectedApproles = [];
                  selectedServices.value[a2].selectableApproles = [];
                  selectedServices.value[a2].saving = false;
                }
              } else {
                showSnackPattern.value = "noerror";
                await USProleSet(
                  userDetailInfo.user_id,
                  userDetailInfo.value.company_id,
                  selectedServices.value[a2].service_id,
                  selectedServices.value[a2].id,
                );
                selectedServices.value[a2].doubleErrorMessage = "";
                selectedServices.value[a2].usp = true;
              }
            }
          }
          result_code.value = result_code_limit.value;
          result_message.value = result_message_limit.value;
          appStore.showSnackPattern = "badrequest";
          appStore.showSnack = true;
        }
        appStore.transactionId = error.response.data.transaction_id;
      } else {
        appStore.showSnackPattern = "systemerror";
        appStore.showSnack = true;
      }
    }

    endProcessing();
    dialogVisible.value = false;
    emit("setting-confirmation-close");
  }

  // ユーザ一覧取得API実行メソッド
  async function getUserList() {
    let user_type = "";
    if (usertype.value) {
      user_type = envConstants().organization_admin;
    }
    const queries = {
      company_id: selectedSearchCompany,
      service_id: selectedSearchService,
      name: searchName,
      email: searchEmail,
      user_type_id: user_type,
    };

    axiosGet(userListAPi, { params: queries })
      .then((res: any) => {
        const userInfoList = res.data.user;
        for (const userInfo in userInfoList) {
          users.push({
            id: userInfoList[userInfo].id,
            name:
              userInfoList[userInfo].last_name +
              " " +
              userInfoList[userInfo].first_name,
            companyId: userInfoList[userInfo].company_id,
            companyName: userInfoList[userInfo].company_name,
            email: userInfoList[userInfo].email,
            usertype: userInfoList[userInfo].usertype,
            useApps: userInfoList[userInfo].used_app,
            serviceList: "",
          });
        }
        const userList = listServiceHidden();
        for (const user in userList) {
          userList[user].serviceList = listServiceName(user);
        }
      })
      .catch(() => {});
  }
  // 登録可能アプリ一覧取得API実行メソッド
  async function serviceSet(uid: any, cid: any) {
    const queries = { company_id: cid };
    const url = formatUrl(servicesListParamsAPi, { userId: uid });
    try {
      const res: any = await axiosGet(url, {
        params: queries,
      });

      selectableServices = [];
      const selectableServiceInfo = res.data.service;
      if (selectableServiceInfo.length !== 0) {
        for (const list in selectableServiceInfo) {
          selectableServices.push({
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

  function listServiceName(num: any) {
    const useApps = userList.value[num] as any;
    const serviceName = [];
    for (const useApp in useApps) {
      serviceName.push(useApps[useApp].service_name);
    }
    return serviceName.join(", ");
  }

  function listServiceHidden() {
    const lsh = users.slice(0);
    for (const user in lsh) {
      for (const useApp in lsh[user].useApps) {
        if (
          envConstants().hidden.some(
            (e: any) => e == lsh[user].useApps[useApp].service_id,
          )
        ) {
          lsh[user].useApps.splice(useApp, 1);
        }
      }
    }
    return lsh;
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

  function clickCancel() {
    dialogVisible.value = false;
    emit("setting-confirmation-close");
  }

  return {
    checkedValidation,
    dialogVisible,
    height,
    noapps,
    selectedServices,
    isProcessing,
    appsUsageRegist,
    clickCancel,
  };
}
