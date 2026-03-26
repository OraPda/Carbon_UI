<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>耗能占比</span>
    </div>
    <div class="text item">
      <div id="Proportion" style="width: 100%;height: 400px"></div>
    </div>
  </el-card>

</template>

<script>
import {getEmissionPercent,} from "@/api/dtct/dataCenter";

export default {
  name: "Proportion",
  mounted(){
    this.initEchart();
  },
  methods:{
    getData() {
      return new Promise((resolve, reject) => {
        getEmissionPercent().then(response => {
          resolve(response.data)
        });
      })
    },
    initEchart(){
      let data = this.getData()
      data.then( res => {
        let totalPowerConsume = res[0].totalPowerConsume
        let totalOfficePowerConsume = res[0].totalOfficePowerConsume
        let totalWaterConsume = res[0].totalWaterConsume
        let totalOfficeWaterConsume = res[0].totalOfficeWaterConsume
        let myChart = this.$echarts.init(document.getElementById('Proportion'));

        let option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '能耗占比',
              type: 'pie',
              radius: '50%',
              data: [
                { value: totalPowerConsume, name: '生产耗电量' },
                { value: totalOfficePowerConsume, name: '办公耗电量' },
                { value: totalWaterConsume, name: '生产耗水量' },
                { value: totalOfficeWaterConsume, name: '办公耗水量' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
