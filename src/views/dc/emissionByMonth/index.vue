<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="月份">
        <el-date-picker v-model="daterangeProductMonth" size="small" style="width: 240px" unlink-panels type="monthrange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="productPowerReportList">
      <el-table-column label="月份" align="center" prop="productMonth" width="180" />
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
import { productPowerReportByMonth } from "@/api/dtct/dataCenter";

export default {
  name: "emissionByMonth",
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
      // 月度能耗表格数据
      productPowerReportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 生产日期时间范围
      daterangeProductMonth: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
    /** 查询月度碳排放列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeProductMonth && '' != this.daterangeProductMonth) {
        this.queryParams.params["beginManufactureDate"] = this.daterangeProductMonth[0];
        this.queryParams.params["endManufactureDate"] = this.daterangeProductMonth[1];
      }
      productPowerReportByMonth(this.queryParams).then(response => {
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
      this.daterangeProductMonth = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {

    }
  }
};
</script>
