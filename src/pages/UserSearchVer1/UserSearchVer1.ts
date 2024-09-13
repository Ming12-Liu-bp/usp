import { onBeforeRouteLeave } from "vue-router";
import {
  companiesListAPi,
  loginUserAPi,
  servicesListParamsAPi,
  userListAPi,
} from "@/constants/apiConstants";
import { events } from "../../utils/bus";
import { envConstants } from "../../constants/envConstants";
import UserDetailDialog from "../UserDetailDialog/UserDetailDialog.vue";

export default function UserSearchVer1() {
  const appStore = useAppStore();
  const userDetailDialogRef = ref(null);
  let user_id = "";
  let log_company_id = "";
  let companyInfo: any[] = [];
  let serviceInfo: any[] = [];
  let userInfo: any[] = [];
  let users: any[] = [];

  const companyAutocomplete = ref<any>(null);
  const servicesAutocomplete = ref<any>(null);

  // 検索条件
  const selectedSearchCompany = ref(
    appStore.selectedSearchCompany === ""
      ? undefined
      : appStore.selectedSearchCompany,
  );
  const searchName = ref(
    appStore.searchName === "" ? undefined : appStore.searchName,
  );
  const searchEmail = ref(
    appStore.searchEmail === "" ? undefined : appStore.searchEmail,
  );
  const selectedSearchService = ref(
    appStore.selectedSearchService === ""
      ? undefined
      : appStore.selectedSearchService,
  );
  const usertype = ref(appStore.usertype);

  const searchServices = ref<any[]>([]);
  const searchCompanies = ref<any[]>([]);

  // show: false,
  const search_disable_flg = ref(false);
  // snackbar display
  const snack = ref(false);
  const showRolesTable = ref(appStore.showRolesTable);
  const searching = ref(appStore.searching);
  const headers_d = [
    {
      title: "Company name",
      key: "companyName",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Mail address",
      key: "email",
    },
    {
      title: "Use apps",
      key: "serviceList",
    },
  ];
  const itemsPerPageOptions = ref([
    { value: 5, title: "5" },
    { value: 10, title: "10" },
    { value: 20, title: "20" },
    { value: 50, title: "50" },
  ]);
  const userList = ref<any[]>(appStore.userList);
  const pagination = ref(appStore.pagination);
  const maxUserSize = ref("");
  // error display pattern
  const showSnackPattern = ref("");
  // snackbar timeout
  const time_success = ref(20000);
  const time_error = ref(-1);
  const show = ref(appStore.show);
  const detailDialog = ref(false);
  const user_type_id = ref("");
  const isOpenUserDetailDialog = ref(false);

  // ヘッダーメニューからのアクセス時でもリロードを表現する
  onBeforeRouteLeave((to, from, next) => {
    restore();
    events.off("resetFlg");
    next();
  });

  onMounted(() => {
    loginUserSet();
    if (useBusinessStore().getContents("search")) {
      showSnackPattern.value =
        useBusinessStore().getContents("search").showSnackPattern;
      snack.value = useBusinessStore().getContents("search").snack;
      useBusinessStore().removeContents("search");
    }

    changeRestore(true);
  });

  // ログインユーザ情報取得API実行メソッド
  function loginUserSet() {
    axiosGet(loginUserAPi, {})
      .then(function (response: any) {
        user_id = response.data.user_id;
        user_type_id.value = response.data.user_type_id;
        log_company_id = response.data.company_id;
        if (user_id === undefined || user_type_id.value === undefined) {
          showSnackPattern.value = "nodata_user";
          snack.value = true;
          search_disable_flg.value = true;
        } else {
          companySet(user_id);
          serviceSet(user_id);
        }
        // ログインユーザ情報取得APIが実行できたら'loginUserInfo'イベントを発砲し、レスポンス内容を送る
        events.emit("loginUserInfo", response.data);
      })
      .catch(() => {
        search_disable_flg.value = true;
      });
  }

  // show roles tableボタンの表示切替
  function checkShowRolesTable() {
    // flag初期化
    setTrueShowRolesTable(false);

    // SIEのcompanyIdを事前に把握しておく
    if (
      log_company_id == envConstants().sie_id &&
      selectedSearchService.value == envConstants().rigel_id
    ) {
      setTrueShowRolesTable(true);
    }
    getUserList();
  }

  // 【権限チェック用】登録可能企業一覧取得API実行メソッド
  function companySet(userId: any) {
    const url = formatUrl(companiesListAPi, { userId: userId as string });
    axiosGet(url, {})
      .then(function (res: any) {
        companyInfo = res.data.company;
        if (companyInfo.length === 0) {
          showSnackPattern.value = "notregisterable";
          snack.value = true;
          search_disable_flg.value = true;
        } else {
          for (const list in companyInfo) {
            searchCompanies.value.push({
              name: companyInfo[list].company_name,
              id: companyInfo[list].id,
            });
          }
        }
      })
      .catch(() => {
        search_disable_flg.value = true;
      });
  }

  // アプリ一覧取得API実行メソッド
  function serviceSet(userId: any) {
    const url = formatUrl(servicesListParamsAPi, {
      userId: userId as string,
    });
    axiosGet(url, {})
      .then(function (res: any) {
        serviceInfo = res.data.service;
        if (serviceInfo.length === 0) {
          showSnackPattern.value = "nodata";
          snack.value = true;
        } else {
          for (const list in serviceInfo) {
            searchServices.value.push({
              name: serviceInfo[list].name,
              id: serviceInfo[list].id,
            });
          }
        }
      })
      .catch(() => {
        search_disable_flg.value = true;
      });
  }

  // サービス名リスト
  function listServiceName(num: any) {
    const serviceName = [];
    for (const list2 in userList.value[num].useApps) {
      serviceName.push(userList.value[num].useApps[list2].service_name);
    }
    return serviceName.join(", ");
  }

  // ロール名リスト
  function listRoleName(num: any) {
    const roleName = [];
    for (const list2 in userList.value[num].useApps) {
      if (
        userList.value[num].useApps[list2].service_id ==
        selectedSearchService.value
      ) {
        for (const list3 in userList.value[num].useApps[list2].app_role) {
          roleName.push(
            userList.value[num].useApps[list2].app_role[list3].app_role_name,
          );
        }
      }
    }
    return roleName.join(", ");
  }

  // 条件変えて再検索したときにページネーションを初期化する
  function resetPagination() {
    appStore.pagination = {
      page: 1,
      rowsPerPage: 5,
      sortBy: [
        { key: "companyName", order: "asc" },
        { key: "name", order: "asc" },
      ] as any,
      descending: false,
    };
  }

  // ユーザ一覧取得API実行メソッド
  function getUserList() {
    setTrueShow(false);
    users = [];
    if (usertype.value) {
      user_type_id.value = envConstants().organization_admin;
    }
    setTrueSearching(true);

    axiosGet(userListAPi, {
      company_id: selectedSearchCompany.value,
      service_id: selectedSearchService.value,
      name: searchName.value,
      email: searchEmail.value,
      user_type_id: user_type_id.value,
    })
      .then((res: any) => {
        maxUserSize.value = res.data?.max_user_size;
        userInfo = res.data?.user;

        for (const list in userInfo) {
          users.push({
            id: userInfo[list].id,
            name: userInfo[list].last_name + " " + userInfo[list].first_name,
            companyId: userInfo[list].company_id,
            companyName: userInfo[list].company_name,
            email: userInfo[list].email,
            usertype: userInfo[list].usertype,
            useApps: userInfo[list].used_app,
            serviceList: "",
          });
        }
        userList.value = users;
        appStore.userList = userList.value as any;
        for (const list2 in userList.value) {
          userList.value[list2].serviceList = listServiceName(list2);
          userList.value[list2].roleList = listRoleName(list2);
        }

        // 検索条件
        appStore.selectedSearchUsertype = user_type_id.value;
        appStore.userList = userList.value as any;
        setTrueShow(true);
        setTrueSearching(false);
      })
      .catch(() => {
        setTrueSearching(false);
      });
  }

  // set show
  function setTrueShow(param: any) {
    appStore.show = param;
    show.value = param;
  }

  // set showRolesTable
  function setTrueShowRolesTable(param: any) {
    appStore.showRolesTable = param;
    showRolesTable.value = param;
  }

  // set searching
  function setTrueSearching(param: any) {
    appStore.searching = param;
    searching.value = param;
  }

  // set usertype
  function setTrueUsertype(param: any) {
    appStore.usertype = param;
    usertype.value = param;
  }

  // set restoreflg
  function changeRestore(param: any) {
    appStore.restoreflg = param;
  }

  // clear selectedSearchCompany
  function clearCompany() {
    appStore.selectedSearchCompany = "";
    selectedSearchCompany.value = undefined;
    companyAutocomplete.value.search = "";
  }

  // save selectedSearchCompany
  function saveSelectedCompany() {
    appStore.selectedSearchCompany = selectedSearchCompany.value as any;
  }

  // clear searchName
  function clearName() {
    appStore.searchName = "";
    searchName.value = undefined;
  }

  // save searchName
  function saveSearchName() {
    appStore.searchName = searchName.value as any;
  }

  // clear searchEmail
  function clearEmail() {
    appStore.searchEmail = "";
    searchEmail.value = undefined;
  }

  // save searchEmail
  function saveSearchEmail() {
    appStore.searchEmail = searchEmail.value as any;
  }

  // clear selectedSearchService
  function clearService() {
    appStore.selectedSearchService = "";
    selectedSearchService.value = undefined;
    servicesAutocomplete.value.search = "";
  }

  // save selectedSearchService
  function saveSelectedService() {
    appStore.selectedSearchService = selectedSearchService.value as any;
  }

  // save usertype
  function saveUsertype() {
    appStore.usertype = usertype.value;
  }

  // save pagination
  function savePaginationPageInStore() {
    appStore.pagination = pagination.value;
  }

  // ユーザ情報Dialog
  function openUserDetailDialog(event: any, values: any) {
    isOpenUserDetailDialog.value = true;
    (userDetailDialogRef.value as any).selectedUserId = values.item.id;
    (userDetailDialogRef.value as any).user_type_id = user_type_id.value;
    (userDetailDialogRef.value as any).searchCompanies = searchCompanies.value;
    (userDetailDialogRef.value as any).detailDialog = detailDialog.value;
    (userDetailDialogRef.value as any).getUserDetail();
  }

  // ユーザ情報失敗
  function userDetailError(showSnackPatternDialog: any, snackDialog: any) {
    showSnackPattern.value = showSnackPatternDialog;
    snack.value = snackDialog;
  }

  // store情報削除
  function restore() {
    if (appStore.restoreflg) {
      setTrueShow(false);
      setTrueShowRolesTable(false);
      setTrueUsertype(false);
      setTrueSearching(false);
      appStore.selectedSearchCompany = "";
      appStore.searchName = "";
      appStore.searchEmail = "";
      appStore.selectedSearchService = "";
      appStore.pagination = {
        page: 1,
        rowsPerPage: 5,
        sortBy: [
          { key: "companyName", order: "asc" },
          { key: "name", order: "asc" },
        ] as any,
        descending: false,
      };
      appStore.userList = [];
    }
  }

  // 検索初期化
  function reset() {
    restore();
    // 検索条件初期化
    selectedSearchCompany.value = undefined;
    companyAutocomplete.value.search = "";
    searchName.value = undefined;
    searchEmail.value = undefined;
    selectedSearchService.value = undefined;
    servicesAutocomplete.value.search = "";

    // 検索結果初期化
    userList.value = [];
    pagination.value = {
      page: 1,
      rowsPerPage: 5,
      sortBy: [
        { key: "companyName", order: "asc" },
        { key: "name", order: "asc" },
      ] as any,
      descending: false,
    };
  }

  events.on("resetFlg", (data: any) => {
    if (data) {
      reset();
      showSnackPattern.value = "";
      snack.value = false;
      loginUserSet();
    }
  });

  return {
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
    isOpenUserDetailDialog,
    userDetailDialogRef,
    companyAutocomplete,
    servicesAutocomplete,
    saveSelectedCompany,
    saveSearchName,
    saveSearchEmail,
    saveSelectedService,
    saveUsertype,
  };
}
