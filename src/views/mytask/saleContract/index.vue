<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="签订日期" prop="daterangeSigningDate">
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
      <el-form-item label="业务员" prop="salesManId">
        <el-select v-model="queryParams.salesManId" placeholder="请选择业务员" clearable>
          <el-option
            v-for="user in salesManList"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="customId">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable>
          <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker clearable
                        v-model="queryParams.deliveryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择交货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applyId">
        <el-select v-model="queryParams.applyId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.id"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker
          v-model="daterangeApplyDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.mytask_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditorId">
        <el-select v-model="queryParams.auditorId" placeholder="请选择审核人" clearable>
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
          v-model="daterangeAuditDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditorStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
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
      <el-table-column label="合同编号" align="center" prop="contractNumber" width="180"/>
      <el-table-column label="订单编号" align="center" prop="orderNo" width="180"/>
      <el-table-column label="客户名称" align="center" prop="customName" width="180" />
      <el-table-column label="业务员" align="center" prop="salesMan" />
      <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
      </el-table-column>
      <el-table-column label="送货方式" align="center" prop="shipping">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.scm_shipping_type" :value="scope.row.shipping" />
        </template>
      </el-table-column>
      <el-table-column label="金额合计" align="center" prop="totalAmount" />
      <el-table-column label="签订日期" align="center" prop="signingDate" width="180">
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyName" />
      <el-table-column label="申请日期" align="center" prop="applyDate" width="180">
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applyStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mytask_apply_status" :value="scope.row.applyStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditorName" />
      <el-table-column label="审核日期" align="center" prop="auditTime" width="180">
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mytask_audit_status" :value="scope.row.auditStatus"/>
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
        <el-form-item label="订单编号" prop="orderNo">
          <el-input placeholder="请选择" v-model="form.orderNo" class="input-with-select" :disabled="true" />
        </el-form-item>
        <el-form-item label="送货方式" prop="shipping">
          <el-select v-model="form.shipping" placeholder="请选择送货方式" :disabled="true">
            <el-option
              v-for="dict in dict.type.scm_shipping_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签订日期" prop="signingDate">
          <el-date-picker clearable
                          v-model="form.signingDate"
                          type="date"
                          :disabled="true"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择签订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额合计" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入金额合计"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
                          v-model="form.deliveryDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择交货日期"
                          :disabled="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyId">
          <el-select v-model="form.applyId" placeholder="请选择申请人" clearable disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker clearable
            v-model="form.applyDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" disabled>
            <el-option
              v-for="dict in dict.type.mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditorId">
          <el-select v-model="form.auditorId" placeholder="请选择审核人" clearable disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="auditTime">
          <el-date-picker clearable
            v-model="form.auditTime"
            type="date"
            value-format="yyyy-MM-dd"
            disabled
            placeholder="请选择审核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" disabled>
            <el-option
              v-for="dict in dict.type.mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditorComments">
          <el-input v-model="form.auditorComments" placeholder="请输入审核意见" />
        </el-form-item>
        <el-divider content-position="center">采购计划详细信息</el-divider>
        <el-table :data="form.scmSaleContractItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品" prop="model" width="150">
            <template slot-scope="scope">
              {{scope.row.materialName}}
              <el-button
                size="mini"
                type="text"
                @click="selectMaterial(scope.row)"
              >选择
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="model" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled />
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="specification" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled />
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="unit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled />
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="unitPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" disabled />
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="orderQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.orderQuantity" placeholder="请输入订货数量" disabled />
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amount" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="请输入金额" disabled />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applyStatus==1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applyStatus==1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getContract, updateContract, listContract, approveContract} from "@/api/scm/saleContract";
import { mapGetters } from 'vuex';
import {getUserList} from "@/api/system/user";
import {listCustomList} from "@/api/scm/custom";
export default {
  name: "ProcurementPlan",
  dicts: ['mytask_audit_status', 'mytask_apply_status', 'scm_shipping_type'],
    computed: {
    ...mapGetters([
      'name',
    ]),
  },
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
      // 采购计划审核表格数据
      procurementPlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核意见时间范围
      daterangeApplyDate: [],
      // 审核意见时间范围
      daterangeAuditDate: [],
      // 签订日期范围
      daterangeSigningDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        customId: null,
        salesManId: null,
        applyId: null,
        applyStatus: 1,
        auditorId: null,
        auditStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      userList: [],
      customList: [],
      salesManList: []
    };
  },
  created() {
    // this.queryParams.applyStatus = 1
    this.getUser();
    this.getList();
    this.getCustom();
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
          this.salesManList = response.data;
        }
      );
    },
    getCustom() {
      listCustomList().then(response => {
        this.customList = response.data;
      });
    },
    /** 查询采购计划审核列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};

      if (null != this.daterangeApplyDate && '' != this.daterangeApplyDate) {
        this.queryParams.params["beginApplicantDate"] = this.daterangeApplyDate[0];
        this.queryParams.params["endApplicantDate"] = this.daterangeApplyDate[1];
      }
      if (null != this.daterangeAuditDate && '' != this.daterangeAuditDate) {
        this.queryParams.params["beginAuditDate"] = this.daterangeAuditDate[0];
        this.queryParams.params["endAuditDate"] = this.daterangeAuditDate[1];
      }
      if (null != this.daterangeSigningDate && '' != this.daterangeSigningDate) {
        this.queryParams.params["beginSigningDate"] = this.daterangeSigningDate[0];
        this.queryParams.params["endSigningDate"] = this.daterangeSigningDate[1];
      }
      listContract(this.queryParams).then(response => {
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
      this.daterangeSigningDate = [];
      this.daterangeApplyDate = [];
      this.daterangeAuditDate = [];
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
      getContract(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "销售合同审核详细";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.auditStatus = status
          approveContract(this.form).then(response => {
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
