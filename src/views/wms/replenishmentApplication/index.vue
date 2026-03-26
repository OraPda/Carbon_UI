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
            :value="dict.value"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wms:replenishmentApplication:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="replenishmentApplicationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
             @click="handleDelete1(scope.row)"
            v-if="scope.row.approvedStatus == 1 && scope.row.status == 0"
          >生成采购单</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.applicationStatus!='1'&&scope.row.approvedStatus!='1'"
          >删除</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据号" prop="documentNumber">
              <el-input v-model="form.documentNumber" placeholder="请输入单据号" style="width:220px" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="applicationDate">
              <el-date-picker clearable disabled
                v-model="form.applicationDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择申请日期">
              </el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核日期" prop="approvedDate">
              <el-date-picker clearable disabled
                v-model="form.approvedDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择审核日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核意见" prop="approvedComments">
              <el-input v-model="form.approvedComments" placeholder="请输入审核意见" disabled  style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" style="width: 220px;" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1' ? false : true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">补货申请明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" icon="el-icon-plus" size="mini" @click="handleAddWmsReplenishmentApplicationDetails">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsReplenishmentApplicationDetails">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsReplenishmentApplicationDetailsList" :row-class-name="rowWmsReplenishmentApplicationDetailsIndex" @selection-change="handleWmsReplenishmentApplicationDetailsSelectionChange" ref="wmsReplenishmentApplicationDetails">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialId">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsReplenishmentApplicationDetailsList.'+scope.$index+'.materialId'"
                            :rules="rules.materialId">
                <el-select v-model="scope.row.materialId" placeholder="请选择物料" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1' ? false : true">
                  <el-option
                    v-for="dict in materialList"
                    :key="dict.id"
                    :label="dict.materialName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="补货数量" prop="replenishmentNumber">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsReplenishmentApplicationDetailsList.'+scope.$index+'.replenishmentNumber'"
                            :rules="rules.replenishmentNumber">
                <el-input v-model.number="scope.row.replenishmentNumber" placeholder="请输入补货数量"  :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1' ? false : true"/>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"  :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1' ? false : true"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" @click="submitForm">提 交</el-button>
						<el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="success" @click="saveForm">保 存</el-button>
				<el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listReplenishmentApplication,
  getReplenishmentApplication,
  delReplenishmentApplication,
  addReplenishmentApplication,
  updateReplenishmentApplication,
  listUser,
  listMaterial,
  subReplenishmentApplication, repPurchaseApply
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
        applicationStatus: null,
        approvedDate: null,
        approvedStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialId: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        replenishmentNumber: [
          {required: true, message: "补货数量不能为空", trigger: "change"},
          { type: 'number', message: '补货数量必须为数字值' },
        ],
      },
      // 用户列表
      userList: [],
      // 物料列表
      materialList: [],
    };
  },
  watch: {
    'wmsReplenishmentApplicationDetailsList': {
      handler(newVal, oldVal) {
        this.form.wmsReplenishmentApplicationDetailsList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智能仓储WMS-补货申请列表 */
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
      listReplenishmentApplication(this.queryParams).then(response => {
        this.replenishmentApplicationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser().then(response => {
        this.userList = response.data
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      listUser().then(response => {
        this.userList = response.data;
      })
      listMaterial().then(response => {
        this.materialList = response.data;
      })
      this.open = true;
      this.title = "添加补货申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      listMaterial().then(response => {
        this.materialList = response.data;
      })
      const id = row.id || this.ids
      getReplenishmentApplication(id).then(response => {
        this.form = response.data;
        this.wmsReplenishmentApplicationDetailsList = response.data.wmsReplenishmentApplicationDetailsList;
        this.open = true;
        this.title = "修改补货申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsReplenishmentApplicationDetailsList = this.wmsReplenishmentApplicationDetailsList;
          subReplenishmentApplication(this.form).then(response => {
            this.$modal.msgSuccess("提交成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 保存按钮 */
    saveForm(){
        this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsReplenishmentApplicationDetailsList = this.wmsReplenishmentApplicationDetailsList;
          if (this.form.id != null) {
            updateReplenishmentApplication(this.form).then(response => {
              this.$modal.msgSuccess("保存成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReplenishmentApplication(this.form).then(response => {
              this.$modal.msgSuccess("保存成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除补货申请编号为"' + ids + '"的数据项？').then(function() {
        return delReplenishmentApplication(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 生成采购单按钮操作 */
    handleDelete1(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认生成采购申请清单？').then(function() {
        return repPurchaseApply({id: row.id})
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("生成采购单成功");
      }).catch(() => {});
    },
	/** 智能仓储WMS-补货申请明细序号 */
    rowWmsReplenishmentApplicationDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 智能仓储WMS-补货申请明细添加按钮操作 */
    handleAddWmsReplenishmentApplicationDetails() {
      let obj = {};
      obj.materialId = "";
      obj.replenishmentNumber = "";
      obj.remark = "";
      this.wmsReplenishmentApplicationDetailsList.push(obj);
    },
    /** 智能仓储WMS-补货申请明细删除按钮操作 */
    handleDeleteWmsReplenishmentApplicationDetails() {
      if (this.checkedWmsReplenishmentApplicationDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的补货申请明细数据");
      } else {
        const wmsReplenishmentApplicationDetailsList = this.wmsReplenishmentApplicationDetailsList;
        const checkedWmsReplenishmentApplicationDetails = this.checkedWmsReplenishmentApplicationDetails;
        this.wmsReplenishmentApplicationDetailsList = wmsReplenishmentApplicationDetailsList.filter(function(item) {
          return checkedWmsReplenishmentApplicationDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsReplenishmentApplicationDetailsSelectionChange(selection) {
      this.checkedWmsReplenishmentApplicationDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/replenishmentApplication/export', {
        ...this.queryParams
      }, `replenishmentApplication_${new Date().getTime()}.xlsx`)
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
