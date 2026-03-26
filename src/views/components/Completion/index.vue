<template>
  <div class="app-container">
    <el-dialog title="生产完工单" @open="getList" :visible="open" @close="close" :before-close="close" append-to-body>

      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="生产计划" prop="planNumber">
          <el-input
            v-model="queryParams.planNumber"
            placeholder="请输入生产计划"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产作业" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入生产作业"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="产品" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入产品"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="完工日期">
          <el-date-picker
            v-model="daterangeCompletionDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生产批号" prop="batchNumber">
          <el-input
            v-model="queryParams.batchNumber"
            placeholder="请输入生产批号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="completionList">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="单号" align="center" prop="oddNumbers" />
        <el-table-column label="生产计划" align="center" prop="planNumber" />
        <el-table-column label="生产作业" align="center" prop="jobName" />
        <el-table-column label="产品" align="center" prop="materialName" />
        <el-table-column label="型号" align="center" prop="materialModel" />
        <el-table-column label="规格" align="center" prop="materialSpecifications" />
        <el-table-column label="单位" align="center" prop="materialUnit" />
        <el-table-column label="完工日期" align="center" prop="completionDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产数量" align="center" prop="quantity" />
        <el-table-column label="生产批号" align="center" prop="batchNumber" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.mes_production_completion_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
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


    </el-dialog>
  </div>
</template>

<script>
import {listCompletion} from "@/api/mes/completions";

export default {
  name: "Completion",
  dicts: ['mes_production_completion_status'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: '',
    },

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
      // 生产完工单表格数据
      completionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // 备注时间范围
      daterangeCompletionDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planNumber: null,
        jobName: null,
        materialName: null,
        completionDate: null,
        batchNumber: null,
        status: this.status
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  methods: {
    /** 查询生产完工单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCompletionDate && '' != this.daterangeCompletionDate) {
        this.queryParams.params["beginCompletionDate"] = this.daterangeCompletionDate[0];
        this.queryParams.params["endCompletionDate"] = this.daterangeCompletionDate[1];
      }
      listCompletion(this.queryParams).then(response => {
        this.completionList = response.rows;
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
      this.daterangeCompletionDate = [];
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
