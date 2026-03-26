<template>
  <el-dialog :title="title"@open="getList" :visible.sync="open" width="1000px" :before-close="close" @close="close"
    append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="到货单号" prop="deliveryNumber">
        <el-input v-model="queryParams.deliveryNumber" placeholder="请输入到货单号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同编号" prop="purchasingContractNo">
        <el-input v-model="queryParams.purchasingContractNo" placeholder="请输入合同编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商" prop="saleSupplierName">
        <el-input v-model="queryParams.saleSupplierName" placeholder="请输入供应商" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="arriveList">
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
          <el-button size="mini" type="text"  @click="handleSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </el-dialog>
</template>

<script>
import {listArrival} from '@/api/scm/arrival'
  export default {
    name: "ArriveSelect",
    components: {

    },
    props: {
      open: {
        type: Boolean,
        default: false,
      },
      // 弹出层标题
      title: {
        type: String,
        default: "选择到货单",
      },
      //是否单选
      isSingle: {
        type: Boolean,
        default: true,
      },
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
        // 表格数据
        arriveList: [],
        selectedList: [],
        // 类型字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          arriveNo: null,
          contractNo: null,
          supplierName: null,
          status: '0', //未入库
        },
        status: [
          '未入库','入库中','已入库'
        ],
      };
    },
    methods: {
      handleSelect(row) {
        this.$emit('onArriveSelected', row);
      },

      /** 查询列表 */
      getList() {
        this.loading = true;
        listArrival(this.queryParams).then(response => {
          this.arriveList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
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
        this.selectedList = [];
        this.selectedList.push(selection);
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      close() {
        this.$emit('close')
      }
    }
  };

</script>
