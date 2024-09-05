<template>
  <div>
    <v-main>
      <v-card class="usp-main-card" elevation="8">
        <v-card-title class="usp-main-card-title">
          <strong>RIGEL roles table</strong>
        </v-card-title>
        <div class="usp-div-table">
          <vxe-table
            border="none"
            class="usp-table"
            :column-config="{ resizable: true }"
            :data="getItems"
            :edit-config="{
              trigger: 'click',
              mode: 'cell',
              showIcon: false,
            }"
            empty-text=" "
            :header-row-style="{ height: 40 }"
            height="496"
            :keyboard-config="{ isArrow: true }"
            :mouse-config="{ selected: true }"
            :row-config="{ height: 40 }"
            show-header-overflow
            show-overflow
          >
            <vxe-column
              field="companyName"
              fixed="left"
              min-width="200"
              show-overflow="tooltip"
              title="Company name"
              width="200"
            />
            <vxe-column
              field="name"
              fixed="left"
              min-width="200"
              show-overflow="tooltip"
              title="Name"
              width="200"
            />
            <vxe-column
              field="email"
              min-width="250"
              show-overflow="tooltip"
              title="Mail address"
              width="250"
            />
            <vxe-column
              field="usertype"
              min-width="200"
              show-overflow="tooltip"
              title="User type"
              width="200"
            />
            <vxe-column
              field="modelRoleList.rigel"
              show-header-overflow="tooltip"
              show-overflow="tooltip"
              title="RIGEL"
              width="80"
            />
            <vxe-column
              field="modelRoleList.tristar"
              show-header-overflow="tooltip"
              show-overflow="tooltip"
              title="TRISTAR"
              width="80"
            />
            <vxe-column
              field="citrus"
              show-header-overflow="tooltip"
              show-overflow="tooltip"
              title="CITRUS"
              width="80"
            />

            <!-- Model Role -->
            <vxe-colgroup title="Model Role">
              <vxe-column
                field="modelRoleList.seisan"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="生産計画"
                width="80"
              />
              <vxe-column
                field="modelRoleList.jitatsu"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="自達"
                width="80"
              />
              <vxe-column
                field="modelRoleList.yuushou"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="有償支給"
                width="80"
              />
              <vxe-column
                field="modelRoleList.plp"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PLP_Maker"
                width="80"
              />
              <vxe-column
                field="modelRoleList.aroke"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="アロケ閲覧権限"
                width="80"
              />
            </vxe-colgroup>

            <!-- Product_List -->
            <vxe-colgroup title="Product_List">
              <vxe-column
                field="productList.allpro"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="All Product"
                width="80"
              />
              <vxe-column
                field="productList.common"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="COMMON"
                width="80"
              />
              <vxe-column
                field="productList.ds4"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="DS4"
                width="80"
              />
              <vxe-column
                field="productList.ps5hdc"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 HD Camera"
                width="80"
              />
              <vxe-column
                field="productList.ds"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="DualSense"
                width="80"
              />
              <vxe-column
                field="productList.pscam"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS Camera"
                width="80"
              />
              <vxe-column
                field="productList.psmove"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS Move"
                width="80"
              />
              <vxe-column
                field="productList.psvr"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS VR"
                width="80"
              />
              <vxe-column
                field="productList.ps4"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS4"
                width="80"
              />
              <vxe-column
                field="productList.ps5"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5"
                width="80"
              />
              <vxe-column
                field="productList.dscs"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="DualSense Charging Station"
                width="80"
              />
              <vxe-column
                field="productList.ps5ca"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 Camera Adaptor"
                width="80"
              />
              <vxe-column
                field="productList.ps5mr"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 Media Remote"
                width="80"
              />
              <vxe-column
                field="productList.ps5wh"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 Wireless Headset"
                width="80"
              />
              <vxe-column
                field="productList.vr2"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS VR2"
                width="80"
              />
              <vxe-column
                field="productList.vr2c"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS VR2 Controller"
                width="80"
              />
              <vxe-column
                field="productList.dse"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="DualSense Edge"
                width="80"
              />
              <vxe-column
                field="productList.dsersm"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="DualSense Edge Replacement stick module"
                width="80"
              />
              <vxe-column
                field="productList.vr2ccs"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS VR2 Controller Charging Station"
                width="80"
              />
              <vxe-column
                field="productList.ps5d"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 Drive"
                width="80"
              />
              <vxe-column
                field="productList.ps5sp"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PS5 Server PWBA"
                width="80"
              />
            </vxe-colgroup>

            <!-- Site -->
            <vxe-colgroup title="Site">
              <vxe-column
                field="siteList.allsite"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="All Site"
                width="80"
              />
              <vxe-column
                field="siteList.foxgz"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="FOX-GZ"
                width="80"
              />
              <vxe-column
                field="siteList.foxmy"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="FOX-MY"
                width="80"
              />
              <vxe-column
                field="siteList.foxsk"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="FOX-SK"
                width="80"
              />
              <vxe-column
                field="siteList.foxyt"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="FOX-YT"
                width="80"
              />
              <vxe-column
                field="siteList.goerrc"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="GOER-RC"
                width="80"
              />
              <vxe-column
                field="siteList.goervn"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="GOER-VN"
                width="80"
              />
              <vxe-column
                field="siteList.goerwf"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="GOER-WF"
                width="80"
              />
              <vxe-column
                field="siteList.pegasz"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="PEGA-SZ"
                width="80"
              />
              <vxe-column
                field="siteList.skz"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="SKZ"
                width="80"
              />
              <vxe-column
                field="siteList.unalloc"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="UN_ALLOC"
                width="80"
              />
              <vxe-column
                field="siteList.nittsusz"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="NITTSU-SZ"
                width="80"
              />
              <vxe-column
                field="siteList.nittsuyt"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                title="NITTSU-YT"
                width="80"
              />
            </vxe-colgroup>
          </vxe-table>
          <vxe-pager
            v-model:current-page="pageNum"
            v-model:page-size="parPage"
            v-model:total="total"
            class="usp-pager"
            :layouts="['Sizes', 'PrevPage', 'JumpNumber', 'NextPage']"
            :page-sizes="[
              { label: '10/page', value: 10 },
              { label: '20/page', value: 20 },
              { label: '50/page', value: 50 },
              { label: 'all', value: 999999 },
            ]"
            :pager-count="5"
          >
          </vxe-pager>
        </div>
        <v-row class="usp-button-row" justify="end" no-gutters>
          <v-card-actions>
            <v-btn
              class="ml-5 mr-5 mb-5 base-button-grey"
              width="200px"
              @click="downloadCSV()"
              >CSV Download</v-btn
            >
            <v-btn
              class="mr-5 ml-2 mb-5 base-button-grey"
              width="120px"
              @click="backbtn()"
              >Back</v-btn
            >
          </v-card-actions>
        </v-row>
      </v-card>
    </v-main>
  </div>
</template>
<script setup lang="ts">
import RIGELRolesTable from "./RIGELRolesTable";

const { pageNum, parPage, total, getItems, downloadCSV, backbtn } =
  RIGELRolesTable();
</script>
<style src="./RIGELRolesTable.css" scoped></style>
