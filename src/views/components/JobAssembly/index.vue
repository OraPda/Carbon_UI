<template>
  <div class="app-container">
    <el-dialog title="选择生产作业" @open="getList" :before-close="close" @close="close"  :visible="open" append-to-body>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="作业名称" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入作业名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="daterangeStartDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="daterangeEndDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="assemblyList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="作业名称" align="center" prop="jobName"/>
        <el-table-column label="生产计划" align="center" prop="planNumber"/>
        <el-table-column label="计划排产" align="center" prop="serialNo"/>
        <el-table-column label="产品" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column label="规格" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="开始时间" align="center" prop="startTime" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
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
              @click="submit(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改作业装配对话框 -->
    </el-dialog>
  </div>
</template>

<script>
import {
  listAssembly,
  getAssembly,
  delAssembly,
  addAssembly,
  updateAssembly,
} from "@/api/mes/assembly";

export default {
  name: "Assembly1",
  dicts: ["mes_assembly_status"],
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
      // 作业装配表格数据
      assemblyList: [],
      // 弹出层标题
      title: "",
      // 作业状态时间范围
      daterangeStartDate: [],
      // 作业状态时间范围
      daterangeEndDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: null,
        startDate: null,
        endDate: null,
        status: this.status
      },
      // 表单参数
      form: {},
      // 表单校验

    };
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: null,
    },
  },
  created() {

  },
  methods: {
    /** 查询作业装配列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeStartDate && "" != this.daterangeStartDate) {
        this.queryParams.params["beginStartDate"] = this.daterangeStartDate[0];
        this.queryParams.params["endStartDate"] = this.daterangeStartDate[1];
      }
      if (null != this.daterangeEndDate && "" != this.daterangeEndDate) {
        this.queryParams.params["beginEndDate"] = this.daterangeEndDate[0];
        this.queryParams.params["endEndDate"] = this.daterangeEndDate[1];
      }
      listAssembly(this.queryParams).then((response) => {
        this.assemblyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    close() {
      this.$emit("close");
    },
    /** 提交按钮 */
    submit(row) {
      this.$emit("fun", row);
      this.close();
    },
    cancel() {
        this.close();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jobName: null,
        productionPlan: null,
        plannedProduction: null,
        product: null,
        model: null,
        specifications: null,
        unit: null,
        startDate: null,
        endDate: null,
        productionNum: null,
        remark: null,
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
      this.daterangeStartDate = [];
      this.daterangeEndDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {},
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();

      this.title = "添加作业装配";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {},
    /** 提交按钮 */
    submitForm() {},
    /** 删除按钮操作 */
    handleDelete(row) {},
    /** 导出按钮操作 */
    handleExport() {},
  },
};
</script>
