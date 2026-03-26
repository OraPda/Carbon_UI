<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeManufactureDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collectionList">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="已产数量" align="center" prop="producedQuantity" />
      <el-table-column label="单位耗电量" align="center" prop="unitPowerConsumption" />
      <el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
      <el-table-column label="单位碳排放" align="center" prop="carbonEmission"/>
      <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {listDevicePowerReport, listDevicePowerReportByDay} from "@/api/dtct/dataCenter";

export default {
  name: "Collection",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智造双碳—双碳管理—能耗数据采集表格数据
      collectionList: [],
      // 生产时间范围
      daterangeManufactureDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        createDate: null
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智造双碳—双碳管理—能耗数据采集列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeManufactureDate && '' != this.daterangeManufactureDate) {
        this.queryParams.params["beginManufactureDate"] = this.daterangeManufactureDate[0];
        this.queryParams.params["endManufactureDate"] = this.daterangeManufactureDate[1];
      }
      listDevicePowerReport(this.queryParams).then(response => {
        this.collectionList = response.rows;
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
      this.daterangeManufactureDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('carbonReport/devicePowerDetails/export', {
        ...this.queryParams
      }, `collection_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
