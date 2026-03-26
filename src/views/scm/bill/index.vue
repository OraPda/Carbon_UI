<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="签订日期">
        <el-date-picker clearable
          v-model="daterangeSigningDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customName">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable>
          <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.id"
          />
        </el-select>
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

    <el-table v-loading="loading" :data="billList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同id" align="center" prop="contractId" />
      <el-table-column label="合同编码" align="center" prop="contractNumber" />
      <el-table-column label="客户名称" align="center" prop="customName" />
      <el-table-column label="合同金额" align="center" prop="totalAmount" />
      <el-table-column label="签订日期" align="center" prop="signingDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="规格" align="center" prop="materialSpecifications" />
      <el-table-column label="单价" align="center" prop="materialPrice" />
      <el-table-column label="订货数量" align="center" prop="orderQuantity" />
      <el-table-column label="应收金额" align="center" prop="amount" />
      <el-table-column label="退款金额" align="center" prop="returnTotal" />
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
import {listBill} from "@/api/scm/bill";
import {listCustomList} from "@/api/scm/custom";

export default {
  name: "Bill",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 供应链SCM-销售报-销售台账表格数据
      billList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customId: null,
        signingDate: null,
        materialName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      customList: [],
      daterangeSigningDate: []
    };
  },
  created() {
    this.getList();
    this.getcustomList()
  },
  methods: {
    /** 查询供应链SCM-销售报-销售台账列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeSigningDate && '' != this.daterangeSigningDate) {
        this.queryParams.params["beginSigningDate"] = this.daterangeSigningDate[0];
        this.queryParams.params["endSigningDate"] = this.daterangeSigningDate[1];
      }
      listBill(this.queryParams).then(response => {
        this.billList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询客户档案列表 */
    getcustomList() {
      listCustomList().then(response => {
        this.customList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        contractId: null,
        contractCode: null,
        customName: null,
        totalAmount: null,
        signingDate: null,
        materialName: null,
        model: null,
        spec: null,
        unitPrice: null,
        orderQuantity: null,
        amount: null,
        returnPrice: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeSigningDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出所有销售台账数据项？').then(() => {
        this.download('carbonReport/scmSale/saleBook/export', {
          ...this.queryParams
        }, `bill_${new Date().getTime()}.xlsx`)
      }).catch(() => {});

    }
  }
};
</script>
