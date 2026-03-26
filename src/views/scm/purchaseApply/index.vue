<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small"  :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请单号" prop="applicationNo">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryParams.applicationNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划单号" prop="planNo">
        <el-input
          placeholder="请输入计划单号"
          clearable
          v-model="queryParams.planNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请类型"  prop="applicationType">
        <el-select placeholder="请选择" v-model="queryParams.applicationType" clearable>
          <el-option key="0" label="计划申请" value="0"/>
          <el-option key="1" label="补货申请" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applicantId">
        <el-select v-model="queryParams.applicantId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.userId"
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
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="approvedId">
        <el-select v-model="queryParams.approvedId" placeholder="请选择审核人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.userId"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
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

    <!-- 添加或修改添加采购申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true" :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true">
        <el-form-item label="申请单号" prop="applicationNo">
          <el-input v-model="form.applicationNo" placeholder="请输入申请类型" :disabled="true"/>
        </el-form-item>
        <el-form-item label="计划单号" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请选择计划单号" :disabled="true" style="width: 400px">
            <el-button  slot="append" @click="changeOpenPlan()" :disabled="form.replenishmentNo == null ? false : true">选择</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="补货单号" prop="replenishmentNo">
          <el-input v-model="form.replenishmentNo" placeholder="请输入补货单号" :disabled="true"/>
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
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入" :disabled="true"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">采购申请详细信息</el-divider>
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
        <el-table :data="scmPurchaseApplyItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="220">
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseApplyItemList.'+scope.$index+'.materialName'" :rules="rules.materialName">
                <el-input placeholder="请选择" v-model="scope.row.materialName" disabled>
                  <el-button slot="append" @click="selectMaterial(scope.row)">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="materialPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="purchaseQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseApplyItemList.'+scope.$index+'.purchaseQuantity'" :rules="rules.purchaseQuantity">
                <el-input v-model.number="scope.row.purchaseQuantity" placeholder="请输入"/>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" prop="demandedQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseApplyItemList.'+scope.$index+'.demandedQuantity'" :rules="rules.demandedQuantity">
                <el-input v-model.number="scope.row.demandedQuantity" placeholder="请输入"/>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="需求日期" prop="demandedDate" width="230">
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseApplyItemList.'+scope.$index+'.demandedDate'" :rules="rules.demandedDate">
                <el-date-picker v-model="scope.row.demandedDate" placeholder="请输入" type="date" value-format="yyyy-MM-dd" />

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
        <el-button  v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="success" @click="saveForm">保 存</el-button>
        <el-button  v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->

    <!-- 选择采购计划弹框-->
    <el-dialog title="选择采购计划" :visible.sync="planOpen" width="1000px" append-to-body>
      <el-table :data="planList" @selection-change="handleSelectionChange">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="单据号" align="center" prop="documentNumber"/>
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
              @click="changeSet(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="planTotal"
        :page.sync="planQueryParams.pageNum"
        :limit.sync="planQueryParams.pageSize"
        @pagination="getPlanList"
      />
    </el-dialog>
  </div>
</template>

<script>
import {getUserList} from "@/api/system/user";
import {listApply, updateApply, delApply, addApply, getApply, submitApply} from '../../../api/scm/apply'
import {listPlan, getPlan} from '@/api/scm/purchasePlan'
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
export default {
  name: "purchaseApply",
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
      // 供应链SCM-采购管理-采购申请表格数据
      applyList: [],
      // 供应链SCM-采购管理-采购申请子表格数据
      scmPurchaseApplyItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        params: {},
        pageNum: 1,
        pageSize: 10,
        applicationNo: null,
        planNo: null,
        applicationType: null,
        applicantId:null,
        applicantStatus: null,
        approvedId: null,
        approvedStatus: null,
        beginEndDate: null,
        endEndDate: null,
      },
      planFrom: {
        approvedStatus: 1
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purchasingPlanId: [
          { required: true, message: "计划单号不能为空", trigger: "blur" }
        ],
        materialName: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        purchaseQuantity: [
          {required: true, message: "采购数量不能为空", trigger: "blur"},
          { type: 'number', message: '必须为数字值'},
          { type: 'number',min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
        demandedQuantity: [
          {required: true, message: "需求数量不能为空", trigger: "blur"},
          { type: 'number', message: '必须为数字值'},
          { type: 'number',min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
        demandedDate: [
          {required: true, message: "需求日期不能为空", trigger: "change"}
        ],
      },
      // 采购计划搜索
      planQueryParams: {
        pageNum: 1,
        pageSize: 10,
        approvedStatus: 1
      },
      // 采购计划列表总条数
      planTotal: 0,
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
      daterangeDeliveryDate: [],
      // 备注时间范围
      daterangeStartDate: [],
      // 备注时间范围
      daterangeEndDate: [],

      // 采购计划列表
      planList: [],
      planOpen: false,
      applyType: [
        '计划申请','补货申请'
      ]

    };
  },
  watch: {
    'scmPurchaseApplyItemList': {
      handler(newVal, oldVal) {
        this.form.scmPurchaseApplyItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getUser();
    this.getPlanList();
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
    /** 查询供应链SCM-采购管理-采购申请列表 */
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
      listApply(this.queryParams).then(res=> {
          this.applyList = res.rows
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
        applicationNo: null,
        purchasingPlanId: null,
        applicantName: null,
        applicantDate: null,
        applicantStatus: null,
        approvedName: null,
        approvedDate: null,
        approvedStatus: null,
        approvedComments: null,
        remark: null,
      };
      this.scmPurchaseApplyItemList = []
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeStartDate = [];
      this.daterangeEndDate = [];
      this.daterangeAuditTime = [];
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
      this.title = "添加采购申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getApply(id).then(res=> {
        if (res.code === 200) {
          this.form = res.data
          this.scmPurchaseApplyItemList = res.data.scmPurchaseApplyItemList
        }
      })

      this.open = true;
      this.title = "修改采购申请";
    },
    // 保存提交数据
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.purchasingPlanId === null && this.form.replenishmentNo == null) {
            this.$message.error("请选择单号")
            return
          }
          this.form.scmPurchaseApplyItemList = this.scmPurchaseApplyItemList
          if (this.form.id != null) {
            updateApply(this.form).then(res=>{
              if (res.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.getList()
              }
            })
            this.open = false;
          } else  {
            addApply(this.form).then(res=>{
              if (res.code === 200) {
                this.$modal.msgSuccess("新增成功");
                this.getList()
              }
            })
            this.open = false;
          }
        }
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.purchasingPlanId === null && this.form.replenishmentNo == null) {
            this.$message.error("请选择单号")
            return
          }
          this.form.scmPurchaseApplyItemList = this.scmPurchaseApplyItemList
          submitApply(this.form).then(res=>{
            if (res.code === 200) {
              this.$modal.msgSuccess("提交成功");
              this.getList()
              this.open = false;
            }
          })
        }
      });

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`是否确认删除采购申请编号为${ids}的数据项？`).then(() => {
        delApply(ids).then(res=> {
          if (res.code === 200) {
            this.$modal.msgSuccess("删除成功");
            this.getList()
          }
        })
      }).catch(() => {
      });
    },
    /** 供应链SCM-采购管理-采购申请子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-采购管理-采购申请子添加按钮操作 */
    handleAddScmSaleOrderItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.materialPrice = "";
      obj.purchaseQuantity = "";
      obj.demandedQuantity = "";
      obj.demandedDate = "";
      obj.remark = "";
      this.scmPurchaseApplyItemList.push(obj);
    },
    /** 供应链SCM-采购管理-采购申请子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-采购管理-采购申请子数据");
      } else {
        const scmPurchaseApplyItemList = this.scmPurchaseApplyItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmPurchaseApplyItemList = scmPurchaseApplyItemList.filter(function (item) {
          return checkedScmSaleOrderItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleScmSaleOrderItemSelectionChange(selection) {
      this.checkedScmSaleOrderItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('scm/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
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
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialName = val.materialName
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialId = val.id
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialModel =  val.materialModel
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.scmPurchaseApplyItemList[this.materialIndex - 1].materialPrice = val.materialPrice
      this.materialOpen = false
    },

    changeOpenPlan() {
      this.planOpen = true
      this.getPlanList()
    },

    getPlanList() {
      listPlan(this.planQueryParams).then(res=>{
        this.planList = res.rows
        this.planTotal = res.total
      })
    },
    changeSet(row) {
      this.form.purchasingPlanId = row.id
      this.form.planNo = row.documentNumber
      getPlan(row.id).then(res=> {
        this.scmPurchaseApplyItemList = []
        let data = res.data.scmPurchasePlanItemList
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.materialPrice = item.materialPrice;
          obj.purchaseQuantity = item.purchaseQuantity;
          obj.demandedQuantity = item.demandedQuantity;
          obj.demandedDate = item.demandedDate;
          obj.remark = '';
          this.scmPurchaseApplyItemList.push(obj);
        })
      })
      this.planOpen = false
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
