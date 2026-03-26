<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>产品能耗排行</span>
    </div>
    <div class="text item">
      <el-table ref="wgzp" :data="tableData"  class="overTable">
        <el-table-column label="排名" type="index" align="center" width="50" />
        <el-table-column label="产品" align="center" prop="materialName" />
        <el-table-column label="已产数量" align="center" prop="producedQuantity" />
        <el-table-column label="单位耗电量" align="center" prop="unitPowerConsumption" />
        <el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
        <el-table-column label="单位碳排放" align="center" prop="carbonEmission" :formatter="carbonEmissionFormat"/>
        <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission" :formatter="totalCarbonEmissionFormat"/>
      </el-table>
    </div>
  </el-card>
</template>

<script>

import { productPowerReportOverall} from "@/api/dtct/dataCenter";

export default {
  name: "Product",
  data(){
    return{
      tableData:[]
    }
  },
  mounted() {
    this.getData()
  },
  methods:{
    getData() {
      productPowerReportOverall().then(response => {
        this.tableData = response.rows
      })
    },
    totalCarbonEmissionFormat(row,column){
      return row.totalCarbonEmission.toFixed(2);
    },
    carbonEmissionFormat(row,column){
      return row.carbonEmission.toFixed(2);
    },
  },
}
</script>

<style lang="scss">
</style>
