<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input
          v-model="queryParams.contractNumber"
          placeholder="请输入编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="送货方式" prop="shipping">
        <el-select v-model="queryParams.shipping" placeholder="请选择送货方式" clearable>
          <el-option
            v-for="dict in dict.type.scm_shipping_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="签订日期">
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
            :value="parseInt(user.id)"
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
            v-for="user in userList"
            :key="user.id"
            :label="user.nickName"
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
        <el-select v-model="queryParams.auditorId" placeholder="请选择申请人" clearable>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickName"
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

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="合同编号" align="center" prop="contractNumber"/>
      <el-table-column label="订单编号" align="center" prop="orderNo"/>
      <el-table-column label="业务员" align="center" prop="salesMan" />
      <el-table-column label="客户名称" align="center" prop="customName"/>
      <el-table-column label="联系人" align="center" prop="linkman"/>
      <el-table-column label="联系方式" align="center" prop="linkmanPhoneNumber"/>
      <el-table-column label="金额合计" align="center" prop="totalAmount"/>
      <el-table-column label="交货日期" align="center" prop="deliveryDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyName"/>
      <el-table-column label="申请时间" align="center" prop="applyDate">
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
      <el-table-column label="审核时间" align="center" prop="auditTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.scm_audit_status" :value="scope.row.auditStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
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
            v-if="scope.row.auditStatus!='1'&& scope.row.applyStatus!='1'"
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

    <!-- 添加或修改供应链SCM-销售管理-销售合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true"
               :disabled="form.applyStatus!=1&&form.auditStatus!=1?false:true">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input placeholder="请选择" v-model="form.orderNo" :disabled="true" class="input-with-select">
            <el-button slot="append" @click="selectOrder">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="送货方式" prop="shipping">
          <el-select v-model="form.shipping" placeholder="请选择送货方式">
            <el-option
              v-for="dict in dict.type.scm_shipping_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入收货地址"/>
        </el-form-item>
        <el-form-item label="签订日期" prop="signingDate">
          <el-date-picker clearable
                          v-model="form.signingDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择签订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户名称" prop="customId">
          <el-select v-model="form.customId" placeholder="请选择客户" :disabled="true" clearable>
            <el-option
              v-for="custom in customList"
              :key="custom.id"
              :label="custom.customName"
              :value="parseInt(custom.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" :disabled="true"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="linkmanPhoneNumber">
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
                          placeholder="请选择交货日期" :disabled="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyId">
          <el-select v-model="form.applyId" placeholder="请选择申请人" :disabled="true" clearable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.userName"
              :value="user.userId"

            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyDate">
          <el-date-picker clearable
                          v-model="form.applyDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择申请时间"
                          :disabled="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" :disabled="true" placeholder="请选择申请状态">
            <el-option
              v-for="dict in dict.type.scm_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditorId">
          <el-select v-model="form.auditorId" :disabled="true" placeholder="请选择审核人" clearable>
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
        <el-form-item label="审核状态" prop="auditStatus">
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
        <el-divider content-position="center">合同明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddScmSaleContractItem">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteScmSaleContractItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="scmSaleContractItemList" :row-class-name="rowScmSaleContractItemIndex"
                  @selection-change="handleScmSaleContractItemSelectionChange" ref="scmSaleContractItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品" prop="materialName" width="220">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.materialName'" :rules="rules.materialName">
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
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.materialPrice'"
                            :rules="rules.materialPrice">
                <el-input v-model.number="scope.row.materialPrice" placeholder="请输入单价" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="orderQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractItemList.'+scope.$index+'.orderQuantity'"
                            :rules="rules.orderQuantity">
                <el-input v-model.number="scope.row.orderQuantity" placeholder="请输入订货数量" @input='changeTotalAmount'/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="金额" prop="amount" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.orderQuantity && scope.row.materialPrice ? scope.row.orderQuantity * scope.row.materialPrice : 0 }}</span>
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
        <el-button v-if="form.applyStatus!=1&&form.auditStatus!=1" type="success" @click="saveForm">保 存</el-button>
        <el-button v-if="form.applyStatus!=1&&form.auditStatus!=1" type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 订单列表弹框 start -->
    <el-dialog title="选择销售订单" :visible.sync="orderOpen" width="1000px" append-to-body>
      <el-form :model="orderQueryParams" ref="orderQueryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="客户名称" prop="customId">
          <el-select v-model="orderQueryParams.customId" placeholder="请选择客户" clearable>
            <el-option
              v-for="custom in customList"
              :key="custom.id"
              :label="custom.customName"
              :value="parseInt(custom.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="chandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="cresetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="orderList">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="订单编号" align="center" prop="orderNo"/>
        <el-table-column label="客户名称" align="center" prop="customName"/>
        <el-table-column label="金额合计" align="center" prop="totalAmount"/>
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleOrder(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="ordertotal>0"
        :total="ordertotal"
        :page.sync="orderQueryParams.pageNum"
        :limit.sync="orderQueryParams.pageSize"
        @pagination="selectOrder"
      />

    </el-dialog>
    <!-- 订单列表弹框 end -->
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->
  </div>
</template>

<script>
import {
  listContract,
  getContract,
  delContract,
  addContract,
  updateContract,
  submitContract
} from "@/api/scm/saleContract";
import {listCustomList} from "@/api/scm/custom";
import {listOrder, getOrder} from "@/api/scm/order";
import {classifyTreeSelect, listMaterial} from "@/api/wms/material";
import {getUserList} from "@/api/system/user";
import MateriaDialog from "@/views/components/MateriaDialog/index.vue";
import Vue from 'vue';

export default {
  name: "Contract",
  components: {
    MateriaDialog,
  },
  dicts: ['scm_apply_status', 'scm_audit_status', 'scm_shipping_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedScmSaleContractItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 供应链SCM-销售管理-销售合同表格数据
      contractList: [],
      // 供应链SCM-销售管理-销售合同子表格数据
      scmSaleContractItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeSigningDate: [],
      // 备注时间范围
      daterangeApplyDate: [],
      // 备注时间范围
      daterangeAuditTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractNumber: null,
        orderNo: null,
        shipping: null,
        signingDate: null,
        customId: null,
        customName: null,
        deliveryDate: null,
        applyId: null,
        applyDate: null,
        applyStatus: null,
        auditorId: null,
        auditTime: null,
        auditStatus: null,
      },
      userList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          {required: true, message: "订单编号不能为空", trigger: "blur"}
        ],
        shipping: [
          {required: true, message: "送货方式不能为空", trigger: "change"}
        ],
        address: [
          {required: true, message: "收货地址不能为空", trigger: "blur"}
        ],
        signingDate: [
          {required: true, message: "签订日期不能为空", trigger: "blur"}
        ],
        linkman: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        linkmanPhoneNumber: [
          {required: true, message: "联系方式不能为空", trigger: "blur"}
        ],
        materialName: [
          {
            required: true,
            message: "产品不能为空",
            trigger: "blur"
          }
        ],
        materialPrice: [
          {required: true, message: "单价不能为空", trigger: "blur"},
          {type: 'number', message: '必须为数字值'}
        ],
        orderQuantity: [
          {required: true, message: "订货数量不能为空", trigger: "blur"},
          {type: 'number', message: '必须为数字值'},
          {type: 'number', min: 1, message: '数量不能小于1', trigger: 'blur'}
        ],
      },
      // 查询参数
      orderQueryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        customId: null,
        salesManId: null,
        applyId: null,
        applyStatus: null,
        auditorId: null,
        auditStatus: null
      },
      orderList: [],
      orderOpen: false,
      ordertotal: 0,
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
      customList: [],
      salesManList: []
    };
  },
  watch: {
    'scmSaleContractItemList': {
      handler(newVal, oldVal) {
        this.form.scmSaleContractItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },

  created() {
    this.getList();
    this.getUser();
    this.getCustom();
  },
  methods: {
    close() {
      this.materialOpen = false
    },
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
    /** 查询供应链SCM-销售管理-销售合同列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeSigningDate && '' != this.daterangeSigningDate) {
        this.queryParams.params["beginSigningDate"] = this.daterangeSigningDate[0];
        this.queryParams.params["endSigningDate"] = this.daterangeSigningDate[1];
      }
      if (null != this.daterangeApplyDate && '' != this.daterangeApplyDate) {
        this.queryParams.params["beginApplyDate"] = this.daterangeApplyDate[0];
        this.queryParams.params["endApplyDate"] = this.daterangeApplyDate[1];
      }
      if (null != this.daterangeAuditTime && '' != this.daterangeAuditTime) {
        this.queryParams.params["beginAuditTime"] = this.daterangeAuditTime[0];
        this.queryParams.params["endAuditTime"] = this.daterangeAuditTime[1];
      }
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
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
        orderNo: null,
        linkman: null,
        shipping: null,
        address: null,
        signingDate: null

      };
      this.scmSaleContractItemList = [];
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
      this.title = "添加销售合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getContract(id).then(response => {
        this.form = response.data;
        this.scmSaleContractItemList = response.data.scmSaleContractItemList;
        this.open = true;
        this.title = "修改销售合同";
      });
    },

    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != null) {
            updateContract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(this.form).then(response => {
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
          submitContract(this.form).then(response => {
            this.$modal.msgSuccess("保存成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除供应链SCM-销售管理-销售合同编号为"' + ids + '"的数据项？').then(function () {
        return delContract(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 供应链SCM-销售管理-销售合同子序号 */
    rowScmSaleContractItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-销售管理-销售合同子添加按钮操作 */
    handleAddScmSaleContractItem() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialUnit = "";
      obj.materialPrice = "";
      obj.quantity = "";
      obj.amount = "";
      obj.remark = "";
      obj.orderQuantity = "";
      this.scmSaleContractItemList.push(obj);
    },
    /** 供应链SCM-销售管理-销售合同子删除按钮操作 */
    handleDeleteScmSaleContractItem() {
      if (this.checkedScmSaleContractItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-销售管理-销售合同子数据");
      } else {
        const scmSaleContractItemList = this.scmSaleContractItemList;
        const checkedScmSaleContractItem = this.checkedScmSaleContractItem;
        this.scmSaleContractItemList = scmSaleContractItemList.filter(function (item) {
          return checkedScmSaleContractItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleScmSaleContractItemSelectionChange(selection) {
      this.checkedScmSaleContractItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('scm/contract/export', {
        ...this.queryParams
      }, `contract_${new Date().getTime()}.xlsx`)
    },
    // 选择订单
    selectOrder() {
      this.orderOpen = true
      listOrder(this.orderQueryParams).then(response => {
        this.orderList = response.rows;
        this.ordertotal = response.total
      });
    },
    // 点击选择订单
    handleOrder(val) {
      console.log(val);
        this.form.orderId = val.id;
        this.form.orderNo = val.orderNo;
        this.form.customName = val.customName;
        this.form.totalAmount = val.totalAmount;
        this.form.deliveryDate = val.deliveryDate;
        this.form.customId = val.customId;
        this.form.linkman = val.linkman;
        this.form.linkmanPhoneNumber = val.linkmanPhoneNumber;
        this.$set(this.form,this.form.linkmanPhoneNumber,val.linkmanPhoneNumber,)
      getOrder(val.id).then(res => {
        if (res.code === 200) {
          this.scmSaleContractItemList = []
          let data = res.data.scmSaleOrderItemList
          data.forEach(item => {
            let obj = {};
            obj.materialId = item.materialId;
            obj.materialName = item.materialName;
            obj.materialModel = item.materialModel;
            obj.materialSpecifications = item.materialSpecifications;
            obj.materialUnit = item.materialUnit;
            obj.materialPrice = item.materialPrice;
            obj.amount = '';
            obj.orderQuantity = item.quantity;
            obj.remark = '';
            this.scmSaleContractItemList.push(obj);
          })
        }
      })
      this.orderOpen = false
    },
    /** 订单搜索按钮操作 */
    chandleQuery() {
      this.orderQueryParams.pageNum = 1;
      this.selectOrder();
    },
    /** 订单重置按钮操作 */
    cresetQuery() {
      this.resetForm("orderQueryForm");
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
      this.scmSaleContractItemList[this.materialIndex - 1].materialName = val.materialName
      this.scmSaleContractItemList[this.materialIndex - 1].materialId = val.id
      this.scmSaleContractItemList[this.materialIndex - 1].materialModel = val.materialModel
      this.scmSaleContractItemList[this.materialIndex - 1].materialSpecifications = val.materialSpecifications
      this.scmSaleContractItemList[this.materialIndex - 1].materialUnit = val.materialUnit
      this.scmSaleContractItemList[this.materialIndex - 1].materialPrice = val.materialPrice
      this.materialOpen = false;
      let totalPrice = 0;
      for(let item of this.scmSaleContractItemList){
        totalPrice += (item.orderQuantity*item.materialPrice)
      }
      this.form.totalAmount = totalPrice;
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

    selectable(row, index) {
      if (row.auditStatus == 1 || row.applyStatus == 1) {
        return false
      } else {
        return true
      }
    },
    // 修改总金额
    changeTotalAmount(){
      let totalPrice = 0;
      for(let item of this.scmSaleContractItemList){
        totalPrice += (item.orderQuantity*item.materialPrice)
        item.amount = (item.orderQuantity*item.materialPrice)
      }
      let receveForm = this.form
      // 这里需要设置表单为空，否则总金额回显不成功
      this.form = {}
      Vue.set(receveForm,'totalAmount',totalPrice)
      this.form = receveForm
      console.log(this.form);
    }
  }
};
</script>


<style scoped lang="scss">
.cell {

  text-align: center;
}

</style>

