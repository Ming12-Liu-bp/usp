// 例: formatUrl(demoParamsAPi, { name: "Alice", day: "Monday" })
export function formatUrl(
  template: string,
  data: { [key: string]: string },
): string {
  return template.replace(/{(\w+)}/g, (match, key) => data[key] || match);
}

// ログインユーザ情報取得API
export const loginUserAPi = "/users/login_user";

// 企業毎閾値変更リクエストAPI
export const limitChangeParamsAPi =
  "/company/{company_id}/usp_roles/{usp_role_id}/limit/additional_request";

// ユーザ一覧取得API
export const userListAPi = "/users/list";

// ユーザ情報取得API
export const userDetailParamsAPi = "/users/{userId}/detail";

// アプリ一覧取得API(検索用)
export const servicesListParamsAPi = "/services/list/users/{userId}";

// 登録可能USPロール一覧取得API
export const uspRoleListParamsAPi =
  "/usp_roles/company/{company_id}/service/{service_id}/user/{user_id}/registerable_list";

// 登録可能アプリロール一覧取得API
export const appRoleListParamsAPi =
  "/app_roles/company/{company_id}/usp_role/{usp_role_id}/registerable_list";

// アプリ利用登録API
export const userServicesListParamsAPi = "/users/{user_id}/services";

// 登録可能企業一覧取得API
export const companiesListAPi =
  "/users/{userId}/companies/list?manageable_only=true";

// COUNTRY一覧取得API
export const countryListAPi = "/country/list";

// LANGUAGE一覧取得API
export const languageListAPi = "/language/list";

//  ユーザ登録申請API
export const applicationsUsersAPi = "/applications/users";

//  ユーザ登録申請API
export const companiesListForSearchAPi = "/users/{userId}/companies/list";

//  ユーザ削除API
export const delUserAPi = "/users/{userId}/info";
