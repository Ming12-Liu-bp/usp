// demo
export const envConstants = () => {
  if (import.meta.env.VITE_APP_ENV === "production") {
    return {
      okta_target: [3, 608, 602, 603, 605, 601, 607, 604, 606], // 88, 602,603,605,601,607,604,606
      base_url: "../api",
      hidden: [], // RIGEL:"app002" USP上で割り当てさせたくない場合は配列内にサービスIDを記載すること
      default_language: { name: "English", id: "2" },
      system_admin: "0",
      organization_admin: "1",
      user: "2",
      bpp_windows: "3",
      sie_id: "3",
      rigel_id: "app002",
      citrus_id: "app01201",
      nttdata_id: "78", // 78:NTTD 3:SIE
      rigel_model_role: "21001",
      rigel_product: "21003",
      rigel_site: "21004",
      // Model Role
      noaccess: "21336",
      mrfull: "21001",
      mr01: "21002",
      mr02: "21003",
      mr03: "21004",
      mr04: "21005",
      mr05: "21006",
      mr06: "21007",
      mr07: "21008",
      mr08: "21009",
      mr09: "21010",
      mr10: "21011",
      mr11: "21012",
      mr18: "21013",
      mr19: "21014",
      mr20: "21015",
      mr21: "21016",
      mr22: "21017",
      mr23: "21018",
      mr24: "21019",
      mr25: "21020",
      mr26: "21021",
      mr27: "21022",
      mr29: "21023",
      mr30: "21024",
      mr31: "21025",
      mr32: "21026",
      mr33: "21027",
      mr34: "21028",
      mr35: "21029",
      mr36: "21030",
      mr37: "21031",
      mr38: "21032",
      mr39: "21033",
      mr40: "21034",
      mr41: "21035",
      mr42: "21036",
      mr43: "21037",
      mr44: "21038",
      mr45: "21039",
      // Product
      allpro: "23999", // All Product
      common: "23020", // COMMON
      ds4: "23004", // DS4
      ps5hdc: "23010", // PS5 HD Camera
      ds: "23009", // DualSense
      pscam: "23006", // PS Camera
      psmove: "23007", // PS Move
      psvr: "23005", // PS VR
      ps4: "23001", // PS4
      ps5: "23008", // PS5
      dscs: "23011", // DualSense Charging Station
      ps5ca: "23012", // PS5 Camera Adaptor
      ps5mr: "23013", // PS5 Media Remote
      ps5wh: "23014", // PS5 Wireless Headset
      vr2: "23015", // PS VR2
      vr2c: "23016", // PS VR2 Controller
      dse: "23022", // DualSense Edge
      dsersm: "23023", // DualSense Edge Replacement stick module
      vr2ccs: "23019", // PS VR2 Controller Charging Station
      ps5d: "23024", // PS5 Drive
      ps5sp: "23021", // PS5 Server PWBA
      // Site
      allsite: "24999", // All Site
      foxgz: "24005", // FOX-GZ
      foxmy: "24007", // FOX-MY
      foxsk: "24008", // FOX-SK
      foxyt: "24004", // FOX-YT
      goerrc: "24010", // GOER-RC
      goervn: "24009", // GOER-VN
      goerwf: "24006", // GOER-WF
      pegasz: "24003", // PEGA-SZ
      skz: "24001", // SKZ
      unalloc: "24100", // UN_ALLOC
      nittsusz: "24012", // アプリロールID割り当て後要改修 NITTSU-SZ
      nittsuyt: "24011", // アプリロールID割り当て後要改修 NITTSU-YT
    };
  } else if (import.meta.env.VITE_APP_ENV === "local") {
    return {
      okta_target: [1, 2],
      base_url: "http://localhost:8090",
      hidden: [],
      default_language: { name: "English", id: "2" },
      system_admin: "0",
      organization_admin: "1",
      user: "2",
      bpp_windows: "3",
      sie_id: "1",
      rigel_id: "1",
      citrus_id: "2",
      nttdata_id: "1",
      rigel_model_role: "1",
      rigel_product: "3",
      rigel_site: "4",
      // ModelRole
      noaccess: "0",
      mrfull: "1",
      mr01: "2",
      mr02: "3",
      mr03: "4",
      mr04: "5",
      mr05: "6",
      mr06: "7",
      mr07: "8",
      mr08: "9",
      mr09: "10",
      mr10: "11",
      mr11: "12",
      mr18: "13",
      mr19: "14",
      mr20: "15",
      mr21: "16",
      mr22: "17",
      mr23: "18",
      mr24: "19",
      mr25: "20",
      mr26: "21",
      mr27: "22",
      mr29: "23",
      mr30: "24",
      mr31: "25",
      mr32: "26",
      mr33: "27",
      mr34: "28",
      mr35: "29",
      mr36: "30",
      mr37: "31",
      mr38: "32",
      mr39: "33",
      mr40: "34",
      mr41: "35",
      mr42: "36",
      mr43: "37",
      mr44: "38",
      mr45: "39",
      // Product
      allpro: "31",
      common: "32",
      ds4: "33",
      ps5hdc: "34",
      ds: "35",
      pscam: "36",
      psmove: "37",
      psvr: "38",
      ps4: "39",
      ps5: "40",
      dscs: "21370",
      ps5ca: "21371",
      ps5mr: "21372",
      ps5wh: "21373",
      vr2: "21375",
      vr2c: "21376",
      dse: "21392",
      dsersm: "21393",
      vr2ccs: "99999", // アプリロールID割り当て後要改修
      ps5d: "99999", // アプリロールID割り当て後要改修
      ps5sp: "21389",
      // Site
      allsite: "51",
      foxgz: "52",
      foxmy: "53",
      foxsk: "54",
      foxyt: "55",
      goerrc: "21368",
      goervn: "56",
      goerwf: "57",
      pegasz: "58",
      skz: "59",
      unalloc: "60",
      nittsusz: "99999", // アプリロールID割り当て後要改修
      nittsuyt: "99999", // アプリロールID割り当て後要改修
    };
  } else if (import.meta.env.VITE_APP_ENV === "staging") {
    return {
      okta_target: [921, 922, 722, "SGMO_dev"],
      base_url: "../api",
      hidden: [],
      default_language: { name: "English", id: "2" },
      system_admin: "0",
      organization_admin: "1",
      user: "2",
      bpp_windows: "3",
      sie_id: "722",
      rigel_id: "app002",
      citrus_id: "app01202",
      nttdata_id: "125", // 125:NTTD 126:CCS 722:SIE
      rigel_model_role: "21001",
      rigel_product: "21003",
      rigel_site: "21004",
      // Model Role
      noaccess: "21336",
      mrfull: "21001",
      mr01: "21002",
      mr02: "21003",
      mr03: "21004",
      mr04: "21005",
      mr05: "21006",
      mr06: "21007",
      mr07: "21008",
      mr08: "21009",
      mr09: "21010",
      mr10: "21011",
      mr11: "21012",
      mr18: "21013",
      mr19: "21014",
      mr20: "21015",
      mr21: "21016",
      mr22: "21017",
      mr23: "21018",
      mr24: "21019",
      mr25: "21020",
      mr26: "21021",
      mr27: "21022",
      mr29: "21023",
      mr30: "21024",
      mr31: "21025",
      mr32: "21026",
      mr33: "21027",
      mr34: "21028",
      mr35: "21029",
      mr36: "21030",
      mr37: "21031",
      mr38: "21032",
      mr39: "21033",
      mr40: "21034",
      mr41: "21035",
      mr42: "21036",
      mr43: "21037",
      mr44: "21038",
      mr45: "21039",
      // Product
      allpro: "23999", // All Product
      common: "23020", // COMMON
      ds4: "23004", // DS4
      ps5hdc: "23010", // PS5 HD Camera
      ds: "23009", // DualSense
      pscam: "23006", // PS Camera
      psmove: "23007", // PS Move
      psvr: "23005", // PS VR
      ps4: "23001", // PS4
      ps5: "23008", // PS5
      dscs: "23011", // DualSense Charging Station
      ps5ca: "23012", // PS5 Camera Adaptor
      ps5mr: "23013", // PS5 Media Remote
      ps5wh: "23014", // PS5 Wireless Headset
      vr2: "23015", // PS VR2
      vr2c: "23016", // PS VR2 Controller
      dse: "23022", // DualSense Edge
      dsersm: "23023", // DualSense Edge Replacement stick module
      vr2ccs: "23019", // PS VR2 Controller Charging Station
      ps5d: "23024", // PS5 Drive
      ps5sp: "23021", // PS5 Server PWBA
      // Site
      allsite: "24999", // All Site
      foxgz: "24005", // FOX-GZ
      foxmy: "24007", // FOX-MY
      foxsk: "24008", // FOX-SK
      foxyt: "24004", // FOX-YT
      goerrc: "24010", // GOER-RC
      goervn: "24009", // GOER-VN
      goerwf: "24006", // GOER-WF
      pegasz: "24003", // PEGA-SZ
      skz: "24001", // SKZ
      unalloc: "24100", // UN_ALLOC
      nittsusz: "24012", // NITTSU-SZ
      nittsuyt: "24011", // NITTSU-YT
    };
  } else {
    return {
      okta_target: [51, "SGMO_dev"],
      base_url: "../api",
      hidden: [], // RIGEL:app002
      default_language: { name: "English", id: "2" },
      system_admin: "0",
      organization_admin: "1",
      user: "2",
      bpp_windows: "3",
      sie_id: "51",
      rigel_id: "app002",
      citrus_id: "app010",
      nttdata_id: "49", // 49:NTTD 50:CCS 51:SIE
      rigel_model_role: "21001",
      rigel_product: "21003",
      rigel_site: "21004",
      // Model Role
      noaccess: "21336",
      mrfull: "21001",
      mr01: "21002",
      mr02: "21003",
      mr03: "21004",
      mr04: "21005",
      mr05: "21006",
      mr06: "21007",
      mr07: "21008",
      mr08: "21009",
      mr09: "21010",
      mr10: "21011",
      mr11: "21012",
      mr18: "21013",
      mr19: "21014",
      mr20: "21015",
      mr21: "21016",
      mr22: "21017",
      mr23: "21018",
      mr24: "21019",
      mr25: "21020",
      mr26: "21021",
      mr27: "21022",
      mr29: "21023",
      mr30: "21024",
      mr31: "21025",
      mr32: "21026",
      mr33: "21027",
      mr34: "21028",
      mr35: "21029",
      mr36: "21030",
      mr37: "21031",
      mr38: "21032",
      mr39: "21033",
      mr40: "21034",
      mr41: "21035",
      mr42: "21036",
      mr43: "21037",
      mr44: "21038",
      mr45: "21039",
      // Product
      allpro: "21131",
      common: "21132",
      ds4: "21133",
      ps5hdc: "21134",
      ds: "21135",
      pscam: "21136",
      psmove: "21137",
      psvr: "21138",
      ps4: "21139",
      ps5: "21140",
      dscs: "21370",
      ps5ca: "21371",
      ps5mr: "21372",
      ps5wh: "21373",
      vr2: "21375",
      vr2c: "21376",
      dse: "21392",
      dsersm: "21393",
      vr2ccs: "99999", // アプリロールID割り当て後要改修
      ps5d: "99999", // アプリロールID割り当て後要改修
      ps5sp: "21389",
      // Site
      allsite: "21141",
      foxgz: "21142",
      foxmy: "21143",
      foxsk: "21144",
      foxyt: "21145",
      goerrc: "21368",
      goervn: "21146",
      goerwf: "21147",
      pegasz: "21148",
      skz: "21149",
      unalloc: "21150",
      nittsusz: "99999", // アプリロールID割り当て後要改修
      nittsuyt: "99999", // アプリロールID割り当て後要改修
    };
  }
};
