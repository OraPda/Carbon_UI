<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="退货编号" prop="returnNo">
        <el-input
          v-model="queryParams.returnNo"
          placeholder="请输入退货编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货单号" prop="deliveryNo">
        <el-input
          v-model="queryParams.deliveryNo"
          placeholder="请输入发货编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customId">
        <el-select v-model="queryParams.customId" placeholder="请选择客户"    clearable>
          <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退货日期">
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
      <el-form-item label="入库状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择入库状态" clearable>
          <el-option
            v-for="dict in dict.type.scm_put_status"
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

    <el-table v-loading="loading" :data="returnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="退货编号" align="center" prop="returnNo" />
      <el-table-column label="发货单号" align="center" prop="deliveryNo" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="客户名称" align="center" prop="customName" />
      <el-table-column label="退货日期" align="center" prop="returnDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.returnDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货金额" align="center" prop="returnAmount" />
      <el-table-column label="入库状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.scm_put_status" :value="scope.row.status"/>
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
            v-show="scope.row.status == 0"
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

    <!-- 添加或修改供应链SCM-销售管理-销售退货对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true" :disabled="form.status != 0 && form.status != null ? true:false">
        <el-form-item label="退货编号" prop="returnNo">
          <el-input v-model="form.returnNo" placeholder="系统自动生成" disabled/>
        </el-form-item>
        <el-form-item label="发货单号" prop="deliveryNo">
          <el-input placeholder="请选择" v-model="form.deliveryNo" disabled class="input-with-select">
            <el-button slot="append" @click="selectDelivery">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="请输入合同编号" disabled />
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称" disabled />
        </el-form-item>
        <el-form-item label="退货日期" prop="returnDate">
          <el-date-picker clearable
            v-model="form.returnDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择退货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退货金额" prop="returnAmount">
          <el-input v-model.number="form.returnAmount" placeholder="请输入退货金额" disabled/>
        </el-form-item>
        <el-form-item label="退货原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入退货原因" />
        </el-form-item>
        <el-form-item label="入库状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择入库状态" disabled>
            <el-option
              v-for="dict in dict.type.scm_put_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-divider content-position="center">退货明细信息</el-divider>
        <el-table :data="scmSaleReturnItemList" :row-class-name="rowScmSaleReturnItemIndex" @selection-change="handleScmSaleReturnItemSelectionChange" ref="scmSaleReturnItem">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="material" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" placeholder="请输入物料" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled />
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled />
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled />
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="materialPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入价格" disabled />
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="orderQuantity" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.orderQuantity" placeholder="请输入订货数量" disabled />
            </template>
          </el-table-column>
          <el-table-column label="发货数量" prop="deliveryNum" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deliveryNum" placeholder="请输入发货数量" disabled />
            </template>
          </el-table-column>
          <el-table-column label="退货数量" prop="returnNum" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleReturnItemList.'+scope.$index+'.returnNum'" :rules="rules.returnNum">
                <el-input-number :max="scope.row.deliveryNum" :min="1" style="width:130px" :size="small" v-model.number="scope.row.returnNum" placeholder="请输入退货数量"  @input='changeTotalAmount' />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.note" placeholder="请输入备注" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="form.status!='1'&&form.status!='2'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发货单列表弹框 -->
    <el-dialog title="选择发货单" :visible.sync="deliveryOpen" width="1050px" append-to-body>
      <el-form :model="deliveryQueryParams" ref="deliveryQueryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="发货编号" prop="deliveryNo">
          <el-input
            v-model="deliveryQueryParams.deliveryNo"
            placeholder="请输入发货编号"
            clearable
            @keyup.enter.native="chandleQuery"
          />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input
            v-model="deliveryQueryParams.contractNo"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter.native="chandleQuery"
          />
        </el-form-item>
        <el-form-item label="客户名称" prop="customId">
        <el-select v-model="deliveryQueryParams.customId" placeholder="请选择客户"    clearable>
          <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.customId"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
                          v-model="deliveryQueryParams.deliveryDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择交货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="chandleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="cresetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="deliveryList">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="发货编号" align="center" prop="deliveryNo" />
        <el-table-column label="合同编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="送货方式" align="center" prop="shipping">
          <template slot-scope="scope">
            <span>{{shipping[scope.row.shipping]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="linkman" />
        <el-table-column label="联系电话" align="center" prop="contactWay" />
        <el-table-column label="出库状态" align="center" prop="status">
          <template slot-scope="scope">
            <span>{{returnStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDelivery(scope.row)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="deliverytotal>0"
        :total=" deliverytotal"
        :page.sync="deliveryQueryParams.pageNum"
        :limit.sync="deliveryQueryParams.pageSize"
        @pagination="selectDelivery"
      />

    </el-dialog>
  </div>
</template>

<script>
import { listReturn, getReturn, delReturn, addReturn, updateReturn } from "@/api/scm/return";
import {listCustomList} from "@/api/scm/custom";
import {listDelivery,getDelivery} from "@/api/scm/delivery";

export default {
  name: "Return",
  dicts: ['scm_put_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedScmSaleReturnItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,

      customList: [],
      // 总条数
      total: 0,
      // 供应链SCM-销售管理-销售退货表格数据
      returnList: [],
      // 供应链SCM-销售管理-销售退货子表格数据
      scmSaleReturnItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeReturnDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        returnNo: null,
        deliveryNo: null,
        contractNo: null,
        customId: null,
        returnDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deliveryNo: [
          { required: true, message: "发货编号不能为空", trigger: "blur" }
        ],
        returnDate: [
          { required: true, message: "退货日期不能为空", trigger: "blur" }
        ],
        returnNum: [
          { required: true, message: "退货数量不能为空", trigger: "blur" },
          {type: 'number', message: '必须为数字值'},
        ],
      },
      // 发货单弹框
      deliveryOpen: false,
      // 发货单表格数据
      deliveryList: [],
      // 发货单搜索
      deliveryQueryParams: {
        pageNum: 1,
        pageSize: 10,
        deliveryNo: null,
        contractNo: null,
        customId: null,
        deliveryDate: null,
        status: 2
      },
      // 发货单列表总条数
      deliverytotal: 0,
      shipping: ['快递','物流'],
      returnStatus: ['未出库','出库中','已出库']
    };
  },
  watch: {
    'scmSaleReturnItemList': {
      handler(newVal, oldVal) {
        this.form.scmSaleReturnItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getCustomList()
  },
  methods: {
    /** 查询供应链SCM-销售管理-销售退货列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeReturnDate && '' != this.daterangeReturnDate) {
        this.queryParams.params["beginReturnDate"] = this.daterangeReturnDate[0];
        this.queryParams.params["endReturnDate"] = this.daterangeReturnDate[1];
      }
      listReturn(this.queryParams).then(response => {
        this.returnList = response.rows;
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
        returnNo: null,
        deliveryNo: null,
        contractNo: null,
        customName: null,
        returnDate: null,
        returnAmount: null,
        reason: null,
        status: null,
        remark: null,
        createTime: null
      };
      this.scmSaleReturnItemList = [];
      this.resetForm("form");
    },

    getCustomList() {
      listCustomList().then(res=>{
        this.customList = res.data
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReturnDate = [];
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
      this.title = "添加销售退货";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReturn(id).then(response => {
        this.form = response.data;
        this.scmSaleReturnItemList = response.data.scmSaleReturnItemList;
        this.open = true;
        this.title = "修改销售退货";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.scmSaleReturnItemList = this.scmSaleReturnItemList;
          if (this.form.id != null) {
            updateReturn(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReturn(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
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
      this.$modal.confirm('是否确认删除销售退货编号为"' + ids + '"的数据项？').then(function() {
        return delReturn(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 供应链SCM-销售管理-销售退货子序号 */
    rowScmSaleReturnItemIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 供应链SCM-销售管理-销售退货子添加按钮操作 */
    handleAddScmSaleReturnItem() {
      let obj = {};
      obj.material = "";
      obj.materialModel = "";
      obj.materialSpecifications = "";
      obj.materialName="";
      obj.materialUnit = "";
      obj.amount = "";
      obj.orderQuantity = "";
      obj.deliveryNum = "";
      obj.returnNum = "";
      obj.note = "";
      this.scmSaleReturnItemList.push(obj);
    },
    /** 供应链SCM-销售管理-销售退货子删除按钮操作 */
    handleDeleteScmSaleReturnItem() {
      if (this.checkedScmSaleReturnItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-销售管理-销售退货子数据");
      } else {
        const scmSaleReturnItemList = this.scmSaleReturnItemList;
        const checkedScmSaleReturnItem = this.checkedScmSaleReturnItem;
        this.scmSaleReturnItemList = scmSaleReturnItemList.filter(function(item) {
          return checkedScmSaleReturnItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleScmSaleReturnItemSelectionChange(selection) {
      this.checkedScmSaleReturnItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('scm/return/export', {
        ...this.queryParams
      }, `return_${new Date().getTime()}.xlsx`)
    },
    // 选择发货单
    selectDelivery() {
      listDelivery(this.deliveryQueryParams).then(response => {
        this.deliveryList = response.rows;
        this.deliverytotal = response.total;
        this.deliveryOpen = true
      });
    },
    // 点击选择发货单
    handleDelivery(val) {
        this.form.deliverId = val.id
        this.form.contractId = val.contractId
        this.form.deliveryNo = val.deliveryNo
        this.form.contractNo = val.contractNo
        this.form.customId = val.customId
        this.form.customName = val.customName
      getDelivery(val.id).then(res=>{
        this.scmSaleReturnItemList = res.data.scmSaleDeliveryItemList
        this.scmSaleReturnItemList.forEach(item => {
          this.$set(item,"returnNum",null)
        });
      })
      this.deliveryOpen = false

    },
    selectable(row,index) {
      if (row.status == '0' ) {
        return true
      } else {
        return false
      }
    },
    /** 发货单搜索按钮操作 */
    chandleQuery() {
      this.deliveryQueryParams.pageNum = 1;
      this.selectDelivery();
    },
    /** 发货单重置按钮操作 */
    cresetQuery() {
      this.resetForm("deliveryQueryForm");
      this.chandleQuery();
    },
    // 修改总金额
    changeTotalAmount(){
      let totalPrice = 0;
      for(let item of this.scmSaleReturnItemList){
        totalPrice += (item.returnNum*item.materialPrice)
      }
      let receveForm = this.form
      // 这里需要设置表单为空，否则总金额回显不成功
      this.form = {}
      this.$set(receveForm,'returnAmount',totalPrice)
      this.form = receveForm
    }
  }
};
</script>
