<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryParams.contractNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请编号" prop="applicationNo">
        <el-input
          placeholder="请输入申请编号"
          clearable
          v-model="queryParams.applicationNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="saleSupplierName">
        <el-select placeholder="请选择" v-model="queryParams.saleSupplierId" clearable>
          <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="签约日期">
        <el-date-picker
          v-model="daterangeSigningDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applicantId">
        <el-select v-model="queryParams.applicantId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickName"
            :value="user.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="daterangeStartDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applicantStatus">
        <el-select v-model="queryParams.applicantStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.scm_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="approvedId">
        <el-select v-model="queryParams.approvedId" placeholder="请选择审核人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickName"
            :value="user.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="daterangeEndDate"
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
            v-for="dict in dict.type.scm_audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
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

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="合同编号" align="center" prop="contractNo"/>
      <el-table-column label="申请编号" align="center" prop="applicationNo"/>
      <el-table-column label="供应商" align="center" prop="saleSupplierName"/>
      <el-table-column label="联系人" align="center" prop="contacts"/>
      <el-table-column label="联系方式" align="center" prop="contactNumber"/>
      <el-table-column label="合同金额" align="center" prop="contractAmount"/>
      <el-table-column label="送货方式" align="center" prop="deliveryMethod">
        <template slot-scope="scope">
          <span>{{ deliveryMethod[scope.row.deliveryMethod] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签约日期" align="center" prop="signingDate"/>
      <el-table-column label="申请人" align="center" prop="applicantName"/>
      <el-table-column label="申请日期" align="center" prop="applicantDate"/>
      <el-table-column label="申请状态" align="center" prop="applicantStatus">
        <template slot-scope="scope">
          <span>{{ applictiontStatus[scope.row.applicantStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName"/>
      <el-table-column label="审核日期" align="center" prop="approvedDate"/>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <span>{{ approvedStatus[scope.row.approvedStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
            v-if="scope.row.approvedStatus != '1' && scope.row.applicantStatus != '1'"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改添加采购合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true"
              :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="系统自动生成" :disabled="true"/>
        </el-form-item>
        <el-form-item label="申请单号" prop="applicationNo">
          <el-input v-model="form.applicationNo" placeholder="请输入" style="width: 300px" :disabled="true">
            <el-button @click="changeOpenApply" slot="append">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="saleSupplierId">
          <el-select v-model="form.saleSupplierId" placeholder="请选择申请状态">
            <el-option
              v-for="dict in this.supplierList"
              :label="dict.supplierName"
              :value="dict.id"
              :key="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送货方式" prop="deliveryMethod">
          <el-select v-model="form.deliveryMethod" placeholder="请选择送货方式">
            <el-option label="客户自提" value="0"></el-option>
            <el-option label="快递物流" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约日期" prop="signingDate">
          <el-date-picker v-model="form.signingDate" placeholder="请输入" type="date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="申请人" prop="applicantName">
          <el-input v-model="form.applicantName" placeholder="请输入申请人" :disabled="true"/>
        </el-form-item>
        <el-form-item label="申请时间" prop="applicantDate">
          <el-date-picker clearable
                          v-model="form.applicantDate"
                          type="date"
                          :disabled="true"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择申请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicantStatus">
          <el-select v-model="form.applicantStatus" placeholder="请选择申请状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.scm_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approvedName">
          <el-input v-model="form.approvedName" placeholder="请输入审核人" :disabled="true"/>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker clearable
                          v-model="form.approvedDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          :disabled="true"
                          placeholder="请选择审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="form.approvedStatus" placeholder="请选择审核状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.scm_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)" z
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入" :disabled="true"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">采购合同详细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddScmSaleOrderItem">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteScmSaleOrderItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="scmSaleContractItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="220">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.materialName'" :rules="rules.materialName">
                <el-input placeholder="请选择" v-model="scope.row.materialName" disabled>
                  <el-button slot="append" @click="selectMaterial(scope.row)"
                            :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true">选择
                  </el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="amount" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="请输入单价" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="purchaseQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.purchaseQuantity'"
                            :rules="rules.purchaseQuantity">
                <el-input v-model.number="scope.row.purchaseQuantity" placeholder="请输入"
                          :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true"/>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="需求日期" prop="requirementDate" width="230px">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.requirementDate'"
                            :rules="rules.requirementDate">
                <el-date-picker v-model="scope.row.requirementDate" placeholder="请输入" type="date"
                                value-format="yyyy-MM-dd"
                                :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true"/>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="success" @click="saveForm">保 存
        </el-button>
        <el-button v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="primary" @click="submitForm">提 交
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->
    <!--采购申请选择-->
    <el-dialog title="选择采购申请" :visible.sync="applyOpen" width="1200px" append-to-body>
      <el-table :data="applyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="编号" align="center" type="index"/>
        <el-table-column label="申请单号" align="center" prop="applicationNo"/>
        <el-table-column label="申请类型" align="center" prop="applicationType">
          <template slot-scope="scope">
            <span>{{ applyType[scope.row.applicationType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划单号" align="center" prop="planNo"/>
        <el-table-column label="补货单号" align="center" prop="replenishmentNo"/>
        <el-table-column label="申请人" align="center" prop="applicantName"/>
        <el-table-column label="申请日期" align="center" prop="applicantDate"/>
        <el-table-column label="申请状态" align="center" prop="applicantStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.scm_apply_status" :value="scope.row.applicantStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="approvedName"/>
        <el-table-column label="审核日期" align="center" prop="approvedDate"/>
        <el-table-column label="审核状态" align="center" prop="approvedStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.scm_audit_status" :value="scope.row.approvedStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="changeSetContract(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="applyTotal"
        :page.sync="applyQueryParams.pageNum"
        :limit.sync="applyQueryParams.pageSize"
        @pagination="getApplyList"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listContract,
  addContract,
  delContract,
  updateContract,
  getContract,
  submitContract
} from '../../../api/scm/contract'
import {classifyTreeSelect, listMaterial} from "@/api/wms/material";
import {getUserList} from "@/api/system/user";
import {addApply, listApply, submitApply} from '@/api/scm/apply'
import {getListSupplier} from '@/api/scm/supplier'
import {getApply} from '@/api/scm/apply'
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";

export default {
  name: "purchaseContract",
  components: {
    MateriaDialog,
  },
  dicts: ['scm_apply_status', 'scm_audit_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedScmSaleOrderItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 1,
      // 供应链SCM-采购管理-采购合同表格数据
      contractList: [],
      // 供应链SCM-采购管理-采购合同子表格数据
      scmSaleContractItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        params: {},
        pageNum: 1,
        pageSize: 10,
        contractNo: null,
        applicationNo: null,
        saleSupplierId: null,
        applicantId: null,
        approvedId: null,
        approvedStatus: null
      },
      applyQueryParams: {
        pageNum: 1,
        pageSize: 10,
        approvedStatus: 1
      },
      applyTotal: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        saleSupplierId: [
          {required: true, message: "字段不能为空", trigger: "change"}
        ],
        deliveryMethod: [
          {required: true, message: "字段不能为空", trigger: "change"}
        ],
        signingDate: [
          {required: true, message: "字段不能为空", trigger: "blur"}
        ],
        materialName: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        purchaseQuantity: [
          {required: true, message: "采购数量不能为空", trigger: "blur"},
          {type: 'number', message: '必须为数字值'},
          { type: 'number',min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
        requirementDate: [
          {required: true, message: "需求日期不能为空", trigger: "change"}
        ],
      },
      // 物料列表
      materialList: [],
      // 物料弹出框
      materialOpen: false,
      // 部门树选项
      classifyOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      materialQuery: {
        classifyId: null
      },
      materialIndex: null,
      userList: [],
      // 备注时间范围
      daterangeSigningDate: [],
      // 备注时间范围
      daterangeStartDate: [],
      // 备注时间范围
      daterangeEndDate: [],
      applyList: [],

      applyOpen: false,

      applyForm: {
        applicantStatus: 2
      },
      deliveryMethod: [
        '客户自提', '快递物流'
      ],
      applictiontStatus: [
        '未提交', '待审核', '已审核'
      ],
      approvedStatus: [
        '驳回', '通过'
      ],
      applyType: [
        '计划申请', '补货申请'
      ],
      supplierList: []
    };
  },
  watch: {
    'scmSaleContractItemList': {
      handler(newVal, oldVal) {
        this.form.scmSaleContractItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getUser();
    this.getSupplier();
  },
  methods: {
    close() {
      this.materialOpen = false
    },
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
        }
      );
    },
    /** 查询供应链SCM-采购管理-采购合同列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeStartDate && '' != this.daterangeStartDate) {
        this.queryParams.params["beginApplicantDate"] = this.daterangeStartDate[0];
        this.queryParams.params["endApplicantDate"] = this.daterangeStartDate[1];
      }
      if (null != this.daterangeEndDate && '' != this.daterangeEndDate) {
        this.queryParams.params["beginApprovedDate"] = this.daterangeEndDate[0];
        this.queryParams.params["endApprovedDate"] = this.daterangeEndDate[1];
      }

      if (null != this.daterangeSigningDate && '' != this.daterangeSigningDate) {
        this.queryParams.params["beginSigningDate"] = this.daterangeSigningDate[0]
        this.queryParams.params["endSigningDate"] = this.daterangeSigningDate[1]
      }
      listContract(this.queryParams).then(res => {
        this.contractList = res.rows
        this.total = res.total
        this.loading = false;
      })
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
        contractNo: null,
        applicationNo: null,
        saleSupplierName: null,
        deliveryMethod: null,
        signingDate: null,
        applicantName: null,
        applicantDate: null,
        applicantStatus: null,
        approvedName: null,
        approvedDate: null,
        approvedComments: null,
        approvedStatus: null,
        remark: null,
      };
      this.scmSaleOrderItemList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {}
      this.daterangeSigningDate = [];
      this.daterangeStartDate = [];
      this.daterangeEndDate = [];
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
      this.scmSaleContractItemList = []
      this.form = {}
      this.title = "添加采购合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids;
      getContract(ids).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.scmSaleContractItemList = this.form.scmPurchaseContractItemList
        }
      })
      this.open = true;
      this.title = "修改采购合同";
    },

    getPriceCount() {
      let count = 0
      this.scmSaleContractItemList.forEach(item => {
        count += item.amount * item.purchaseQuantity
      })
      this.form.contractAmount = count;
    },
    // 保存提交数据
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.setRules()) {
            return
          } else {
            if (this.form.applicationId == null) {
              this.$message.error("请选择申请单号")
            } else {
              this.getPriceCount()
              this.form.scmPurchaseContractItemList = this.scmSaleContractItemList
              if (this.form.id != null) {
                updateContract(this.form).then(res => {
                  if (res.code === 200) {
                    this.$modal.msgSuccess("修改成功");
                    this.getList()
                  }
                })
                this.open = false;
              } else {
                addContract(this.form).then(res => {
                  if (res.code === 200) {
                    this.$modal.msgSuccess("新增成功");
                    this.getList()
                  }
                })
                this.open = false;
              }
            }
          }
        }
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.setRules()) {
            return
          } else {
            if (this.form.applicationId == null) {
              this.$message.error("请选择申请单号")
            } else {
              this.getPriceCount()
              this.form.scmPurchaseContractItemList = this.scmSaleContractItemList
              submitContract(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success("提交成功")
                  this.getList()
                  this.open = false
                }
              })
            }
          }
        }
      });

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除采购合同编号为1的数据项？').then(() => {
        delContract(ids).then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess("删除成功");
            this.getList()
          }
        })
      }).catch(() => {
      });
    },
    /** 供应链SCM-采购管理-采购合同子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-采购管理-采购合同子添加按钮操作 */
    handleAddScmSaleOrderItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.amount = "";
      obj.orderQuantity = "";
      obj.purchaseQuantity = "";
      obj.requirementDate = "";
      obj.remark = "";
      this.scmSaleContractItemList.push(obj);
    },
    /** 供应链SCM-采购管理-采购合同子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-采购管理-采购合同子数据");
      } else {
        const scmSaleContractItemList = this.scmSaleContractItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmSaleContractItemList = scmSaleContractItemList.filter(function (item) {
          return checkedScmSaleOrderItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleScmSaleOrderItemSelectionChange(selection) {
      this.checkedScmSaleOrderItem = selection.map(item => item.index)
    },
    // 选择物料弹出层按钮
    selectMaterial(row) {
      if (row) {
        this.materialIndex = row.index
      }
      this.materialOpen = true
    },
    // 选中物料数据
    handleChange(val) {
      this.scmSaleContractItemList[this.materialIndex - 1].materialName = val.materialName
      this.scmSaleContractItemList[this.materialIndex - 1].materialId = val.id
      this.scmSaleContractItemList[this.materialIndex - 1].materialModel = val.materialModel
      this.scmSaleContractItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.scmSaleContractItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.scmSaleContractItemList[this.materialIndex - 1].amount = val.materialPrice
      this.materialOpen = false
    },

    changeOpenApply() {
      this.applyOpen = true
      this.getApplyList()

    },

    getApplyList() {
      listApply(this.applyQueryParams).then(res => {
        this.applyList = res.rows
        this.applyTotal = res.total
      })
    },
    changeSetContract(item) {
      this.form.applicationId = item.id
      getApply(item.id).then(res => {
        this.form.applicationNo = res.data.applicationNo
        this.scmSaleContractItemList = []
        let data = res.data.scmPurchaseApplyItemList
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.amount = item.materialPrice;
          obj.purchaseQuantity = item.purchaseQuantity;
          obj.requirementDate = item.demandedDate;
          obj.remark = '';
          this.scmSaleContractItemList.push(obj);
        })
      })
      this.applyOpen = false
    },

    // 获取所有供应商
    getSupplier() {
      getListSupplier().then(res => {
        this.supplierList = res.data
      })
    },

    setRules() {
      if (this.form.saleSupplierId == null && this.form.deliveryMethod == null && this.form.singleDate == null) {
        return this.$message.error("请输入必填项")
      }
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
