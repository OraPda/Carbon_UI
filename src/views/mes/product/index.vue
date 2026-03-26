<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模型名称" prop="modeName">
        <el-input
          v-model="queryParams.modeName"
          placeholder="请输入模型名称"
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
        >新增
        </el-button>
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
        </el-button>
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
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="模型名称" align="center" prop="modeName"/>
      <el-table-column label="产品" align="center" prop="materialName"/>
      <el-table-column label="产品型号" align="center" prop="materialModel"/>
      <el-table-column label="产品规格" align="center" prop="materialSpecifications"/>
      <el-table-column label="产品单位" align="center" prop="materialUnit"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改产品建模对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="modeName">
              <el-input v-model="form.modeName" placeholder="请输入模型名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="materialName">
              <el-input placeholder="请选择产品" v-model="form.materialName" disabled>
                <el-button slot="append" @click="selectFormMaterial()">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品型号" prop="materialModel">
              <el-input v-model="form.materialModel" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品规格" prop="materialSpecifications">
              <el-input v-model="form.materialSpecifications" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">产品建模明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddMesProductMaterialItem">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteMesProductMaterialItem">
              删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="mesProductMaterialItemList" :row-class-name="rowMesProductMaterialItemIndex"
                  @selection-change="handleMesProductMaterialItemSelectionChange" ref="mesProductMaterialItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductMaterialItemList.'+scope.$index+'.materialId'" :rules="rules.materialId">
                <el-input placeholder="请选择物料" v-model="scope.row.materialName" disabled>
                  <el-button slot="append" @click="selectMaterial(scope.row)">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
            </template>
          </el-table-column>
        </el-table>
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
import {listProduct, getProduct, delProduct, addProduct, updateProduct} from "@/api/mes/product";
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";

export default {
  components: {
    MateriaDialog,
  },
  name: "Product",
  dicts: ['scm_apply_status', 'scm_audit_status', 'material_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesProductMaterialItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品建模表格数据
      productList: [],
      // 产品物料子表格数据
      mesProductMaterialItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modeName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modeName: [
          {required: true, message: "模型名称不能为空", trigger: "blur"}
        ],
        materialName: [
          {required: true, message: "产品不能为空", trigger: "blur"}
        ],
        materialId: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
      },
      // 物料弹出框
      materialOpen: false,
      // 物料列表
      materialList: [],
      // 部门树选项
      classifyOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      materialQuery: {
        classifyId: null
      },
      flag: null,
    };
  },
  created() {
    this.getList();
  },
  watch: {
    'mesProductMaterialItemList': {
      handler(newVal, oldVal) {
        this.form.mesProductMaterialItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询产品建模列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
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
        modeName: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null,
        remark: null
      };
      this.mesProductMaterialItemList = [];
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品建模";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProduct(id).then(response => {
        this.form = response.data;
        this.mesProductMaterialItemList = response.data.mesProductMaterialItemList;
        this.open = true;
        this.title = "修改产品建模";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesProductMaterialItemList = this.mesProductMaterialItemList;
          if (this.form.id != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除产品建模编号为"' + ids + '"的数据项？').then(function () {
        return delProduct(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 产品物料子序号 */
    rowMesProductMaterialItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 产品物料子添加按钮操作 */
    handleAddMesProductMaterialItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.remark = "";
      this.mesProductMaterialItemList.push(obj);
    },
    /** 产品物料子删除按钮操作 */
    handleDeleteMesProductMaterialItem() {
      if (this.checkedMesProductMaterialItem.length == 0) {
        this.$modal.msgError("请先选择要删除的产品物料子数据");
      } else {
        const mesProductMaterialItemList = this.mesProductMaterialItemList;
        const checkedMesProductMaterialItem = this.checkedMesProductMaterialItem;
        this.mesProductMaterialItemList = mesProductMaterialItemList.filter(function (item) {
          return checkedMesProductMaterialItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleMesProductMaterialItemSelectionChange(selection) {
      this.checkedMesProductMaterialItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/product/export', {
        ...this.queryParams
      }, `product_${new Date().getTime()}.xlsx`)
    },
    // 选择表单物料弹出层按钮
    selectFormMaterial() {
      this.materialOpen = true
      this.flag = 1;
    },
    close() {
      this.materialOpen = false
    },
    // 选择物料弹出层按钮
    selectMaterial(row) {
      if (row) {
        this.materialIndex = row.index
      }
      this.materialOpen = true
      this.flag = 2;
    },
    // 选中物料数据
    handleChange(val) {
      if (this.flag == 1) {
        this.form.materialId = val.id
        this.form.materialName = val.materialName
        this.form.materialModel = val.materialModel
        this.form.materialSpecifications = val.materialSpecifications
        this.materialOpen = false
      } else {
        this.mesProductMaterialItemList[this.materialIndex - 1].materialId = val.id
        this.mesProductMaterialItemList[this.materialIndex - 1].materialName = val.materialName
        this.mesProductMaterialItemList[this.materialIndex - 1].materialModel = val.materialModel
        this.mesProductMaterialItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
        this.mesProductMaterialItemList[this.materialIndex - 1].materialUnit = val.materialUnit
        this.materialOpen = false;
      }
      this.flag = null;
    }
  }
};
</script>
