import Mock from "mockjs2";
import applicationDetail from "./services/applicationDetail.json";
import loginUserAPI from "./services/loginUserAPI.json";
import countryList from "./services/countryList.json";
import languageList from "./services/languageList.json";
import companiesListAPI from "./services/companiesListAPI.json";
import servicesListAPI from "./services/servicesListAPI.json";
import success from "./services/success.json";
import loginUserAPIerror from "./services/loginUserAPIerror.json";
import loginUserNoDeleteAPI from "./services/loginUserNoDeleteAPI.json";
import companiesListAPIerror from "./services/companiesListAPIerror.json";
import usertypeList from "./services/usertypeList.json";
import userList from "./services/userList.json";
import userDetail from "./services/userDetail.json";
import appRoleList_RIGEL from "./services/appRoleList_RIGEL.json";
import uspRoleList_RIGEL from "./services/uspRoleList_RIGEL.json";
import uspRoleList_CITRUS from "./services/uspRoleList_CITRUS.json";
import uspRoleList from "./services/uspRoleList.json";
import appRoleList_CITRUS from "./services/appRoleList_CITRUS.json";
import applicationList_authorizer from "./services/applicationList_authorizer.json";
import applicationList_applicant from "./services/applicationList_applicant.json";
import appRoleList from "./services/appRoleList.json";

// ユーザ申請情報取得API
Mock.mock(/\/applications\/(\d+)\/users/, "get", () => {
  return applicationDetail;
});
// ログインユーザ情報取得API
Mock.mock(/api\/users\/login_user/, "get", () => {
  return loginUserAPI;
});

// //  ログインユーザ情報取得API【エラー】400
// Mock.mock(/api\/users\/login_user/, "get", () => ({
//   _status: 400,
//   transaction_id: "202",
//   result_code: "400",
//   result_message: "Bad Reuest",
//   redirect_url: "/usp/",
// }));

// //  ログインユーザ情報取得API【エラー】400
// Mock.mock(/api\/users\/login_user/, "get", () => ({
//   _status: 400,
//   transaction_id: "202",
//   result_code: "400",
//   result_message: "Bad Reuest",
//   redirect_url: "/usp/",
// }));

// //  ログインユーザ情報取得API【エラー】401
// Mock.mock(/api\/users\/login_user/, "get", () => ({
//   _status: 401,
//   transaction_id: "202",
//   result_code: "401",
//   result_message: "unauthorized",
//   redirect_url: "/usp/",
// }));

// //  ログインユーザ情報取得API【エラー】500
// Mock.mock(/api\/users\/login_user/, "get", () => ({
//   _status: 500,
//   transaction_id: "202",
//   result_code: "400",
//   result_message: "Bad Reuest",
//   redirect_url: "/usp/",
// }));

// (ユーザ登録用)ユーザ所属企業一覧取得API
Mock.mock(
  /\/users\/(\d+)\/companies\/list\?manageable_only=true/,
  "get",
  () => {
    return companiesListAPI;
  },
);

// アプリ一覧取得API(検索用)
Mock.mock(/\/services\/list\/users\/22/, "get", () => {
  return servicesListAPI;
});

//  ログインユーザ情報取得API
Mock.mock(/\/users\/login_user/, "get", () => {
  return loginUserAPI;
});

//  ログインユーザ情報取得API 【削除権限なし】
Mock.mock(/\/users\/login_user\/nodelete/, "get", () => {
  return loginUserNoDeleteAPI;
});
//  (ユーザ登録用)ユーザ所属企業一覧取得API
// companiesListAPIregist文件不存在
Mock.mock(
  /\/users\/(\d+)\/companies\/list\?manageable_only=true/,
  "get",
  () => {
    return companiesListAPI;
  },
);
//  COUNTRY一覧取得API
Mock.mock(/\/country\/list/, "get", () => {
  return countryList;
});
//  LANGUAGE一覧取得API
Mock.mock(/\/language\/list/, "get", () => {
  return languageList;
});
//  USER TYPE一覧取得API
Mock.mock(/\/usertype\/list/, "get", () => {
  return usertypeList;
});
//  (ユーザ検索用)ユーザ所属企業一覧取得API
Mock.mock(/\/users\/(\d+)\/companies\/list/, "get", () => {
  return companiesListAPI;
});
//  ユーザ所属企業一覧取得API【エラー】
Mock.mock(/\/error\/users\/(\d+)\/companies\/list/, "get", () => {
  return companiesListAPI;
});
//  ユーザ登録申請API
Mock.mock(/\/applications\/users/, "post", () => {
  return success;
});
//  ユーザ登録申請API【エラー】
Mock.mock(/\/error\/applications\/users/, "post", () => {
  return loginUserAPIerror;
});
//  ユーザ一覧取得API
// 含queries
Mock.mock(/\/users\/list/, "get", () => {
  return userList;
});
//  ユーザ一覧取得API【エラー】
// 含queries
Mock.mock(/\/error\/users\/list/, "get", () => {
  return loginUserAPIerror;
});
//  ユーザ情報取得API
Mock.mock(/\/users\/(\d+)\/detail/, "get", () => {
  return userDetail;
});
//  ユーザ情報取得API【エラー】
Mock.mock(/\/error\/users\/(\d+)\/detail/, "get", () => {
  return companiesListAPIerror;
});
//  ユーザ情報削除API
Mock.mock(/\/users\/(\d+)\/info/, "delete", () => {
  return success;
});
//  ユーザ削除API【エラー】
Mock.mock(/\/error\/users\/(\d+)/, "delete", () => {
  return companiesListAPIerror;
});
//  アプリ一覧取得API(検索用)
Mock.mock(/\/services\/list\/users\/(\d+)/, "get", () => {
  return servicesListAPI;
});
//  ロール一覧取得API(検索用)
Mock.mock(/\/roles\/list\/users\/1/, "get", () => {
  return appRoleList_RIGEL;
});
//  アプリ一覧取得API(アプリ利用登録用)
Mock.mock(/\/services\/list\/users\/22&company_id=1/, "get", () => {
  return servicesListAPI;
});
//  アプリ一覧取得API【エラー】
Mock.mock(/\/error\/services\/list/, "get", () => {
  return companiesListAPIerror;
});
//  登録可能USPロール一覧取得API
Mock.mock(
  /\/usp_roles\/company\/(\d+)\/service\/1\/user\/(\d+)\/registerable_list/,
  "get",
  () => {
    return uspRoleList_RIGEL;
  },
);

//  登録可能USPロール一覧取得API
Mock.mock(
  /\/usp_roles\/company\/(\d+)\/service\/2\/user\/(\d+)\/registerable_list/,
  "get",
  () => {
    return uspRoleList_CITRUS;
  },
);

//  登録可能USPロール一覧取得API
Mock.mock(
  /\/usp_roles\/company\/(\d+)\/service\/3\/user\/(\d+)\/registerable_list/,
  "get",
  () => {
    return uspRoleList;
  },
);
//  登録可能USPロール一覧取得API
Mock.mock(
  /\/usp_roles\/company\/(\d+)\/service\/4\/user\/(\d+)\/registerable_list/,
  "get",
  () => {
    return uspRoleList;
  },
);
//  登録可能USPロール一覧取得API
Mock.mock(
  /\/usp_roles\/company\/(\d+)\/service\/5\/user\/(\d+)\/registerable_list/,
  "get",
  () => {
    return uspRoleList;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/(\d+)\/registerable_list/,
  "get",
  () => {
    return appRoleList_RIGEL;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/12\/registerable_list/,
  "get",
  () => {
    return appRoleList_RIGEL;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/13\/registerable_list/,
  "get",
  () => {
    return appRoleList_RIGEL;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/21\/registerable_list/,
  "get",
  () => {
    return appRoleList_CITRUS;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/22\/registerable_list/,
  "get",
  () => {
    return appRoleList_CITRUS;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/23\/registerable_list/,
  "get",
  () => {
    return appRoleList_CITRUS;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/31\/registerable_list/,
  "get",
  () => {
    return appRoleList;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/32\/registerable_list/,
  "get",
  () => {
    return appRoleList;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/33\/registerable_list/,
  "get",
  () => {
    return appRoleList;
  },
);
//  登録可能アプリロール一覧取得API
Mock.mock(
  /\/app_roles\/company\/(\d+)\/usp_role\/34\/registerable_list/,
  "get",
  () => {
    return appRoleList;
  },
);

//  申請取り消しAPI
Mock.mock(/\/applications\/(\d+)\/cancel/, "post", () => {
  return success;
});
//  アプリ利用登録API
Mock.mock(/\/users\/(\d+)\/services/, "post", () => {
  return success;
});
// //  アプリ利用登録API【エラー】400
// Mock.mock(/\/users\/(\d+)\/services/, "post", () => ({
//   _status: 400,
//   transaction_id: "202",
//   result_code: "400",
//   result_message: "Bad Reuest",
//   redirect_url: "/usp/",
// }));
// //  アプリ利用登録API【エラー】401
// Mock.mock(/\/users\/(\d+)\/services/, "post", () => ({
//   _status: 401,
//   transaction_id: "202",
//   result_code: "401",
//   result_message: "unauthorized",
//   redirect_url: "/usp/",
// }));
// //  アプリ利用登録API【エラー】500
// Mock.mock(/\/users\/(\d+)\/services/, "post", () => ({
//   _status: 500,
//   transaction_id: "202",
//   result_code: "500",
//   result_message: "Internal Server Error",
//   redirect_url: "/usp/",
// }));
// //  アプリ利用登録API【エラー】135
// Mock.mock(/\/users\/(\d+)\/services/, "post", () => ({
//   _status: 500,
//   transaction_id: "202",
//   result_code: "135",
//   result_message: "Bad Request",
//   redirect_url: "/usp/",
// }));
// //  アプリ利用登録API【エラー】137
// Mock.mock(/\/users\/(\d+)\/services/, "post", () => ({
//   _status: 500,
//   transaction_id: "202",
//   result_code: "137",
//   result_message: "Bad Request",
//   redirect_url: "/usp/",
// }));
//  (× 申請承認ステータス更新API)申請中
Mock.mock(/\/applications\/(\d+)\/apply\/applying/, "post", () => {
  return success;
});
//  (× 申請承認ステータス更新API)承認
Mock.mock(/\/applications\/(\d+)\/apply\/approval/, "post", () => {
  return success;
});
//  (× 申請承認ステータス更新API)拒否
Mock.mock(/\/applications\/(\d+)\/apply\/reject/, "post", () => {
  return success;
});
//  申請情報一覧取得API（モード：applocant(申請)）
Mock.mock(/\/applications\/list\/mode\/applocant/, "get", () => {
  return applicationList_applicant;
});
//  申請情報一覧取得API（モード：authorizer(承認)）
Mock.mock(/\/applications\/list\/mode\/authorizer/, "get", () => {
  return applicationList_authorizer;
});
//  ユーザ申請情報取得API
Mock.mock(/\/applications\/(\d+)\/users/, "get", () => {
  return applicationDetail;
});
//  企業毎閾値変更リクエストAPI
Mock.mock(
  /\/company\/(\d+)\/usp_roles\/(\d+)\/limit\/additional_request/,
  "post",
  () => {
    return success;
  },
);

console.log("-----------------mock end-----------------");
