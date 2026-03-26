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
      <el-form-item label="调度单号" prop="vehicleNo">
        <el-input
          v-model="queryParams.vehicleNo"
          placeholder="请输入调度单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配送状态" prop="deliveryStatus">
        <el-select v-model="queryParams.deliveryStatus" placeholder="请选择配送状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_delivery_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-date-picker
          v-model="daterangeDeliveryTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="到达时间">
        <el-date-picker
          v-model="daterangeArrivalTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客户" prop="customId">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable>
          <el-option
            v-for="dict in customList"
            :key="dict.id"
            :label="dict.customName"
            :value="dict.id"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wms:distribution:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="distributionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center"/>
      <el-table-column label="编号" align="center" prop="id" width="50 "/>
      <el-table-column label="单据号" align="center" prop="documentNo"/>
      <el-table-column label="调度单号" align="center" prop="vehicleNo"/>
      <el-table-column label="车牌号" align="center" prop="carNumber"/>
      <el-table-column label="司机" align="center" prop="driver"/>
      <el-table-column label="司机联系电话" align="center" prop="driverPhone"/>
      <el-table-column label="配送状态" align="center" prop="deliveryStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_delivery_status" :value="scope.row.deliveryStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="配送时间" align="center" prop="deliveryTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到达时间" align="center" prop="arrivalTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.arrivalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center" prop="customName"/>
      <el-table-column label="客户联系人" align="center" prop="linkman"/>
      <el-table-column label="客户联系电话" align="center" prop="linkmanPhoneNumber"/>
      <el-table-column label="配送地址" align="center" prop="deliveryAddress"/>
      <el-table-column label="发货地址" align="center" prop="shippingAddress"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.deliveryStatus==0"
            size="mini"
            type="text"
            icon="el-icon-bell"
            @click="handleUpdateStatus(scope.row,1)"
          >配送
          </el-button>
          <el-button
            v-if="scope.row.deliveryStatus==1"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleUpdateStatus(scope.row,2)"
          >收货
          </el-button>
          <el-button
            v-if="scope.row.deliveryStatus==0"
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

    <!-- 添加或修改智能仓储WMS-运输管理-配送管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form.documentNo" disabled/>
        </el-form-item>
        <el-form-item label="调度单号" prop="vehicleNo">
          <el-input v-model="form.vehicleNo" placeholder="请选择" disabled>
            <el-button slot="append" @click="handleSelect" :disabled="form.deliveryStatus == 0 ? false : true">选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-select v-model="form.carNumber" placeholder="请选择" clearable @change="handleChangeCarNum" :disabled="form.deliveryStatus == 0 ? false : true">
            <el-option
              v-for="dict in carNumberList"
              :key="dict.carNumber"
              :label="dict.carNumber"
              :value="dict.carNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="司机" prop="driver">
          <el-input v-model="form.driver" disabled/>
        </el-form-item>
        <el-form-item label="司机联系电话" prop="driverPhone">
          <el-input v-model="form.driverPhone" disabled/>
        </el-form-item>
        <el-form-item label="客户" prop="customName">
          <el-input v-model="form.customName" disabled/>
        </el-form-item>
        <el-form-item label="客户联系人" prop="linkman">
          <el-input v-model="form.linkman" disabled/>
        </el-form-item>
        <el-form-item label="客户联系电话" prop="linkmanPhoneNumber">
          <el-input v-model="form.linkmanPhoneNumber" disabled/>
        </el-form-item>
        <el-form-item label="配送状态" prop="deliveryStatus">
          <el-select v-model="form.deliveryStatus" placeholder="请选择配送状态" disabled>
            <el-option
              v-for="dict in dict.type.wms_delivery_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送时间" prop="deliveryTime">
          <el-date-picker
            :disabled="form.deliveryStatus == 0 ? false : true"
            clearable
            v-model="form.deliveryTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择配送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到达时间" prop="arrivalTime">
          <el-date-picker
            clearable
            disabled
            v-model="form.arrivalTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择到达时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="配送地址" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" placeholder="请输入配送地址" :disabled="form.deliveryStatus == 0 ? false : true"/>
        </el-form-item>
        <el-form-item label="发货地址" prop="shippingAddress">
          <el-input v-model="form.shippingAddress" placeholder="请输入发货地址" :disabled="form.deliveryStatus == 0 ? false : true"/>
        </el-form-item>
      <el-divider content-position="center">配送单明细信息</el-divider>
      <el-table :data="wmsDistributionDetailsList" :row-class-name="rowWmsCarrierApplicationDetailsIndex"
                ref="wmsCarrierApplicationDetails" :aria-disabled="true">
        <!-- <el-table-column type="selection" width="50" align="center" /> -->
        <el-table-column label="序号" align="center" prop="index" width="50"/>
        <el-table-column label="物料" prop="materialName" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.materialName" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="生产批号" prop="batchNumber" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNumber" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="仓库" prop="warehouse" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.warehouseId" disabled>
              <el-option
                v-for="warehouse in warehouseList"
                :key="warehouse.id"
                :label="warehouse.warehouseName"
                :value="warehouse.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="库区" prop="area" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" disabled>
              <el-option
                v-for="area in scope.row.wmsWarehouseAreaList"
                :key="area.id"
                :label="area.areaName"
                :value="area.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="库位" prop="seat" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" disabled >
              <el-option
                v-for="seat in scope.row.wmsWarehouseSeatList"
                :key="seat.id"
                :label="seat.seatName"
                :value="seat.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" prop="shipmentQuantity" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsDistributionDetailsList.'+scope.$index+'.shipmentQuantity'" :rules="rules.shipmentQuantity">
              <el-input v-model.number="scope.row.shipmentQuantity" :disabled="form.deliveryStatus == 0 ? false : true"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="price" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="总价" prop="totalAmount" width="150">
          <template slot-scope="scope">
            <el-input :value="scope.row.price * scope.row.shipmentQuantity" placeholder="请输入总价" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入" :disabled="form.deliveryStatus == 0 ? false : true"/>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择调度单对话框 -->
    <el-dialog :title="title1" :visible.sync="open1" width="1050px" append-to-body>
      <el-form :model="vehicleSchedulingQueryParams" ref="queryForm1" size="small" :inline="true" v-show="showSearch1"
               label-width="68px">
        <el-form-item label="单据号" prop="documentNo">
          <el-input
            v-model="vehicleSchedulingQueryParams.documentNo"
            placeholder="请输入单据号"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery1">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading1" :data="vehicleSchedulingList" @selection-change="handleSelectionChange">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="单据号" align="center" prop="documentNo" />
        <el-table-column label="承运单号" align="center" prop="carrierApplicationDocumentNo" />
        <el-table-column label="客户" align="center" prop="customName" />
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
              icon="el-icon-thumb"
              @click="handleSelectCarrierApplication(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total1>0"
        :total="total1"
        :page.sync="vehicleSchedulingQueryParams.pageNum"
        :limit.sync="vehicleSchedulingQueryParams.pageSize"
        @pagination="getVehicleSchedulingList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDistribution,
  getDistribution,
  delDistribution,
  addDistribution,
  updateDistribution,
  listCustom
} from "@/api/wms/distribution";
import {listCarrierApplication, getCarrierApplication, listWarehouse} from "@/api/wms/carrierApplication";
import {getCustom} from "@/api/scm/custom";
import {getVehicleScheduling, listVehicleScheduling} from "@/api/wms/vehicleScheduling";

export default {
  name: "Distribution",
  dicts: ['wms_delivery_status'],
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
      // 智能仓储WMS-运输管理-配送管理表格数据
      distributionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 发货地址时间范围
      daterangeDeliveryTime: [],
      // 发货地址时间范围
      daterangeArrivalTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
        vehicleNo: null,
        carNumber: null,
        deliveryStatus: null,
        deliveryTime: null,
        arrivalTime: null,
        customId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carNumber: [
          {required: true, message: "车牌号不能为空", trigger: "blur"}
        ],
        deliveryTime: [
          {required: true, message: "配送时间不能为空", trigger: "blur"}
        ],
        deliveryAddress: [
          {required: true, message: "配送地址不能为空", trigger: "blur"}
        ],
        shipmentQuantity: [
          {required: true, message: "发货数量不能为空", trigger: "blur"},
          {type: "number", message: "发货数量需要为数字值"}
        ]
      },
      // 智能仓储WMS-运输管理-配送单明细表格数据
      wmsDistributionDetailsList: [],
      // 客户列表
      customList: [],
      // 查看承运申请弹出层标题
      title1: "",
      // 查看承运申请是否显示弹出层
      open1: false,
      // 车辆调度表格数据
      vehicleSchedulingList: [],
      // 车辆调度查询参数
      vehicleSchedulingQueryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
        outboundNo: null,
        custom: null,
      },
      // 遮罩层
      loading1: true,
      // 显示搜索条件
      showSearch1: true,
      // 总条数
      total1: 0,
      // 车牌号列表
      carNumberList: [],
      warehouseList: []
    };
  },
  watch: {
    'wmsDistributionDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsDistributionDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getCustomList();
  },
  methods: {
    /** 查询智能仓储WMS-运输管理-配送管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDeliveryTime && '' != this.daterangeDeliveryTime) {
        this.queryParams.params["beginDeliveryTime"] = this.daterangeDeliveryTime[0];
        this.queryParams.params["endDeliveryTime"] = this.daterangeDeliveryTime[1];
      }
      if (null != this.daterangeArrivalTime && '' != this.daterangeArrivalTime) {
        this.queryParams.params["beginArrivalTime"] = this.daterangeArrivalTime[0];
        this.queryParams.params["endArrivalTime"] = this.daterangeArrivalTime[1];
      }
      listDistribution(this.queryParams).then(response => {
        this.distributionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
    },
    // 获取客户列表
    getCustomList() {
      listCustom().then(response => {
        this.customList = response.data;
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
        vehicleId: null,
        vehicleNo: null,
        carNumber: null,
        driver: null,
        driverPhone: null,
        deliveryStatus: 0,
        deliveryTime: null,
        arrivalTime: null,
        customId: null,
        customName: null,
        linkman: null,
        linkmanPhoneNumber: null,
        deliveryAddress: null,
        shippingAddress: null
      };
      this.carNumberList = [];
      this.wmsDistributionDetailsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeDeliveryTime = [];
      this.daterangeArrivalTime = [];
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
      this.title = "添加配送单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDistribution(id).then(response => {
        this.form = response.data;
        this.wmsDistributionDetailsList = response.data.wmsDistributionDetailsList;
        this.carNumberList = response.data.wmsVehicleSchedulingDetailsList;
        this.open = true;
        this.title = "修改配送单";
      });
    },
    /** 配送按钮操作 */
    handleUpdateStatus(row, status) {
      row.deliveryStatus = status
      updateDistribution(row).then(response => {
        if (status == 1) {
          this.$modal.msgSuccess("开始配送");
        }
        if (status == 2) {
          this.$modal.msgSuccess("收货成功");
        }
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsDistributionDetailsList = this.wmsDistributionDetailsList
          if (this.form.id != null) {
            updateDistribution(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDistribution(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除配送管理编号为"' + ids + '"的数据项？').then(function () {
        return delDistribution(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/distribution/export', {
        ...this.queryParams
      }, `distribution_${new Date().getTime()}.xlsx`)
    },
    /** 智能仓储WMS-运输管理-承运申请明细序号 */
    rowWmsCarrierApplicationDetailsIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 选择查看承运申请按钮操作 */
    handleSelect() {
      this.getCustomList();
      this.getVehicleSchedulingList();
      this.open1 = true;
      this.title1 = "选择调度单";
    },
    /** 查询智能仓储WMS-运输管理-车辆调度列表 */
    getVehicleSchedulingList() {
      this.loading1 = true;
      this.vehicleSchedulingQueryParams.params = {};
      listVehicleScheduling(this.vehicleSchedulingQueryParams).then(response => {
        this.vehicleSchedulingList = response.rows;
        this.total1 = response.total;
        this.loading1 = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery1() {
      this.vehicleSchedulingQueryParams.pageNum = 1;
      this.getVehicleSchedulingList();
    },
    /** 重置按钮操作 */
    resetQuery1() {
      this.resetForm("queryForm1");
      this.handleQuery1();
    },
    /** 车辆调度选择按钮操作 */
    handleSelectCarrierApplication(row) {
      this.form.vehicleNo = row.documentNo;
      this.form.vehicleId = row.id;
      this.form.customId = row.customId
      this.form.customName = row.customName;
      this.form.deliveryAddress = row.address;
      this.form.linkman = row.contacts;
      this.form.linkmanPhoneNumber = row.telephone;
      getVehicleScheduling(row.id).then(response => {
        this.carNumberList = response.data.wmsVehicleSchedulingDetailsList
        getCarrierApplication(response.data.carrierApplicationId).then(response => {
          this.wmsDistributionDetailsList = response.data.wmsCarrierApplicationDetailsList
          this.form.customId = response.data.customId
        });
      });

      this.open1 = false;
    },
    handleChangeCarNum(val) {
      let data = this.carNumberList.filter(item => item.carNumber == val);
      this.form.driver = data[0].driver;
      this.form.driverPhone = data[0].driverPhone;
    },
    // 调度单取消按钮
    cancel1() {
      this.open1 = false;
    },
  },
};
</script>
