<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库" prop="warehouseId">
        <el-select v-model="queryParams.warehouseId" placeholder="请选择仓库" @change="handleWarehouseArea(queryParams.warehouseId)" clearable>
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseName"
            :value="warehouse.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库区" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择库区" @change="handleWarehouseSeat(queryParams.areaId)" clearable>
          <el-option
            v-for="area in warehouseAreaList"
            :key="area.id"
            :label="area.areaName"
            :value="area.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位" prop="seatId">
        <el-select v-model="queryParams.seatId" placeholder="请选择库位" clearable>
          <el-option
            v-for="seat in warehouseSeatList"
            :key="seat.id"
            :label="seat.seatName"
            :value="seat.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <el-input
          v-model="queryParams.manufacturer"
          placeholder="请输入生产厂家"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入生产批号"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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

    <el-table v-loading="loading" :data="inventoryDetailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="仓库名" align="center" prop="warehouseName" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="规格" align="center" prop="materialSpecifications" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="生产厂家" align="center" prop="manufacturer" />
      <el-table-column label="生产批号" align="center" prop="batchNumber" />
      <el-table-column label="库存量" align="center" prop="existingInventory" />
      <!-- <el-table-column label="总库存" align="center" prop="totalInventory" /> -->
      <el-table-column label="锁定库存" align="center" prop="lockInventory" />
      <el-table-column label="库存上限" align="center" prop="inventoryLimit" />
      <el-table-column label="库存下限" align="center" prop="inventoryLower" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:inventoryDetails:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:inventoryDetails:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改库存明细报表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料库存ID" prop="inventoryId">
          <el-input v-model="form.inventoryId" placeholder="请输入物料库存ID" />
        </el-form-item>
        <el-form-item label="库区ID" prop="warehouseAreaId">
          <el-input v-model="form.warehouseAreaId" placeholder="请输入库区ID" />
        </el-form-item>
        <el-form-item label="库位ID" prop="warehouseSeatId">
          <el-input v-model="form.warehouseSeatId" placeholder="请输入库位ID" />
        </el-form-item>
        <el-form-item label="现有库存" prop="existingInventory">
          <el-input v-model="form.existingInventory" placeholder="请输入现有库存" />
        </el-form-item>
        <el-form-item label="生产日期" prop="manufactureDate">
          <el-date-picker clearable
            v-model="form.manufactureDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="生产批号" prop="batchNumber">
          <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
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
import { listInventoryDetails, getInventoryDetails, delInventoryDetails, addInventoryDetails, updateInventoryDetails, listWarehouse, getWarehouse, getArea } from "@/api/wms/inventoryDetails";

export default {
  name: "InventoryDetails",
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
      // 库存明细报表表格数据
      inventoryDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseId: null,
        areaId: null,
        seatId: null,
        manufacturer: null,
        batchNumber: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 仓库数据
      warehouseList: [],
      // 库区数据
      warehouseAreaList: [],
      // 库位数据
      warehouseSeatList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存明细报表列表 */
    getList() {
      this.loading = true;
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
      listInventoryDetails(this.queryParams).then(response => {
        this.inventoryDetailsList = response.rows;
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
        inventoryId: null,
        warehouseAreaId: null,
        warehouseSeatId: null,
        existingInventory: null,
        manufactureDate: null,
        manufacturer: null,
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
      this.warehouseAreaList = [];
      this.warehouseSeatList = [];
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
      this.title = "添加库存明细报表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInventoryDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存明细报表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInventoryDetails(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryDetails(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存明细报表编号为"' + ids + '"的数据项？').then(function() {
        return delInventoryDetails(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出？').then(() => {
        this.download('wms/inventoryDetails/export', {
          ...this.queryParams
        }, `inventoryDetails_${new Date().getTime()}.xlsx`)
      }).catch(() => {});
    },
    /** 获取库区列表操作 */
    handleWarehouseArea(id){
      this.warehouseAreaList = [];
      this.warehouseSeatList = [];
      getWarehouse(id).then(response => {
        this.warehouseAreaList = response.data.wmsWarehouseAreaList;
      });
    },
    /** 获取库位置列表操作 */
    handleWarehouseSeat(id){
      this.warehouseSeatList = [];
      getArea(id).then(response => {
        this.warehouseSeatList = response.data.wmsWarehouseSeatList;
      });
    }
  }
};
</script>
