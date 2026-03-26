<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="日期" prop="daterangeManufactureDate">
        <el-date-picker v-model="daterangeManufactureDate" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="equipmentPowerReportList">
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="日期" align="center" prop="manufactureDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.manufactureDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小时" align="center" prop="hour">
        <template slot-scope="scope">
          <span>{{ scope.row.hour }}点</span>
        </template>
      </el-table-column>
      <el-table-column label="耗电量" align="center" prop="totalPowerConsume" />
      <el-table-column label="碳排放" align="center" prop="carbonEmission" />
    </el-table>
<!--    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />-->
  </div>
</template>

<script>
import {listDevicePowerReportByHour} from "@/api/dtct/dataCenter";

export default {
  name: "energyByhour",
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
      // VIEW表格数据
      equipmentPowerReportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 生产日期时间范围
      daterangeManufactureDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询VIEW列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeManufactureDate && '' != this.daterangeManufactureDate) {
        this.queryParams.params["beginManufactureDate"] = this.daterangeManufactureDate[0];
        this.queryParams.params["endManufactureDate"] = this.daterangeManufactureDate[1];
      }
      listDevicePowerReportByHour(this.queryParams).then(response => {
        this.equipmentPowerReportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },


    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.queryParams.pageNum = 1;
          this.getList();
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeManufactureDate = []
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {

    }
  }
};
</script>
