<template>
  <div class="app-container">
    <el-dialog title="检验标准" @open="getList" :visible.sync="open" :before-close="close" append-to-body>
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
        <el-form-item label="物料名称" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入"
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
      <el-table v-loading="loading" :data="standardsList">
        <el-table-column label="ID" align="center" prop="id"/>
        <el-table-column label="物料ID" align="center" prop="materialId"/>
        <el-table-column label="检验项" align="center" prop="checkItem"/>
        <el-table-column label="检验类型" align="center" prop="checkType"/>
        <el-table-column label="标准值上限" align="center" prop="upLimit"/>
        <el-table-column label="标准值下限" align="center" prop="lowerLimit"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column
          label="规格"
          align="center"
          prop="materialSpecifications"
        />
        <el-table-column label="单位" align="center" prop="materialUnit"/>
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
        v-show="total > 0"
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
  listStandards,

} from "@/api/mes/standards";

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    materialId: {
      type: Number,
      default: null
    },
    checkType: {
      type: String,
      default: null
    }

  },
  name: "Standards",
  data() {
    return {
      selectIds: null,
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
      // 检验标准
      //表格数据
      standardsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // 查询参数
      material: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: this.materialId,
        checkItem: null,
        checkType: this.checkType,
        upLimit: null,
        lowerLimit: null,
        materialName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  watch: {
    materialId(newVal, oldVal) {
      if (newVal) {
        this.queryParams.materialId = this.materialId;
      }
    }
  },
  methods: {
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
      this.close();
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

      };
      this.material = null
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
      this.close();
    },
  },
};
</script>
