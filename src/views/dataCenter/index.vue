<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
<!--        能耗总览-->
        <Overview />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
<!--        设备能耗排行-->
        <Equipment />
      </el-col>
      <el-col :span="12">
<!--        产品能耗排行-->
        <Product />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
<!--        综合能耗-->
        <Synthetical />
      </el-col>
      <el-col :span="12">
<!--        耗能占比-->
        <Proportion />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
<!--        能耗地图-->
        <Map />
      </el-col>
      <el-col :span="12">
<!--        能耗趋势-->
        <Trend />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Overview from "@/views/dataCenter/Overview.vue";
import Equipment from "@/views/dataCenter/Equipment.vue";
import Product from "@/views/dataCenter/Product.vue";
import Synthetical from "@/views/dataCenter/Synthetical.vue";
import Proportion from "@/views/dataCenter/Proportion.vue";
import Map from "@/views/dataCenter/Map.vue";
import Trend from "@/views/dataCenter/Trend.vue";
export default {
  name: "index",
  components: {Overview, Equipment, Product, Synthetical, Proportion, Map, Trend },
  data() {
    return {

    }
  },
  created(){
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
.app-container{
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
