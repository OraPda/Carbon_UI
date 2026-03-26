<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="供应商名称" prop="saleSupplierId">
        <el-select placeholder="请选择" v-model="queryParams.saleSupplierId">
          <el-option v-for="item in supplierList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"/>
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
    </el-row>

    <el-table :data="orderList" v-loading="loading">
      <el-table-column label="季度/月份" align="center" prop="contractQuarter" v-if="type == 0"></el-table-column>
      <el-table-column label="季度/月份" align="center" prop="contractMonth" v-else></el-table-column>
      <el-table-column label="供应商名称" align="center" prop="supplierName"/>
      <el-table-column label="合同金额" align="center" prop="contractAmount"/>
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
import {getListSupplier,supplierBillByQuarter,supplierBillByMonth} from "@/api/scm/supplier";
export default {
  name: "supplierBill",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      orderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractYear: null,
        saleSupplierId: null
      },
      supplierList:[],
      type : 0,
      // 总条数
      total: 0
    };
  },
  created() {
    this.getList();
    this.getSupplierList();
  },
  methods: {
    // 获取供应商列表
    getSupplierList(){
      getListSupplier().then(res=>{
        this.supplierList = res.data;
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      if(this.type == 0) {
        supplierBillByQuarter(this.queryParams).then(res=>{
          this.orderList = res.rows;
          this.total = res.total;
        })
      }else{
        supplierBillByMonth(this.queryParams).then(res=>{
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
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
