<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流水号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          placeholder="请输入流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划号" prop="planNumber">
        <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="BOM" prop="bomId">
        <el-select v-model="queryParams.bomId" placeholder="请选择BOM" clearable>
          <el-option
            v-for="item in bomList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产线" prop="factoryId">
        <el-select v-model="queryParams.factoryId" placeholder="请选择生产线" clearable>
          <el-option
            v-for="item in factoryList"
            :key="item.id"
            :label="item.productionLine"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺" prop="technologyId">
        <el-select v-model="queryParams.technologyId" placeholder="请选择工艺" clearable>
          <el-option
            v-for="item in technologyList"
            :key="item.id"
            :label="item.technologyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="请选择项目" clearable>
          <el-option
            v-for="item in maintenanceList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产日期" prop="manufactureDate">
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
      <el-form-item label="交货日期" prop="deliveryDate">
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_publish_status"
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

    <el-table v-loading="loading" :data="productionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="流水号" align="center" prop="serialNo"/>
      <el-table-column label="计划号" align="center" prop="planNumber"/>
      <el-table-column label="产品" align="center" prop="materialName"/>
      <el-table-column label="型号" align="center" prop="materialModel"/>
      <el-table-column label="规格" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
      <el-table-column label="BOM" align="center" prop="bomName"/>
      <el-table-column label="生产线" align="center" prop="productionLine"/>
      <el-table-column label="工艺" align="center" prop="technologyName"/>
      <el-table-column label="项目" align="center" prop="projectName"/>
      <el-table-column label="待产数量" align="center" prop="producedQuantity"/>
      <el-table-column label="已产数量" align="center" prop="quantityProduced"/>
      <el-table-column label="生产日期" align="center" prop="manufactureDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.manufactureDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交货日期" align="center" prop="deliveryDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_publish_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="领料状态" align="center" prop="pickingStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_picking_status" :value="scope.row.pickingStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.status"
            size="mini"
            type="text"
            icon="el-icon-collection-tag"
            @click="issue(scope.row)"
          >发布
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="!scope.row.status"
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

    <!-- 修改新增计划排产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划号" prop="planNumber">
              <el-input v-model="form.planNumber" placeholder="请选择生产计划" disabled>
                <el-button slot="append" @click="selectPlan" :disabled="form.status ? true : false">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目" prop="projectName">
              <el-input v-model="form.projectName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="materialName">
              <el-input v-model="form.materialName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="materialModel">
              <el-input v-model="form.materialModel" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="materialSpecifications">
              <el-input v-model="form.materialSpecifications" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="materialUnit">
              <el-input v-model="form.materialUnit" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="BOM" prop="bomId">
              <el-select v-model="form.bomId" placeholder="请选择BOM" @change="changeBom" clearable :disabled="form.status ? true : false">
                <el-option
                  v-for="item in bomListByMaterial"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-form-item label="生产线" prop="factoryId">
              <el-select v-model="form.factoryId" placeholder="请选择生产线" clearable :disabled="form.status ? true : false">
                <el-option
                  v-for="item in factoryListByMaterial"
                  :key="item.id"
                  :label="item.productionLine"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工艺" prop="technologyId">
              <el-select v-model="form.technologyId" placeholder="请选择工艺" clearable :disabled="form.status ? true : false">
                <el-option
                  v-for="item in technologyListByMaterial"
                  :key="item.id"
                  :label="item.technologyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待产数量" prop="producedQuantity">
              <el-input v-model="form.producedQuantity" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已产数量" prop="quantityProduced">
              <el-input v-model="form.quantityProduced" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产日期" prop="manufactureDate">
              <el-date-picker
                clearable
                v-model="form.manufactureDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择生产日期"
                :disabled="form.status ? true : false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交货日期" prop="deliveryDate">
              <el-date-picker
                clearable
                v-model="form.deliveryDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择交货日期"
                :disabled="true">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option
                  v-for="dict in dict.type.mes_publish_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" :disabled="form.status ? true : false"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-divider content-position="center">生产计划信息</el-divider>
        <el-table :data="mesPlannedProductionItemList" ref="mesPlannedProductionItem">
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="物料" prop="materialName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" prop="demandQuantity">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dosage" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="已用数量" prop="usedQuantity">
            <template slot-scope="scope">
              <el-input v-model="scope.row.usedQuantity" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="剩余数" prop="residueQuantity">
            <template slot-scope="scope">
              <el-input v-model="scope.row.residueQuantity" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="form.status ? true : false"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!form.status" type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 生产计划弹框 start -->
    <PlanDialog :open.sync="planOpen" @fun="handleChange" @close="close"/>
    <!-- 生产计划弹框 end -->
  </div>
</template>

<script>
import {
  listProduction,
  getProduction,
  delProduction,
  addProduction,
  updateProduction,
  getBomList, getFactoryList, getTechnologyList
} from "@/api/mes/production";
import {getMaintenance} from "@/api/mes/plan";
import {getBom} from "@/api/mes/bom";
import PlanDialog from "@/views/components/PlanDialog/index.vue";
export default {
  components: {
    PlanDialog,
  },
  name: "Production",
  dicts: ['mes_publish_status', 'mes_application_status', 'mes_picking_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesPlannedProductionItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产日期时间范围
      daterangeManufactureDate: [],
      // 交货日期时间范围
      daterangeDeliveryDate: [],
      // 计划排产表格数据
      productionList: [],
      // 计划排产-生产计划子表格数据
      mesPlannedProductionItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNo: null,
        planNumber: null,
        materialName: null,
        bomId: null,
        technologyId: null,
        projectId: null,
        factoryId: null,
        manufactureDate: null,
        deliveryDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planNumber: [
          {required: true, message: "计划号不能为空", trigger: "blur"}
        ],
        bomId: [
          {required: true, message: "BOM不能为空", trigger: "blur"}
        ],
        factoryId: [
          {required: true, message: "生产线不能为空", trigger: "blur"}
        ],
        technologyId: [
          {required: true, message: "工艺不能为空", trigger: "blur"}
        ],
        producedQuantity: [
          {required: true, message: "待产数量不能为空", trigger: "blur"}
        ],
      },
        // 项目列表
        maintenanceList: [],
        // bom列表
        bomList: [],
        // 生产线列表
        factoryList: [],
        // 工艺列表
        technologyList: [],
        // 生产计划列表
        planList: [],
        planOpen: false,
        // bom列表
        bomListByMaterial: [],
        // 生产线列表
        factoryListByMaterial: [],
        // 工艺列表
        technologyListByMaterial: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询计划排产列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeManufactureDate && '' != this.daterangeManufactureDate) {
        this.queryParams.params["beginManufactureDate"] = this.daterangeManufactureDate[0];
        this.queryParams.params["endManufactureDate"] = this.daterangeManufactureDate[1];
      }
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginDeliveryDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endDeliveryDate"] = this.daterangeDeliveryDate[1];
      }
      listProduction(this.queryParams).then(response => {
        this.productionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getMaintenance().then(response => {
        this.maintenanceList = response.data
      });
      getBomList().then(response => {
        this.bomList = response.data
      });
      getFactoryList().then(response => {
        this.factoryList = response.data
      });
      getTechnologyList().then(response => {
        this.technologyList = response.data
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
        planNumber: null,
        bomId: null,
        technologyId: null,
        projectId: null,
        factoryId: null,
        producedQuantity: null,
        quantityProduced: null,
        manufactureDate: null,
        deliveryDate: null,
        status: null,
        pickingStatus: null,
        remark: null,
      };
      this.technologyListByMaterial = []
      this.factoryListByMaterial = []
      this.bomListByMaterial = []
      this.mesPlannedProductionItemList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeManufactureDate = [];
      this.daterangeDeliveryDate = [];
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
      this.title = "添加计划排产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProduction(id).then(response => {
        this.form = response.data;
        this.mesPlannedProductionItemList = response.data.mesPlannedProductionItemList;
        this.getListByMateril(this.form.materialId)
        this.open = true;
        this.title = "修改计划排产";
      });

    },
    // 发布
    issue(row) {
      getProduction(row.id).then(response => {
        this.form = response.data;
        this.mesPlannedProductionItemList = response.data.mesPlannedProductionItemList;
        this.form.status = 1
        updateProduction(this.form).then(response => {
          this.$modal.msgSuccess("发布成功");
          this.getList();
        });
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesPlannedProductionItemList = this.mesPlannedProductionItemList;
          if (this.form.id != null) {
            updateProduction(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduction(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除计划排产编号为"' + ids + '"的数据项？').then(function () {
        return delProduction(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    // 选择计划
    selectPlan() {
      this.planOpen = true
    },
    // 选中计划
    handleChange(val) {
      this.reset();
      this.form.productionPlanId = val.planId
      this.form.planNumber = val.planNumber
      this.form.manufactureDate = val.manufacture
      this.form.producedQuantity = val.quantity
      this.form.deliveryDate = val.deliveryDate
      this.form.projectName = val.projectName
      this.form.materialId = val.materialId
      this.form.materialName = val.materialName
      this.form.materialSpecifications = val.materialSpecifications
      this.form.materialUnit = val.materialUnit
      this.form.materialModel = val.materialModel
      this.getListByMateril(val.materialId)
      this.planOpen = false
    },
    getListByMateril(materialId) {
      getBomList({materialId: materialId}).then(response => {
        this.bomListByMaterial = response.data
      });
      getFactoryList({materialId: materialId}).then(response => {
        this.factoryListByMaterial = response.data
      });
      getTechnologyList({materialId: materialId}).then(response => {
        this.technologyListByMaterial = response.data
      });
    },
    close() {
      this.planOpen = false
    },
    // BOM改变
    changeBom(value) {
      // 判断bom值改变时是否为清空数据，防止发生清空数据传参为空而报错
      if(value != null && value != ""){
        getBom(value).then(response => {
        this.mesPlannedProductionItemList = []
        let data = response.data.mesBomDetailItemList
        data.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.dosage = item.dosage * this.form.producedQuantity;
          obj.usedQuantity = "";
          obj.residueQuantity = "";
          obj.remark = "";
          this.mesPlannedProductionItemList.push(obj);
        })
      });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/production/export', {
        ...this.queryParams
      }, `production_${new Date().getTime()}.xlsx`)
    },
    // 已下发不可删除，禁用列表选择
    selectable(row,index) {
      if (row.status == 1) {
        return false
      } else {
        return true
      }
    }
  }
};
</script>
