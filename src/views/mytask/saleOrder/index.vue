<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入销售编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customName">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable>
          <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="apply">
        <el-select v-model="queryParams.applyId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
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
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="daterangeAuditTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
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
    <el-table v-loading="loading" :data="orderList">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="订单编号" align="center" prop="orderNo" width="180"/>
      <el-table-column label="客户名称" align="center" prop="customName"/>
      <el-table-column label="金额合计" align="center" prop="totalAmount"/>
      <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyName"/>
      <el-table-column label="申请时间" align="center" prop="applyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applyStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mytask_apply_status" :value="scope.row.applyStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditorName"/>
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
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
            @click="handleUpdate(scope.row)"
          >详情
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

    <!-- 添加或修改添加销售订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入销售编号" :disabled="true" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" :disabled="true"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactWay">
          <el-input v-model="form.linkmanPhoneNumber" placeholder="请输入联系方式" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额合计" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入金额合计" :disabled="true"/>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
                          v-model="form.deliveryDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          :disabled="true"
                          placeholder="请选择交货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyId">
          <el-select v-model="form.applyId" placeholder="请选择申请人" clearable :disabled="true">
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyDate">
          <el-date-picker clearable
                          v-model="form.applyDate"
                          type="date"
                          :disabled="true"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择申请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditorId">
          <el-select v-model="form.auditorId" placeholder="请选择审核人" clearable :disabled="true">
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
                          :disabled="true"
                          placeholder="请选择审核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入审核意见"/>
        </el-form-item>

        <el-table :data="form.scmSaleOrderItemList" ref="scmSaleOrderItem">
          <el-table-column label="序号" align="center" prop="id" width="50"/>
          <el-table-column label="产品" prop="model" width="150" :disabled="true">
            <template slot-scope="scope">{{scope.row.materialName}}</template>
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
          <el-table-column label="订货数量" prop="quantity" width="150">
            <template slot-scope="scope">
              <el-input-number :min="1" v-model="scope.row.quantity" size="small" :disabled="true" placeholder="请输入订货数量"/>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amount" width="150">
            <template slot-scope="scope">
              <el-input-number :min="0" v-model="scope.row.amount" size="small" :disabled="true" placeholder="请输入金额"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.note" placeholder="请输入备注"/>
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
import { mapGetters } from 'vuex'
import {listOrder, getOrder, updateOrder, approveOrder} from "@/api/scm/order";
import {listCustomList} from "@/api/scm/custom";
import {getUserList} from "@/api/system/user";

export default {
  name: "saleOrder",
  computed: {
    ...mapGetters([
      'name',
    ]),
  },
  dicts: ['mytask_apply_status', 'mytask_audit_status'],
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
      // 供应链SCM-销售管理-销售订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        customName: null,
        deliveryDate: null,
        apply: null,
        applyDate: null,
        applyStatus: null,
        auditor: null,
        auditTime: null,
        auditStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userList: [],
      customList: [],
      // 备注时间范围
      daterangeDeliveryDate: [],
      // 备注时间范围
      daterangeApplyDate: [],
      // 备注时间范围
      daterangeAuditTime: [],
    };
  },
  created() {
    this.queryParams.applyStatus = 1
    this.getList();
    this.getUser();
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
        }
      );
      listCustomList().then(response => {
          this.customList = response.data;
        }
      );
    },
    /** 查询供应链SCM-销售管理-销售订单列表 */
    getList() {
      this.loading = true;

      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginDeliveryDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endDeliveryDate"] = this.daterangeDeliveryDate[1];
      }
      if (null != this.daterangeApplyDate && '' != this.daterangeApplyDate) {
        this.queryParams.params["beginApplyDate"] = this.daterangeApplyDate[0];
        this.queryParams.params["endApplyDate"] = this.daterangeApplyDate[1];
      }
      if (null != this.daterangeAuditTime && '' != this.daterangeAuditTime) {
        this.queryParams.params["beginAuditTime"] = this.daterangeAuditTime[0];
        this.queryParams.params["endAuditTime"] = this.daterangeAuditTime[1];
      }
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        orderNo: null,
        customName: null,
        linkman: null,
        contactWay: null,
        totalAmount: null,
        deliveryDate: null,
        apply: null,
        applyDate: null,
        applyStatus: null,
        auditor: null,
        auditTime: null,
        auditStatus: null,
        remark: null
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
      this.daterangeDeliveryDate = [];
      this.daterangeApplyDate = [];
      this.daterangeAuditTime = [];
      this.queryParams = []
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "审核销售订单";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.form.auditStatus = status
      approveOrder(this.form).then(response => {
        this.$modal.msgSuccess("审核成功");
        this.open = false;
        this.getList();
      });
    },
  }
};
</script>
