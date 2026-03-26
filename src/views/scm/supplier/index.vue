<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input
          v-model="queryParams.contacts"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="公司地址" align="center" prop="companyAddress" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="contactNumber" />
      <el-table-column label="申请状态" align="center" prop="applicantStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.scm_apply_status" :value="scope.row.applicantStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409EFF"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="changeType(scope.row)"
            ></el-switch>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
            v-if="scope.row.applicantStatus!='1'&&scope.row.approvedStatus!='1'"
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

    <!-- 添加或修改供应链SCM-销售管理-供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1050px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :disabled="form.applicantStatus!=1&&form.approvedStatus!=1 ? false : true" :inline="true">
        <el-row>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
          </el-form-item>
          <el-form-item label="简称" prop="abbreviation">
            <el-input v-model="form.abbreviation" placeholder="请输入简称" />
          </el-form-item>
          <el-form-item label="公司地址" prop="companyAddress">
            <el-input v-model="form.companyAddress" placeholder="请输入公司地址" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="公司电话" prop="companyPhone">
            <el-input v-model="form.companyPhone" placeholder="请输入公司电话" />
          </el-form-item>
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="form.depositBank" placeholder="请输入开户银行" />
          </el-form-item>
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="form.bankAccount" placeholder="请输入银行账号" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="税号" prop="dutyParagraph">
            <el-input v-model="form.dutyParagraph" placeholder="请输入税号" />
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactNumber">
            <el-input v-model="form.contactNumber" placeholder="请输入联系电话" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="供应商分类" prop="supplierClassification">
            <el-select v-model="form.supplierClassification" placeholder="请选择供应商分类">
              <el-option
                v-for="dict in dict.type.scm_supplier_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商等级" prop="supplierLevel">
            <el-select v-model="form.supplierLevel" placeholder="请选择供应商等级">
              <el-option
                v-for="dict in dict.type.scm_supplier_level"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核人" prop="approvedId">
            <el-select v-model="form.approvedId" disabled>
              <el-option
                v-for="dict in userList"
                :key="dict.userId"
                :label="dict.userName"
                :value="dict.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核日期" prop="approvedDate">
            <el-date-picker clearable
                            disabled
              v-model="form.approvedDate"
              type="date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态" prop="approvedStatus">
            <el-select v-model="form.approvedStatus" disabled>
              <el-option
              v-for="dict in dict.type.scm_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="primary" @click="saveForm">保 存</el-button>
        <el-button v-if="form.applicantStatus!=1&&form.approvedStatus!=1" type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier, subSupplier,listUser} from "@/api/scm/supplier";

export default {
  name: "Supplier",
  dicts: ['scm_supplier_type', 'scm_supplier_level', 'scm_apply_status','scm_audit_status'],
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
      // 供应链SCM-销售管理-供应商表格数据
      supplierList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierName: null,
        contacts: null,
        companyAddress: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        supplierName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        companyAddress: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactNumber: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
      },
      supplierClassification: [
        {value: '0', label: '核心供应商'},
        {value: '1', label: '普通供应商'},
      ],
      // 用户列表
      userList: [],
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {

    // 修改供应商状态
    changeType(item){
      updateSupplier(item).then(res=>{
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 获取用户列表
    getUserList() {
      listUser().then(response => {
        this.userList = response.data;
      });
    },
    /** 查询供应链SCM-销售管理-供应商列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then(response => {
        this.supplierList = response.rows;
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
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      this.open = true;
      this.title = "添加供应商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSupplier(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商信息";
      });
    },
    /** 保存按钮 */
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSupplier(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSupplier(this.form).then(response => {
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
          subSupplier(this.form).then(response => {
            this.$modal.msgSuccess("提交成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除供应链SCM-销售管理-供应商编号为"' + ids + '"的数据项？').then(function() {
        return delSupplier(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('scm/supplier/export', {
        ...this.queryParams
      }, `supplier_${new Date().getTime()}.xlsx`)
    },
    selectable(row, index) {
      if (row.applicantStatus == 1 || row.approvedStatus == 1) {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
