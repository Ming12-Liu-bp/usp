import { envConstants } from "@/constants/envConstants";
import { loginUserAPi, userListAPi } from "@/constants/apiConstants";
import { events } from "../../utils/bus";

export default function RIGELRolesTable() {
  const appStore = useAppStore();
  const router = useRouter();

  const search_disable_flg = ref(false);

  const user_id = ref("");
  const user_type_id = ref("");
  const user_type_name_en = ref("");
  const log_last_name = ref("");
  const log_first_name = ref("");
  const log_company_id = ref("");
  const log_company_name = ref("");
  const log_company_name_en = ref("");
  const company_id = ref("");

  const parPage = ref(10);
  const pageNum = ref(1);
  const userList = ref<any>([]);
  const users = ref<any>([]);

  const selectedSearchCompany = computed(() => appStore.selectedSearchCompany);
  const selectedSearchService = computed(() => appStore.selectedSearchService);
  const searchName = computed(() => appStore.searchName);
  const searchEmail = computed(() => appStore.searchEmail);
  const usertype = computed(() => appStore.usertype);

  const getItems = computed(() => {
    const current = pageNum.value * parPage.value;
    const start = current - parPage.value;
    return userList.value.slice(start, current);
  });
  const total = computed(() => userList.value.length);

  onMounted(() => {
    first();
  });

  function first() {
    axiosGet(loginUserAPi, {})
      .then(function (response: any) {
        user_id.value = response.data.user_id;
        user_type_id.value = response.data.user_type_id;
        user_type_name_en.value = response.data.user_type_name_en;
        log_last_name.value = response.data.last_name;
        log_first_name.value = response.data.first_name;
        log_company_id.value = response.data.company_id;
        log_company_name.value = response.data.company_name;
        log_company_name_en.value = response.data.company_name_en;
        company_id.value = response.data.company_id;
        if (user_id.value === undefined || user_type_id.value === undefined) {
          appStore.showSnackPattern = "nodata_user";
          appStore.showSnack = true;
          search_disable_flg.value = true;
        } else {
          getUserList();
        }
        // ログインユーザ情報取得APIが実行できたら"loginUserInfo"イベントを発砲し、レスポンス内容を送る
        events.emit("loginUserInfo", response.data);
      })
      .catch(() => {});
  }

  function getUserList() {
    let user_type = "";
    if (usertype.value) {
      user_type = envConstants().organization_admin;
    }

    axiosGet(userListAPi, {
      company_id: selectedSearchCompany.value,
      service_id: envConstants().rigel_id,
      name: searchName.value,
      email: searchEmail.value,
      user_type_id: user_type,
    })
      .then(function (res: any) {
        const userInfo = res.data.user;
        for (const list in userInfo) {
          users.value.push({
            id: userInfo[list].id,
            name: userInfo[list].last_name + " " + userInfo[list].first_name,
            companyId: userInfo[list].company_id,
            companyName: userInfo[list].company_name,
            email: userInfo[list].email,
            usertype: userInfo[list].usertype,
            useApps: userInfo[list].used_app,
            serviceList: "",
            roleList: "",
            modelRoleList: "",
            productList: "",
            siteList: "",
            citrus: "",
          });
          for (const list2 in userInfo[list].used_app) {
            if (
              userInfo[list].used_app[list2].service_id ==
              envConstants().citrus_id
            ) {
              users.value[list].citrus = "〇";
            }
          }
          userList.value = users.value;
          userList.value = listCompanyHidden();
          for (const list3 in userList.value) {
            userList.value[list3].serviceList = listServiceName(list3);
            userList.value[list3].roleList = listRoleName(list3);
          }
          modelRoleSet(); // 変換用
        }
      })
      .catch(() => {});
  }

  function listServiceName(num: any) {
    const serviceName = [];
    for (const list2 in userList.value[num].useApps) {
      serviceName.push(userList.value[num].useApps[list2].service_name);
    }
    return serviceName.join(", ");
  }

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

  // RIGELだけを抽出
  function listServiceRIGELOnly() {
    const rigelOnly = users.value.slice(0);
    for (const list in rigelOnly) {
      for (const list2 in rigelOnly[list].useApps) {
        if (
          rigelOnly[list].useApps[list2].service_id != envConstants().rigel_id
        ) {
          rigelOnly[list].useApps.splice(list2, 1);
        }
      }
    }
    return rigelOnly;
  }

  // RIGEL表にはNTT DATAを表示させないための処理
  function listCompanyHidden() {
    const nodatalist = userList.value.slice(0);
    for (let i = 0; i < nodatalist.length; i++) {
      if (nodatalist[i].companyId == envConstants().nttdata_id) {
        nodatalist.splice(i, 1);
        continue;
      }
    }
    return nodatalist;
  }

  function formatDate(dt: any) {
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    return y + m + d;
  }

  // Backボタン
  function backbtn() {
    appStore.restoreflg = false;
    router.go(-1);
  }

  function downloadCSV() {
    // csv出力時の表項目
    let csv =
      "\ufeff" +
      "Company name,Name,Mail address,User type," +
      "RIGEL,TRISTAR,CITRUS,生産計画,自達,有償支給,PLP_Maker,アロケ閲覧権限," +
      "All Product,COMMON,DS4,PS5 HD Camera,DualSense,PS Camera,PS Move,PS VR,PS4,PS5,DualSense Charging Station,PS5 Camera Adaptor,PS5 Media Remote,PS5 Wireless Headset,PS VR2,PS VR2 Controller,DualSense Edge,DualSense Edge Replacement stick module,PS VR2 Controller Charging Station,PS5 Drive,PS5 Server PWBA," +
      "All Site,FOX-GZ,FOX-MY,FOX-SK,FOX-YT,GOER-RC,GOER-VN,GOER-WF,PEGA-SZ,SKZ,UN_ALLOC,NITTSU-SZ,NITTSU-YT" +
      "\n";
    for (const list in userList.value) {
      const line =
        '"' +
        userList.value[list].companyName +
        '"' +
        "," +
        '"' +
        userList.value[list].name +
        '"' +
        "," +
        '"' +
        userList.value[list].email +
        '"' +
        "," +
        '"' +
        userList.value[list].usertype +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.rigel +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.tristar +
        '"' +
        "," +
        '"' +
        userList.value[list].citrus +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.seisan +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.jitatsu +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.yuushou +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.plp +
        '"' +
        "," +
        '"' +
        userList.value[list].modelRoleList.aroke +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.allpro +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.common +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ds4 +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5hdc +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ds +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.pscam +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.psmove +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.psvr +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps4 +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5 +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.dscs +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5ca +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5mr +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5wh +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.vr2 +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.vr2c +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.dse +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.dsersm +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.vr2ccs +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5d +
        '"' +
        "," +
        '"' +
        userList.value[list].productList.ps5sp +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.allsite +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.foxgz +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.foxmy +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.foxsk +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.foxyt +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.goerrc +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.goervn +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.goerwf +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.pegasz +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.skz +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.unalloc +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.nittsusz +
        '"' +
        "," +
        '"' +
        userList.value[list].siteList.nittsuyt +
        '"' +
        "," +
        "\n";
      csv += line;
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "RIGELUser_" + formatDate(new Date()) + ".csv";
    link.click();
  }

  // Model Role変換用
  // eslint-disable-next-line complexity
  function modelRoleSet() {
    userList.value = listServiceRIGELOnly();
    let modelRole = {
      rigel: "",
      tristar: "",
      seisan: "",
      jitatsu: "",
      yuushou: "",
      plp: "",
      aroke: "",
    };
    for (const ap1 in userList.value) {
      userList.value[ap1].modelRoleList = modelRole;
      for (const ap2 in userList.value[ap1].useApps) {
        if (
          userList.value[ap1].useApps[ap2].service_id == envConstants().rigel_id
        ) {
          for (const ap3 in userList.value[ap1].useApps[ap2].app_rolegroup) {
            if (
              userList.value[ap1].useApps[ap2].app_rolegroup[ap3]
                .app_rolegroup_id == envConstants().rigel_model_role
            ) {
              switch (
                userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[0]
                  .app_role_id
              ) {
                case envConstants().mrfull:
                case envConstants().mr01:
                case envConstants().mr02:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "〇",
                    aroke: "",
                  };
                  break;
                case envConstants().mr03:
                case envConstants().mr05:
                case envConstants().mr09:
                case envConstants().mr23:
                case envConstants().mr33:
                case envConstants().mr38:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr04:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "〇",
                    aroke: "",
                  };
                  break;
                case envConstants().mr06:
                case envConstants().mr27:
                case envConstants().mr35:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr07:
                case envConstants().mr08:
                case envConstants().mr10:
                case envConstants().mr34:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr11:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr18:
                case envConstants().mr19:
                case envConstants().mr22:
                case envConstants().mr25:
                case envConstants().mr30:
                case envConstants().mr36:
                case envConstants().mr37:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr20:
                case envConstants().mr24:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr21:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "〇",
                    aroke: "",
                  };
                  break;
                case envConstants().mr26:
                  modelRole = {
                    rigel: "",
                    tristar: "〇",
                    seisan: "",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr29:
                  modelRole = {
                    rigel: "",
                    tristar: "〇",
                    seisan: "",
                    jitatsu: "",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr31:
                case envConstants().mr32:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "",
                    yuushou: "〇",
                    plp: "",
                    aroke: "",
                  };
                  break;
                case envConstants().mr39:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr40:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr41:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr42:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr43:
                  modelRole = {
                    rigel: "〇",
                    tristar: "",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr44:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().mr45:
                  modelRole = {
                    rigel: "〇",
                    tristar: "〇",
                    seisan: "〇",
                    jitatsu: "〇",
                    yuushou: "〇",
                    plp: "",
                    aroke: "〇",
                  };
                  break;
                case envConstants().noaccess:
                default:
                  modelRole = {
                    rigel: "",
                    tristar: "",
                    seisan: "",
                    jitatsu: "",
                    yuushou: "",
                    plp: "",
                    aroke: "",
                  };
                  break;
              }
              userList.value[ap1].modelRoleList = modelRole;
              modelRole = {
                rigel: "",
                tristar: "",
                seisan: "",
                jitatsu: "",
                yuushou: "",
                plp: "",
                aroke: "",
              };
            }
          }
        }
      }
    }
    productListSet();
  }

  // ProductList変換用
  function productListSet() {
    let productRole = {
      allpro: "",
      common: "",
      ds4: "",
      ps5hdc: "",
      ds: "",
      pscam: "",
      psmove: "",
      psvr: "",
      ps4: "",
      ps5: "",
      dscs: "",
      ps5ca: "",
      ps5mr: "",
      ps5wh: "",
      vr2: "",
      vr2c: "",
      dse: "",
      dsersm: "",
      vr2ccs: "",
      ps5d: "",
      ps5sp: "",
    };
    for (const ap1 in userList.value) {
      productRole = {
        allpro: "",
        common: "",
        ds4: "",
        ps5hdc: "",
        ds: "",
        pscam: "",
        psmove: "",
        psvr: "",
        ps4: "",
        ps5: "",
        dscs: "",
        ps5ca: "",
        ps5mr: "",
        ps5wh: "",
        vr2: "",
        vr2c: "",
        dse: "",
        dsersm: "",
        vr2ccs: "",
        ps5d: "",
        ps5sp: "",
      };
      userList.value[ap1].productList = productRole;
      for (const ap2 in userList.value[ap1].useApps) {
        if (
          userList.value[ap1].useApps[ap2].service_id == envConstants().rigel_id
        ) {
          for (const ap3 in userList.value[ap1].useApps[ap2].app_rolegroup) {
            if (
              userList.value[ap1].useApps[ap2].app_rolegroup[ap3]
                .app_rolegroup_id == envConstants().rigel_product
            ) {
              for (const ap4 in userList.value[ap1].useApps[ap2].app_rolegroup[
                ap3
              ].app_role) {
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().allpro
                ) {
                  productRole.allpro = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().common
                ) {
                  productRole.common = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ds4
                ) {
                  productRole.ds4 = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5hdc
                ) {
                  productRole.ps5hdc = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ds
                ) {
                  productRole.ds = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().pscam
                ) {
                  productRole.pscam = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().psmove
                ) {
                  productRole.psmove = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().psvr
                ) {
                  productRole.psvr = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps4
                ) {
                  productRole.ps4 = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5
                ) {
                  productRole.ps5 = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().dscs
                ) {
                  productRole.dscs = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5ca
                ) {
                  productRole.ps5ca = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5mr
                ) {
                  productRole.ps5mr = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5wh
                ) {
                  productRole.ps5wh = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().vr2
                ) {
                  productRole.vr2 = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().vr2c
                ) {
                  productRole.vr2c = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().dse
                ) {
                  productRole.dse = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().dsersm
                ) {
                  productRole.dsersm = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().vr2ccs
                ) {
                  productRole.vr2ccs = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5d
                ) {
                  productRole.ps5d = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().ps5sp
                ) {
                  productRole.ps5sp = "〇";
                }
              }
              userList.value[ap1].productList = productRole;
            }
          }
        }
      }
    }
    siteListSet();
  }

  // Site変換用
  function siteListSet() {
    let siteRole = {
      allsite: "",
      foxgz: "",
      foxmy: "",
      foxsk: "",
      foxyt: "",
      goerrc: "",
      goervn: "",
      goerwf: "",
      pegasz: "",
      skz: "",
      unalloc: "",
      nittsusz: "",
      nittsuyt: "",
    };
    for (const ap1 in userList.value) {
      siteRole = {
        allsite: "",
        foxgz: "",
        foxmy: "",
        foxsk: "",
        foxyt: "",
        goerrc: "",
        goervn: "",
        goerwf: "",
        pegasz: "",
        skz: "",
        unalloc: "",
        nittsusz: "",
        nittsuyt: "",
      };
      userList.value[ap1].siteList = siteRole;
      for (const ap2 in userList.value[ap1].useApps) {
        if (
          userList.value[ap1].useApps[ap2].service_id == envConstants().rigel_id
        ) {
          for (const ap3 in userList.value[ap1].useApps[ap2].app_rolegroup) {
            if (
              userList.value[ap1].useApps[ap2].app_rolegroup[ap3]
                .app_rolegroup_id == envConstants().rigel_site
            ) {
              for (const ap4 in userList.value[ap1].useApps[ap2].app_rolegroup[
                ap3
              ].app_role) {
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().allsite
                ) {
                  siteRole.allsite = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().foxgz
                ) {
                  siteRole.foxgz = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().foxmy
                ) {
                  siteRole.foxmy = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().foxsk
                ) {
                  siteRole.foxsk = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().foxyt
                ) {
                  siteRole.foxyt = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().goerrc
                ) {
                  siteRole.goerrc = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().goervn
                ) {
                  siteRole.goervn = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().goerwf
                ) {
                  siteRole.goerwf = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().pegasz
                ) {
                  siteRole.pegasz = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().skz
                ) {
                  siteRole.skz = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().unalloc
                ) {
                  siteRole.unalloc = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().nittsusz
                ) {
                  siteRole.nittsusz = "〇";
                }
                if (
                  userList.value[ap1].useApps[ap2].app_rolegroup[ap3].app_role[
                    ap4
                  ].app_role_id == envConstants().nittsuyt
                ) {
                  siteRole.nittsuyt = "〇";
                }
              }
              userList.value[ap1].siteList = siteRole;
            }
          }
        }
      }
    }
    userList.value = listCompanyHidden();
  }

  return {
    pageNum,
    parPage,
    getItems,
    total,
    downloadCSV,
    backbtn,
  };
}
