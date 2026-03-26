<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工艺名称" prop="technologyName">
        <el-input
          v-model="queryParams.technologyName"
          placeholder="请输入工艺名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
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
    <el-table v-loading="loading" :data="technologyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="工艺名称" align="center" prop="technologyName" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="规格" align="center" prop="materialSpecifications" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="单位耗电量" align="center" prop="unitPowerConsumption" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
    <!-- 添加或修改工艺建模对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工艺名称" prop="technologyName">
          <el-input v-model="form.technologyName" placeholder="请输入工艺名称" />
        </el-form-item>
        <el-form-item label="产品" prop="materialName">
          <el-input placeholder="请选择产品" v-model="form.materialName" disabled>
            <el-button slot="append" @click="openDialog()">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="单位耗电量" prop="unitPowerConsumption">
          <el-input v-model.number="form.unitPowerConsumption" placeholder="请输入单位耗电量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="工艺描述" prop="technologyDescribe">
          <el-input v-model="form.technologyDescribe" placeholder="请输入工艺描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->
  </div>
</template>

<script>
import { listTechnology, getTechnology, delTechnology, addTechnology, updateTechnology} from "@/api/mes/technology";
import {listMaterial} from "@/api/wms/material";
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
export default {
  components: {
    MateriaDialog,
  },
  name: "Technology",
  data() {
    return {
      materialList:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesProduct: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工艺建模表格数据
      technologyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      materialOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        technologyName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        technologyName: [
          { required: true, message: "工艺名称不能为空", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "产品不能为空", trigger: "blur" }
        ],
        unitPowerConsumption: [
          { required: true, message: "单位耗电量不能为空", trigger: "blur" },
          { type: 'number', message: '单位耗电量必须为数字值'}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getMaterialList();
  },
  methods: {
    /** 查询工艺建模列表 */
    getList() {
      this.loading = true;
      listTechnology(this.queryParams).then(response => {
        this.technologyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    getMaterialList() {
      listMaterial().then(response => {
        this.materialList = response.rows;
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
        technologyName: null,
        materialId: null,
        materialName: null,
        unitPowerConsumption: null,
        remark: null,
        technologyDescribe: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    openDialog() {
      this.materialOpen = true
    },
    close() {
      this.materialOpen = false
    },
    // 选中物料数据
    handleChange(val) {
      this.form.materialId = val.id
      this.form.materialName = val.materialName
      this.materialOpen = false
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工艺建模";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTechnology(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工艺建模";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTechnology(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTechnology(this.form).then(response => {
              this.$message.success("新增成功");
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
      this.$confirm('是否确认删除工艺建模编号为"' + ids + '"的数据项？').then(function() {
        return delTechnology(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/technology/export', {
        ...this.queryParams
      }, `technology_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
