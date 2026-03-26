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
      <el-form-item label="检验结果" prop="result">
        <el-select v-model="queryParams.result">
          <el-option
            v-for="dict in dict.type.mes_inspection_result"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

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


      <el-form-item label="检验人" prop="checkUserId">
        <el-select v-model="queryParams.checkUserId" clearable>
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"/>
        </el-select>
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
      <el-form-item label="检验时间">
        <el-date-picker
          v-model="daterangeInspectorTime"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button
        >
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
        </el-button
        >
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
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="productInspectorList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="流水号" align="center" prop="serialNumber"/>
      <el-table-column label="计划编号" align="center" prop="planNumber"/>
      <el-table-column label="完工单号" align="center" prop="oddNumbers"/>
      <el-table-column label="作业名称" align="center" prop="jobName"/>
      <el-table-column label="产线名称" align="center" prop="productionLine"/>
      <el-table-column label="产品名称" align="center" prop="materialName"/>
      <el-table-column label="检验批次" align="center" prop="batchNumber"/>
      <el-table-column label="生产日期" align="center" prop="manufactureDate"/>
      <el-table-column label="检验项" align="center" prop="checkItem"/>
      <el-table-column label="生产数量" align="center" prop="quantity"/>
      <el-table-column label="阈值上限" align="center" prop="upLimit"/>
      <el-table-column label="阈值下限" align="center" prop="lowerLimit"/>
      <el-table-column label="抽样数量" align="center" prop="sampleQuantity"/>
      <el-table-column label="检验值" align="center" prop="inspectionValue"/>
      <el-table-column label="检验结果" align="center" prop="result">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_inspection_result" :value="scope.row.result"/>
        </template>
      </el-table-column>
      <el-table-column label="检验人" align="center" prop="checkUserName"/>
      <el-table-column label="检验时间" align="center" prop="inspectorTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inspectorTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
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

    <!-- 添加或修改产品检验对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="完工单号" prop="productionCompletionId">
          <el-input v-model="completion.oddNumbers" placeholder="请选择完工单" disabled>
            <el-button slot="append" @click="completionDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="作业名称" prop="completion">
          <el-input v-model="completion.jobName" disabled/>
        </el-form-item>
        <el-form-item label="检验批次" prop="batchNumber">
          <el-input v-model="completion.batchNumber" disabled/>
        </el-form-item>
        <el-form-item label="产品名称" prop="materialName">
          <el-input v-model="completion.materialName" disabled/>
        </el-form-item>
        <el-form-item label="生产日期" prop="completionDate">
          <el-date-picker
            clearable
            disabled
            v-model="completion.completionDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择检验时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产数量" prop="quantity">
          <el-input v-model="completion.quantity" disabled/>
        </el-form-item>
        <el-form-item label="检验标准" prop="standardsId">
          <el-input v-model="standards.checkItem" placeholder="请选择检验标准" disabled>
            <el-button slot="append" @click="standardsOpenDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="阈值上限" prop="upLimit">
          <el-input
            v-model="standards.upLimit" disabled
            placeholder="请输入阈值上限"
          />
        </el-form-item>
        <el-form-item label="阈值下限" prop="lowerLimit">
          <el-input
            v-model="standards.lowerLimit" disabled
            placeholder="请输入阈值下限限"
          />
        </el-form-item>
        <el-form-item label="抽检数量" prop="sampleQuantity">
          <el-input
            v-model.number="form.sampleQuantity"
            placeholder="请输入抽样数量"
          />
        </el-form-item>
        <el-form-item label="检验值" prop="inspectionValue">
          <el-input v-model.number="form.inspectionValue" placeholder="请输入检验值"/>
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-select v-model="form.result">
            <el-option
              v-for="dict in dict.type.mes_inspection_result"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <Completion :open.sync="completionOpen" @fun="selectCompletion" @close="close"/>

    <Standards :open.sync="standardsOpen" :materialId="materialId" checkType="1" @fun="selectStandards" @close="close"/>
  </div>
</template>

<script>
import {
  listProductInspector,
  getProductInspector,
  delProductInspector,
  addProductInspector,
  updateProductInspector,
} from "@/api/mes/productInspector";
import Standards from "../../components/Standards/index.vue";
import Completion from "../../components/Completion/index.vue";
import {
  getCompletion
} from "@/api/mes/completions";
import {
  getStandards
} from "@/api/mes/standards";
import {listUser} from "@/api/wms/warehousingApplication";

export default {
  components: {
    Standards,
    Completion,
  },
  name: "ProductInspector",
  dicts: ['mes_inspection_result'],
  data() {
    let validateQuantity = (rule, value, callback) => {
      if (value > parseInt(this.completion.quantity)) {
        callback(new Error('抽检数量不能大于生产数量'));
      } else if (value < 1) {
        callback(new Error('抽检数量不能小于1'));
      } else {
        callback();
      }
    };
    return {
      // 遮罩层
      standardsOpen: false,
      completionOpen: false,
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
      // 产品检验
      // 表格数据
      productInspectorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //时间范围
      daterangeInspectorTime: [],
      daterangeManufactureDate: [],
      // 查询参数
      queryParams: {
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
      // 表单参数
      form: {},
      // 选中标准信息
      standards: {},
      // 选中完工单信息
      completion: {},
      // 表单校验
      rules: {
        productionCompletionId: [{required: true, message: "完工单号不能为空", trigger: "blur"}],
        standardsId: [{required: true, message: "检验标准不能为空", trigger: "blur"}],
        sampleQuantity: [
          {
            required: true,
            message: "抽检数量不能为空",
            trigger: "blur"
          },
          {
            type: 'number',
            message: '抽检数量必须为数字值'
          },
          {
            validator: validateQuantity,
            trigger: 'blur'
          }
        ],
        inspectionValue: [
          {required: true, message: "检验值不能为空", trigger: "blur"
          },{
            type: 'number',
            message: '检验值必须为数字值'
          }],
        result: [{required: true, message: "检验结果不能为空", trigger: "blur"}]
      },
      materialId: null,
      userList: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.completionOpen = false;
      this.standardsOpen = false;
    },
    // 选择质检标准
    standardsOpenDialog() {
      if (this.materialId) {
        this.standardsOpen = true;
      } else {
        this.$modal.msgError("请先选择完工单")
      }
    },
    // 选择完工单
    completionDialog() {
      this.completionOpen = true;
    },
    // 选择完工单回调
    selectCompletion(val) {
      getCompletion(val.id).then((response) => {
        this.completion = response.data;
        this.materialId = response.data.materialId
      });
    },
    // 选择质检标准回调
    selectStandards(val) {
      getStandards(val.id).then((response) => {
        this.standards = response.data;
      });
    },
    /** 查询产品检验列表 */
    getList() {
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productionCompletionId: null,
        standardsId: null,
        sampleQuantity: null,
        inspectionValue: null,
        remark: null,
        result: null
      };
      this.standards = {};
      this.completion = {};
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品检验";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProductInspector(id).then((response) => {
        this.form = response.data;
        this.selectCompletion({id: this.form.productionCompletionId});
        this.selectStandards({id: this.form.standardsId});
        this.open = true;
        this.title = "修改产品检验";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.standardsId = this.standards.id;
      this.form.productionCompletionId = this.completion.id;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateProductInspector(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProductInspector(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除产品检验编号为"' + ids + '"的数据项？')
        .then(function () {
          return delProductInspector(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "mes/productInspector/export",
        {
          ...this.queryParams,
        },
        `productInspector_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
