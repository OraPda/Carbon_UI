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
            v-for="dict in dict.type.wms_replenishment_application_application_status"
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
            v-for="dict in dict.type.wms_replenishment_application_approved_status"
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

    <el-table v-loading="loading" :data="replenishmentApplicationList">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentNumber" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_replenishment_application_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicantName" />
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_replenishment_application_application_status" :value="scope.row.applicationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName" />
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_replenishment_application_approved_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
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

    <!-- 添加或修改智能仓储WMS-补货申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据号" prop="documentNumber">
          <el-input v-model="form.documentNumber" placeholder="请输入单据号" disabled/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" disabled>
            <el-option
              v-for="dict in dict.type.wms_replenishment_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
          <el-date-picker clearable disabled
            v-model="form.applicationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="form.applicationStatus" placeholder="请选择申请状态" disabled>
            <el-option
              v-for="dict in dict.type.wms_replenishment_application_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="form.approved" placeholder="请选择审核人" disabled>
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker clearable disabled
            v-model="form.approvedDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择审核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="form.approvedStatus" placeholder="请选择审核状态" disabled>
            <el-option
              v-for="dict in dict.type.wms_replenishment_application_approved_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
        </el-form-item>
        <el-divider content-position="center">补货申请明细信息</el-divider>
        <el-table :data="wmsReplenishmentApplicationDetailsList" :row-class-name="rowWmsReplenishmentApplicationDetailsIndex" ref="wmsReplenishmentApplicationDetails">
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialId" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.materialId" placeholder="请选择物料" disabled>
                <el-option
                  v-for="dict in materialList"
                  :key="dict.id"
                  :label="dict.materialName"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="补货数量" prop="replenishmentNumber" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.replenishmentNumber" placeholder="请输入补货数量" disabled />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicationStatus==1" type="success" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applicationStatus==1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getReplenishmentApplication,
  listUser,
  listMaterial,
  approveReplenishmentApplication, listReplenishmentApplication
} from "@/api/wms/replenishmentApplication";

export default {
  name: "ReplenishmentApplication",
  dicts: ['wms_replenishment_application_approved_status', 'wms_replenishment_application_application_status', 'wms_replenishment_application_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsReplenishmentApplicationDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 智能仓储WMS-补货申请表格数据
      replenishmentApplicationList: [],
      // 智能仓储WMS-补货申请明细表格数据
      wmsReplenishmentApplicationDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeApplicationDate: [],
      // 备注时间范围
      daterangeApprovedDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentNumber: null,
        applicationDate: null,
        applicationStatus: 1,
        approvedDate: null,
        approvedStatus: null,
        applicant: null,
        approved: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 用户列表
      userList: [],
      // 物料列表
      materialList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智能仓储WMS-补货申请列表 */
    getList() {
      this.loading = true;
      listUser().then(response => {
        this.userList = response.data;
      })
      this.queryParams.params = {};
      if (null != this.daterangeApplicationDate && '' != this.daterangeApplicationDate) {
        this.queryParams.params["beginApplicationDate"] = this.daterangeApplicationDate[0];
        this.queryParams.params["endApplicationDate"] = this.daterangeApplicationDate[1];
      }
      if (null != this.daterangeApprovedDate && '' != this.daterangeApprovedDate) {
        this.queryParams.params["beginApprovedDate"] = this.daterangeApprovedDate[0];
        this.queryParams.params["endApprovedDate"] = this.daterangeApprovedDate[1];
      }
      listReplenishmentApplication(this.queryParams).then(response => {
        this.replenishmentApplicationList = response.rows;
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
        documentNumber: null,
        status: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        approvedComments: null,
        remark: null
      };
      this.wmsReplenishmentApplicationDetailsList = [];
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

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      listUser().then(response => {
        this.userList = response.data;
      })
      listMaterial().then(response => {
        this.materialList = response.data;
      })
      const id = row.id || this.ids
      getReplenishmentApplication(id).then(response => {
        this.form = response.data;
        this.wmsReplenishmentApplicationDetailsList = response.data.wmsReplenishmentApplicationDetailsList;
        this.open = true;
        this.title = "审核补货申请";
      });
    },
    /** 提交按钮 */
    submitForm(value) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsReplenishmentApplicationDetailsList = this.wmsReplenishmentApplicationDetailsList;
          this.form.approvedStatus = value;
          approveReplenishmentApplication(this.form).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },

	/** 智能仓储WMS-补货申请明细序号 */
    rowWmsReplenishmentApplicationDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/replenishmentApplication/export', {
        ...this.queryParams
      }, `replenishmentApplication_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
