<template>
  <div class="app-container">
    <!-- 物料列表 -->
    <el-dialog title="选择物料档案" :visible="open" width="1000px"  @close="close" append-to-body>

      <el-row :gutter="20">
        <!--物料分类数据-->
        <el-col :span="4" :xs="24">
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
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                   label-width="68px">
            <el-form-item label="物料名称" prop="materialName">
              <el-input
                v-model="queryParams.materialName"
                placeholder="请输入物料名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="loading" :data="materialList">
            <el-table-column label="编号" align="center" prop="id"/>
            <el-table-column label="物料编码" align="center" prop="materialCode"/>
            <el-table-column label="物料名称" align="center" prop="materialName"/>
            <el-table-column label="型号" align="center" prop="materialModel"/>
            <el-table-column label="规格" align="center" prop="materialSpecifications"/>
            <el-table-column label="单位" align="center" prop="materialUnit"/>
            <el-table-column label="单价" align="center" prop="materialPrice"/>
            <el-table-column label="类型" align="center" prop="materialType">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.material_type" :value="scope.row.materialType"/>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark"/>
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
                </el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-col>

      </el-row>

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
import {
  listMaterial,
  getMaterial,
  delMaterial,
  classifyTreeSelect,
} from "@/api/wms/material";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Material",
  dicts: ["material_type"],
  components: {Treeselect},
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
      // 部门树选项
      classifyOptions: undefined,
      // 物料分类名称
      classifyName: undefined,
      // 物料档案表格数据
      materialList: [],
      // 弹出层标题
      title: "",

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialName: null,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    // 根据名称筛选物料分类树
    classifyName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getClassifyTree();
  },
  methods: {
    /** 查询物料分类下拉树结构 */
    getClassifyTree() {
      classifyTreeSelect().then((response) => {
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
      listMaterial(this.queryParams).then((response) => {
        this.materialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    close() {
      this.$emit("close");
    },
    /** 提交按钮 */
    submitForm(row) {
      this.$emit('fun', row);
      this.close()
    },
  },
};
</script>
