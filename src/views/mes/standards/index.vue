<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="检验项" prop="checkItem">
        <el-input
          v-model="queryParams.checkItem"
          placeholder="请输入检验项"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="检验类型" prop="checkType">
        <el-select v-model="queryParams.checkType">
          <el-option
            v-for="dict in dict.type.mes_check_type"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="standardsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="物料名称" align="center" prop="materialName"/>
      <el-table-column label="型号" align="center" prop="materialModel"/>
      <el-table-column label="规格" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
      <el-table-column label="检验项" align="center" prop="checkItem"/>
      <el-table-column label="检验类型" align="center" prop="checkType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_check_type" :value="scope.row.checkType"/>
        </template>
      </el-table-column>
      <el-table-column label="标准值上限" align="center" prop="upLimit"/>
      <el-table-column label="标准值下限" align="center" prop="lowerLimit"/>
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
            @click="handleUpdate(scope.row)"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
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
    <MateriaDialog :open.sync="materialOpen" @fun="selectMaterial" @close="close"/>
    <!-- 添加或修改检验标准对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="物料" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请选择物料" disabled>
            <el-button slot="append" @click="openDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="检验项目名称" prop="checkItem">
          <el-input v-model="form.checkItem" placeholder="请输入检验项"/>
        </el-form-item>
        <el-form-item label="检验类型" prop="checkType">
          <el-select v-model="form.checkType">
            <el-option
              v-for="dict in dict.type.mes_check_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准值上限" prop="upLimit">
          <el-input v-model.number="form.upLimit" placeholder="请输入标准值上限"/>
        </el-form-item>
        <el-form-item label="标准值下限" prop="lowerLimit">
          <el-input v-model.number="form.lowerLimit" placeholder="请输入标准值下限"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStandards,
  getStandards,
  delStandards,
  addStandards,
  updateStandards,
} from "@/api/mes/standards";
import MateriaDialog from "../../components/MateriaDialog/index.vue";

export default {
  components: {
    MateriaDialog,
  },
  name: "Standards",
  dicts: ['mes_check_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      materialOpen: false,
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
      // 检验标准表格数据
      standardsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      material: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: null,
        checkItem: null,
        checkType: null,
        upLimit: null,
        lowerLimit: null,
        materialName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        checkItem:[{ required: true, message: "检验项目名称不能为空", trigger: "blur" }],
        checkType:[{ required: true, message: "检验类型不能为空", trigger: "blur" }],
        upLimit:[
          { required: true, message: "标准值上限不能为空", trigger: "blur" },
          { type: 'number', message: '检验值上限必须为数字值', trigger: 'blur' }
        ],
        lowerLimit:[
          { required: true, message: "标准值下限不能为空", trigger: "blur" },
          { type: 'number', message: '检验值下限必须为数字值', trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openDialog() {
      this.materialOpen = true;
    },
    selectMaterial(val) {
      this.form.materialName = val.materialName
      this.form.materialId = val.id
    },
    close() {
      this.materialOpen = false;
    },
    /** 查询检验标准列表 */
    getList() {
      this.loading = true;
      listStandards(this.queryParams).then((response) => {
        this.standardsList = response.rows;
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
        materialId: null,
        checkItem: null,
        checkType: null,
        upLimit: null,
        lowerLimit: null,
        remark: null,
        materialName: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加检验标准";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getStandards(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改检验标准";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateStandards(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStandards(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除检验标准编号为"' + ids + '"的数据项？')
        .then(function () {
          return delStandards(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "mes/standards/export",
        {
          ...this.queryParams,
        },
        `standards_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
