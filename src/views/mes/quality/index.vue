<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="完工单号" prop="oddNumbers">
        <el-input
          v-model="queryParams.oddNumbers"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="作业名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="检验批次" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="检验项" prop="checkItem">
        <el-input
          v-model="queryParams.checkItem"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="计划编号" prop="planNumber">
        <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产时间">
        <el-date-picker
          v-model="daterangeManufactureDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="productInspectorList"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="流水号" align="center" prop="serialNumber"/>
      <el-table-column label="计划编号" align="center" prop="planNumber"/>
      <el-table-column label="完工单号" align="center" prop="oddNumbers"/>
      <el-table-column label="作业名称" align="center" prop="jobName"/>
      <el-table-column label="产线名称" align="center" prop="productionLine"/>
      <el-table-column label="检验编号" align="center" prop="batchNumber"/>
      <el-table-column label="产品名称" align="center" prop="materialName"/>
      <el-table-column label="生产日期" align="center" prop="manufactureDate"/>
      <el-table-column label="检验项" align="center" prop="checkItem"/>
      <el-table-column label="生产数量" align="center" prop="quantity"/>
      <el-table-column label="抽检数量" align="center" prop="sampleQuantity"/>
      <el-table-column label="检验值" align="center" prop="inspectionValue"/>
      <el-table-column label="合格率" align="center" prop="qualifiedRate">
        <template slot-scope="scope">
          <span>{{ scope.row.qualifiedRate * 100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="检验人" align="center" prop="checkUserName"/>
      <el-table-column
        label="检验时间"
        align="center"
        prop="inspectorTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inspectorTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  listProductInspector,
} from "@/api/mes/productInspector";
import {listUser} from "@/api/wms/warehousingApplication";

export default {
  components: {},
  name: "traceability",
  dicts: ['mes_inspection_result'],
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
      productInspectorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangeInspectorTime: [],
      daterangeManufactureDate: [],
      // 查询参数
      queryParams: {
        year: null,
        pageNum: 1,
        pageSize: 10,
        serialNumber: null,
        oddNumbers: null,
        jobName: null,
        materialName: null,
        batchNumber: null,
        checkItem: null,
        checkUserId: null,
        result: null,
        planNumber: null,
      },
      userList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询质量追溯列表 */
    getList() {
      console.log(this.queryParams)
      this.loading = true;
      this.queryParams.params = {};
      if (
        null != this.daterangeInspectorTime &&
        "" != this.daterangeInspectorTime
      ) {
        this.queryParams.params["beginInspectorTime"] =
          this.daterangeInspectorTime[0];
        this.queryParams.params["endInspectorTime"] =
          this.daterangeInspectorTime[1];
      }
      if (
        null != this.daterangeManufactureDate &&
        "" != this.daterangeManufactureDate
      ) {
        this.queryParams.params["beginManufactureDate"] =
          this.daterangeManufactureDate[0];
        this.queryParams.params["endManufactureDate"] =
          this.daterangeManufactureDate[1];
      }
      listProductInspector(this.queryParams).then((response) => {
        this.productInspectorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser().then(response => {
        this.userList = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeInspectorTime = [];
      this.daterangeManufactureDate = []
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>
