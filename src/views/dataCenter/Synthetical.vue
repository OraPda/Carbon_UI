<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>综合能耗</span>
    </div>
    <div class="text item">
      <div id="ringlike" style="width: 100%;height: 400px"></div>
    </div>
  </el-card>

</template>

<script>
import {getEmissionOverall} from "@/api/dtct/dataCenter";

export default {
  name: "Synthetical",
  mounted(){
    this.initEchart();
  },
  methods:{
    getData() {
      return new Promise((resolve, reject) => {
        getEmissionOverall().then(response => {
          resolve(response.data)
        });
      })
    },
    initEchart(){
      let data = this.getData()
      data.then( res => {
        let date = []
        let totalPowerConsume = []
        let totalWaterConsume = []
        let totalOfficePowerConsume = []
        let totalOfficeWaterConsume = []
        let totalPrdPowerSave = []
        for (let year in res) {
          let obj = res[year];
          date.push(year)
          totalPowerConsume.push(obj.totalPowerConsume);
          totalWaterConsume.push(obj.totalWaterConsume);
          totalOfficePowerConsume.push(obj.totalOfficePowerConsume);
          totalOfficeWaterConsume.push(obj.totalOfficeWaterConsume);
          totalPrdPowerSave.push(obj.totalProductPowerSave + obj.totalOfficePowerSave);
        }
        let myChart = this.$echarts.init(document.getElementById('ringlike'));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            show: true,
            top: "6%"
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: date
          },
          series: [
            {
              name: '生产耗电量',
              type: 'bar',
              data: totalPowerConsume
            },
            {
              name: '生产用水量',
              type: 'bar',
              data: totalWaterConsume
            },
            {
              name: '办公耗电量',
              type: 'bar',
              data: totalOfficePowerConsume
            },
            {
              name: '办公用水量',
              type: 'bar',
              data: totalOfficeWaterConsume
            },
            {
              name: '节点量',
              type: 'bar',
              data: totalPrdPowerSave
            }
          ]
        };

        option && myChart.setOption(option);
      })

    }
  }
}
</script>

<style scoped>

</style>
