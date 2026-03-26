<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="退货单号" prop="returnNo">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryParams.returnNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          placeholder="请输入到货名称"
          clearable
          v-model="queryParams.purchasingContractNo"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商"  prop="supplierId">
        <el-select placeholder="请选择供应商" v-model="queryParams.supplierId" clearable>
          <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="退货日期" >
        <el-date-picker
          v-model="daterangeReturnDate"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="returnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="退货单号" align="center" prop="returnNo"/>
      <el-table-column label="到货单号" align="center" prop="deliveryNumber"/>
      <el-table-column label="合同编号" align="center" prop="purchasingContractNo"/>
      <el-table-column label="供应商名称" align="center" prop="saleSupplierName"/>
      <el-table-column label="退货日期" align="center" prop="returnDate"/>
      <el-table-column label="创建人" align="center" prop="founderName"/>
      <el-table-column label="创建时间" align="center" prop="founderDate"/>
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

    <!-- 添加或修改添加采购退货对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="退货单号" prop="returnNo">
          <el-input placeholder="系统自动生成" v-model="form.returnNo" class="input-with-select" :disabled="true"/>
        </el-form-item>
        <el-form-item label="到货编号" prop="deliveryNumber">
          <el-input placeholder="请选择" v-model="form.deliveryNumber" class="input-with-select" :disabled="true">
            <el-button slot="append" @click="selectArrival">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="退货日期" prop="returnDate">
          <el-date-picker v-model="form.returnDate" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入"/>
        </el-form-item>
        <el-divider content-position="center">退货明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteScmSaleOrderItem">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="scmPurchaseReturnItemList" :row-class-name="rowScmSaleOrderItemIndex"
                  @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" placeholder="请输入型号" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="materialPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="demandedQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.demandedQuantity" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber" placeholder="请输入" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="到货数量" prop="arrivalQuantity" width="150" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.arrivalQuantity" placeholder="请输入" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="退货数量" prop="returnQuantity" width="150">
            <template slot-scope="scope">
              <el-input-number :max="scope.row.arrivalQuantity" :min="1"  size="small" v-model="scope.row.returnQuantity" placeholder="请输入"/>
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

    <el-dialog title="选择到货单" :visible.sync="arrivalOpen" width="1000px" append-to-body>
      <el-form :model="arrivalQueryParams" ref="customQueryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="到货单号" prop="linkman">
          <el-input
            v-model="arrivalQueryParams.deliveryNumber"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="合同编号" prop="purchasingContractNo">
          <el-input
            v-model="arrivalQueryParams.purchasingContractNo"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="customType">
          <el-select placeholder="请选择供应商" v-model="arrivalQueryParams.supplierId" clearable>
          <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.id" :key="item.id"/>
        </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="chandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="cresetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="arrivalList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="id" />
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
              @click="handleCustom(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="customtotal>0"
        :total="customtotal"
        :page.sync="arrivalQueryParams.pageNum"
        :limit.sync="arrivalQueryParams.pageSize"
        @pagination="selectArrival"
      />
    </el-dialog>
  </div>
</template>

<script>
import {getListSupplier} from "@/api/scm/supplier";
import {getUserList} from "@/api/system/user";
import {listReturn,addReturn,getReturn,delReturn,updateReturn} from '@/api/scm/purchaseRetrun'
import {listArrival,getArrival} from '@/api/scm/arrival'

export default {
  name: "purchaseReturn",
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
      // 供应链SCM-采购管理-采购退货表格数据
      returnList: [],
      // 供应链SCM-采购管理-采购退货子表格数据
      scmPurchaseReturnItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        params: {},
        pageNum: 1,
        pageSize: 10,
        returnNo: null,
        deliveryNumber: null,
        purchasingContractNo: null,
        supplierId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purchasingArrivalId: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        returnDate: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],

      },
      // 到货弹框
      arrivalOpen: false,
      // 到货档案表格数据
      customList: [],
      // 供应商列表
      supplierList: [],
      arrivalQueryParams: {
        pageNum: 1,
        pageSize: 10,
        status: 0,
        deliveryNumber: null,
        purchasingContractNo: null,
        supplierId: null,
      },
      // 到货列表总条数
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
      daterangeReturnDate: [],

      arrivalList: [],
      status: [
        '未入库','入库中','已入库'
      ],
    };
  },
  created() {
    this.getList();
    this.getUser();
    this.getSupplierList();
  },
  methods: {
    getUser() {
      getUserList().then(response => {
          this.userList = response.rows;
        }
      );
    },
    getSupplierList() {
      getListSupplier().then(response => {
          this.supplierList = response.data;
        }
      );      
    },
    /** 查询供应链SCM-采购管理-采购退货列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {}
      if (null != this.daterangeReturnDate && '' != this.daterangeReturnDate) {
        this.queryParams.params["beginReturnDate"] = this.daterangeReturnDate[0];
        this.queryParams.params["endReturnDate"] = this.daterangeReturnDate[1];
      }
      listReturn(this.queryParams).then(res=>{
        this.returnList = res.rows
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
        id: null,
        returnNo: null,
        deliveryNumber: null,
        returnDate: null,
        remark: null,
      };
      this.scmPurchaseReturnItemList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReturnDate = [];
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
      this.title = "添加采购退货";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids;
      getReturn(ids).then(res=>{
        if (res.code === 200) {
          this.form = res.data
          this.scmPurchaseReturnItemList = res.data.scmPurchaseReturnItemList
        }
      })
      this.open = true;
      this.title = "修改采购退货";
    },
    /** 提交按钮 */
    submitForm() {
      if (this.form.purchasingArrivalId == null ) {
        this.$message.error("请输入必填项")
        return
      }
      if ( this.form.returnDate == null) {
        this.$message.error("请选择退货时间")
        return
      }
      this.form.scmPurchaseReturnItemList = this.scmPurchaseReturnItemList
      if (this.form.id != null) {
        updateReturn(this.form).then(res=>{
          this.$modal.msgSuccess("修改成功");
        })
        this.open = false;
      } else {
        addReturn(this.form).then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess("新增成功");
            this.getList()
          }
        })
        this.open = false;
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`是否确认删除采购退货编号为${ids}的数据项？`).then(() => {
        delReturn(ids).then(res=>{
          if (res.code === 200) {
            this.$modal.msgSuccess("删除成功");
            this.getList()
          }
        })
      }).catch(() => {
      });
    },
    /** 供应链SCM-采购管理-采购退货子序号 */
    rowScmSaleOrderItemIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-采购管理-采购退货子添加按钮操作 */
    handleAddScmSaleOrderItem() {

    },
    /** 供应链SCM-采购管理-采购退货子删除按钮操作 */
    handleDeleteScmSaleOrderItem() {
      if (this.checkedScmSaleOrderItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-采购管理-采购退货子数据");
      } else {
        const scmPurchaseReturnItemList = this.scmPurchaseReturnItemList;
        const checkedScmSaleOrderItem = this.checkedScmSaleOrderItem;
        this.scmPurchaseReturnItemList = scmPurchaseReturnItemList.filter(function (item) {
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
    // 选择到货
    selectArrival() {
      this.getArrivalList()
      this.arrivalOpen = true
    },
    // 点击选择到货
    handleCustom(val) {
      this.form.purchasingArrivalId = val.id,
      this.form.deliveryNumber = val.deliveryNumber,
      this.form.supplierId = val.supplierId

      getArrival(val.id).then(res=>{
        this.scmPurchaseReturnItemList = res.data.scmPurchaseArrivalItemList

        this.scmPurchaseReturnItemList.forEach(item => {
          item.returnQuantity = item.arrivalQuantity
          item.amount = item.materialPrice
          this.filterList()
        })
      })
      this.arrivalOpen = false
    },
    /** 到货搜索按钮操作 */
    chandleQuery() {
      this.arrivalQueryParams.pageNum = 1;
      this.getArrivalList();
    },
    /** 到货重置按钮操作 */
    cresetQuery() {
      this.arrivalQueryParams = {}
      this.getArrivalList();
    },
    filterList() {
      let arr =[]
      this.returnList.forEach(item=>{
        arr.push(item.purchasingArrivalId)
      })
      this.arrivalList=this.arrivalList.filter(item => {
        return arr.indexOf(item.id) == -1
      })
    },
    getArrivalList() {
      listArrival(this.arrivalQueryParams).then(res=>{
        this.arrivalList = res.rows
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
