<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="申请单号" prop="documentNo">
        <el-input v-model="queryParams.documentNo" placeholder="请输入申请单号" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable>
          <el-option
            v-for="dict in dict.type.wms_application_business"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable size="small">
          <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType">
        <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable>
          <el-option
            v-for="dict in dict.type.wms_application_contract"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库状态" prop="documentStatus">
        <el-select v-model="queryParams.documentStatus" placeholder="请选择入库状态" clearable>
          <el-option
            v-for="dict in dict.type.wms_application_status1"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="applicationDate">
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
            v-for="dict in dict.type.wms_application_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
      <el-form-item label="审核日期" prop="approvedDate">
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
            v-for="dict in dict.type.wms_approved_status"
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
          v-hasPermi="['wms:warehousingApplication:add']"
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
          v-hasPermi="['wms:warehousingApplication:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehousingApplicationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="申请单号" align="center" prop="documentNo"/>
      <el-table-column label="关联单据号" align="center" prop="associationDocumentNo" width="150"/>
      <el-table-column label="业务类型" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_business" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" prop="supplierName"/>
      <el-table-column label="合同号" align="center" prop="contractNo"/>
      <el-table-column label="合同类型" align="center" prop="contractType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_contract" :value="scope.row.contractType"/>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="documentStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_status1" :value="scope.row.documentStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="applicationType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_type" :value="scope.row.applicationType"/>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicantName"/>
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_application_status" :value="scope.row.applicationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName"/>
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_approved_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleWarehousing(scope.row)"
            v-if="scope.row.approvedStatus == 1 && scope.row.documentStatus != 1"
          >入库
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

    <!-- 添加或修改智能仓储WMS-入库申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="95px" :inline="true" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">

        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable
                     @change="businessTypeChange">
            <el-option
              v-for="dict in dict.type.wms_application_business"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联单据号" prop="associationDocumentNo">
          <el-input v-model="form.associationDocumentNo" disabled>
            <el-button slot="append" @click="handleSelectDocument">选择
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="申请单号" prop="documentNo">
          <el-input v-model="form.documentNo" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType=='2'" label="供应商" prop="supplierId">
          <el-select v-model="form.supplierId" placeholder="请选择供应商" clearable filterable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.businessType!='1'" label="合同号" prop="contractNo">
          <el-input v-model="form.contractNo" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType!='1'" label="合同类型" prop="contractType">
          <el-select v-model="form.contractType" disabled>
            <el-option
              v-for="dict in dict.type.wms_application_contract"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请类型" prop="applicationType">
          <el-select v-model="form.applicationType" placeholder="" disabled>
            <el-option
              v-for="dict in dict.type.wms_application_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="form.applicant" placeholder="" disabled>
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker size="small" v-model="form.applicationDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="form.applicationStatus" placeholder="" disabled>
            <el-option v-for="dict in dict.type.wms_application_status" :key="dict.value" :label="dict.label"
                       :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="form.approved" placeholder="" disabled>
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker size="small" v-model="form.approvedDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="form.approvedStatus" placeholder="" disabled>
            <el-option v-for="dict in dict.type.wms_approved_status" :key="dict.value" :label="dict.label"
                       :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容"/>
        </el-form-item>
        <el-divider content-position="center">入库申请明细信息</el-divider>
        <el-table :data="wmsWarehousingApplicationDetailsList"
                  :row-class-name="rowWmsWarehousingApplicationDetailsIndex"
                  ref="wmsWarehousingApplicationDetails">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.materialName'"
                            :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" placeholder="" disabled>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouseId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseId'"
                            :rules="rules.warehouseId">
                <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库"
                           @change="handleWarehouseArea(scope.row)">
                  <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName"
                             :value="dict.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="warehouseAreaId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseAreaId'"
                            :rules="rules.warehouseAreaId">
                <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区"
                           @change="handleWarehouseSeat(scope.row)">
                  <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="warehouseSeatId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseSeatId'"
                            :rules="rules.warehouseSeatId">
                <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位">
                  <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发货数量" prop="arrivalNum" width="100">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.arrivalNum'"
                            :rules="rules.arrivalNum">
                <el-input v-model.number="scope.row.arrivalNum" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" prop="receiptNum" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.receiptNum'"
                            :rules="rules.receiptNum">
                <el-input v-model.number="scope.row.receiptNum" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel"/>
          <el-table-column label="规格" prop="materialSpecification"/>
          <el-table-column label="单位" prop="materialUnit"/>
          <el-table-column label="生产批号" prop="batchNumber" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.batchNumber'"
                            :rules="rules.batchNumber">
                <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="manufactureDate" width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.manufactureDate'"
                            :rules="rules.manufactureDate">
                <el-date-picker clearable v-model="scope.row.manufactureDate" type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择生产日期"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产单位" prop="productionUnit" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.productionUnit'"
                            :rules="rules.productionUnit">
                <el-input v-model="scope.row.productionUnit" placeholder="请输入生产单位"
                          />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" @click="saveForm()">保 存</el-button>
        <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    选择采购到货单-->
    <ArriveSelect :open="arriveSelectOpen" @onArriveSelected="handleArrive" @close="close"></ArriveSelect>
    <!--选择生产完工单-->
    <Completion status="3" :open.sync="completionOpen" @fun="selectCompletion" @close="close"/>
    <!--选择销售退货单-->
    <SaleReturn :open="saleReturnOpen" @close="close" @onSaleReturnSelected="saleReturnSelected"></SaleReturn>
  </div>
</template>

<script>
import {
  listWarehousingApplication,
  getWarehousingApplication,
  delWarehousingApplication,
  addWarehousingApplication,
  updateWarehousingApplication,
  listUser,
  listSupplier,
  listWarehouse,
  getWarehouse,
  getArea, subWarehousingApplication, warehousingApplication
} from "@/api/wms/warehousingApplication";
import SaleReturn from "../../components/Sale/SaleReturn.vue";
import ArriveSelect from "../../components/Purchase/ArrivalOrder.vue";
import Completion from "../../components/Completion/index.vue";
import {getReturn} from "@/api/scm/return";
import {getArrival} from "@/api/scm/arrival";

export default {
  name: "WarehousingApplication",
  dicts: ['wms_application_status', 'wms_application_business', 'wms_warehousing_application_document_no',
    'wms_application_contract', 'wms_approved_status', 'wms_application_status1', 'scm_put_status', 'wms_document_status', 'wms_application_type'],
  components: {
    SaleReturn,
    ArriveSelect,
    Completion
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsWarehousingApplicationDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智能仓储WMS-入库申请表格数据
      warehousingApplicationList: [],
      // 智能仓储WMS-入库申请明细表格数据
      wmsWarehousingApplicationDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      saleReturnOpen: false,
      arriveSelectOpen: false,
      completionOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNo: null,
        status: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        supplierName: null,
        businessType: null,
        contractType: null,
        documentStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        associationDocumentNo: [
          {required: true, message: "关联单据不能为空", trigger: "blur"}
        ],
        businessType: [
          {required: true, message: "业务类型不能为空", trigger: "blur"}
        ],
        materialName: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        warehouseId: [
          {required: true, message: "仓库不能为空", trigger: "change"}
        ],
        warehouseSeatId: [
          {required: true, message: "库位不能为空", trigger: "change"}
        ],
        warehouseAreaId: [
          {required: true, message: "库区不能为空", trigger: "change"}
        ],
        arrivalNum: [
          {required: true, message: "发货数量不能为空", trigger: "blur"},
          {type: 'number', min: 1, max: 65535, message: '必须为数字值且在1到65535之间'},
        ],
        receiptNum: [
          {required: true, message: "入库数量不能为空", trigger: "blur"},
          {type: 'number', min: 1, max: 65535, message: '必须为数字值且在1到65535之间'},
        ],
        batchNumber: [
          {required: true, message: "生产批号不能为空", trigger: "blur"}
        ]
      },
      // 用户列表
      userList: [],
      // 仓库数据
      warehouseList: [],
      // 供应商列表
      supplierList: [],
      // 备注时间范围
      daterangeApplicationDate: [],
      // 备注时间范围
      daterangeApprovedDate: [],
    };
  },
  created() {
    this.getList();
  },
  watch: {
    'wmsWarehousingApplicationDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsWarehousingApplicationDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询智能仓储WMS-入库申请列表 */
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
      listUser().then(response => {
        this.userList = response.data;
      })
      listSupplier().then(response => {
        this.supplierList = response.data;
      })
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
      listWarehousingApplication(this.queryParams).then(response => {
        this.warehousingApplicationList = response.rows;
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
        associationDocumentNo: null,
        documentNoId: null,
        documentNo: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        supplier: null,
        businessType: null,
        contractId: null,
        contractNo: null,
        contractType: null,
        documentStatus: null,
        warehousingStatus: null,
        remark: null,
        approvedComments: null,
        wmsWarehousingApplicationDetailsList : []
      };
      this.wmsWarehousingApplicationDetailsList = [];
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
      this.title = "添加入库申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWarehousingApplication(id).then(response => {
        this.form = response.data;
        this.wmsWarehousingApplicationDetailsList = response.data.wmsWarehousingApplicationDetailsList;
        this.open = true;
        this.title = "修改入库申请";
      });
    },
    /** 入库按钮操作 */
    handleWarehousing(row) {
      warehousingApplication({ id: row.id }).then(response => {
        this.$modal.msgSuccess("入库成功");
        this.getList();
      });

    },
    /** 保存按钮 */
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsWarehousingApplicationDetailsList = this.wmsWarehousingApplicationDetailsList;
          if (this.form.id != null) {
            updateWarehousingApplication(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehousingApplication(this.form).then(response => {
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
          this.form.wmsWarehousingApplicationDetailsList = this.wmsWarehousingApplicationDetailsList;
          subWarehousingApplication(this.form).then(response => {
            this.$modal.msgSuccess("提交成功");
            this.open = false;
            this.getList();
          });
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除入库申请编号为"' + ids + '"的数据项？').then(function () {
        return delWarehousingApplication(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 智能仓储WMS-入库申请明细序号 */
    rowWmsWarehousingApplicationDetailsIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/warehousingApplication/export', {
        ...this.queryParams
      }, `warehousingApplication_${new Date().getTime()}.xlsx`)
    },
    /** 获取库区列表操作 */
    handleWarehouseArea(row) {
      this.wmsWarehousingApplicationDetailsList[row.index - 1].warehouseAreaId = '';
      this.wmsWarehousingApplicationDetailsList[row.index - 1].warehouseSeatId = '';
      getWarehouse(row.warehouseId).then(response => {
        this.wmsWarehousingApplicationDetailsList[row.index - 1].wmsWarehouseAreaList = response.data.wmsWarehouseAreaList;
        console.log(this.wmsWarehousingApplicationDetailsList)
      });
    },
    /** 获取库位列表操作 */
    handleWarehouseSeat(row) {
      this.wmsWarehousingApplicationDetailsList[row.index - 1].warehouseSeatId = '';
      getArea(row.warehouseAreaId).then(response => {
        this.wmsWarehousingApplicationDetailsList[row.index - 1].wmsWarehouseSeatList = response.data.wmsWarehouseSeatList;
      });
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
      //生产入库
      if (this.form.businessType == '1') {
        this.completionOpen = true
      }
      //采购入库
      if (this.form.businessType == '2') {
        this.arriveSelectOpen = true
      }
      //退货入库
      if (this.form.businessType == '3') {
        this.saleReturnOpen = true;
      }
    },
    // 销售退货对话框数据回调
    saleReturnSelected(row) {

      getReturn(row.id).then(response => {
        this.form.associationDocumentNo = response.data.returnNo
        this.form.documentNoId = response.data.id
        this.form.contractNo = response.data.contractNo
        if (this.form.businessType == '2') {
          this.form.contractType = 1
        } else if (this.form.businessType == '3') {
          this.form.contractType = 2
        }
        this.wmsWarehousingApplicationDetailsList = []
        let data = response.data.scmSaleReturnItemList
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecification = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.arrivalNum = item.deliveryNum;
          obj.receiptNum = item.returnNum;
          obj.batchNumber = '';
          obj.manufactureDate = '';
          obj.productionUnit = '';
          obj.warehouseId = '';
          obj.warehouseAreaId = '';
          obj.warehouseSeatId = '';
          obj.wmsWarehouseAreaList = []
          obj.wmsWarehouseSeatList = []
          this.wmsWarehousingApplicationDetailsList.push(obj);
        })
      });
      this.saleReturnOpen = false;
    },
    // 选择到货单
    handleArrive(row) {
      getArrival(row.id).then(response => {
        this.form.associationDocumentNo = response.data.deliveryNumber
        this.form.documentNoId = response.data.id
        this.form.contractNo = response.data.purchasingContractNo
        if (this.form.businessType == '2') {
          this.form.contractType = 1
        } else if (this.form.businessType == '3') {
          this.form.contractType = 2
        }
        let data = response.data.scmPurchaseArrivalItemList
        this.wmsWarehousingApplicationDetailsList = []
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecification = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.arrivalNum = item.arrivalQuantity;
          obj.receiptNum = item.arrivalQuantity - item.returnQuantity;
          obj.batchNumber = item.batchNumber;
          obj.manufactureDate = '';
          obj.productionUnit = '';
          obj.warehouseId = '';
          obj.warehouseAreaId = '';
          obj.warehouseSeatId = '';
          obj.wmsWarehouseAreaList = []
          obj.wmsWarehouseSeatList = []
          this.wmsWarehousingApplicationDetailsList.push(obj)
        })

      });
      this.arriveSelectOpen = false;
    },
    // 选择生产完工单
    selectCompletion(row) {
      this.wmsWarehousingApplicationDetailsList = []
      this.form.associationDocumentNo = row.oddNumbers
      this.form.documentNoId = row.id
      let obj = {};
      obj.materialId = row.materialId;
      obj.materialName = row.materialName;
      obj.materialModel = row.materialModel;
      obj.materialSpecification = row.materialSpecifications;
      obj.materialUnit = row.materialUnit;
      obj.arrivalNum = row.quantity;
      obj.receiptNum = row.quantity;
      obj.batchNumber = row.batchNumber;
      obj.manufactureDate = '';
      obj.productionUnit = '';
      obj.warehouseId = '';
      obj.warehouseAreaId = '';
      obj.warehouseSeatId = '';
      obj.wmsWarehouseAreaList = []
      obj.wmsWarehouseSeatList = []
      this.wmsWarehousingApplicationDetailsList.push(obj);
      this.completionOpen = false;
    },
    // 关闭关联弹窗
    close() {
      this.saleReturnOpen = false;
      this.arriveSelectOpen = false;
      this.completionOpen = false
    },
    selectable(row, index) {
      if (row.applicantStatus == '1' || row.approvedStatus == '1') {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
