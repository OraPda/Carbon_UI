<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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

    <el-table v-loading="loading" :data="bomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="产品" align="center" prop="materialName"/>
      <el-table-column label="型号" align="center" prop="materialModel"/>
      <el-table-column label="规格" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
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

    <!-- 添加或修改Bom对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品模型" prop="productId">
              <el-select v-model="form.productId" placeholder="请选择产品模型" clearable @change="selectModel">
                <el-option
                  v-for="dict in productList"
                  :key="dict.id"
                  :label="dict.modeName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品" prop="materialName">
              <el-input v-model="form.materialName" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="bomDescribe">
              <el-input v-model="form.bomDescribe" placeholder="请输入描述"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">BOM单明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddMesBomDetailItem">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteMesBomDetailItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="mesBomDetailItemList" :row-class-name="rowMesBomDetailItemIndex"
                  @selection-change="handleMesBomDetailItemSelectionChange" ref="mesBomDetailItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialMode">
            <template slot-scope="scope">
              <el-form-item :prop="'mesBomDetailItemList.'+scope.$index+'.materialId'" :rules="rules.materialId">
                <el-input placeholder="请选择" v-model="scope.row.materialName" disabled>
                  <el-button slot="append" @click="selectMaterial(scope.row)">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="用量" prop="dosage" width="120">
            <template slot-scope="scope">
              <el-form-item :prop="'mesBomDetailItemList.'+scope.$index+'.dosage'" :rules="rules.dosage">
                <el-input v-model.number="scope.row.dosage" placeholder="请输入"/>
              </el-form-item>

            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入"/>
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
import {listBom, getBom, delBom, addBom, updateBom} from "@/api/mes/bom";
import {listProduct, getProduct, getProdctList} from "@/api/mes/product";
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
export default {
  components: {
    MateriaDialog,
  },
  name: "Bom",
  dicts: ['scm_apply_status', 'scm_audit_status', 'material_type'],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      materialQuery: {
        classifyId: null
      },
      // 部门树选项
      classifyOptions: undefined,
      materialOpen: false,
      materialList: [],
      productList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesBomDetailItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // Bom表格数据
      bomList: [],
      // BOM单明细信息子表格数据
      mesBomDetailItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: "名称不能为空", trigger: "blur"}
        ],
        productId: [
          {required: true, message: "产品不能为空", trigger: "blur"}
        ],
        materialId: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        dosage: [
          { required: true, message: "用量不能为空", trigger: "change" },
          { type: 'number', message: '必须为数字值'}
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getProductList();
  },
  watch: {
    'mesBomDetailItemList': {
      handler(newVal, oldVal) {
        this.form.mesBomDetailItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询Bom列表 */
    getList() {
      this.loading = true;
      listBom(this.queryParams).then(response => {
        this.bomList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getProductList() {
      getProdctList().then(response => {
        this.productList = response.data;
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
        name: null,
        productId: null,
        materialId: null,
        materialName: null,
        bomDescribe: null
      };
      this.mesBomDetailItemList = [];
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
      this.title = "添加Bom";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBom(id).then(response => {
        this.form = response.data;
        this.mesBomDetailItemList = response.data.mesBomDetailItemList;
        this.open = true;
        this.title = "修改Bom";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesBomDetailItemList = this.mesBomDetailItemList;
          if (this.form.id != null) {
            updateBom(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBom(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除Bom编号为"' + ids + '"的数据项？').then(function () {
        return delBom(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** BOM单明细信息子序号 */
    rowMesBomDetailItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** BOM单明细信息子添加按钮操作 */
    handleAddMesBomDetailItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.dosage = "";
      obj.remark = "";
      this.mesBomDetailItemList.push(obj);
    },
    /** BOM单明细信息子删除按钮操作 */
    handleDeleteMesBomDetailItem() {
      if (this.checkedMesBomDetailItem.length == 0) {
        this.$modal.msgError("请先选择要删除的BOM单明细信息子数据");
      } else {
        const mesBomDetailItemList = this.mesBomDetailItemList;
        const checkedMesBomDetailItem = this.checkedMesBomDetailItem;
        this.mesBomDetailItemList = mesBomDetailItemList.filter(function (item) {
          return checkedMesBomDetailItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleMesBomDetailItemSelectionChange(selection) {
      this.checkedMesBomDetailItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/bom/export', {
        ...this.queryParams
      }, `bom_${new Date().getTime()}.xlsx`)
    },
    // 选择物料弹出层按钮
    selectMaterial(row) {
      if (row) {
        this.materialIndex = row.index
      }
      this.materialOpen = true;
    },
    close() {
      this.materialOpen = false
    },
    // 选中物料数据
    handleChange(val) {
      this.mesBomDetailItemList[this.materialIndex - 1].materialId = val.id
      this.mesBomDetailItemList[this.materialIndex - 1].materialName = val.materialName
      this.mesBomDetailItemList[this.materialIndex - 1].materialModel = val.materialModel
      this.mesBomDetailItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.mesBomDetailItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.materialOpen = false;
    },
    // 选择产品模型
    selectModel(val) {
      getProduct(val).then(response => {
        this.form.materialId = response.data.materialId;
        this.form.materialName = response.data.materialName;
        let data =response.data.mesProductMaterialItemList;
        this.mesBomDetailItemList = []
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.dosage = "";
          obj.remark = "";
          this.mesBomDetailItemList.push(obj);
        })
      })
    }
  }
};
</script>
