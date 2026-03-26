<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="title">
        <el-select placeholder="请选择" v-model="queryParams.customId" clearable>
          <el-option v-for="item in customList"
            :key="item.id"
            :label="item.customName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="contractYear">
        <el-date-picker
          v-model="queryParams.contractYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="getData(0)"
        >季度统计
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="getData(1)"
        >月份统计
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="orderList"  v-loading="loading">
      <el-table-column label="季度/月份" align="center" prop="contractQuarter" v-if="type == 0"></el-table-column>
      <el-table-column label="季度/月份" align="center" prop="contractMonth" v-else></el-table-column>
      <el-table-column label="客户名称" align="center" prop="customName"/>
      <el-table-column label="合同金额" align="center" prop="totalAmount"/>
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
import {listCustomList,customBillByQuarter,customBillByMonth} from "@/api/scm/custom";
export default {
  name: "ClientBill",
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      orderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractYear: null,
        customId: null,
      },
      customList:null,
      type : 0,
      // 总条数
      total: 0,
      loading : true
    };
  },
  created() {
    this.getList();
    this.getCustom()
  },
  methods: {
    // 获取客户列表
    getCustom() {
      listCustomList().then(response => {
        this.customList = response.data;
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      if(this.type == 0){
        customBillByQuarter(this.queryParams).then(res=>{
          this.orderList = res.rows;
          this.total = res.total;
        })
      }else{
        customBillByMonth(this.queryParams).then(res=>{
          this.orderList = res.rows;
          this.total = res.total;
        })
      }
      this.loading = false;
    },
    // 季度统计/月份统计按钮
    getData(type) {
        this.type = type;
        this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {}
      this.handleQuery();
    }
  }
};
</script>
