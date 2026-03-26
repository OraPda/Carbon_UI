<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="领料单号" prop="oddNumber">
        <el-input
          v-model="queryParams.oddNumber"
          placeholder="请输入领料单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领取日期" prop="collectionDate">
        <el-date-picker
          v-model="daterangeCollectionDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
      <el-form-item label="申请时间" prop="applicantDate">
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
        <el-select v-model="queryParams.applicantStatus" placeholder="请选择申请状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="reviewer">
        <el-select v-model="queryParams.reviewer" placeholder="请选择审核人" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间" prop="reviewerDate">
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
        <el-select v-model="queryParams.reviewerStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_auditor_status"
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

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="领料单号" align="center" prop="oddNumber"/>
      <el-table-column label="生产计划" align="center" prop="planNumber"/>
      <el-table-column label="计划排产" align="center" prop="serialNo"/>
      <el-table-column label="产品" align="center" prop="materialName"/>
      <el-table-column label="规格" align="center" prop="materialModel"/>
      <el-table-column label="型号" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
      <el-table-column label="领取日期" align="center" prop="collectionDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.collectionDate, '{y}-{m}-{d}') }}</span>
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
          <dict-tag :options="dict.type.mes_apply_status" :value="scope.row.applicantStatus"/>
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
          <dict-tag :options="dict.type.mes_auditor_status" :value="scope.row.reviewerStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_material_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
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

    <!-- 领料申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="领料单号" prop="code">
              <el-input v-model="form.oddNumber" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划排产" prop="serialNo">
              <el-input v-model="form.serialNo" placeholder="请选择计划排产" disabled>

              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品" prop="materialModel">
              <el-input v-model="form.materialName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="materialModel">
              <el-input v-model="form.materialModel" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="型号" prop="materialSpecifications">
              <el-input v-model="form.materialSpecifications" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="materialUnit">
              <el-input v-model="form.materialUnit" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="待产数量" prop="producedQuantity">
              <el-input v-model="form.producedQuantity" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="manufactureDate">
              <el-date-picker
                clearable
                v-model="form.manufactureDate"
                type="date"
                value-format="yyyy-MM-dd"
                disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领取日期" prop="collectionDate">
              <el-date-picker
                clearable
                disabled
                v-model="form.collectionDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择领取日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入" disabled/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请人" prop="proposer">
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
                  v-for="dict in dict.type.mes_apply_status"
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
                value-format="yyyy-MM-dd"
                disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态" prop="reviewerStatus">
              <el-select v-model="form.reviewerStatus" disabled>
                <el-option
                  v-for="dict in dict.type.mes_auditor_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核意见" prop="reviewComments">
          <el-input v-model="form.reviewComments" />
        </el-form-item>
        <el-divider content-position="center">生产计划明细信息</el-divider>
        <el-table :data="mesMaterialApplyItemList" ref="mesMaterialApplyItem">
          <el-table-column label="序号" align="center" prop="id" width="50"/>
          <el-table-column label="物料" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" prop="dosage" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dosage"  disabled/>
            </template>
          </el-table-column>
          <el-table-column label="已领数量" prop="receivedQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.receivedQuantity" disabled/>
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
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listApply, getApply, approveApply} from "@/api/mes/apply";
import { mapGetters } from 'vuex';
import { getUserList } from "@/api/system/user";
export default {
  name: "Apply",
  dicts: ['mes_auditor_status', 'mes_apply_status','mes_publish_status', 'mes_application_status', 'mes_picking_status', 'mes_material_status'],
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
      // 领料申请表格数据
      applyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 申请时间范围
      daterangeApplicantDate: [],
      // 审核时间范围
      daterangeReviewerDate: [],
      // 领取时间范围
      daterangeCollectionDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        oddNumber: null,
        collectionDate: null,
        applicant: null,
        applicantDate: null,
        applicantStatus: 1,
        reviewer: null,
        reviewerDate: null,
        reviewerStatus: null,
      },
      mesMaterialApplyItemList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      userList:[],
    };
  },
  created() {
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
    /** 查询领料申请列表 */
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
      if (null != this.daterangeCollectionDate && '' != this.daterangeCollectionDate) {
        this.queryParams.params["beginCollectionDate"] = this.daterangeCollectionDate[0];
        this.queryParams.params["endCollectionDate"] = this.daterangeCollectionDate[1];
      }
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows;
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
        oddNumber: null,
        plannedProductionId: null,
        serialNo: null,
        collectionDate: null,
        reviewComments: null,
        remark: null,
      };
      this.mesMaterialApplyItemList = [];
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
      this.daterangeCollectionDate = [];
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
      getApply(id).then(response => {
        this.form = response.data;
        this.mesMaterialApplyItemList = response.data.mesMaterialApplyItemList;
        this.open = true;
        this.title = "领料申请详情";
      });
    },
    /** 审核按钮 */
    submitForm(status) {
      this.form.reviewerStatus = status
      approveApply(this.form).then(response => {
        this.$modal.msgSuccess("审核成功");
        this.open = false;
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mytask/apply/export', {
        ...this.queryParams
      }, `apply_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
