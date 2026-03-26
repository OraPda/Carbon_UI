<template>
  <div class="app-container">
    <el-dialog title="发货单" @open="getList" :visible="open" @close="close" :before-close="close" append-to-body>

      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="发货编号" prop="deliveryNo">
          <el-input
            v-model="queryParams.deliveryNo"
            placeholder="请输入发货编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input
            v-model="queryParams.contractNo"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter.native="handleQuery"
          />

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="deliveryList">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="发货编号" align="center" prop="deliveryNo" />
        <el-table-column label="合同编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="送货方式" align="center" prop="shipping">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.scm_shipping_type" :value="scope.row.shipping"/>
          </template>
        </el-table-column>
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="linkman" />
        <el-table-column label="联系电话" align="center" prop="contactWay" />
        <el-table-column label="出库状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.scm_cargo_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="submitForm(scope.row)"
            >选择</el-button>
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
import {listDelivery} from "@/api/scm/delivery";

export default {
  name: "SaleDelivery",
  dicts: ['scm_cargo_status','scm_shipping_type'],
  props: {
    open: {
      type: Boolean,
      default: false
    }

  },
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
      // 发货单表格数据
      deliveryList: [],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deliveryNo: null,
        contractNo: null,
        customId: null,
        deliveryDate: null,
        status: 0,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  methods: {
    /** 查询发货单单列表 */
    getList() {
      this.loading = true;
      listDelivery(this.queryParams).then(response => {
        this.deliveryList = response.rows;
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
    /** 提交按钮 */
    submitForm(row) {
      this.$emit('fun', row);
      this.close();
    },
  }
};
</script>
