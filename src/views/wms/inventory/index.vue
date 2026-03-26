<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryList" @selection-change="handleSelectionChange" :row-class-name="rowClassName">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="仓库" align="center" prop="warehouseName" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="物料型号" align="center" prop="materialModel" />
      <el-table-column label="物料规格" align="center" prop="materialSpecifications" />
      <el-table-column label="物料单位" align="center" prop="materialUnit" />
      <el-table-column label="物料单价" align="center" prop="materialPrice" />
      <el-table-column label="总库存" align="center" prop="totalInventory" />
      <el-table-column label="锁定库存" align="center" prop="lockInventory" />
      <el-table-column label="库存上限" align="center" prop="inventoryLimit" />
      <el-table-column label="库存下限" align="center" prop="inventoryLower" />
      <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sort"
            @click="handleYiku(scope.row)"
          >移库</el-button>
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

    <!-- 添加或修改物料库存对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1300px" append-to-body :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="disabled"  :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料名称选择" prop="materialId">
              <el-select v-model="form.materialId" placeholder="请选择物料">
                <el-option
                  v-for="material in materialList"
                  :key="material.id"
                  :label="material.materialName"
                  :value="material.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库选择" prop="warehouseId">
              <el-select v-model="form.warehouseId" placeholder="请选择仓库" @change="handleWarehouseArea(form.warehouseId)">
                <el-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.id"
                  :label="warehouse.warehouseName"
                  :value="warehouse.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总库存" prop="totalInventory">
              <el-input v-model="form.totalInventory" placeholder="请输入总库存" type="number" style="width:220px" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="锁定库存" prop="lockInventory">
          <el-input v-model="form.lockInventory" placeholder="请输入锁定库存" type="number" style="width:220px" disabled />
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存上限" prop="inventoryLimit">
              <el-input v-model.number="form.inventoryLimit" placeholder="请输入库存上限" style="width:220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="库存下限" prop="inventoryLower">
          <el-input v-model.number="form.inventoryLower" placeholder="请输入库存下限" style="width:220px" />
        </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">库存物料明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddWmsInventoryDetails">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsInventoryDetails">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsInventoryDetailsList" :row-class-name="rowWmsInventoryDetailsIndex" @selection-change="handleWmsInventoryDetailsSelectionChange" ref="wmsInventoryDetails">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="库区" prop="warehouseAreaId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsInventoryDetailsList.'+scope.$index+'.warehouseAreaId'"
                            :rules="rules.warehouseAreaId">
                <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" @change="handleWarehouseSeat(scope.row)">
                  <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="warehouseSeatId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsInventoryDetailsList.'+scope.$index+'.warehouseSeatId'"
                            :rules="rules.warehouseSeatId">
                <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位">
                  <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="现有库存" prop="existingInventory" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsInventoryDetailsList.'+scope.$index+'.existingInventory'"
                            :rules="rules.existingInventory">
                <el-input v-model.number="scope.row.existingInventory" placeholder="请输入现有库存" />

              </el-form-item>
            </template>
          </el-table-column>
		  <el-table-column label="锁定库存" prop="lockInventory" width="150">
		    <template slot-scope="scope">
		      <el-input v-model="scope.row.lockInventory" placeholder="" disabled/>
		    </template>
		  </el-table-column>
          <el-table-column label="生产日期" prop="manufactureDate" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.manufactureDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择生产日期" />
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" prop="manufacturer" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.manufacturer" placeholder="请输入生产厂家" />
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号" />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

     <!-- 移库信息对话框 -->
     <el-dialog :title="relocationTitle" :visible.sync="relocationOpen" width="1300px" append-to-body :before-close="cancel">
      <el-table :data="relocationList" :row-class-name="rowWmsRelocationInfoIndex">
        <el-table-column label="序号" align="center" prop="index" width="50" :fixed="true" />
        <el-table-column label="物料" align="center" prop="material" width="100" :fixed="true" />
        <el-table-column label="源仓库" prop="warehouseName" width="100" :fixed="true" />
        <el-table-column label="源库区" prop="areaName" width="100" :fixed="true" />
        <el-table-column label="源库位" prop="seatName" width="100" :fixed="true" />
        <el-table-column label="目标仓库" prop="targetWarehouse" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-select v-model="scope.row.targetWarehouse" placeholder="请选择目标仓库" @change="handleTargetWarehouseArea(scope.row)">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="目标库区" prop="targetArea" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-select v-model="scope.row.targetArea" placeholder="请选择目标库区" @change="handlTargeteWarehouseSeat(scope.row)">
              <el-option
                v-for="area in scope.row.wmsWarehouseAreaList"
                :key="area.id"
                :label="area.areaName"
                :value="area.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="目标库位" prop="targetSeat" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-select v-model="scope.row.targetSeat" placeholder="请选择目标库位">
              <el-option
                v-for="seat in scope.row.wmsWarehouseSeatList"
                :key="seat.id"
                :label="seat.seatName"
                :value="seat.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="移出数量" prop="relocationQuantity" width="150">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.relocationQuantity" placeholder="请输入移出数量" min="0" type="number"/>
          </template>
        </el-table-column>
        <el-table-column label="现有库存" prop="existingInventory" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.existingInventory" placeholder="请输入现有库存" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="锁定库存" prop="lockInventory" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lockInventory" placeholder="请输入现有库存" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="批号" prop="batchNumber" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNumber" placeholder="请输入批号" disabled/>
          </template>
        </el-table-column>

        <el-table-column label="移出原因" prop="reason" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reason" placeholder="请输入移出原因"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRelocatioln">确 定</el-button>
        <el-button @click="relocationOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInventory, getInventory, delInventory, addInventory, updateInventory, listMaterial, listWarehouse, getWarehouse, getArea, getRelocationInfo , relocation} from "@/api/wms/inventory";
import Vue from 'vue';

export default {
  name: "Inventory",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsInventoryDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 物料库存表格数据
      inventoryList: [],
      // 库存明细表格数据
      wmsInventoryDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      disabled: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialName: null,
        materialModel: null,
        materialSpecifications: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialId: [
          { required: true, message: "请选择物料", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "请选择仓库", trigger: "change" }
        ],
        warehouseSeatId: [
          {required: true, message: "库位不能为空", trigger: "change"}
        ],
        warehouseAreaId: [
          {required: true, message: "库区不能为空", trigger: "change"}
        ],
        inventoryLimit: [
          { type: 'number', message: '必须为数字值'}
        ],
        inventoryLower: [
          { type: 'number', message: '必须为数字值'}
        ],
        existingInventory: [
          { required: true, message: "库存不能为空", trigger: "blur" },
          { type: 'number', message: '库存必须为数字值'}
        ]
      },
      // 物料数据
      materialList: [],
      // 仓库数据
      warehouseList: [],
      wmsWarehouseAreaList: [],
      wmsWarehouseSeatList: [],
      relocationList: [],
      relocationOpen: false,
      relocationTitle: '移库信息'
    };
  },
  watch: {
    'wmsInventoryDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsInventoryDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询物料库存列表 */
    getList() {
      this.loading = true;
      listInventory(this.queryParams).then(response => {
        this.inventoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询物料 */
    getMaterialList() {
      listMaterial().then(response => {
        this.materialList = response.data;
      });
    },
    /** 查询仓库 */
    getWarehouseList() {
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.relocationOpen = false;
      this.disabled = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseId: null,
        materialId: null,
        totalInventory: null,
        lockInventory: null,
        inventoryLimit: null,
        inventoryLower: null
      };
      this.wmsInventoryDetailsList = [];
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMaterialList();
      this.getWarehouseList();
      this.wmsWarehouseAreaList = [];
      this.wmsWarehouseSeatList = [];
      this.open = true;
      this.title = "添加物料库存";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getMaterialList();
      this.getWarehouseList();
      const id = row.id || this.ids
      getInventory(id).then(response => {
        this.form = response.data;
        this.wmsInventoryDetailsList = response.data.wmsInventoryDetailsList;
        this.wmsInventoryDetailsList.forEach((item, index) => {
          this.wmsWarehouseAreaList = item.wmsWarehouseAreaList;
          this.wmsWarehouseSeatList = item.wmsWarehouseSeatList;
        })
        this.open = true;
        this.title = "修改物料库存";
      });
    },
    /** 移库操作 */
    handleYiku(row){
      this.reset();
      const id = row.id;
      this.getWarehouseList();
      this.wmsWarehouseAreaList = [];
      this.wmsWarehouseSeatList = [];
      getRelocationInfo(id).then(response => {
        this.relocationList = response.data;
        this.relocationList.forEach((item,index) => {
          Vue.set(item,'targetWarehouse',null);
          Vue.set(item,'targetArea',null);
          Vue.set(item,'targetSeat',null);
          Vue.set(item,'wmsWarehouseAreaList',[]);
          Vue.set(item,'wmsWarehouseSeatList',[]);
          Vue.set(item,'executor',null);
          Vue.set(item,'relocationQuantity',0);
          Vue.set(item,'reason',null);
        });
        this.relocationOpen = true;
      });
    },
    submitRelocatioln(){
      relocation(this.relocationList).then(res =>{
        this.$modal.msgSuccess("移库成功");
        this.relocationOpen = false;
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inventoryLimit && this.form.inventoryLower) {
            if (this.form.inventoryLimit <= this.form.inventoryLower) {
              this.$modal.msgError("请输入正确的库存上限及下限！");
              return
            }
          }

          this.form.wmsInventoryDetailsList = this.wmsInventoryDetailsList;
          if (this.form.id != null) {
              updateInventory(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            }else {
            addInventory(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物料库存编号为"' + ids + '"的数据项？').then(function() {
        return delInventory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	  /** 库存明细序号 */
    rowWmsInventoryDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 库存明细序号 */
    rowWmsRelocationInfoIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 库存明细添加按钮操作 */
    handleAddWmsInventoryDetails() {
      let obj = {};
      obj.warehouseAreaId = "";
      obj.warehouseSeatId = "";
      obj.wmsWarehouseAreaList = [];
      obj.wmsWarehouseSeatList = [];
      obj.existingInventory = "";
      obj.manufactureDate = "";
      obj.manufacturer = "";
      obj.batchNumber = "";
      obj.remark = "";
      this.wmsInventoryDetailsList.push(obj);
      this.setInventoryDetail()
    },
    /** 库存明细删除按钮操作 */
    handleDeleteWmsInventoryDetails() {
      if (this.checkedWmsInventoryDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的库存明细数据");
      } else {
        const wmsInventoryDetailsList = this.wmsInventoryDetailsList;
        const checkedWmsInventoryDetails = this.checkedWmsInventoryDetails;
        this.wmsInventoryDetailsList = wmsInventoryDetailsList.filter(function(item) {
          return checkedWmsInventoryDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsInventoryDetailsSelectionChange(selection) {
      this.checkedWmsInventoryDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/inventory/export', {
        ...this.queryParams
      }, `inventory_${new Date().getTime()}.xlsx`)
    },
    /** 获取库区列表操作 */
    handleWarehouseArea(warehouseId){
      this.wmsInventoryDetailsList.forEach((item, index) => {
        item.warehouseAreaId = '';
        item.warehouseSeatId = '';
        item.wmsWarehouseSeatList = [];
        this.getWarehouseAreaList(warehouseId, index)
      })
    },
    //获取库区
    getWarehouseAreaList(warehouseId, index) {
      if (!warehouseId) {
        return;
      }
      getWarehouse(warehouseId).then(res => {
        this.wmsInventoryDetailsList[index].wmsWarehouseAreaList = res.data.wmsWarehouseAreaList;
      });
    },
    /** 获取库位列表操作 */
    handleWarehouseSeat(row){
      this.wmsInventoryDetailsList[row.index-1].warehouseSeatId = '';
      getArea(row.warehouseAreaId).then(response => {
        this.wmsInventoryDetailsList[row.index-1].wmsWarehouseSeatList = response.data.wmsWarehouseSeatList
      });
    },
    setInventoryDetail() {
      this.wmsInventoryDetailsList.forEach((item, index) => {
        this.getWarehouseAreaList(this.form.warehouseId, index)
      })
    },
    /** 获取目标库区列表操作 */
    handleTargetWarehouseArea(row){
      console.log(row.index);
      getWarehouse(row.targetWarehouse).then(response => {
        this.relocationList[row.index-1].wmsWarehouseAreaList = response.data.wmsWarehouseAreaList;
        this.relocationList[row.index-1].targetArea = '';
        this.relocationList[row.index-1].targetSeat = '';
        this.relocationList[row.index-1].wmsWarehouseSeatList = [];
      });
    },

        /** 获取目标库位列表操作 */
    handlTargeteWarehouseSeat(row){
        this.relocationList[row.index-1].targetSeat = '';
        getArea(row.targetArea).then(response => {
          this.relocationList[row.index-1].wmsWarehouseSeatList = response.data.wmsWarehouseSeatList
        });
    },
    rowClassName({row, rowIndex}) {
      if (row.inventoryLower && row.totalInventory < row.inventoryLower) {
        return 'lower';
      }
      if (row.inventoryLimit && row.totalInventory > row.inventoryLimit) {
        return 'limit';
      }
      return '';
    }
  }
};
</script>
<style>
.el-table .lower {
  background-color: #f0f9eb;
}
.el-table .limit {
  background-color: oldlace;
}
</style>
