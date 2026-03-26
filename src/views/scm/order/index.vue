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
      <el-form-item label="客户名称" prop="customId">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable>
          <el-option
            v-for="custom in selectCustomList"
            :key="custom.id"
            :label="custom.customName"
            :value="custom.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交货日期">
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
      <el-form-item label="申请人" prop="applyId">
        <el-select v-model="queryParams.applyId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
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
            v-for="dict in dict.type.scm_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditorId">
        <el-select v-model="queryParams.auditorId" placeholder="请选择审核人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.userName"
            :value="user.userId"
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
            v-for="dict in dict.type.scm_audit_status"
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

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="订单编号" align="center" prop="orderNo"/>
      <el-table-column label="客户名称" align="center" prop="customName"/>
      <el-table-column label="联系人" align="center" prop="linkman"/>
      <el-table-column label="联系方式" align="center" prop="linkmanPhoneNumber"/>
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
          <dict-tag :options="dict.type.scm_apply_status" :value="scope.row.applyStatus"/>
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
          <dict-tag :options="dict.type.scm_audit_status" :value="scope.row.auditStatus"/>
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
          <el-button v-if="scope.row.auditStatus!='1'&& scope.row.applyStatus!='1'"
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

    <!-- 添加或修改添加销售订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true" :disabled="form.applyStatus!=1&&form.auditStatus!=1 ? false : true">
        <el-form-item label="销售编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="系统自动生成" :disabled="true"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input placeholder="请选择" v-model="form.customName" class="input-with-select" :disabled="true">
            <el-button slot="append" @click="selectCustom">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="customlinkmanPhoneNumberName">
          <el-input v-model="form.linkmanPhoneNumber" placeholder="请输入联系方式" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
            v-model="form.deliveryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择交货日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyId">
          <el-select v-model="form.applyId" placeholder="请选择申请人" :disabled="true" clearable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.userName"
              :value="user.userId"
              :disabled="true"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyDate">
          <el-date-picker clearable
                          v-model="form.applyDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择申请时间" :disabled="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.scm_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"

            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditorId">
          <el-select v-model="form.auditorId" placeholder="请选择审核人" :disabled="true" clearable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.userName"
              :value="user.userId"

            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable
                          v-model="form.auditTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择审核时间" :disabled="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus" >
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" :disabled="true">
            <el-option
              v-for="dict in dict.type.scm_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"

            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">订单明细信息</el-divider>
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
        <el-table :data="scmSaleOrderItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品" prop="model" width="180">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleOrderItemList.'+scope.$index+'.materialId'" :rules="rules.materialId">
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
              <el-form-item :prop="'scmSaleOrderItemList.'+scope.$index+'.materialPrice'" :rules="rules.materialPrice">
                <el-input v-model.number="scope.row.materialPrice" placeholder="请输入单价" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="quantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleOrderItemList.'+scope.$index+'.quantity'" :rules="rules.quantity">
                <el-input @change="count()" v-model.number="scope.row.quantity" placeholder="请输入订货数量"/>
              </el-form-item>
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
        <el-button v-if="form.applyStatus!=1&&form.auditStatus!=1" type="success" @click="saveForm">保 存</el-button>
        <el-button v-if="form.applyStatus!=1&&form.auditStatus!=1" type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 客户列表弹框 start -->
    <el-dialog title="选择销售客户" :visible.sync="customOpen" width="1000px" append-to-body>
      <el-form :model="customQueryParams" ref="customQueryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="客户名称" prop="customName">
          <el-select v-model="customQueryParams.customName" placeholder="请选择客户" clearable>
            <el-option
              v-for="custom in selectCustomList"
              :key="custom.id"
              :label="custom.customName"
              :value="custom.customName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input
            v-model="customQueryParams.linkman"
            placeholder="请输入联系人"
            clearable
            @keyup.enter.native="chandleQuery"
          />
        </el-form-item>
        <el-form-item label="客户分类" prop="customType">
          <el-select v-model="customQueryParams.customType" placeholder="请选择客户分类" clearable>
            <el-option
              v-for="dict in dict.type.scm_custom_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="chandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="cresetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="customList">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="客户名称" align="center" prop="customName"/>
        <el-table-column label="公司地址" align="center" prop="address"/>
        <el-table-column label="联系电话" align="center" prop="phoneNumber"/>
        <el-table-column label="联系人" align="center" prop="linkman"/>
        <el-table-column label="联系人电话" align="center" prop="linkmanPhoneNumber"/>
        <el-table-column label="客户分类" align="center" prop="customType">
          <template slot-scope="scope">
            <span>{{customType[scope.row.customType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="信用等级" align="center" prop="creditLevel">

          <template slot-scope="scope">
            <span>{{scmCreditLevel[scope.row.creditLevel]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleCustom(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="customtotal>0"
        :total="customtotal"
        :page.sync="customQueryParams.pageNum"
        :limit.sync="customQueryParams.pageSize"
        @pagination="selectCustom"
      />

    </el-dialog>
    <!-- 客户列表弹框 end -->
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->
  </div>
</template>

<script>
import {listOrder, getOrder, delOrder, addOrder, updateOrder, submitOrder} from "@/api/scm/order";
import {listCustom, listCustomList} from "@/api/scm/custom";
import {classifyTreeSelect, listMaterial} from "@/api/wms/material";
import {getUserList} from "@/api/system/user";
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
export default {
  name: "Order",
  components: {
    MateriaDialog,
  },
  dicts: ['scm_apply_status', 'scm_audit_status','scm_custom_type','scm_custom_status','scm_credit_level'],
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
      total: 0,
      // 供应链SCM-销售管理-销售订单表格数据
      orderList: [],
      // 供应链SCM-销售管理-销售订单子表格数据
      scmSaleOrderItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        customId: null,
        deliveryDate: null,
        applyId: null,
        applyDate: null,
        applyStatus: null,
        auditorId: null,
        auditTime: null,
        auditStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deliveryDate: [
          { required: true, message: "交货日期不能为空", trigger: "blur" }
        ],
        customName: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        materialId: [
          {
            required: true,
            message: "产品不能为空",
            trigger: "blur"
          }
        ],
        materialPrice: [
          { required: true, message: "单价不能为空", trigger: "blur" },
          { type: 'number', message: '必须为数字值'}
        ],
        quantity: [
          { required: true, message: "订货数量不能为空", trigger: "blur" },
          { type: 'number', message: '必须为数字值'},
          { type: 'number',min: 1, message: '数量不能小于1', trigger: 'blur' }
        ],
      },
      // 0-优质 1-良好 2-一般 3-较差
      scmCreditLevel:[
        '优质','良好','一般','较差',
      ],
      customType: [
        '核心客户','普通客户'
      ],
      // 客户弹框
      customOpen: false,
      // 客户档案表格数据
      customList: [],
      // 客户档案下拉框数据
      selectCustomList: [],
      // 客户搜索
      customQueryParams: {
        pageNum: 1,
        pageSize: 10,
        customName: null,
        linkman: null,
        customType: null
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
    this.getCustomList();
    this.getSelectCustomList();
  },
  watch: {
    'scmSaleOrderItemList': {
      handler(newVal, oldVal) {
        this.form.scmSaleOrderItemList = newVal;
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
    getCustomList() {
      listCustom(this.customQueryParams).then(response => {
        this.customList = response.rows;
        this.customtotal = response.total;
      });
    },
    getSelectCustomList() {
      listCustomList().then(response => {
        this.selectCustomList = response.data;
      });
    },
    /** 查询供应链SCM-销售管理-销售订单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
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

    count() {
      this.scmSaleOrderItemList.forEach(item=>{
        item.amount = item.materialPrice * item.quantity
      })
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderNo: null,
        customId: null,
        customName:null,
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
      this.title = "添加销售订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.scmSaleOrderItemList = response.data.scmSaleOrderItemList;
        this.open = true;
        this.title = "修改销售订单";
      });
    },

    setCount() {
      let totalPrice = 0;
      this.scmSaleOrderItemList.forEach(item=>{
        totalPrice += item.amount
      })
      this.form.totalAmount = totalPrice
    },
    //保存按钮
    saveForm() {
      this.setCount()
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.scmSaleOrderItemList = this.scmSaleOrderItemList;
          if (!this.scmSaleOrderItemList || this.scmSaleOrderItemList.length == 0) {
            this.$modal.msgError("请添加订单明细信息");
            return false;
          }
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
              this.$modal.msgSuccess("保存成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.setCount()
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.scmSaleOrderItemList = this.scmSaleOrderItemList;
          if (!this.scmSaleOrderItemList || this.scmSaleOrderItemList.length == 0) {
            this.$modal.msgError("请添加订单明细信息");
            return false;
          }
          submitOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除销售订单编号为"' + ids + '"的数据项？').then(function () {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 供应链SCM-销售管理-销售订单子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-销售管理-销售订单子添加按钮操作 */
    handleAddScmSaleOrderItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.materialPrice = "";
      obj.quantity = "";
      obj.amount = "";
      obj.note = "";
      this.scmSaleOrderItemList.push(obj);

    },
    /** 供应链SCM-销售管理-销售订单子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-销售管理-销售订单子数据");
      } else {
        const scmSaleOrderItemList = this.scmSaleOrderItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmSaleOrderItemList = scmSaleOrderItemList.filter(function (item) {
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
    // 选择客户
    selectCustom() {
      listCustom(this.customQueryParams).then(response => {
        this.customList = response.rows;
        this.customtotal = response.total;
        this.customOpen = true
      });
    },
    // 点击选择客户
    handleCustom(val) {
      this.form.customId = val.id
      this.form.customName = val.customName
      this.form.linkman = val.linkman
      this.form.linkmanPhoneNumber = val.linkmanPhoneNumber
      this.customOpen = false
    },
    /** 客户搜索按钮操作 */
    chandleQuery() {
      this.customQueryParams.pageNum = 1;
      this.selectCustom();
    },
    /** 客户重置按钮操作 */
    cresetQuery() {

      this.resetForm("customQueryForm");
      this.chandleQuery();
    },
    // 选择物料弹出层按钮
    selectMaterial(row) {
      if (row) {
        this.materialIndex = row.index
      }
      classifyTreeSelect().then(response => {
        this.classifyOptions = response.data;
      });
      listMaterial(this.materialQuery).then(response => {
        this.materialList = response.rows;
        this.materialOpen = true
      });
    },
    // 选中物料数据
    handleChange(val) {
      this.scmSaleOrderItemList[this.materialIndex - 1].materialName = val.materialName
      this.scmSaleOrderItemList[this.materialIndex - 1].materialId = val.id
      this.scmSaleOrderItemList[this.materialIndex - 1].materialModel =  val.materialModel
      this.scmSaleOrderItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.scmSaleOrderItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.scmSaleOrderItemList[this.materialIndex - 1].materialPrice = val.materialPrice
      this.scmSaleOrderItemList.forEach(item=>{
        item.amount = item.materialPrice * item.quantity
      })
      this.materialOpen = false
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.materialQuery.classifyId = data.id;
      this.selectMaterial();
    },

    selectable(row,index) {
      if (row.auditStatus== 1 || row.applyStatus==1) {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
