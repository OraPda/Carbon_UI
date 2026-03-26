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
      <el-form-item label="出库单号" prop="outboundNo">
        <el-input
          v-model="queryParams.outboundNo"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货单号" prop="deliverNo">
        <el-input
          v-model="queryParams.deliverNo"
          placeholder="请输入发货单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="申请人" prop="applicant">
        <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="parseInt(dict.userId)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker
          v-model="daterangeApplicationDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applicationStatus">
        <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_carrier_application_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="approved">
        <el-select v-model="queryParams.approved" placeholder="请选择审核人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核日期">
        <el-date-picker
          v-model="daterangeApprovedDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="approvedStatus">
        <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_carrier_approved_status"
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wms:carrierApplication:add']"
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
          v-hasPermi="['wms:carrierApplication:edit']"
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
          v-hasPermi="['wms:carrierApplication:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wms:carrierApplication:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="carrierApplicationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentNo" />
      <el-table-column label="出库单号" align="center" prop="outboundNo" />
      <el-table-column label="发货单号" align="center" prop="deliverNo" />
      <el-table-column label="客户" align="center" prop="customerName" />
      <el-table-column label="收货地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="承运人" align="center" prop="carrier" />
      <el-table-column label="运输距离" align="center" prop="distance" />
      <el-table-column label="申请人" align="center" prop="applicantName" />
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_carrier_application_status" :value="scope.row.applicationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName">
      </el-table-column>
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_carrier_approved_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:carrierApplication:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改智能仓储WMS-运输管理-承运申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1050px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px"  :inline="true">
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form.documentNo" placeholder="请输入单据号" disabled/>
        </el-form-item>
        <el-form-item label="出库单号" prop="outboundNo">
          <el-input v-model="form.outboundNo" placeholder="请输入出库单号" disabled/>
        </el-form-item>
        <el-form-item label="发货单号" prop="deliverNo">
          <el-input v-model="form.deliverNo" placeholder="请输入发货单号" disabled/>
        </el-form-item>
        <el-form-item label="客户" prop="customId">
          <el-select v-model="form.customId" placeholder="请选择客户" disabled>
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
            v-model="form.deliveryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择交货日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入收货地址" disabled/>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" disabled/>
        </el-form-item>
        <el-form-item label="承运人" prop="carrier">
          <el-select v-model="form.carrier" placeholder="请选择审核人" clearable disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运输距离" prop="distance">
          <el-input v-model="form.distance" placeholder="请输入运输距离" disabled/>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="form.applicant" placeholder="请选择申请人" disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker clearable
            v-model="form.applicationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="form.applicationStatus" placeholder="请选择申请状态" disabled>
            <el-option
              v-for="dict in dict.type.wms_carrier_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
        </el-form-item>
        <el-divider content-position="center">承运申请明细信息</el-divider>
        <el-table :data="wmsCarrierApplicationDetailsList" ref="wmsCarrierApplicationDetails">
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="物料" prop="material" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" disabled />
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber" disabled />
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
              <el-input v-model="scope.row.shipmentQuantity" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  v-if="form.applicationStatus == 1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button  v-if="form.applicationStatus == 1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCarrierApplication,
  getCarrierApplication,
  listCustom,
  listUser,
  carrierApplication,
  listWarehouse,
} from "@/api/wms/carrierApplication";

export default {
  name: "CarrierApplication",
  dicts: ['wms_carrier_application_status', 'wms_carrier_approved_status'],
  data() {
    return {
      modifyOpen: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsCarrierApplicationDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智能仓储WMS-运输管理-承运申请表格数据
      carrierApplicationList: [],
      // 智能仓储WMS-运输管理-承运申请明细表格数据
      wmsCarrierApplicationDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 发货数量时间范围
      daterangeApplicationDate: [],
      // 发货数量时间范围
      daterangeApprovedDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
        outboundNo: null,
        deliverNo: null,
        customId: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: 1,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        custom: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        contacts: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        carrier: [
          { required: true, message: "承运人不能为空", trigger: "blur" }
        ],
        distance: [
          { required: true, message: "运输距离不能为空", trigger: "blur" }
        ],
      },
      // 用户列表
      userList: [],
      // 客户列表
      customList: [],
      // 仓库数据
      warehouseList: []
    };
  },
  created() {
    this.getList();
    this.getUserList();
    this.getCustomList();
  },
  methods: {
    /** 查询智能仓储WMS-运输管理-承运申请列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeApplicationDate && '' != this.daterangeApplicationDate) {
        this.queryParams.params["beginApplicationDate"] = this.daterangeApplicationDate[0];
        this.queryParams.params["endApplicationDate"] = this.daterangeApplicationDate[1];
      }
      if (null != this.daterangeApprovedDate && '' != this.daterangeApprovedDate) {
        this.queryParams.params["beginApprovedDate"] = this.daterangeApprovedDate[0];
        this.queryParams.params["endApprovedDate"] = this.daterangeApprovedDate[1];
      }
      listCarrierApplication(this.queryParams).then(response => {
        this.carrierApplicationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取用户列表
    getUserList() {
      listUser().then(response => {
        this.userList = response.data;
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
        outboundNo: null,
        deliverNo: null,
        custom: null,
        deliveryDate: null,
        address: null,
        contacts: null,
        telephone: null,
        carrier: null,
        distance: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        remark: null,
        approvedComments: null
      };
      this.wmsCarrierApplicationDetailsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeApplicationDate = [];
      this.daterangeApprovedDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
      const id = row.id || this.ids
      getCarrierApplication(id).then(response => {
        this.form = response.data;
        this.wmsCarrierApplicationDetailsList = response.data.wmsCarrierApplicationDetailsList;
        this.open = true;
        this.modifyOpen = true;
        this.title = "修改承运申请";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsCarrierApplicationDetailsList = this.wmsCarrierApplicationDetailsList;
          this.form.approvedStatus = status;
          carrierApplication(this.form).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
	/** 智能仓储WMS-运输管理-承运申请明细序号 */
    rowWmsCarrierApplicationDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/carrierApplication/export', {
        ...this.queryParams
      }, `carrierApplication_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
