// Utilities
import { defineStore } from "pinia";

// app情報のストアー
export const useAppStore = defineStore("app", {
  state: () => ({
    overlay: false,
    showSnack: false,
    errorModal: false,
    showSnackPattern: "",
    statusCode: "",
    transactionId: "",
    resultMessage: "",
    redirectUrl: "",

    pagination: {
      page: 1,
      rowsPerPage: 5,
      sortBy: [
        { key: "companyName", order: "asc" },
        { key: "name", order: "asc" },
      ] as any,
      descending: false,
    },
    selectedSearchCompany: "",
    searchName: "",
    searchEmail: "",
    selectedSearchService: "",
    selectedSearchUsertype: "",
    show: false,
    usertype: false,
    showRolesTable: false,
    searching: false,
    userList: [],
    restoreflg: true,
  }),
  actions: {
    resetStore() {
      this.pagination = {
        page: 1,
        rowsPerPage: 5,
        sortBy: [
          { key: "companyName", order: "asc" },
          { key: "name", order: "asc" },
        ] as any,
        descending: false,
      };
      this.selectedSearchCompany = "";
      this.searchName = "";
      this.searchEmail = "";
      this.selectedSearchService = "";
      this.selectedSearchUsertype = "";
      this.show = false;
      this.usertype = false;
      this.showRolesTable = false;
      this.searching = false;
      this.userList = [];
      this.restoreflg = true;
    },
  },
});

// 画面業務情報のストアー
export const useBusinessStore = defineStore("businessStore", {
  state: () => ({
    // [{pageId:"xxx",content:{xx:"xx"}}...]
    contents: [],
  }),
  actions: {
    setContents(pageData: any) {
      let pos = -1;
      if (this.contents.length !== 0) {
        for (let i = 0; i < this.contents.length; i++) {
          if ((this.contents[i] as any).pageId === pageData.pageId) {
            pos = i;
            break;
          }
        }
      }
      if (pos !== -1 && this.contents) {
        (this.contents[pos] as any) = pageData;
      } else {
        (this.contents as any).push(pageData);
      }
    },
    getContents(pageId: string) {
      if (this.contents.length !== 0) {
        for (let i = 0; i < this.contents.length; i++) {
          if ((this.contents[i] as any).pageId === pageId) {
            return (this.contents[i] as any).content;
          }
        }
      }
      return undefined;
    },
    removeContents(pageId: string) {
      if (this.contents.length !== 0) {
        for (let i = 0; i < this.contents.length; i++) {
          if ((this.contents[i] as any).pageId === pageId) {
            this.contents.splice(i, 1);
          }
        }
      }
    },
  },
});
