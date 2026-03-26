<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据号" prop="documentNo">
        <el-input
          v-model="queryParams.documentNo"
          placeholder="请输入单据号"
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

    <el-table v-loading="loading" :data="vehicleSchedulingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentNo" />
      <el-table-column label="承运单号" align="center" prop="carrierApplicationDocumentNo" />
      <el-table-column label="客户" align="center" prop="customName" />
      <el-table-column label="收货地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="承运人" align="center" prop="carrierName" />
      <el-table-column label="运输距离" align="center" prop="distance" />
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

    <!-- 添加或修改智能仓储WMS-运输管理-车辆调度对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form.documentNo" disabled/>
        </el-form-item>
        <el-form-item label="承运单号" prop="carrierApplicationDocumentNo">
          <el-input v-model="form.carrierApplicationDocumentNo" disabled>
            <el-button slot="append" @click="handleSelect">选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="出库单号" prop="outboundNo">
          <el-input v-model="form.outboundNo" disabled />
        </el-form-item>
         <el-form-item label="客户" prop="customName">
          <el-input v-model="form.customName" disabled />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" disabled />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" disabled />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" disabled />
        </el-form-item>
        <el-form-item label="承运人" prop="carrierName">
          <el-input v-model="form.carrierName" disabled />
        </el-form-item>
        <el-form-item label="运输距离" prop="distance">
          <el-input v-model="form.distance" disabled>
            <template slot="append">公里</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入" />
        </el-form-item>
        <el-divider content-position="center">车辆调度明细</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddWmsVehicleSchedulingDetails">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsVehicleSchedulingDetails">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsVehicleSchedulingDetailsList" :row-class-name="rowWmsVehicleSchedulingDetailsIndex" @selection-change="handleWmsVehicleSchedulingDetailsSelectionChange" ref="wmsVehicleSchedulingDetails">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="车牌号" prop="carNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.carNumber" placeholder="请输入车牌号" />
            </template>
          </el-table-column>
          <el-table-column label="驾驶员" prop="driver">
            <template slot-scope="scope">
              <el-input v-model="scope.row.driver" placeholder="请输入驾驶员" />
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="driverPhone">
            <template slot-scope="scope">
              <el-input v-model="scope.row.driverPhone" placeholder="请输入联系电话" />
            </template>
          </el-table-column>
          <el-table-column label="载重" prop="driverLoad">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsVehicleSchedulingDetailsList.'+scope.$index+'.driverLoad'" :rules="rules.driverLoad">
                <el-input v-model.number="scope.row.driverLoad" placeholder="请输入载重">
                  <template slot="append">Kg</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看承运申请对话框 -->
    <el-dialog :title="title1" :visible.sync="open1" width="1050px" append-to-body>
      <el-form :model="carrierApplicationQueryParams" ref="queryForm1" size="small" :inline="true" v-show="showSearch1" label-width="68px">
        <el-form-item label="单据号" prop="documentNo">
          <el-input
            v-model="carrierApplicationQueryParams.documentNo"
            placeholder="请输入单据号"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item label="出库单号" prop="outboundNo">
          <el-input
            v-model="carrierApplicationQueryParams.outboundNo"
            placeholder="请输入出库单号"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item label="发货单号" prop="deliverNo">
          <el-input
            v-model="carrierApplicationQueryParams.deliverNo"
            placeholder="请输入发货单号"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item label="客户" prop="customId">
          <el-select v-model="carrierApplicationQueryParams.customId" placeholder="请选择客户" clearable>
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery1">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading1" :data="carrierApplicationList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="单据号" align="center" prop="documentNo" />
        <el-table-column label="出库单号" align="center" prop="outboundNo" />
        <el-table-column label="发货单号" align="center" prop="deliverNo" />
        <el-table-column label="客户" align="center" prop="customerName" />
        <el-table-column label="收货地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="contacts" />
        <el-table-column label="联系电话" align="center" prop="telephone" />
        <el-table-column label="承运人" align="center" prop="carrierName" />
        <el-table-column label="运输距离" align="center" prop="distance" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="handleCarrierApplicationDetail(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="handleSelectCarrierApplication(scope.row)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total1>0"
        :total="total1"
        :page.sync="carrierApplicationQueryParams.pageNum"
        :limit.sync="carrierApplicationQueryParams.pageSize"
        @pagination="getCarrierApplicationList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看承运申请详情对话框 -->
    <el-dialog :title="title2" :visible.sync="open2" width="1050px" append-to-body>
      <el-form ref="form1" :model="form1" label-width="80px" disabled>
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form1.documentNo" placeholder="请输入单据号" />
        </el-form-item>
        <el-form-item label="出库单号" prop="outboundNo">
          <el-input v-model="form1.outboundNo" placeholder="请输入出库单号" />
        </el-form-item>
        <el-form-item label="发货单号" prop="deliverNo">
          <el-input v-model="form1.deliverNo" placeholder="请输入发货单号" />
        </el-form-item>
        <el-form-item label="客户" prop="custom">
          <el-select v-model="form1.custom" placeholder="请选择客户">
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form1.address" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form1.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form1.telephone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="承运人" prop="carrierName">
          <el-input v-model="form1.carrierName" placeholder="请输入承运人" />
        </el-form-item>
        <el-form-item label="运输距离" prop="distance">
          <el-input v-model="form1.distance" placeholder="请输入运输距离" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form1.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-divider content-position="center">承运申请明细信息</el-divider>
        <el-table :data="wmsCarrierApplicationDetailsList" :row-class-name="rowWmsCarrierApplicationDetailsIndex" ref="wmsCarrierApplicationDetails">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="material" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.material" placeholder="请输入物料" />
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号" />
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouse" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.warehouse" placeholder="请输入仓库" />
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="area" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.area" placeholder="请输入库区" />
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="seat" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.seat" placeholder="请输入库位" />
            </template>
          </el-table-column>
          <el-table-column label="发货数量" prop="shipmentQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.shipmentQuantity" placeholder="请输入发货数量" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVehicleScheduling, getVehicleScheduling, delVehicleScheduling, addVehicleScheduling, updateVehicleScheduling } from "@/api/wms/vehicleScheduling";
import { listCarrierApplication, getCarrierApplication, listCustom } from "@/api/wms/carrierApplication";

export default {
  name: "VehicleScheduling",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsVehicleSchedulingDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智能仓储WMS-运输管理-车辆调度表格数据
      vehicleSchedulingList: [],
      // 智能仓储WMS-运输管理-车辆调度明细表格数据
      wmsVehicleSchedulingDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carrierApplicationDocumentNo: [
          { required: true, message: "承运单号不能为空", trigger: "blur" }
        ],
        driverLoad: [
          { required: true, message: "载重不能为空", trigger: "blur" },
          { type: "number", message: "载重只能为数字值"}
        ]
      },
      // 查看承运申请弹出层标题
      title1: "",
      // 查看承运申请是否显示弹出层
      open1: false,
      // 承运申请表格数据
      carrierApplicationList: [],
      // 承运申请明细表格数据
      wmsCarrierApplicationDetailsList: [],
      // 承运申请查询参数
      carrierApplicationQueryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
        outboundNo: null,
        deliverNo: null,
        custom: null,
        approvedStatus: 1
      },
      // 客户列表
      customList: [],
      // 遮罩层
      loading1: true,
      // 显示搜索条件
      showSearch1: true,
      // 总条数
      total1: 0,
      // 承运申请明细表单参数
      form1: {},
       // 查看承运申请详情弹出层标题
      title2: "",
      // 查看承运申请详情是否显示弹出层
      open2: false,
    };
  },
  watch: {
    'wmsVehicleSchedulingDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsVehicleSchedulingDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智能仓储WMS-运输管理-车辆调度列表 */
    getList() {
      this.loading = true;
      listVehicleScheduling(this.queryParams).then(response => {
        this.vehicleSchedulingList = response.rows;
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
        documentNo: null,
        carrierApplicationDocumentNo: null,
        carrierApplicationId: null
      };
      this.wmsVehicleSchedulingDetailsList = [];
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
      this.open = true;
      this.title = "添加车辆调度单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVehicleScheduling(id).then(response => {
        this.form = response.data;
        this.wmsVehicleSchedulingDetailsList = response.data.wmsVehicleSchedulingDetailsList;
        this.open = true;
        this.title = "修改车辆调度单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsVehicleSchedulingDetailsList = this.wmsVehicleSchedulingDetailsList;
          if (this.form.id != null) {
            updateVehicleScheduling(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVehicleScheduling(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车辆调度编号为"' + ids + '"的数据项？').then(function() {
        return delVehicleScheduling(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 智能仓储WMS-运输管理-车辆调度明细序号 */
    rowWmsVehicleSchedulingDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 智能仓储WMS-运输管理-车辆调度明细添加按钮操作 */
    handleAddWmsVehicleSchedulingDetails() {
      let obj = {};
      obj.carNumber = "";
      obj.driver = "";
      obj.driverPhone = "";
      obj.driverLoad = "";
      this.wmsVehicleSchedulingDetailsList.push(obj);
    },
    /** 智能仓储WMS-运输管理-车辆调度明细删除按钮操作 */
    handleDeleteWmsVehicleSchedulingDetails() {
      if (this.checkedWmsVehicleSchedulingDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的车辆调度明细数据");
      } else {
        const wmsVehicleSchedulingDetailsList = this.wmsVehicleSchedulingDetailsList;
        const checkedWmsVehicleSchedulingDetails = this.checkedWmsVehicleSchedulingDetails;
        this.wmsVehicleSchedulingDetailsList = wmsVehicleSchedulingDetailsList.filter(function(item) {
          return checkedWmsVehicleSchedulingDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsVehicleSchedulingDetailsSelectionChange(selection) {
      this.checkedWmsVehicleSchedulingDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/vehicleScheduling/export', {
        ...this.queryParams
      }, `vehicleScheduling_${new Date().getTime()}.xlsx`)
    },
    /** 选择产看承运申请按钮操作 */
    handleSelect() {
      this.getCustomList();
      this.getCarrierApplicationList();
      this.open1 = true;
      this.title1 = "查看承运申请";
    },
    /** 查询智能仓储WMS-运输管理-承运申请列表 */
    getCarrierApplicationList() {
      this.loading1 = true;
      this.carrierApplicationQueryParams.params = {};
      listCarrierApplication(this.carrierApplicationQueryParams).then(response => {
        this.carrierApplicationList = response.rows;
        this.total1 = response.total;
        this.loading1 = false;
      });
    },
    // 获取承运申请客户列表
    getCustomList() {
      listCustom().then(response => {
        this.customList = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery1() {
      this.carrierApplicationQueryParams.pageNum = 1;
      this.getCarrierApplicationList();
    },
    /** 重置按钮操作 */
    resetQuery1() {
      this.resetForm("queryForm1");
      this.handleQuery1();
    },
    /** 承运申请选择按钮操作 */
    handleSelectCarrierApplication(row) {
      this.form.carrierApplicationDocumentNo = row.documentNo;
      this.form.carrierApplicationId = row.id;
      this.form.outboundNo = row.outboundNo;
      this.form.customName = row.customerName;
      this.form.address = row.address;
      this.form.contacts = row.contacts;
      this.form.telephone = row.telephone;
      this.form.carrierName = row.carrierName;
      this.form.distance = row.distance;
      this.open1 = false;
    },
    // 承运申请取消按钮
    cancel1() {
      this.open1 = false;
    },
    /** 承运申请详情按钮操作 */
    handleCarrierApplicationDetail(row) {
      this.reset1();
      const id = row.id
      getCarrierApplication(id).then(response => {
        this.form1 = response.data;
        this.wmsCarrierApplicationDetailsList = response.data.wmsCarrierApplicationDetailsList;
        this.open2 = true;
        this.title2 = "查看承运申请";
      });
    },
    /** 智能仓储WMS-运输管理-承运申请明细序号 */
    rowWmsCarrierApplicationDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    // 查看承运申请详情表单重置
    reset1() {
      this.form1 = {
        id: null,
        carrierApplicationDocumentNo: null,
        outboundNo: null,
        deliverNo: null,
        custom: null,
        deliveryDate: null,
        address: null,
        contacts: null,
        telephone: null,
        carrier: null,
        distance: null,
        remark: null
      };
      this.wmsCarrierApplicationDetailsList = [];
      this.resetForm("form1");
    },
    // 承运申请取消按钮
    cancel2() {
      this.open2 = false;
    }
  }
};
</script>
