<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="年份">
        <el-date-picker v-model="queryParams.params.beginManufactureDate" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="year" placeholder="选择开始年份"></el-date-picker>
        -
        <el-date-picker v-model="queryParams.params.endManufactureDate" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="year" placeholder="选择结束年份"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="productPowerReportList">
      <el-table-column label="年份" align="center" prop="productYear" width="180">
      </el-table-column>
      <el-table-column label="生产总耗电量" align="center" prop="totalPowerConsume" />
      <el-table-column label="生产总用水量" align="center" prop="totalWaterConsume" />
      <el-table-column label="生产总节电量" align="center" prop="totalProductPowerSave" />
      <el-table-column label="办公总用水量" align="center" prop="totalOfficeWaterConsume" />
      <el-table-column label="办公总耗电量" align="center" prop="totalOfficePowerConsume" />
      <el-table-column label="办公总节电量" align="center" prop="totalOfficePowerSave" />
      <el-table-column label="碳排放总量" align="center" prop="totalCarbonEmission" :formatter="carbonEmissionFormater"/>
      <el-table-column label="减少碳排放总量" align="center" prop="totalCarbonSave" :formatter="totalCarbonSaveFormater"/>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { productPowerReportByYear } from "@/api/dtct/dataCenter";

export default {
  name: "emissionByYear",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 年度碳排放表格数据
      productPowerReportList: [],
      // 生产日期时间范围
      daterangeProductYear: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        params: {
          beginProductYear: '',
          endProductYear: '',
        }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    totalCarbonSaveFormater(row,column){
      return row.totalCarbonSave.toFixed(2);
    },
    carbonEmissionFormater(row,column){
      return row.totalCarbonEmission.toFixed(2);
    },
    /** 查询年度碳排放列表 */
    getList() {
      this.loading = true;
      productPowerReportByYear(this.queryParams).then(response => {
        this.productPowerReportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeProductYear = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {

    }
  }
};
</script>
