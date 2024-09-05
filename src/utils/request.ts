import { envConstants } from "@/constants/envConstants";
import axios from "axios";

const CONTENT_TYPE_JSON = "application/json;charset=UTF-8";
const CONTENT_TYPE_FORM_DATA = "multipart/form-data";

const request = axios.create({
  baseURL: envConstants().base_url,
  timeout: 120000, // WEB端末の応答タイムアウト時間
});

request.interceptors.request.use(
  (config: any) => {
    showLoading();
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: any) => {
    hideLoading();
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error: any) => {
    hideLoading();
    return Promise.reject(error);
  },
);

/**
 * 認証情報を付けるHttp連動.
 * @param {String} url リクエストのURL
 * @param {Object} jsonData リクエストのパラメータ
 * @param {Object} method 参照定数HTTP_METHOD_*
 *
 * @returns {Promise}
 */
const requestWithAuth = (url: string, jsonData: any, method: string) => {
  request.defaults.headers.post["Content-Type"] = CONTENT_TYPE_JSON;

  if (method === "get") {
    return request.get(url, {
      params: jsonData,
    });
  } else if (method === "delete") {
    return request.delete(url, {
      params: jsonData,
    });
  } else if (method === "get_blob" || method === "get_blob_pdf") {
    return request.get(url, {
      params: jsonData,
      responseType: "blob",
    });
  } else if (method === "post_blob") {
    return request.post(url, jsonData, {
      responseType: "blob",
    });
  } else if (method === "post_form") {
    request.defaults.headers.post["Content-Type"] = CONTENT_TYPE_FORM_DATA;
    return request.post(url, jsonData);
  } else {
    return request.post(url, jsonData);
  }
};

/**
 * Http連動テンプレート.
 * @param {String} url リクエストのURL
 * @param {Object} jsonData リクエストのパラメータ
 * @param {Object} method 参照定数
 *
 * @returns {Promise}
 */
const requestTemplate = (url: string, jsonData: any, method: string) => {
  return new Promise((resolve, reject) => {
    requestWithAuth(url, jsonData, method)
      .then((response: any) => {
        // レスポンス中に、業務に関連するデータだけを呼び出す元に報告
        resolve(response);
      })
      .catch((error: any) => {
        // アプリ利用登録API以外
        if (!url.match(/\/users\/(\d+)\/services/)) {
          const appStore = useAppStore();
          if (error.response) {
            if (error.response.status === 400) {
              appStore.showSnackPattern = "badrequest";
              appStore.showSnack = true;
            } else if (error.response.status === 401) {
              appStore.redirectUrl = error.response.data.redirect_url;
              appStore.showSnackPattern = "unauthorized";
              appStore.errorModal = true;
            } else {
              appStore.showSnackPattern = "systemerror_code_id";
              appStore.showSnack = true;
            }
            appStore.statusCode = error.response.status;
            // appStore.resultCode = error.response.data.result_code;
            appStore.resultMessage = error.response.data.result_message;
            appStore.transactionId = error.response.data.transaction_id;
          } else {
            appStore.showSnackPattern = "systemerror";
            appStore.showSnack = true;
          }
          reject(error);
        } else {
          reject(error);
        }
      });
  });
};

/**
 * Get方式のAjaxインタフェース.
 * @param {String} url リクエストのURL
 * @param {Object} jsonData リクエストのパラメータ
 *
 * @returns {Promise}
 */
export function axiosGet(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "get");
}

export function axiosDelete(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "delete");
}

export function axiosPost(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "post");
}

export function axiosGetPDF(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "get_blob_pdf");
}

export function axiosPostCsv(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "post_blob");
}
export function axiosPostForm(url: string, jsonData: any) {
  return requestTemplate(url, jsonData, "post_form");
}

let requestCount = 0;

function showLoading() {
  if (requestCount === 0) {
    const appStore = useAppStore();
    appStore.overlay = true;
  }
  requestCount++;
}

function hideLoading() {
  requestCount--;
  if (requestCount <= 0) {
    const appStore = useAppStore();
    appStore.overlay = false;
  }
}
