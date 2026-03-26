<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料" prop="materialId">
        <el-select v-model="queryParams.materialId" placeholder="请选择物料" clearable>
          <el-option
            v-for="item in materialList"
            :key="item.id"
            :label="item.materialName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="源仓库" prop="sourceWarehouse">
        <el-select v-model="queryParams.sourceWarehouse" placeholder="请选择源仓库" clearable>
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.warehouseName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="源库区" prop="sourceArea">
        <el-select v-model="queryParams.sourceArea" placeholder="请选择源库区" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="源库位" prop="sourceSeat">
        <el-select v-model="queryParams.sourceSeat" placeholder="请选择源库位" clearable>
          <el-option
            v-for="item in seatList"
            :key="item.id"
            :label="item.seatName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标仓库" prop="targetWarehouse">
        <el-select v-model="queryParams.targetWarehouse" placeholder="请选择目标仓库" clearable>
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.warehouseName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标库区" prop="targetArea">
        <el-select v-model="queryParams.targetArea" placeholder="请选择目标库区" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标库位" prop="targetSeat">
        <el-select v-model="queryParams.targetSeat" placeholder="请选择目标库位" clearable>
          <el-option
            v-for="item in seatList"
            :key="item.id"
            :label="item.seatName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移库时间">
        <el-date-picker
          v-model="daterangeTransferTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="执行人" prop="executor">
        <el-select v-model="queryParams.executor" placeholder="请选择执行人" clearable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="relocationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="物料" align="center" prop="material" />
      <el-table-column label="源仓库" align="center" prop="sourceWarehouse" />
      <el-table-column label="源库区" align="center" prop="sourceArea" />
      <el-table-column label="源库位" align="center" prop="sourceSeat" />
      <el-table-column label="批号" align="center" prop="batchNumber" />
      <el-table-column label="目标仓库" align="center" prop="targetWarehouse" />
      <el-table-column label="目标库区" align="center" prop="targetArea" />
      <el-table-column label="目标库位" align="center" prop="targetSeat" />
      <el-table-column label="移出数量" align="center" prop="relocationQuantity" />
      <el-table-column label="移库时间" align="center" prop="transferTime" />
      <el-table-column label="执行人" align="center" prop="executor" />
      <el-table-column label="原因" align="center" prop="reason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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
  </div>
</template>

<script>
import { listRelocation, getRelocation, delRelocation, addRelocation, updateRelocation, listWarehouse, listArea, listSeat, listMaterial } from "@/api/wms/relocation";
import { listUser } from "@/api/system/user";
export default {
  name: "Relocation",
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
      // 移库信息表格数据
      relocationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 执行人时间范围
      daterangeTransferTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: null,
        batchNumber: null,
        sourceWarehouse: null,
        sourceArea: null,
        sourceSeat: null,
        targetWarehouse: null,
        targetArea: null,
        targetSeat: null,
        transferTime: null,
        executor: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      userList: [],
      warehouseList: [],
      areaList: [],
      seatList: [],
      materialList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询移库信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      this.getWarehouseList();
      this.getAreaList();
      this.getSeatList();
      this.getMaterial();
      this.getUser();
      if (null != this.daterangeTransferTime && '' != this.daterangeTransferTime) {
        this.queryParams.params["beginTransferTime"] = this.daterangeTransferTime[0];
        this.queryParams.params["endTransferTime"] = this.daterangeTransferTime[1];
      }
      listRelocation(this.queryParams).then(response => {
        this.relocationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询仓库 */
    getWarehouseList() {
      listWarehouse().then(response => {
        this.warehouseList = response.data;
      });
    },
    /** 查询库区 */
    getAreaList() {
      listArea().then(response => {
        this.areaList = response.data;
      });
    },
    /** 查询库位 */
    getSeatList() {
      listSeat().then(response => {
        this.seatList = response.data;
      });
    },
    /** 查询物料 */
    getMaterial() {
      listMaterial().then(response => {
        this.materialList = response.data;
      });
    },
    getUser(){
      listUser().then(response=>{
        this.userList = response.rows;
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
        material: null,
        batchNumber: null,
        reason: null,
        sourceWarehouse: null,
        sourceArea: null,
        sourceSeat: null,
        targetWarehouse: null,
        targetArea: null,
        targetSeat: null,
        transferTime: null,
        executor: null,
        relocationQuantity:null
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
      this.daterangeTransferTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除移库信息编号为"' + ids + '"的数据项？').then(function() {
        return delRelocation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>
