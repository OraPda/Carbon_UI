<template>
  <div class="app-container">
    <!-- 库存物料明细 -->
    <el-dialog title="选择物料" :visible="open" width="1000px"  @close="close" append-to-body>
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
        <el-table-column label="编号" align="center" type="index"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column label="规格" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="仓库" align="center" prop="warehouseName" />
        <el-table-column label="库区" align="center" prop="areaName" />
        <el-table-column label="库位" align="center" prop="seatName" />
        <el-table-column label="生产批号" align="center" prop="batchNumber" />
        <el-table-column label="现有库存" align="center" prop="existingInventory" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="submitForm(scope.row)"
            >选择
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
    </el-dialog>
  </div>
</template>

<script>
import {listInventoryDetails} from "@/api/wms/inventoryDetails";
export default {
  name: "Material",
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

  created() {
    this.getList();
  },
  methods: {
    /** 查询物料库存明细列表 */
    getList() {
      this.loading = true;
      listInventoryDetails(this.queryParams).then((response) => {
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
