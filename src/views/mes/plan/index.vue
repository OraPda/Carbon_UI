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

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
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
          >修改
          </el-button>
          <el-button
            v-if="!scope.row.applicantStatus"
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

    <!-- 添加或修改生产计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body style="">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true" :disabled="form.applicantStatus!=1&&form.reviewerStatus!=1?false:true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划号" prop="planNumbr">
              <el-input v-model="form.planNumber" placeholder="请输入计划号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" prop="saleOrderNo">
              <el-input v-model="form.saleOrderNo" placeholder="请选择订单" disabled>
                <el-button slot="append" @click="selectOrder" >选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
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
              <el-select v-model="form.projectId" placeholder="请选择项目" clearable >
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
              <el-input v-model="form.remark" placeholder="请输入备注"/>
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
              <el-input v-model="form.reviewComments" placeholder="请输入审核意见" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">生产计划明细信息</el-divider>
        <el-table :data="mesProductionPlanItemList" :row-class-name="rowMesProductionPlanItemIndex" ref="mesProductionPlanItem">
          <el-table-column label="序号" align="center" prop="index" width="50"/>
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
          <el-table-column label="单位" prop="materialUnit" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="生产数量" prop="quantity" width="160">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductionPlanItemList.'+scope.$index+'.quantity'" :rules="rules.quantity">
                <el-input v-model.number="scope.row.quantity" placeholder="请输入生产数量"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="manufacture" width="240">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductionPlanItemList.'+scope.$index+'.manufacture'" :rules="rules.manufacture">
                <el-date-picker clearable v-model="scope.row.manufacture" type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择生产日期"/>
              </el-form-item>

            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicantStatus!=1&&form.reviewerStatus!=1" type="primary" @click="saveForm()">保 存</el-button>
        <el-button v-if="form.applicantStatus!=1&&form.reviewerStatus!=1" type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 销售订单弹框 start -->
    <SaleOrder auditStatus="1" :open.sync="orderOpen" @fun="handleChange" @close="close"/>
    <!-- 销售订单弹框 end -->
  </div>
</template>

<script>
import {listPlan, getPlan, delPlan, addPlan, updatePlan, getMaintenance, submitPlan} from "@/api/mes/plan";
import {getUserList} from "@/api/system/user";
import SaleOrder from "@/views/components/SaleOrder/index.vue"
import { getOrder } from "@/api/scm/order";

export default {
  name: "Plan",
  components: {
    SaleOrder,
  },
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
        applicantStatus: null,
        reviewer: null,
        reviewerDate: null,
        reviewerStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        saleOrderNo: [
          {required: true, message: "订单号不能为空", trigger: "blur"}
        ],
        projectId: [
          {required: true, message: "项目不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "名称不能为空", trigger: "blur"}
        ],
        deliveryDate: [
          {required: true, message: "交货日期不能为空", trigger: "blur"}
        ],
        quantity: [
          {required: true, message: "生产数量不能为空", trigger: "blur"},
          { type: 'number', message: '必须为数字值'}
        ],
        manufacture: [
          {required: true, message: "生产时间不能为空", trigger: "blur"}
        ],
      },
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
  watch: {
    'mesProductionPlanItemList': {
      handler(newVal, oldVal) {
        this.form.mesProductionPlanItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
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
      this.title = "添加生产计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlan(id).then(response => {
        this.form = response.data;
        this.mesProductionPlanItemList = response.data.mesProductionPlanItemList;
        this.open = true;
        this.title = "修改生产计划";
      });
    },
    /** 保存按钮 */
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesProductionPlanItemList = this.mesProductionPlanItemList;
          if (this.form.id != null) {
            updatePlan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlan(this.form).then(response => {
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
          this.form.mesProductionPlanItemList = this.mesProductionPlanItemList;
          submitPlan(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除生产计划编号为"' + ids + '"的数据项？').then(function () {
        return delPlan(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    // 选择订单
    selectOrder() {
      this.orderOpen = true
    },
    // 选中订单数据
    handleChange(val) {
      getOrder(val.id).then(response => {
        this.form.saleOrderId = val.id
        this.form.saleOrderNo = val.orderNo
        this.form.deliveryDate = val.deliveryDate
        let data = response.data.scmSaleOrderItemList
        this.mesProductionPlanItemList = []
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.quantity = item.quantity;
          obj.manufacture = "";
          this.mesProductionPlanItemList.push(obj);
        })
        this.orderOpen = false;
      });
    },
    close() {
      this.orderOpen = false
    },
    /** 生产计划-生产计划明细子序号 */
    rowMesProductionPlanItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/plan/export', {
        ...this.queryParams
      }, `plan_${new Date().getTime()}.xlsx`)
    },
    // 待审核和已审核不可删除，禁用列表选择
    selectable(row,index) {
      if (row.applicantStatus == 1 || row.reviewerStatus == 1) {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
