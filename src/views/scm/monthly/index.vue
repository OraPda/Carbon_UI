<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="客户" prop="customId" >
        <el-select placeholder="请选择" v-model="queryParams.customId" clearable>
          <el-option
            v-for="item in customList"
            :label="item.customName"
            :value="item.id"
            :key="item.id"/>
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
      <el-form-item label="物料名称" prop="materialName">
          <el-input placeholder="请输入" clearable v-model="queryParams.materialName"/>
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

    <el-table v-loading="loading" :data="orderList">
      <el-table-column v-if="type == 0" label="季度" align="center" prop="contractQuarter" />
      <el-table-column v-if="type == 1" label="月份" align="center" prop="contractMonth" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="已收金额" align="center" prop="incomeAmount" />
      <el-table-column label="退款金额" align="center" prop="returnAmount" />
      <el-table-column label="订货数量" align="center" prop="saleNum" />
      <el-table-column label="发货数量" align="center" prop="deliveryNum" />
      <el-table-column label="退货数量" align="center" prop="returnNum" />
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
import {listMonth, listQuarter} from '@/api/scm/monthly'
import {listCustomList} from "@/api/scm/custom";

export default {
  name: "returnTable",
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
        customId: null,
        contractYear: null,
        materialName: null
      },
      customList: [],
      type : 0,
      // 总条数
      total: 0
    };
  },
  created() {
    this.getList();
    this.getCustomList();
  },
  methods: {
    // 获取客户列表
    getCustomList(){
      listCustomList().then(res=>{
        this.customList = res.data
      })
    },
    /** 查询统计列表 */
    getList() {
      this.loading = true;
      if(this.type == 0){
        listQuarter(this.queryParams).then(res=>{
          this.orderList = res.rows;
          this.total = res.total;
        })
      }else{
        listMonth(this.queryParams).then(res=>{
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
