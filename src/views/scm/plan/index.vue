<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划单号" prop="scheduleNumber">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryParams.scheduleNumber"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划标题" prop="scheduleTitle">
        <el-input
          placeholder="请输入计划标题"
          clearable
          v-model="queryParams.scheduleTitle"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划类型"  prop="scheduleType">
        <el-select v-model="queryParams.scheduleType" clearable>
          <el-option
            v-for="dict in dict.type.scm_plan_schedule_type"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="计划单号" align="center" prop="scheduleNumber"/>
      <el-table-column label="计划标题" align="center" prop="scheduleTitle"/>
      <el-table-column label="起始时间" align="center" prop="startDate"/>
      <el-table-column label="结束时间" align="center" prop="endDate"/>
      <el-table-column label="创建时间" align="center" prop="createDate"/>
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

    <!-- 添加或修改添加销售计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="计划单号" prop="scheduleNumber">
          <el-input v-model="form.scheduleNumber" placeholder="系统自动生成" :disabled="true"/>
        </el-form-item>
        <el-form-item label="计划标题" prop="scheduleTitle">
          <el-input v-model="form.scheduleTitle" placeholder="请输入销售标题"/>
        </el-form-item>
        <el-form-item label="计划类型" prop="scheduleType">
          <el-select placeholder="请选择" v-model="form.scheduleType" clearable>
            <el-option
              v-for="item in dict.type.scm_plan_schedule_type"
              :key="item.value"
              :label="item.label"
              :value="parseInt(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">指标配置信息</el-divider>
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
        <el-table :data="scmSalePlanItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品" prop="model" width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSalePlanItemList.'+scope.$index+'.materialId'" :rules="rules.materialId">
                <el-input v-model="scope.row.materialName" placeholder="请选择" disabled>
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
          <el-table-column label="销售额" prop="sales" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSalePlanItemList.'+scope.$index+'.sales'" :rules="rules.sales">
                <el-input v-model.number="scope.row.sales" placeholder="请输入销售额" />
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->
  </div>
</template>

<script>

import {classifyTreeSelect, listMaterial} from "@/api/wms/material";
import {getUserList} from "@/api/system/user";
import {listPlan,addPlan,delPlan,getPlan,updatePlan} from '@/api/scm/salePlan'
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
export default {
  name: "Plan",
  components: {
    MateriaDialog,
  },
  dicts: ['scm_apply_status', 'scm_audit_status','scm_plan_schedule_type'],
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
      // 供应链SCM-销售管理-销售计划表格数据
      planList: [],
      // 供应链SCM-销售管理-销售计划子表格数据
      scmSalePlanItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scheduleNumber: null,
        scheduleTitle: null,
        scheduleType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        scheduleTitle:[
          {
            required: true,
            message: "收货地址不能为空",
            trigger: "blur"
          },
          {
            max: 50,
            message: "长度不能超过20个字符",
            trigger: "blur"
          }
        ],
        scheduleType: [
          {
            required: true,
            message: "计划类型不能为空",
            trigger: "change"
          }
        ],
        startDate: [
          {
            required: true,
            message: "起始日期不能为空",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "结束日期不能为空",
            trigger: "blur"
          }
        ],
        materialId: [
          {
            required: true,
            message: "产品不能为空",
            trigger: "blur"
          }
        ],
        sales: [
          {
            required: true,
            message: "销售额不能为空",
            trigger: "blur"
          },
          { type: 'number', message: '必须为数字值'},
          { type: 'number',min: 1, message: '数量不能小于1', trigger: 'blur' }
        ]
      },
      // 客户弹框
      customOpen: false,
      // 客户档案表格数据
      customList: [],
      // 客户搜索
      customQueryParams: {
        pageNum: 1,
        pageSize: 10,
        customName: null,
        linkman: null,
        customType: null,
      },
      // 客户列表总条数
      customtotal: 0,
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
      daterangeApplyDate: [],
      // 备注时间范围
      daterangeAuditTime: [],
    };
  },
  created() {
    this.getList();
    this.getUser();
  },
  watch: {
    'scmSalePlanItemList': {
      handler(newVal, oldVal) {
        this.form.scmSalePlanItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
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
    /** 查询供应链SCM-销售管理-销售计划列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginCreateDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endCreateDate"] = this.daterangeDeliveryDate[1];
      }
      listPlan(this.queryParams).then(res=>{
        this.planList = res.rows
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
      };
      this.scmSalePlanItemList = [];
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
      this.title = "添加销售计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids;
      getPlan(ids).then(res=>{
        this.form = res.data
        this.scmSalePlanItemList = res.data.scmSalePlanItemList
      })
      this.open = true;
      this.title = "修改销售计划";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.scmSalePlanItemList = this.scmSalePlanItemList
          if (!this.scmSalePlanItemList || this.scmSalePlanItemList.length == 0) {
            this.$modal.msgError("请添加指标配置信息");
            return false;
          }
          if (this.form.id != null) {
            updatePlan(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            })
            this.open = false;
          } else {
            addPlan(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success("添加成功")
                this.getList()
              }
            })
            this.open = false;
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`是否确认删除销售计划${ids}编号的数据项？`).then(() => {
        delPlan(ids).then(res=>{
          this.$modal.msgSuccess("删除成功");
          this.getList()
        })
      }).catch(() => {
      });
    },
    /** 供应链SCM-销售管理-销售计划子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-销售管理-销售计划子添加按钮操作 */
    handleAddScmSaleOrderItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.materialPrice = "";
      obj.sales = "";
      obj.remark = "";
      this.scmSalePlanItemList.push(obj);
    },
    /** 供应链SCM-销售管理-销售计划子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-销售管理-销售计划子数据");
      } else {
        const scmSalePlanItemList = this.scmSalePlanItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmSalePlanItemList = scmSalePlanItemList.filter(function (item) {
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
      this.scmSalePlanItemList[this.materialIndex - 1].materialName = val.materialName
      this.scmSalePlanItemList[this.materialIndex - 1].materialId = val.id
      this.scmSalePlanItemList[this.materialIndex - 1].materialModel = val.materialModel
      this.scmSalePlanItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.scmSalePlanItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.scmSalePlanItemList[this.materialIndex - 1].materialPrice = val.materialPrice
      this.materialOpen = false
    },
  }
};
</script>

<style lang="scss">

</style>
