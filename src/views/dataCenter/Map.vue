<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>能耗地图</span>
    </div>
    <div class="text item">
      <div id="Map" style="width: 100%;height: 400px"></div>
    </div>
  </el-card>

</template>

<script>
import {getEmissionPercent} from "@/api/dtct/dataCenter";

export default {
  name: "Map",
  mounted() {
    this.initEchart();
  },
  methods: {
    getData() {
      return new Promise((resolve, reject) => {
        getEmissionPercent().then(response => {
          resolve(response.data)
        });
      })
    },
    initEchart() {
      let data = this.getData()
      data.then(res => {

        let officeConsume = res[0].totalOfficePowerConsume + res[0].totalOfficeWaterConsume;
        let prdConsume = res[0].totalPowerConsume + res[0].totalWaterConsume;
        let myChart = this.$echarts.init(document.getElementById('Map'));

        let option = {
          tooltip: {
            trigger: 'item',
            show: true
          },
          series: [
            {
              type: 'treemap',
              data: [
                {
                  "value": officeConsume,
                  "name": "办公能耗",
                  "children": [
                    {
                      "value": res[0].totalOfficePowerConsume,
                      "name": "办公耗电量",
                    },
                    {
                      "value": res[0].totalOfficeWaterConsume,
                      "name": "办公用水量",
                    }
                  ]
                },
                {
                  "value": prdConsume,
                  "name": "生产能耗",
                  "children": [
                    {
                      "value": res[0].totalPowerConsume,
                      "name": "生产耗电量",
                    },
                    {
                      "value": res[0].totalWaterConsume,
                      "name": "生产耗水量",
                    },
                  ]
                }
              ]
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
