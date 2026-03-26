<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据号" prop="documentId">
        <el-input
          v-model="queryParams.documentId"
          placeholder="请输入单据号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料" prop="material">
        <el-input
          v-model="queryParams.material"
          placeholder="请输入物料"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="warehouse">
        <el-input
          v-model="queryParams.warehouse"
          placeholder="请输入仓库"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库区" prop="warehouseArea">
        <el-input
          v-model="queryParams.warehouseArea"
          placeholder="请输入库区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批号" prop="warehouseSeat">
        <el-input
          v-model="queryParams.warehouseSeat"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="盘点类型" prop="inventoryType">
        <el-select v-model="queryParams.inventoryType" placeholder="请选择盘点类型" clearable>
          <el-option
            v-for="dict in dict.type.wms_inventory_information_inventory_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存月份" prop="inventoryMonth">
        <el-input
          v-model="queryParams.inventoryMonth"
          placeholder="请输入库存月份"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="盘点日期">
        <el-date-picker
          v-model="daterangeInventoryDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="负责人" prop="head">
        <el-select v-model="queryParams.head" placeholder="请输入负责人" clearable>
          <el-option
            v-for = "dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
        />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1">重置</el-button>
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

    <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentId" />
      <el-table-column label="物料" align="center" prop="material"/>
      <el-table-column label="仓库" align="center" prop="warehouse" />
      <el-table-column label="库区" align="center" prop="warehouseArea" />
      <el-table-column label="库位" align="center" prop="warehouseSeat" />
      <el-table-column label="批号" align="center" prop="batchNumber" />
      <el-table-column label="盘点类型" align="center" prop="inventoryType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_inventory_information_inventory_type" :value="scope.row.inventoryType"/>
        </template>
      </el-table-column>
      <el-table-column label="库存月份" align="center" prop="inventoryMonth" />
      <el-table-column label="盘点日期" align="center" prop="inventoryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inventoryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="head" />
      <el-table-column label="实际库存" align="center" prop="physicalInventory" />
      <el-table-column label="原因" align="center" prop="reason" />
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

    <!-- 添加或修改智能仓储WMS-盘点信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据号" prop="documentId" >
              <el-input v-model="form.documentId" disabled/>
            </el-form-item>        
            <el-form-item label="仓库" prop="warehouse">
              <el-input v-model="form.warehouse" disabled placeholder="请输入仓库"></el-input>
            </el-form-item>
            <el-form-item label="库位" prop="warehouseSeat" >
              <el-input v-model="form.warehouseArea" disabled placeholder="请输入库位"></el-input>
            </el-form-item>
            <el-form-item label="盘点日期" prop="inventoryDate">
              <el-date-picker clearable
                v-model="form.inventoryDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择盘点日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="现库存">
              <el-input v-model="form.existingInventory" placeholder="请输入现库存" type="number" disabled></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="head">
              <el-select v-model="form.head" placeholder="请输入负责人" >
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料" prop="material">
              <el-input v-model="form.material" disabled placeholder="请输入物料">
                <template slot="append">
                  <el-button
                  type="primary"
                  @click="handleSelect()"
                  >选择</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="库区" prop="warehouseArea" >
              <el-input v-model="form.warehouseArea" disabled placeholder="请输入库区"></el-input>
            </el-form-item>
            <el-form-item label="批号"  prop="batchNumber" >
              <el-input v-model="form.batchNumber" disabled placeholder="请输入批号"></el-input>
            </el-form-item>
            <el-form-item label="库存月份" prop="inventoryMonth">
                  <el-input v-model="form.inventoryMonth" placeholder="请输入库存月份" />
            </el-form-item>
            <el-form-item label="实际库存" prop="physicalInventory">
              <el-input v-model="form.physicalInventory" placeholder="请输入实际库存" />
            </el-form-item>
            <el-form-item label="原因" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title1" :visible.sync="open1" width="1000px" append-to-body>
      <el-form :model="inventoryDetailsQueryParams" ref="queryForm1" size="small" :inline="true" label-width="68px">
       <el-form-item label="物料名称" prop="material">
        <el-input
          v-model="queryParams.material"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产批号" prop="batchNuumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入生产批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      </el-form>
      <el-table v-loading="loading1" :data="inventoryDetailsList" >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="编号" align="center" prop="id" />
          <el-table-column label="物料" align="center" prop="material"/>
          <el-table-column label="仓库" align="center" prop="warehouse" />
          <el-table-column label="库区" align="center" prop="area" />
          <el-table-column label="库位" align="center" prop="seat" />
          <el-table-column label="现有库存" align="center" prop="existingInventory" />
          <el-table-column label="生产日期" align="center" prop="manufactureDate" />
          <el-table-column label="生产厂家" align="center" prop="manufacturer" />
          <el-table-column label="生产批号" align="center" prop="batchNumber" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleSelectMaterial(scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { listInventoryInformation, getInventoryInformation, delInventoryInformation, addInventoryInformation, updateInventoryInformation } from "@/api/wms/inventoryInformation";
import { listUser} from "@/api/wms/warehousingApplication"
import { inventoryDetailsList } from "../../../api/wms/inventoryInformation";
export default {
  name: "Information",
  dicts: ['wms_inventory_information_inventory_type'],
  // props:["inventoryDetailsList"],
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
      // 智能仓储WMS-盘点信息表格数据
      informationList: [],
      // 弹出层标题
      title: "",
      title1:"",
      // 是否显示弹出层
      open: false,
      // 原因时间范围
      daterangeInventoryDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentId: null,
        inventoryType: null,
        inventoryMonth: null,
        inventoryDate: null,
        head: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //遮罩层
      loading1:true,
      //总条数
      total1 : "",
      //
      userList:[],
      // 物料档案打开
      open1 :false,
      inventoryDetailsQueryParams:[],
      inventoryDetailsList:{},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询智能仓储WMS-盘点信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeInventoryDate && '' != this.daterangeInventoryDate) {
        this.queryParams.params["beginInventoryDate"] = this.daterangeInventoryDate[0];
        this.queryParams.params["endInventoryDate"] = this.daterangeInventoryDate[1];
      }
      listInventoryInformation(this.queryParams).then(response => {
        this.informationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser().then(res=>{
        this.userList = res.data
      })
    },
    CheckUserFormat(row){
      let data = this.userList.find(item =>{
        return item.userId === row.head
      })
      if(data){
        return data.userName
      }
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
        inventoryDetailsId: null,
        documentId: null,
        inventoryType: null,
        inventoryMonth: null,
        inventoryDate: null,
        head: null,
        physicalInventory: null,
        reason: null
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
      this.daterangeInventoryDate = [];
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
      this.title = "添加智能仓储WMS-盘点信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInventoryInformation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改智能仓储WMS-盘点信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInventoryInformation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryInformation(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除智能仓储WMS-盘点信息编号为"' + ids + '"的数据项？').then(function() {
        return delInventoryInformation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/inventoryInformation/export', {
        ...this.queryParams
      }, `inventoryInformation_${new Date().getTime()}.xlsx`)
    },
    /**详情数据 */
    getInventoryDetailsList(){
      this.loading1 = true;
      inventoryDetailsList().then(res=>{
        this.inventoryDetailsList = res.rows;
        this.total1 = res.total;
        this.loading1 = false;
      })
    },
    /**选择物料 */
    handleSelect(){
      this.getInventoryDetailsList();
      this.open1 = true;
      this.title1 = "选择物料";
    },
    /**关闭选择物料 */
    cancel1(){
      this.open1 = false
    },
    handleQuery1(){
      this.inventoryDetailsQueryParams.pageNum = 1;
      this.getInventoryDetailsList();
    },
    resetQuery1(){
      this.resetForm("quertForm1");
      this.handleQuery1();
    },
    handleSelectMaterial(row){
      this.form.inventoryDetailsId = row.id
      this.form.material = row.material
      this.form.warehouse = row.warehouse
      this.form.warehouseArea = row.warehouseArea
      this.form.warehouseSeat = row.warehouseSeat
      this.form.batchNumber = row.batchNumber
      this.form.existingInventory = row.existingInventory
      this.open1 = false
    }
  }
};
</script>
