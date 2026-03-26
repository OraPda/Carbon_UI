<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入作业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="daterangeStartTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="daterangeEndTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="作业状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择作业状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_assembly_status"
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

    <el-table v-loading="loading" :data="assemblyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="作业名称" align="center" prop="jobName"/>
      <el-table-column label="生产计划" align="center" prop="planNumber"/>
      <el-table-column label="计划排产" align="center" prop="serialNo"/>
      <el-table-column label="产品" align="center" prop="materialName"/>
      <el-table-column label="型号" align="center" prop="materialModel"/>
      <el-table-column label="规格" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产数量" align="center" prop="quantity"/>
      <el-table-column label="作业状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_assembly_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-receiving"
            v-if="scope.row.status == 0"
            @click="handleStatus(scope.row, 1)"
          >执行
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-receiving"
            v-if="scope.row.status == 1"
            @click="handleStatus(scope.row, 2)"
          >完成
          </el-button>
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
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改作业装配对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入作业名称" :disabled="form.status > 0 ? true : false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产计划" prop="serialNo">
              <el-input v-model="form.serialNo" placeholder="请选择计划排产" disabled>
                <el-button slot="append" @click="selectPlan" :disabled="form.status > 0 ? true : false">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品" prop="materialName">
              <el-input v-model="form.materialName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="materialModel">
              <el-input v-model="form.materialModel" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格" prop="materialSpecifications">
              <el-input v-model="form.materialSpecifications" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="materialUnit">
              <el-input v-model="form.materialUnit" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="待产数量" prop="producedQuantity">
              <el-input v-model="form.producedQuantity" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已产数量" prop="quantityProduced">
              <el-input v-model="form.quantityProduced" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                clearable
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                disabled
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker
                clearable
                v-model="form.endTime"
                type="date"
                disabled
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产数量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="请输入生产数量" @input="quantityChange"
                        :disabled="form.status > 0 ? true : false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option
                  v-for="dict in dict.type.mes_assembly_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" :disabled="form.status > 0 ? true : false"/>
        </el-form-item>


        <el-divider content-position="center">生产作业明细信息</el-divider>
        <el-table :data="mesJobAssemblyItemList" ref="mesMaterialApplyItem">
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialName" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialModel" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecifications" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialSpecifications" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialUnit" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="消耗数量" prop="usageQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesJobAssemblyItemList.'+scope.$index+'.usageQuantity'"
                            :rules="rules.usageQuantity">
                <el-input v-model="scope.row.usageQuantity" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="form.status > 0 ? true : false"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="form.status == 0 || form.status == null">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 计划排产弹框 start -->
    <ProductionDialog pickingStatus="1" :open.sync="productionOpen" @fun="handleChange" @close="close"/>
    <!-- 计划排产弹框 end -->
  </div>
</template>

<script>
import {
  listAssembly,
  getAssembly,
  delAssembly,
  addAssembly,
  updateAssembly,
  uptAssemblyStatus
} from "@/api/mes/assembly";
import {getProduction, listProduction} from "@/api/mes/production";
import ProductionDialog from "@/views/components/ProductionDialog/index.vue";
import {getBom} from "@/api/mes/bom";

export default {
  components: {
    ProductionDialog,
  },
  name: "Assembly",
  dicts: ['mes_publish_status', 'mes_application_status', 'mes_picking_status', 'mes_assembly_status'],
  data() {
    return {
      productionOpen: false,
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
      // 作业装配表格数据
      assemblyList: [],
      // 作业装配明细子表格数据
      mesJobAssemblyItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 作业状态时间范围
      daterangeStartTime: [],
      // 作业状态时间范围
      daterangeEndTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: null,
        startTime: null,
        endTime: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          {required: true, message: "作业名称不能为空", trigger: "blur"}
        ],
        quantity: [
          {required: true, message: "生产数量不能为空", trigger: "blur"},
          {type: 'number', min: 1, max: 65535, message: '生产数量必须为数字值且在1到65535之间'},
        ],
        usageQuantity: [
          {required: true, message: "消耗数量不能为空", trigger: "blur"}
        ],
      },
      planList: [],
      isEdit: false
    };
  },

  watch: {
    'mesJobAssemblyItemList': {
      handler(newVal, oldVal) {
        this.form.mesJobAssemblyItemList = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {

    /** 查询作业装配列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeStartTime && '' != this.daterangeStartTime) {
        this.queryParams.params["beginStartTime"] = this.daterangeStartTime[0];
        this.queryParams.params["endStartTime"] = this.daterangeStartTime[1];
      }
      if (null != this.daterangeEndTime && '' != this.daterangeEndTime) {
        this.queryParams.params["beginEndTime"] = this.daterangeEndTime[0];
        this.queryParams.params["endEndTime"] = this.daterangeEndTime[1];
      }
      listAssembly(this.queryParams).then(response => {
        this.assemblyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    selectPlan() {
      this.productionOpen = true;
    },
    close() {
      this.productionOpen = false
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
        jobName: null,
        plannedProductionId: null,
        quantity: null,
        bomId: null,
        startTime: null,
        endTime: null,
        status: null,
        remark: null
      };
      this.mesJobAssemblyItemList = []
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeStartTime = [];
      this.daterangeEndTime = [];
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
      this.isEdit = false
      this.open = true;
      this.title = "添加作业装配";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isEdit = true
      const id = row.id || this.ids
      getAssembly(id).then(response => {
        this.form = response.data;
        this.mesJobAssemblyItemList = response.data.mesJobAssemblyItemList;
        this.open = true;
        this.title = "修改作业装配";
      });
    },
    // 数量改变
    quantityChange(val) {
      if (this.form.bomId && val) {
        getBom(this.form.bomId).then(response => {
          let list = response.data.mesBomDetailItemList;
          this.mesJobAssemblyItemList.forEach(jobItem => {
            let bom = list.find(item => item.materialId == jobItem.materialId);
            let usageQuantity = parseInt(bom.dosage) * parseInt(val);
            jobItem.usageQuantity = usageQuantity;
          })
        });
      }
    },
    // 操作
    handleStatus(row, status) {
      uptAssemblyStatus({
        id: row.id,
        status: status
      }).then(response => {
        this.$modal.msgSuccess('提交成功');
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesJobAssemblyItemList = this.mesJobAssemblyItemList;
          if (this.form.id != null) {
            updateAssembly(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssembly(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 选中生产计划数据
    handleChange(val) {
      this.reset();
      getProduction(val.id).then(response => {
        this.form.plannedProductionId = response.data.id
        this.form.serialNo = response.data.serialNo
        this.form.bomId = response.data.bomId
        this.form.materialName = response.data.materialName
        this.form.materialModel = response.data.materialModel
        this.form.materialSpecifications = response.data.materialSpecifications
        this.form.materialUnit = response.data.materialUnit
        this.form.producedQuantity = response.data.producedQuantity
        this.form.quantityProduced = response.data.quantityProduced
        let list = response.data.mesPlannedProductionItemList;
        list.forEach(item => {
          let obj = {};
          obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecifications = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.usageQuantity = "";
          obj.remark = "";
          this.mesJobAssemblyItemList.push(obj);
        });
      });

      this.productionOpen = false
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除作业装配编号为"' + ids + '"的数据项？').then(function () {
        return delAssembly(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/assembly/export', {
        ...this.queryParams
      }, `assembly_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
