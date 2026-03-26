<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>能耗趋势</span>
    </div>
    <div class="text item">
      <div id="Trend" style="width: 100%;height: 400px"></div>
    </div>
  </el-card>

</template>

<script>
import {getEmissionOverall} from "@/api/dtct/dataCenter";

export default {
  name: "Trend",
  mounted() {
    this.initEchart();
  },
  methods: {
    getData() {
      return new Promise((resolve, reject) => {
        getEmissionOverall().then(response => {
          resolve(response.data)
        });
      })
    },
    initEchart() {
      let data = this.getData()
      data.then( res => {
        let date = []
        let totalCarbonEmission = []
        let totalCarbonSave = []

        for (let year in res) {
          let obj = res[year];
          date.push(year)
          totalCarbonEmission.push(obj.totalCarbonEmission);
          totalCarbonSave.push(obj.totalCarbonSave);

        }

        let myChart = this.$echarts.init(document.getElementById('Trend'));

        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['碳排放量', '碳减排量'],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value',
            name: '能耗值'
          },
          series: [
            {
              name: '碳排放量',
              type: 'line',
              stack: 'Total',
              // tooltip: {
              //   valueFormatter: function (value) {
              //     return value + 'kg';
              //   }
              // },
              data: totalCarbonEmission
            },
            {
              name: '碳减排量',
              type: 'line',
              stack: 'Total',
              // tooltip: {
              //   valueFormatter: function (value) {
              //     return value + 'kg';
              //   }
              // },
              data: totalCarbonSave
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
