<template>
  <div class="app-container">
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_production_completion_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
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

    <el-table v-loading="loading" :data="completionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            @click="handleStatus(scope.row, 3)"
          >检验合格</el-button>
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            @click="handleStatus(scope.row, 4)"
          >检验未合格</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改生产完工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
        <el-form-item label="单号" prop="oddNumbers">
          <el-input v-model="form.oddNumbers" disabled/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="生产计划" prop="planNumber">
          <el-input v-model="form.planNumber" disabled/>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="生产作业" prop="jobName">
          <el-input v-model="form.jobName" disabled/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="产品" prop="materialName">
          <el-input v-model="form.materialName" disabled/>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="型号" prop="materialModel">
          <el-input v-model="form.materialModel" disabled/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="规格" prop="materialSpecifications">
          <el-input v-model="form.materialSpecifications" disabled/>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" disabled/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="完工日期" prop="completionDate">
          <el-date-picker
            clearable
            v-model="form.completionDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择完工日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="生产数量" prop="quantity">
          <el-input v-model="form.quantity" disabled/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="生产批号" prop="batchNumber">
          <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" disabled>
            <el-option
              v-for="dict in dict.type.mes_production_completion_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCompletion, getCompletion, delCompletion, addCompletion, updateCompletion } from "@/api/mes/completion";

export default {
  name: "Completion",
  dicts: ['mes_production_completion_status'],
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
      open: false,
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
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        batchNumber:[{ required: true, message: "生产批次不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
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
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        oddNumbers: null,
        batchNumber: null,
        remark: null
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
      this.daterangeCompletionDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCompletion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改生产完工单";
      });
    },
    handleStatus(row, status) {
      updateCompletion({
        id: row.id,
        status: status
      }).then(response => {
        this.$modal.msgSuccess("提交成功");
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCompletion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCompletion(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除生产完工单编号为"' + ids + '"的数据项？').then(function() {
        return delCompletion(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/completion/export', {
        ...this.queryParams
      }, `completion_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
