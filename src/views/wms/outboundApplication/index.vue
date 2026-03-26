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
      <el-form-item label="客户" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择" clearable>
          <el-option
            v-for="dict in customList"
            :key="dict.id"
            :label="dict.customName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-select v-model="queryParams.applicant" clearable filterable>
          <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                     :value="dict.userId"></el-option>
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
      <el-form-item label="审核人" prop="approved">
        <el-select v-model="queryParams.approved" clearable filterable>
          <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                     :value="dict.userId"></el-option>
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
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable>
          <el-option
            v-for="dict in dict.type.wms_ountbound_application_type"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType">
        <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable>
          <el-option
            v-for="dict in dict.type.wms_outbound_application_order_type"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="applicationStatus">
        <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_outbound_application_application_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="approvedStatus">
        <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_outbound_application_approved_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单据状态" prop="documentStatus">
        <el-select v-model="queryParams.documentStatus" placeholder="请选择单据状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_outbound_application_status"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outboundApplicationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="单据号" align="center" prop="documentNo"/>
      <el-table-column label="关联单据号" align="center" prop="associationDocumentNo"/>
      <el-table-column label="业务类型" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_ountbound_application_type" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center" prop="customerName"/>
      <el-table-column label="合同编号" align="center" prop="contractNumber"/>
      <el-table-column label="合同类型" align="center" prop="contractType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_outbound_application_order_type" :value="scope.row.contractType"/>
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="applicationType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_type" :value="scope.row.applicationType"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="documentStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_outbound_application_status" :value="scope.row.documentStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicantName"/>
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_outbound_application_application_status"
                    :value="scope.row.applicationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName"/>
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_outbound_application_approved_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approvedStatus=='1'&&scope.row.documentStatus=='0'"
            @click="handleOutWarehouse(scope.row)"
          >分拣
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.documentStatus=='2'"
            @click="handleDelivery(scope.row)"
          >发货
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.documentStatus=='1'"
            @click="handleUpdate(scope.row)"
          >盘点
          </el-button>
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
            v-if="scope.row.approvedStatus!='1'&&scope.row.applicationStatus!='1'"
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

    <!-- 添加或修改智能仓储WMS-出库申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="95px" :inline="true" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable @change="businessTypeChange">
            <el-option
              v-for="dict in dict.type.wms_ountbound_application_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联单据号" prop="associationDocumentNo">
          <el-input v-model="form.associationDocumentNo" placeholder="请输入关联单据号" disabled>
            <el-button  slot="append" @click="handleSelectDocument">选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form.documentNo" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType=='2'" label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" clearable filterable>
            <el-option v-for="item in customList" :key="item.id" :label="item.customName"
                       :value="parseInt(item.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.businessType=='2'" label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType=='2'" label="合同类型" prop="contractType" disabled>
          <el-select v-model="form.contractType" placeholder="请选择" clearable filterable>
            <el-option
              v-for="dict in dict.type.wms_outbound_application_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="form.applicant" placeholder="" clearable filterable disabled>
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker clearable size="small" v-model="form.applicationDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="form.applicationStatus" placeholder="" clearable filterable disabled>
            <el-option
              v-for="dict in dict.type.wms_outbound_application_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="form.approved" placeholder="" clearable filterable disabled>
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker clearable size="small" v-model="form.approvedDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="form.approvedStatus" placeholder="" clearable filterable disabled>
            <el-option
              v-for="dict in dict.type.wms_outbound_application_approved_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" type="textarea" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="单据状态" prop="documentStatus">
          <el-select v-model="form.documentStatus" placeholder="" clearable filterable disabled>
            <el-option
              v-for="dict in dict.type.wms_outbound_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-divider v-if="form.associationDocumentNo" content-position="center">关联单据明细</el-divider>
        <el-table v-if="form.associationDocumentNo" :data="associationList" ref="bizBillDetail">
          <el-table-column label="物料" prop="materialName" width="200"/>
          <el-table-column label="型号" prop="materialModel">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit">
          </el-table-column>
          <el-table-column label="发货数量" prop="deliveryNum"/>
        </el-table>
        <el-divider content-position="center">出库申请明细</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button  type="primary"
                       icon="el-icon-plus" size="mini" @click="handleAddWmsOutboundApplicationDetails">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button  type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsOutboundApplicationDetails">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsOutboundApplicationDetailsList" :row-class-name="rowWmsOutboundApplicationDetailsIndex"
                  @selection-change="handleWmsOutboundApplicationDetailsSelectionChange" ref="wmsOutWarehouseApplyDetail">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="300">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.materialName'"
                            :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                  <el-button  slot="append" @click="handleSelectMaterial(scope.$index)"
                             >选择
                  </el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouseId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseId'">
                <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库" @change="handleWarehouseArea(scope.row)" disabled>
                  <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName" :value="dict.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="warehouseAreaId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseAreaId'">
                <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" @change="handleWarehouseSeat(scope.row)" disabled>
                  <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName" :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="warehouseSeatId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseSeatId'">
                <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" disabled>
                  <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="出库数量" prop="outboundNumber" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.outboundNumber'"
                            :rules="rules.outboundNumber">
                <el-input v-model.number="scope.row.outboundNumber" placeholder=""/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit">
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.batchNumber'">
                <el-input v-model="scope.row.batchNumber" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  v-if="form.documentStatus=='1'" type="primary" @click="checkConfirm">盘点确认</el-button>
        <el-button  v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary"
                   @click="saveForm()">保 存
        </el-button>
        <el-button  v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary"
                   @click="submitForm()">提 交
        </el-button>
        <el-button  @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    领料单-->
    <MaterialApplyDialog status="0" :open.sync="applyOpen" @fun="selectApply" @close="close"/>
    <!--    发货单-->
    <SaleDelivery :open.sync="deliveryOpen" @fun="selectDelivery" @close="close"/>
    <!--    物料库存明细-->
    <MaterialInventoryDetails :open.sync="materialOpen" @fun="selectMaterial" @close="close"/>
  </div>
</template>

<script>
import {
  listOutboundApplication,
  getOutboundApplication,
  delOutboundApplication,
  addOutboundApplication,
  updateOutboundApplication,
  listUser, subOutboundApplication, OutBound, outInventoryInfo, outDelivery
} from "@/api/wms/outboundApplication";
import {listCustom} from "@/api/wms/carrierApplication";
import {getArea, getWarehouse, listWarehouse, warehousingApplication} from "@/api/wms/warehousingApplication";
import MaterialApplyDialog from "../../components/MaterialApplyDialog/index.vue";
import SaleDelivery from "../../components/SaleDelivery/index.vue";
import MaterialInventoryDetails from "../../components/MaterialInventoryDetails/index.vue";
import {getApply} from "@/api/mes/apply";
import {getDelivery} from "@/api/scm/delivery";
export default {
  name: "OutboundApplication",
  dicts: ['wms_application_type','wms_outbound_application_approved_status', 'wms_ountbound_application_type', 'wms_outbound_application_application_status', 'wms_outbound_application_order_type', 'wms_outbound_application_status'],
  components: {
    MaterialApplyDialog,
    SaleDelivery,
    MaterialInventoryDetails
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsOutboundApplicationDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智能仓储WMS-出库申请表格数据
      outboundApplicationList: [],
      // 智能仓储WMS-出库申请明细表格数据
      wmsOutboundApplicationDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      applyOpen: false,
      deliveryOpen: false,
      materialOpen: false,
      // 出库数量时间范围
      daterangeApplicationDate: [],
      // 出库数量时间范围
      daterangeApprovedDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        type: null,
        orderType: null,
        custom: null,
        status: null,
        applicationName: null,
        applicationDate: null,
        applicationStatus: null,
        approvedName: null,
        approvedDate: null,
        approvedStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        associationDocumentNo: [
          { required: true, message: "关联单据号不能为空", trigger: "blur" }
        ],
        businessType: [
          { required: true, message: "业务类型不能为空", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "物料不能为空", trigger: "blur" }
        ],
        outboundNumber: [
          { required: true, message: "出库数量不能为空", trigger: "blur" },
          { type: 'number', message: '出库数量必须为数字值' },
        ]
      },
      // 用户列表
      userList: [],
      // 客户列表
      customList: [],
      // 物料列表
      materialList: [],
      // 订单列表
      orderList: [],
      warehouseList: [],
      warehouseAreaList: [],
      warehouseSeatList: [],
      associationList: [],
      materialIndex: null
    };
  },
  watch: {
    'wmsOutboundApplicationDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsOutboundApplicationDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智能仓储WMS-出库申请列表 */
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
      listOutboundApplication(this.queryParams).then(response => {
        this.outboundApplicationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser().then(response => {
        this.userList = response.data;
      })
      listCustom().then(response => {
        this.customList = response.data;
      })
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
    },
    /** 获取库区列表操作 */
    handleWarehouseArea(warehouseId,index) {
      getWarehouse(warehouseId).then(response => {
        this.wmsOutboundApplicationDetailsList[index].wmsWarehouseAreaList = response.data.wmsWarehouseAreaList;
      });
    },
    /** 获取库位列表操作 */
    handleWarehouseSeat(warehouseAreaId,index) {
      getArea(warehouseAreaId).then(response => {
        this.wmsOutboundApplicationDetailsList[index].wmsWarehouseSeatList = response.data.wmsWarehouseSeatList;
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
        associationDocumentNo: null,
        businessType: null,
        documentNo: null,
        customerId: null,
        contractNo: null,
        contractType: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        approvedComments: null,
        remark: null,
        documentStatus: null,
        wmsOutboundApplicationDetailsList : []
      };
      this.associationList = []
      this.wmsOutboundApplicationDetailsList = [];
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出库申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutboundApplication(id).then(response => {
        this.form = response.data;
        if (response.data.businessType == 1) {
          this.selectApply(response.data.documentNoId)
        } else if (response.data.businessType == 2) {
          this.selectDelivery(response.data.documentNoId)
        }
        this.wmsOutboundApplicationDetailsList = response.data.wmsOutboundApplicationDetailsList;
        this.open = true;
        this.title = "修改出库申请";
      });
    },
    // 分拣
    handleOutWarehouse(row) {
      OutBound({ id: row.id }).then(response => {
        this.$modal.msgSuccess("分拣成功");
        this.getList();
      });
    },
    // 盘点
    checkConfirm() {
      outInventoryInfo({ id: this.form.id }).then(response => {
        this.$modal.msgSuccess("盘点成功");
        this.open = false
        this.getList();
      });
    },
    // 发货
    handleDelivery(row) {
      outDelivery({ id: row.id }).then(response => {
        this.$modal.msgSuccess("发货成功");
        this.getList();
      });
    },
    /** 保存按钮 */
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.validateMaterial()) {
            return;
          }
          this.form.wmsOutboundApplicationDetailsList = this.wmsOutboundApplicationDetailsList;
          if (this.form.id != null) {
            updateOutboundApplication(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutboundApplication(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.validateMaterial()) {
            return;
          }

          this.form.wmsOutboundApplicationDetailsList = this.wmsOutboundApplicationDetailsList;
          subOutboundApplication(this.form).then(response => {
            this.$modal.msgSuccess("提交成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    validateMaterial() {
      let relevanceList = this.associationList.map(detail => parseInt(detail.materialId));
      let outList = this.wmsOutboundApplicationDetailsList.map(detail => detail.materialId);
      // 验证出库物料与申请明细物料
      let mList = relevanceList.concat(outList).filter(id => !relevanceList.includes(id) || !outList.includes(id));
      if (mList && mList.length > 0) {
        this.$modal.msgError('出库物料与申请明细物料不符');
        return false;
      }
      let outSum = {};
      // 验证出库数量
      this.wmsOutboundApplicationDetailsList.forEach(detail => {
        let materialId = detail.materialId;
        let outboundNumber = detail.outboundNumber;
        if (outSum[materialId]) {
          outSum[materialId] = outSum[materialId] + outboundNumber;
        } else {
          outSum[materialId] = outboundNumber;
        }
      });
      for (let detail of this.associationList) {
        let materialId = detail.materialId;
        let outQuantity = detail.deliveryNum;
        if (outSum[materialId] < outQuantity) {
          this.$modal.msgError('物料：' + detail.materialName + '出库数量不足');
          return false;
        }
        if (outSum[materialId] > outQuantity) {
          this.$modal.msgError('物料：' + detail.materialName + '出库数量超出');
          return false;
        }
      }
      return true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除出库申请编号为"' + ids + '"的数据项？').then(function () {
        return delOutboundApplication(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 智能仓储WMS-出库申请明细序号 */
    rowWmsOutboundApplicationDetailsIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 智能仓储WMS-出库申请明细添加按钮操作 */
    handleAddWmsOutboundApplicationDetails() {
      let obj = {};
      obj.warehouseId = '';
      obj.warehouseAreaId = '';
      obj.warehouseSeatId = '';
      obj.materialId = '';
      obj.materialName = '';
      obj.materialModel = '';
      obj.materialSpecification = '';
      obj.materialUnit = '';
      obj.batchNumber = '';
      obj.outboundNumber = '';
      obj.wmsWarehouseAreaList = []
      obj.wmsWarehouseSeatList = []
      this.wmsOutboundApplicationDetailsList.push(obj);
    },
    /** 智能仓储WMS-出库申请明细删除按钮操作 */
    handleDeleteWmsOutboundApplicationDetails() {
      if (this.checkedWmsOutboundApplicationDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的出库申请明细数据");
      } else {
        const wmsOutboundApplicationDetailsList = this.wmsOutboundApplicationDetailsList;
        const checkedWmsOutboundApplicationDetails = this.checkedWmsOutboundApplicationDetails;
        this.wmsOutboundApplicationDetailsList = wmsOutboundApplicationDetailsList.filter(function (item) {
          return checkedWmsOutboundApplicationDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsOutboundApplicationDetailsSelectionChange(selection) {
      this.checkedWmsOutboundApplicationDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/outboundApplication/export', {
        ...this.queryParams
      }, `outboundApplication_${new Date().getTime()}.xlsx`)
    },
    // 业务类型改变
    businessTypeChange(val) {
      this.reset()
      this.form.businessType = val
    },
    // 选择关联单据号
    handleSelectDocument() {
      // 判断是否选择业务类型
      if (!this.form.businessType) {
        this.$modal.msgError('请选择业务类型');
        return;
      }
      // 领料出库
      if (this.form.businessType == '1') {
        this.applyOpen = true
      }
      // 销售出库
      if (this.form.businessType == '2') {
        this.deliveryOpen = true
      }
    },
    // 选择物料
    handleSelectMaterial(index) {
      this.materialOpen = true;
      this.materialIndex = index;
    },
    //选择领料单
    selectApply(val) {
      getApply(val.id ? val.id : val).then(response => {
        this.form.associationDocumentNo = response.data.oddNumber
        this.form.documentNoId = response.data.id
        this.associationList = response.data.mesMaterialApplyItemList
        this.associationList.map(item => {
          item.deliveryNum = item. dosage
        })
      });
      this.applyOpen = false;
    },
    // 选择发货单
    selectDelivery(val) {
      getDelivery(val.id ? val.id : val).then(response => {
        this.form.associationDocumentNo = response.data.deliveryNo
        this.form.documentNoId = response.data.id
        this.associationList = response.data.scmSaleDeliveryItemList
        this.form.customerId = parseInt(response.data.customId)
        this.form.contractNo = response.data.contractNo
        this.form.contractType = 2
      });
      this.deliveryOpen = false
    },
    // 选择物料库存
    selectMaterial(val) {
      console.log(val);
      this.wmsOutboundApplicationDetailsList[this.materialIndex].warehouseId = val.warehouseId;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].warehouseAreaId = val.areaId;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].warehouseSeatId = val.seatId;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].materialId = val.materialId;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].materialName = val.materialName;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].materialModel = val.materialModel;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].materialSpecification = val.materialSpecifications;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].materialUnit = val.materialUnit;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].batchNumber = val.batchNumber;
      this.wmsOutboundApplicationDetailsList[this.materialIndex].outboundNumber = val.outboundNumber;
      this.handleWarehouseArea(val.warehouseId, this.materialIndex)
      this.handleWarehouseSeat(val.areaId, this.materialIndex)
    },
    close() {
      this.applyOpen = false;
      this.deliveryOpen = false
      this.materialOpen = false
    },
    selectable(row, index) {
      if (row.applicationStatus == '1' || row.approvedStatus == '1') {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
