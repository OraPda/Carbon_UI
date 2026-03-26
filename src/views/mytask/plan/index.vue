<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划号" prop="planNumber">
        <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="请选择项目" clearable>
          <el-option
            v-for="item in maintenanceList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker
          v-model="daterangeDeliveryDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-select v-model="queryParams.applicant" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
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
      <el-form-item label="申请状态" prop="applicantStatus">
        <el-select v-model="queryParams.applicantStatus" clearable>
          <el-option
            v-for="dict in dict.type.mes_plan_sqstatus"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="reviewer">
        <el-select v-model="queryParams.reviewer" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="daterangeReviewerDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="reviewerStatus">
        <el-select v-model="queryParams.reviewerStatus" clearable>
          <el-option
            v-for="dict in dict.type.mes_plan_shstatus"
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

    <el-table v-loading="loading" :data="planList" >
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="计划号" align="center" prop="planNumber"/>
      <el-table-column label="项目" align="center" prop="projectName"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicantName"/>
      <el-table-column label="申请时间" align="center" prop="applicantDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicantDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicantStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_plan_sqstatus" :value="scope.row.applicantStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="reviewerName"/>
      <el-table-column label="审核时间" align="center" prop="reviewerDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reviewerDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="reviewerStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_plan_shstatus" :value="scope.row.reviewerStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
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

    <!-- 添加或修改生产计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body style="">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划号" prop="planNumbr">
              <el-input v-model="form.planNumber" placeholder="请输入计划号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" prop="saleOrderNo">
              <el-input v-model="form.saleOrderNo" placeholder="请选择订单" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货日期" prop="deliveryDate">
              <el-date-picker
                clearable
                v-model="form.deliveryDate"
                type="date"
                disabled
                value-format="yyyy-MM-dd"
                placeholder="请选择交货日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="form.projectId" placeholder="请选择项目" clearable disabled>
                <el-option
                  v-for="item in maintenanceList"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicant">
              <el-select v-model="form.applicant" disabled>
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间" prop="applicantDate">
              <el-date-picker
                clearable
                v-model="form.applicantDate"
                type="date"
                value-format="yyyy-MM-dd"
                disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请状态" prop="applicantStatus">
              <el-select v-model="form.applicantStatus" disabled>
                <el-option
                  v-for="dict in dict.type.mes_plan_sqstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="审核人" prop="reviewer">
              <el-select v-model="form.reviewer" disabled>
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核时间" prop="reviewerDate">
              <el-date-picker
                clearable
                v-model="form.reviewerDate"
                type="date"
                disabled
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态" prop="reviewerStatus">
              <el-select v-model="form.reviewerStatus" disabled>
                <el-option
                  v-for="dict in dict.type.mes_plan_shstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="审核意见" prop="reviewComments">
              <el-input v-model="form.reviewComments" placeholder="请输入审核意见"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">生产计划明细信息</el-divider>
        <el-table :data="mesProductionPlanItemList"  ref="mesProductionPlanItem">
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="产品" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="生产数量" prop="quantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" placeholder="请输入生产数量"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="manufacture" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.manufacture" type="date" value-format="yyyy-MM-dd"
                              placeholder="请选择生产日期" disabled/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listPlan, getPlan, delPlan, addPlan, updatePlan, getMaintenance, getOrderList, approvePlan} from "@/api/mes/plan";
import {getUserList} from "@/api/system/user";
import {getOrder} from "@/api/scm/order";

export default {
  name: "Plan",
  dicts: ['mes_plan_sqstatus', 'mes_plan_shstatus'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesProductionPlanItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产计划表格数据
      planList: [],
      // 生产计划-生产计划明细子表格数据
      mesProductionPlanItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 生产计划id时间范围
      daterangeApplicantDate: [],
      // 生产计划id时间范围
      daterangeReviewerDate: [],
      // 交货日期时间范围
      daterangeDeliveryDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planNumbr: null,
        projectId: null,
        name: null,
        deliveryDate: null,
        applicant: null,
        applicantDate: null,
        applicantStatus: 1,
        reviewer: null,
        reviewerDate: null,
        reviewerStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userList: [],
      maintenanceList: [],
      orderOpen: false,
      orderList: []
    };
  },
  created() {
    this.getUser();
    this.getList();
    getMaintenance().then(response => {
      this.maintenanceList = response.data
    })
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
        }
      );
    },
    /** 查询生产计划列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeApplicantDate && '' != this.daterangeApplicantDate) {
        this.queryParams.params["beginApplicantDate"] = this.daterangeApplicantDate[0];
        this.queryParams.params["endApplicantDate"] = this.daterangeApplicantDate[1];
      }
      if (null != this.daterangeReviewerDate && '' != this.daterangeReviewerDate) {
        this.queryParams.params["beginReviewerDate"] = this.daterangeReviewerDate[0];
        this.queryParams.params["endReviewerDate"] = this.daterangeReviewerDate[1];
      }
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginDeliveryDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endDeliveryDate"] = this.daterangeDeliveryDate[1];
      }
      listPlan(this.queryParams).then(response => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeApplicantDate = [];
      this.daterangeReviewerDate = [];
      this.daterangeDeliveryDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
// 表单重置
    reset() {
      this.form = {
        id: null,
        planNumber: null,
        projectId: null,
        name: null,
        saleOrderId: null,
        saleOrderNo: null,
        deliveryDate: null,
        remark: null,
        reviewComments: null
      };
      this.mesProductionPlanItemList = [];
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlan(id).then(response => {
        this.form = response.data;
        this.mesProductionPlanItemList = response.data.mesProductionPlanItemList;
        this.open = true;
        this.title = "生产计划详情";
      });
    },
    /** 审核按钮 */
    submitForm(status) {
      this.form.reviewerStatus = status
      approvePlan(this.form).then(response => {
        this.$modal.msgSuccess("审核成功");
        this.open = false;
        this.getList();
      });
    },

  }
};
</script>
