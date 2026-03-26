<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>能耗总览</span>
    </div>
    <div class="text item">
      <el-row :gutter="80">
        <el-col :span="6">
          <div class="card-info" style="background: #61ceec;">
            <span>今日总能耗</span>
            <h1>{{overviewData.todayEnergy}}Kg</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-info" style="background: #f7b018;">
            <span>本月总能耗</span>
            <h1>{{ overviewData.monthEnergy }}Kg</h1>
          </div>

        </el-col>
        <el-col :span="6">
          <div class="card-info" style="background: #fa846b;">
            <span>本年总能耗</span>
            <h1>{{ overviewData.yearEnergy }}Kg</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-info" style="background: #2ab876;">
            <span>本年总减排</span>
            <h1>{{ overviewData.yearEmissionReduction }}Kg</h1>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import {productPowerReportByDay, productPowerReportByMonth, productPowerReportByYear} from "@/api/dtct/dataCenter";

export default {
  name: "Overview",
  data() {
    return {
      overviewData: {
        todayEnergy:0,
        monthEnergy:0,
        yearEnergy:0,
        yearEmissionReduction:0,
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      productPowerReportByDay(null).then(res => {
        let rows = res.rows;
        if (rows && rows.length > 0) {
          this.overviewData.todayEnergy = rows[0].totalCarbonEmission;
        }
      })
      productPowerReportByMonth(null).then(res => {
        let rows = res.rows;
        if (rows && rows.length > 0) {
          this.overviewData.monthEnergy = rows[0].totalCarbonEmission;
        }
      })
      productPowerReportByYear(null).then(res => {
        let rows = res.rows;
        if (rows && rows.length > 0) {
          this.overviewData.yearEnergy = rows[0].totalCarbonEmission;
          this.overviewData.yearEmissionReduction = rows[0].totalCarbonSave;
        }
      })
    }
  }
}
</script>

<style scoped>
.item span {
  font-size: 20px;
}

.item h1 {
  font-size: 32px;
  font-weight: bold;
  line-height: 15px;
}

.card-info {
  padding: 20px;
  color: #fff;
  border-radius: 10px;
  height: 120px;
}
</style>
