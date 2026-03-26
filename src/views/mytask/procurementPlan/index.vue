<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据号" prop="documentNumber">
        <el-input
          v-model="queryParams.documentNumber"
          placeholder="请输入单据号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="applicantId">
        <el-select v-model="queryParams.applicantId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker
          v-model="daterangeApplicantDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applicantStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.mytask_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="approvedId">
        <el-select v-model="queryParams.approvedId" placeholder="请选择审核人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.id"
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
            v-for="dict in dict.type.mytask_audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="procurementPlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentNumber" />
      <el-table-column label="申请人" align="center" prop="applicantName" />
      <el-table-column label="申请日期" align="center" prop="applicantDate" width="180">
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicantStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mytask_apply_status" :value="scope.row.applicantStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName" />
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mytask_audit_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
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

    <!-- 添加或修改采购计划审核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据号" prop="documentNumber">
          <el-input v-model="form.documentNumber" placeholder="请输入单据号" disabled/>
        </el-form-item>
        <el-form-item label="申请人" prop="applicantId">
          <el-select v-model="form.applicantId" placeholder="请选择申请人" clearable disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicantDate">
          <el-date-picker clearable
            v-model="form.applicantDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicantStatus">
          <el-select v-model="form.applicantStatus" placeholder="请选择申请状态" disabled>
            <el-option
              v-for="dict in dict.type.mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approvedName">
          <el-input v-model="form.approvedName" placeholder="请输入审核人" disabled/>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker clearable
            v-model="form.approvedDate"
            type="date"
            value-format="yyyy-MM-dd"
            disabled
            placeholder="请选择审核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.approvedStatus" placeholder="请选择审核状态" disabled>
            <el-option
              v-for="dict in dict.type.mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
        </el-form-item>
        <el-divider content-position="center">采购计划详细信息</el-divider>
        <el-table :data="form.scmPurchasePlanItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" placeholder="请输入型号" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="purchaseQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.purchaseQuantity" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" prop="demandedQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.demandedQuantity" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="需求日期" prop="demandedDate" width="150">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.demandedDate" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicantStatus == 1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applicantStatus == 1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPlan, updatePlan, listPlan, approvePlan} from "@/api/scm/purchasePlan";
import { mapGetters } from 'vuex';
import { getUserList } from "@/api/system/user";
export default {
  name: "ProcurementPlan",
  dicts: ['mytask_audit_status', 'mytask_apply_status'],
    computed: {
    ...mapGetters([
      'name',
    ]),
  },
  data() {
    return {
      modifyOpen: false,
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
      // 采购计划审核表格数据
      procurementPlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核意见时间范围
      daterangeApplicantDate: [],
      // 审核意见时间范围
      daterangeApprovedDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNumber: null,
        applicantId: null,
        applicantStatus: null,
        approvedId: null,
        approvedStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      userList: []
    };
  },
  created() {
    this.queryParams.applicantStatus = 1
    this.getUser();
    this.getList();
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
        }
      );
    },
    /** 查询采购计划审核列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeApplicantDate && '' != this.daterangeApplicantDate) {
        this.queryParams.params["beginApplicantDate"] = this.daterangeApplicantDate[0];
        this.queryParams.params["endApplicantDate"] = this.daterangeApplicantDate[1];
      }
      if (null != this.daterangeApprovedDate && '' != this.daterangeApprovedDate) {
        this.queryParams.params["beginApprovedDate"] = this.daterangeApprovedDate[0];
        this.queryParams.params["endApprovedDate"] = this.daterangeApprovedDate[1];
      }
      listPlan(this.queryParams).then(response => {
        this.procurementPlanList = response.rows;
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
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeApplicantDate = [];
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

    /** 详情按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlan(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改采购计划审核";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.approvedStatus = status
          approvePlan(this.form).then(response => {
              this.$modal.msgSuccess("审核成功");
              this.open = false;
              this.getList();
            });
        }
      });
    },
    /** 供应链SCM-采购管理-销售订单子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    handleScmSaleOrderItemSelectionChange(selection) {
      this.checkedScmSaleOrderItem = selection.map(item => item.index)
    },
  }
};
</script>
