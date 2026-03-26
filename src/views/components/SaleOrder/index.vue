<template>
  <div class="app-container">
    <el-dialog title="销售订单" @open="getList" :visible="open" @close="close" :before-close="close" append-to-body>

      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="orderList">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="订单编号" align="center" prop="orderNo"/>
        <el-table-column label="客户名称" align="center" prop="customName"/>
        <el-table-column label="金额合计" align="center" prop="totalAmount"/>
        <el-table-column label="交货日期" align="center" prop="deliveryDate"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="submitForm(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />


    </el-dialog>
  </div>
</template>

<script>
import { listOrder } from "@/api/scm/order";
export default {
  name: "SaleOrder",
  dicts: [],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    auditStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        auditStatus: this.auditStatus
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  methods: {
    /** 查询销售订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
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
    },
    close() {
      this.$emit("close");
    },
    /** 选择按钮 */
    submitForm(row) {
      this.$emit('fun', row);
      this.close();
    },
  }
};
</script>
