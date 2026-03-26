<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="到货单号" prop="deliveryNumber">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryParams.deliveryNumber"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="purchasingContractNo">
        <el-input
          placeholder="请输入客户名称"
          clearable
          v-model="queryParams.purchasingContractNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商"  prop="saleSupplierId">
        <el-select placeholder="请选择" v-model="queryParams.supplierId" clearable>
          <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="到货日期">
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
      <el-form-item label="状态"  prop="status">
        <el-select placeholder="请选择" v-model="queryParams.status" clearable>
          <el-option key="1" label="未入库" value="0"/>
          <el-option key="2" label="入库中" value="1"/>
          <el-option key="3" label="已入库" value="2"/>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="arrivalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="到货单号" align="center" prop="deliveryNumber"/>
      <el-table-column label="合同编号" align="center" prop="purchasingContractNo"/>
      <el-table-column label="供应商名称" align="center" prop="saleSupplierName"/>
      <el-table-column label="联系人" align="center" prop="contacts"/>
      <el-table-column label="联系电话" align="center" prop="contactNumber"/>
      <el-table-column label="到货日期" align="center" prop="arrivalDate"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{status[scope.row.status]}}</span>
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
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-show="scope.row.status=='0'"
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

    <!-- 添加或修改添加采购到货对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1050px" append-to-body >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true" :disabled="form.status != 0 && form.status != null ? true:false">
        <el-form-item label="到货单号" prop="deliveryNumber">
          <el-input placeholder="系统自动生成" v-model="form.deliveryNumber" class="input-with-select" :disabled="true"/>
        </el-form-item>
        <el-form-item label="合同编号" prop="purchasingContractNo">
          <el-input placeholder="请选择" v-model="form.purchasingContractNo" class="input-with-select" :disabled="true">
            <el-button slot="append" @click="selectCustom">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="到货日期" prop="arrivalDate">
            <el-date-picker clearable
              v-model="form.arrivalDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入"/>
        </el-form-item>
        <el-divider content-position="center">到货明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteScmSaleOrderItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="scmPurchaseArrivalItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" placeholder="物料名称" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="materialPrice" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="demandedQuantity" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.demandedQuantity" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseArrivalItemList.'+scope.$index+'.batchNumber'" :rules="rules.batchNumber">
                <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到货数量" prop="arrivalQuantity" width="150" >
            <template slot-scope="scope">
              <el-form-item :prop="'scmPurchaseArrivalItemList.'+scope.$index+'.arrivalQuantity'" :rules="rules.arrivalQuantity">
                <el-input v-model.number="scope.row.arrivalQuantity" placeholder="请输入" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="退货数量" prop="returnQuantity" width="150" >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.returnQuantity" placeholder="请输入" disabled/>
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
        <el-button type="primary" @click="submitForm" v-if="form.status!='1'&&form.status!='2'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择采购合同" :visible.sync="customOpen" width="1000px" append-to-body>
      <el-form :model="contractForm" ref="contractForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input
            v-model="contractForm.contractNo"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="chandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="cresetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="contractList">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="合同编号" align="center" prop="contractNo"/>
        <el-table-column label="申请编号" align="center" prop="applicationNo"/>
        <el-table-column label="供应商" align="center" prop="saleSupplierName"/>
        <el-table-column label="联系人" align="center" prop="contacts"/>
        <el-table-column label="合同金额" align="center" prop="contractAmount"/>
        <el-table-column label="送货方式" align="center" prop="deliveryMethod">
          <template slot-scope="scope">
            <span v-if="scope.row.deliveryMethod === '1'">客户自提</span>
            <span v-if="scope.row.deliveryMethod === '2'">快递物流</span>
          </template>
        </el-table-column>
        <el-table-column label="签约日期" align="center" prop="signingDate"/>
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
        :page.sync="contractForm.pageNum"
        :limit.sync="contractForm.pageSize"
        @pagination="selectCustom"
      />

    </el-dialog>
  </div>
</template>

<script>
import {getUserList} from "@/api/system/user";
import {listArrival,addArrival,delArrival,updateArrival,getArrival} from '@/api/scm/arrival'
import {listContract,getContract} from '@/api/scm/contract'
import {getListSupplier} from '@/api/scm/supplier'
export default {
  name: "purchaseArrival",
  dicts: ['scm_apply_status', 'scm_audit_status'],
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
      // 供应链SCM-采购管理-采购到货表格数据
      arrivalList: [],
      // 供应链SCM-采购管理-采购到货子表格数据
      scmPurchaseArrivalItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        params:{},
        deliveryNumber: null,
        purchasingContractNo: null,
        supplierId: null,
        status: null
      },
      contractForm: {
        approvedStatus: 1,
        contractNo: null,
        pageNum: 1,
        pageSize: 10,
      },
      status: [
        '未入库','入库中','已入库'
      ],

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purchasingContractNo: [
          { required: true, message: "合同单号不能为空", trigger: "blur" }
        ],
        arrivalDate: [
          { required: true, message: "到货日期不能为空", trigger: "blur" }
        ],
        arrivalQuantity: [
          { required: true, message: "到货数量不能为空", trigger: "blur" },
          { type: "number", message: "到货数量需要为数字值" }
        ],
        batchNumber: [
          { required: true, message: "生产批号不能为空", trigger: "blur" }
        ]
      },
      // 合同弹框
      customOpen: false,
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
      contractList: [],
      supplierList: []
    };
  },
  watch: {
    'scmPurchaseArrivalItemList': {
      handler(newVal, oldVal) {
        this.form.scmPurchaseArrivalItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getUser();
    this.getSupplier()
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.data;
        }
      );
    },

    // 获取所有供应商
    getSupplier() {
      getListSupplier().then(res=>{
        this.supplierList = res.rows
      })
    },

    /** 查询供应链SCM-采购管理-采购到货列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginArrivalDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endArrivalDate"] = this.daterangeDeliveryDate[1];
      }
      listArrival(this.queryParams).then(res=>{
        this.arrivalList = res.rows
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
        purchasingContractId: null,
        arrivalDate: null,
        remark: null,
      };
      this.scmPurchaseArrivalItemList = []
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
      this.queryParams.supplierId = null
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
      this.title = "添加采购到货";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids;
      getArrival(ids).then(res=>{
        if (res.code === 200) {
          this.form = res.data
          this.scmPurchaseArrivalItemList = res.data.scmPurchaseArrivalItemList
        }
      })
      this.open = true;
      this.title = "修改采购到货";
    },
    /** 提交按钮 */
    submitForm() {
      this.form.scmPurchaseArrivalItemList = this.scmPurchaseArrivalItemList
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArrival(this.form).then(res=>{
              if(res.code == 200){
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList()
              }
            });
          } else {
            addArrival(this.form).then(res=>{
              if (res.code === 200) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList()
              }
            })
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`是否确认删除采购申请编号为${ids}的数据项？`).then(() => {
        delArrival(ids).then(res=>{
          if (res.code === 200) {
            this.$modal.msgSuccess("删除成功");
            this.getList()
          }
        })
      }).catch(() => {
      });
    },
    /** 供应链SCM-采购管理-采购到货子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-采购管理-采购到货子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的采购到货明细数据");
      } else {
        const scmPurchaseArrivalItemList = this.scmPurchaseArrivalItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmPurchaseArrivalItemList = scmPurchaseArrivalItemList.filter(function (item) {
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
    // 选择合同
    selectCustom() {
      this.getContract()
      this.customOpen = true
    },
    // 点击选择采购合同
    handleCustom(val) {
      console.log(val);
      this.form.purchasingContractId = val.id
      this.form.purchasingContractNo = val.contractNo
      this.form.supplierId = val.saleSupplierId
      this.$set(this.form,this.form.purchasingContractNo,val.contractNo)
      this.$set(this.form,this.form.supplierId,val.saleSupplierId)
      getContract(val.id).then(res=>{
          this.scmPurchaseArrivalItemList = res.data.scmPurchaseContractItemList
        this.scmPurchaseArrivalItemList.forEach(item=>{
          item.amount = item.materialPrice
          item.demandedQuantity = item.purchaseQuantity
          this.$set(item,"batchNumber",null)
          this.$set(item,"arrivalQuantity",null)
        })
      })
      this.customOpen = false
    },
    /** 客户搜索按钮操作 */
    chandleQuery() {
      this.getContract();
    },
    /** 客户重置按钮操作 */
    cresetQuery() {
      this.resetForm("contractForm");
      this.chandleQuery();
    },

    getContract(){
      listContract(this.contractForm).then(res=>{
        this.contractList = res.rows
        this.customtotal = res.total
      })
    },
    selectable(row,index) {
      if (row.status == '0' ) {
        return true
      } else {
        return false
      }
    }
  }
};
</script>
