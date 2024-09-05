import { delUserAPi, userDetailParamsAPi } from "../../constants/apiConstants";

import { envConstants } from "../../constants/envConstants";

export default function UserDetailDialog(emit: any) {
  const router = useRouter();

  const selectedUserId = ref("");
  const user_type_id = ref("");
  const searchCompanies = ref<any[]>([]);
  const detailDialog = ref(false);

  let userDetailInfoService = {};
  const userDetailInfo: any = ref({});
  const showSnackPattern = ref("");
  const snack = ref(false);
  let processing = false;
  const deleteDialog = ref(false);

  function startProcessing() {
    processing = true;
  }
  function endProcessing() {
    processing = false;
  }
  function isProcessing() {
    return processing;
  }

  // ユーザ情報取得API実行メソッド
  function getUserDetail() {
    const url = formatUrl(userDetailParamsAPi, {
      userId: selectedUserId.value as string,
    });
    axiosGet(url, {})
      .then(function (res: any) {
        userDetailInfoService = res.data;
        userDetailInfo.value = userDetailInfoService;
        if (
          !Object.prototype.hasOwnProperty.call(
            userDetailInfo.value,
            "services",
          )
        ) {
          emit("user_detail_error", "nodata_targetuser", true);
          showSnackPattern.value = "nodata_targetuser";
          snack.value = true;
        } else {
          // アプリロールの順番を整理する
          for (const list in userDetailInfo.value.services) {
            userDetailInfo.value.services[list].app_role.sort(function (
              a: any,
              b: any,
            ) {
              if (Number(a.sort_order) < Number(b.sort_order)) {
                return 1;
              } else {
                return -1;
              }
            });
          }
          detailDialog.value = true;
        }
      })
      .catch(() => {});
  }

  // ユーザ削除API実行メソッド
  function userDelete() {
    startProcessing();
    const url = formatUrl(delUserAPi, { userId: selectedUserId.value });
    axiosDelete(url, {})
      .then(function (res: any) {
        if (!Object.prototype.hasOwnProperty.call(res, "transaction_id")) {
          emit("user_detail_error", "systemerror", true);
          showSnackPattern.value = "systemerror";
          snack.value = true;
        } else {
          deleteDialog.value = false;
          snack.value = true;
          showSnackPattern.value = "success";
          emit("user_detail_error", "success", true);
          emit("get_user_list");
        }
        emit("change_restore", false);
        endProcessing();
      })
      .catch(() => {});
  }

  // ユーザ削除ボタンの活性/非活性
  function deleteAuthorityCheck() {
    // 利用者以外の特権ユーザかつ操作可能企業のユーザである⇒削除権限あり
    if (user_type_id.value == envConstants().user) {
      return true;
    } else {
      return !searchCompanies.value.some(
        (e: any) => e.id == userDetailInfo.value.company_id,
      );
    }
  }

  // ChangeAppsUsage画面へ遷移
  function appsetting() {
    emit("change_restore", false);

    router.push({
      name: "change",
      params: {
        userId: selectedUserId.value,
      },
    });
  }

  return {
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
  };
}
