<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--物料分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="classifyName"
            placeholder="请输入物料分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="classifyOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="物料编号" prop="materialCode">
            <el-input
              v-model="queryParams.materialCode"
              placeholder="请输入物料编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料名称" prop="materialName">
            <el-input
              v-model="queryParams.materialName"
              placeholder="请输入物料名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="型号" prop="materialModel">
            <el-input
              v-model="queryParams.materialModel"
              placeholder="请输入型号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="规格" prop="materialSpecifications">
            <el-input
              v-model="queryParams.materialSpecifications"
              placeholder="请输入规格"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="单位" prop="materialUnit">
            <el-input
              v-model="queryParams.materialUnit"
              placeholder="请输入单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="单价" prop="materialPrice" :rules="[{ type: 'number', message: '单价必须为数字值',trigger: 'change'}]">
            <el-input
              v-model.number="queryParams.materialPrice"
              placeholder="请输入单价"
              @keyup.enter.native="handleQuery"
              clearable
              @input="changeSearchPrice"
            />
          </el-form-item>
          <el-form-item label="类型" prop="materialType">
            <el-select v-model="queryParams.materialType" placeholder="请选择类型" clearable>
              <el-option
                v-for="dict in dict.type.material_type"
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
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['wms:material:export']"
            >导出</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="物料档案ID" align="center" prop="id" /> -->
          <el-table-column label="物料编码" align="center" prop="materialCode" />
          <el-table-column label="物料名称" align="center" prop="materialName" />
          <el-table-column label="型号" align="center" prop="materialModel" />
          <el-table-column label="规格" align="center" prop="materialSpecifications" />
          <el-table-column label="单位" align="center" prop="materialUnit" />
          <el-table-column label="单价" align="center" prop="materialPrice" />
          <el-table-column label="类型" align="center" prop="materialType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.material_type" :value="scope.row.materialType"/>
            </template>
          </el-table-column>
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
      </el-col>
    </el-row>
    <!-- 添加或修改物料档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择分类" prop="classifyId">
          <treeselect v-model="form.classifyId" :options="classifyOptions" :show-count="true" placeholder="请选择物料分类" />
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="型号" prop="materialModel">
          <el-input v-model="form.materialModel" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="规格" prop="materialSpecifications">
          <el-input v-model="form.materialSpecifications" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="单价" prop="materialPrice">
          <el-input v-model="form.materialPrice" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="类型" prop="materialType">
          <el-select v-model="form.materialType" placeholder="请选择类型">
            <el-option
              v-for="dict in dict.type.material_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listMaterial, getMaterial, delMaterial, addMaterial, updateMaterial, classifyTreeSelect } from "@/api/wms/material";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Material",
  dicts: ['material_type'],
  components: { Treeselect },
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
      // 部门树选项
      classifyOptions: undefined,
      // 物料分类名称
      classifyName: undefined,
      // 物料档案表格数据
      materialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classifyId: null,
        materialCode: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null,
        materialUnit: null,
        materialPrice: null,
        materialType: null,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        classifyId: [
          { required: true, message: "物料分类ID不能为空", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选物料分类树
    classifyName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getClassifyTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getClassifyTree() {
      classifyTreeSelect().then(response => {
        this.classifyOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.classifyId = data.id;
      this.handleQuery();
    },
    /** 查询物料档案列表 */
    getList() {
      this.loading = true;
      listMaterial(this.queryParams).then(response => {
        this.materialList = response.rows;
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
        classifyId: null,
        materialCode: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null,
        materialUnit: null,
        materialPrice: null,
        materialType: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.queryParams.pageNum = 1;
          this.getList();
          } else {
            return false;
          }
    });
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加物料档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMaterial(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物料档案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMaterial(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterial(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物料档案编号为"' + ids + '"的数据项？').then(function() {
        return delMaterial(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/material/export', {
        ...this.queryParams
      }, `material_${new Date().getTime()}.xlsx`)
    },
    changeSearchPrice(data){
      // 防止单价输入框为空时，校验判断空字段不为数字
      if (data == "") {
        this.queryParams.materialPrice = null
      }
    }
  }
};
</script>
