<template>
  <div class="app-container">
    <el-dialog title="选择领料单" @open="getList" @close="close" :visible="open" append-to-body>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="物料" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="applyList" @row-click="handleSelectionChange" >
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="领料单号" align="center" prop="oddNumber"/>
        <el-table-column label="生产计划" align="center" prop="planNumber"/>
        <el-table-column label="计划排产" align="center" prop="serialNo"/>
        <el-table-column label="产品" align="center" prop="materialName"/>
        <el-table-column label="规格" align="center" prop="materialModel"/>
        <el-table-column label="型号" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="领取日期" align="center" prop="collectionDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.collectionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.mes_material_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="submitForm(scope.row)"
            >选择
            </el-button
            >

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

      <!-- 添加或修改领料申请对话框 -->


    </el-dialog>
  </div>
</template>

<script>
import {listApply} from "@/api/mes/apply";

export default {
  name: "Apply1",
  dicts: ['mes_auditor_status', 'mes_apply_status','mes_material_status'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null
    }

  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesMaterialApplyItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 领料申请表格数据
      applyList: [],
      // 领料申请-生产计划明细子表格数据
      mesMaterialApplyItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        materialName: null,
        materialModel: null,
        materialSku: null,
        materialUnit: null,
        demandQuantity: null,
        receivedQuantity: null,
        status: this.status,
        reviewerStatus: 1,
        applyId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  methods: {
    /** 查询领料申请列表 */
    getList() {
      this.loading = true;
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("close");

    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        plan: null,
        planning: null,
        product: null,
        spec: null,
        type: null,
        unit: null,
        getDate: null,
        proposer: null,
        applyTime: null,
        applyStatus: null,
        auditor: null,
        auditTime: null,
        auditorStatus: null,
        status: null,
        auditorIdea: null,
        demandNum: null,
        inspectDate: null
      };
      this.mesMaterialApplyItemList = [];
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection, column, event) {
      this.ids = selection.id;

    },
    close() {
      this.$emit("close");
    },
    /** 提交按钮 */
    submitForm(row) {
      this.$emit('fun', row);
      this.close();
    },

    /** 领料申请-生产计划明细子序号 */
    rowMesMaterialApplyItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },


  }
};
</script>
