<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发货编号" prop="deliveryNo">
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
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker clearable
          v-model="queryParams.deliveryDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择交货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出库状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择出库状态" clearable>
          <el-option
            v-for="dict in dict.type.scm_cargo_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
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

    <el-table v-loading="loading" :data="deliveryList" @selection-change="handleSelectionChange">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="发货编号" align="center" prop="deliveryNo" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="客户名称" align="center" prop="customName" />
      <el-table-column label="送货方式" align="center" prop="shipping">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.scm_shipping_type" :value="scope.row.shipping"/>
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
          <dict-tag :options="dict.type.scm_cargo_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
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

    <!-- 添加或修改供应链SCM-销售管理-销售发货对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body width="1000px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="form.status !=0 ? true:false">
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="发货编号" prop="deliveryNo">
              <el-input v-model="form.deliveryNo" placeholder="请输入发货编号" style="width:200px" disabled/>
            </el-form-item>
            <el-form-item label="送货方式" prop="shipping">
              <el-select v-model="form.shipping" placeholder="请选择送货方式" disabled>
                <el-option
                  v-for="dict in dict.type.scm_shipping_type"
                  :key="parseInt(dict.value)"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman" placeholder="请输入联系人" />
            </el-form-item>

          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" style="width:200px" disabled>
                <template slot="append" >
                    <span @click="changeOpen()">选择</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="交货日期" prop="deliveryDate">
              <el-date-picker clearable
                              v-model="form.deliveryDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择交货日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="联系电话" prop="contactWay">
              <el-input v-model="form.contactWay" placeholder="请输入联系电话" />
            </el-form-item>

          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="客户名称" prop="customName">
              <el-input v-model="form.customName" placeholder="请输入客户名称" disabled/>
            </el-form-item>

            <el-form-item label="收货地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入收货地址" />
            </el-form-item>

            <el-form-item label="出库状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择出库状态" disabled>
                <el-option
                  v-for="dict in dict.type.scm_cargo_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </div></el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-divider content-position="center">发货单明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
        </el-row>
        <el-table :data="scmSaleDeliveryItemList" :row-class-name="rowScmSaleContractItemIndex"  @selection-change="handleScmSaleContractItemSelectionChange" ref="scmSaleContractItem">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="产品" prop="model" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" placeholder="请输入产品" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" placeholder="请输入型号" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" placeholder="请输入单位"  :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="materialPrice" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialPrice" placeholder="请输入单价"  :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="orderQuantity" width="150">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.orderQuantity" placeholder="请输入订货数量" :disabled="true"/>
            </template>
          </el-table-column>

          <el-table-column label="金额" prop="amount" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="请输入金额" :disabled="true" />
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


    <el-dialog title="选择销售合同" :visible.sync="conOpen"  append-to-body width="1000px">
      <el-table v-loading="loading" :data="contractList" >
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="合同编号" align="center" prop="contractNumber" />
        <el-table-column label="订单编号" align="center" prop="orderNo" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="联系人" align="center" prop="linkman" />
        <el-table-column label="联系方式" align="center" prop="linkmanPhoneNumber" />
        <el-table-column label="金额合计" align="center" prop="totalAmount" />
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applyName" />
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
        <el-table-column label="审核人" align="center" prop="auditorName" />
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
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" @click="setChange(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="contractTotal>0"
        :total="contractTotal"
        :page.sync="contractQueryParams.pageNum"
        :limit.sync="contractQueryParams.pageSize"
        @pagination="getContractList"
      />
    </el-dialog>

  </div>
</template>

<script>
import { listDelivery, getDelivery, delDelivery, addDelivery, updateDelivery } from "@/api/scm/delivery";
import {listCustomList} from "@/api/scm/custom";
import {listContract,getContract} from '@/api/scm/saleContract'

export default {
  name: "Delivery",
  dicts: ['scm_cargo_status', 'scm_shipping_type','scm_apply_status','scm_apply_status', 'scm_audit_status'],
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
      // 供应链SCM-销售管理-销售发货表格数据
      deliveryList: [],
      // 弹出层标题
      title: "",
      conOpen: false,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deliveryNo: null,
        contractNo: null,
        customId: null,
        deliveryDate: null,
        status: null,
        createTime: null,
      },
      contractQueryParams: {
        pageNum: 1,
        pageSize: 10,
        auditStatus: 1
      },
      contractTotal:0,
      customList:[],
      contractList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        shipping: [
          { required: true, message: "送货方式不能为空", trigger: "change" }
        ],
        deliveryDate: [
          { required: true, message: "交货日期不能为空", trigger: "blur" }
        ],
        deliveryAddress: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        linkmanPhoneNumber: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
      },
      scmSaleDeliveryItemList: [],
      checkedScmSaleContractItem: []
    };
  },
  created() {
    this.getList();
    this.getCustomList()

  },
  methods: {
    /** 查询供应链SCM-销售管理-销售发货列表 */
    getList() {
      this.loading = true;
      listDelivery(this.queryParams).then(response => {
        this.deliveryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    changeOpen() {
      this.getContractList()
      this.conOpen = true
    },

    getContractList() {
      listContract(this.contractQueryParams).then(res=>{
        this.contractList = res.rows
        this.contractTotal = res.total
      })
      },
    getCustomList() {
      listCustomList().then(res=>{
        this.customList = res.data
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
      this.scmSaleDeliveryItemList = []
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
      this.title = "新增销售发货单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDelivery(id).then(response => {
        this.form = response.data;
        // 返回的发货方式为字符串，这里是防止发货方式下拉显示数字
        this.form.shipping = parseInt(response.data.shipping)
        this.scmSaleDeliveryItemList = response.data.scmSaleDeliveryItemList
        this.open = true;
        this.title = "修改销售发货单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.scmSaleDeliveryItemList = this.scmSaleDeliveryItemList
          if (this.form.id != null) {

            updateDelivery(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDelivery(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除销售发货单编号为"' + ids + '"的数据项？').then(function() {
        return delDelivery(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('scm/delivery/export', {
        ...this.queryParams
      }, `delivery_${new Date().getTime()}.xlsx`)
    },
    handleDeleteScmSaleContractItem() {
      if (this.checkedScmSaleContractItem.length == 0) {
        this.$modal.msgError("请先选择要删除的供应链SCM-销售管理-发货单子数据");
      } else {
        const scmSaleDeliveryItemList = this.scmSaleDeliveryItemList;
        const checkedScmSaleContractItem = this.checkedScmSaleContractItem;
        this.scmSaleDeliveryItemList = scmSaleDeliveryItemList.filter(function(item) {
          return checkedScmSaleContractItem.indexOf(item.index) == -1
        });
      }
    },
    handleScmSaleContractItemSelectionChange(selection) {
      this.checkedScmSaleContractItem = selection.map(item => item.index)
    },

    rowScmSaleContractItemIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },

    setChange(item) {
      this.form = {
        contractNo: item.contractNumber,
        shipping: item.shipping,
        linkman: item.linkman,
        deliveryDate: item.deliveryDate,
        contactWay: item.linkmanPhoneNumber,
        customName: item.customName,
        address: item.address,
        contractId: item.id,
        customId: item.customId,
        status: 0
      }
      getContract(item.id).then(res=>{
        this.scmSaleDeliveryItemList = res.data.scmSaleContractItemList
        this.scmSaleDeliveryItemList.forEach(item=>{
          item.deliveryNum = item.orderQuantity
        })
      })

      this.conOpen = false
    },
  },


};
</script>
