<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划编号" prop="planNumber">
        <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入计划编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入作业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检验项" prop="checkItem">
        <el-input
          v-model="queryParams.checkItem"
          placeholder="请输入检验项"
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
      <el-form-item label="结果" prop="inspectionResults">
        <el-select v-model="queryParams.inspectionResults">
          <el-option
            v-for="dict in dict.type.mes_inspection_result"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
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

    <el-table v-loading="loading" :data="samplingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="流水号" align="center" prop="serialNumber"/>
      <el-table-column label="计划编号" align="center" prop="planNumber"/>
      <el-table-column label="作业名称" align="center" prop="jobName"/>
      <el-table-column label="物料名称" align="center" prop="materialName"/>
      <el-table-column label="规格" align="center" prop="materialModel"/>
      <el-table-column label="型号" align="center" prop="materialSpecifications"/>
      <el-table-column label="单位" align="center" prop="materialUnit"/>
      <el-table-column label="生产数量" align="center" prop="quantity"/>

      <el-table-column label="阈值上限" align="center" prop="upLimit"/>
      <el-table-column label="阈值下限" align="center" prop="lowerLimit"/>
      <el-table-column label="检验项" align="center" prop="checkItem"/>

      <el-table-column label="采样数量" align="center" prop="samplesNumber"/>
      <el-table-column label="检验值" align="center" prop="inspectionValue"/>
      <el-table-column label="结果" align="center" prop="inspectionResults">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_inspection_result" :value="scope.row.inspectionResults"/>
        </template>
      </el-table-column>
      <el-table-column label="检验人" align="center" prop="checkUserName"/>
      <el-table-column label="检验时间" align="center" prop="inspectorTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inspectorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改生产采样对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="流水号" prop="serialNumber">
          <el-input v-model="form.serialNumber" disabled/>
        </el-form-item>

        <el-form-item label="作业名称" prop="jobName">
          <el-input v-model="form.jobName" placeholder="请选择" disabled>
            <el-button slot="append" @click="openJobDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="计划编号" prop="jobName">
          <el-input v-model="form.planNumber" disabled />
        </el-form-item>
        <el-form-item label="物料" prop="materialId">
          <el-select v-model="form.materialId" @change="selectMaterial">
            <el-option
              v-for="item in materialList"
              :key="item.materialId"
              :label="item.materialName"
              :value="parseInt(item.materialId)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产数量" prop="quantity">
              <el-input v-model="form.quantity"  disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采样数量" prop="samplesNumber">
              <el-input v-model.number="form.samplesNumber" placeholder="请输入采样数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检验标准" prop="checkItem">
              <el-input v-model="form.checkItem" placeholder="请选择检验标准" disabled>
                <el-button slot="append" @click="openStandardsDialog">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="阈值上限" prop="upLimit">
              <el-input v-model="form.upLimit" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阈值下限" prop="lowerLimit">
              <el-input v-model="form.lowerLimit" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验值" prop="inspectionValue">
              <el-input v-model.number="form.inspectionValue" placeholder="请输入检验值"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结果" prop="inspectionResults">
              <el-select v-model="form.inspectionResults">
                <el-option
                  v-for="dict in dict.type.mes_inspection_result"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <Standards :open.sync="standardsOpen" :materialId="materialId" checkType="2" @fun="selectStandards" @close="close"/>
    <JobAssembly status="2" :open.sync="JobAssemblyOpen" @fun="selectJob" @close="close"/>
  </div>
</template>

<script>
import {listSampling, getSampling, delSampling, addSampling, updateSampling} from "@/api/mes/sampling";
import JobAssembly from "../../components/JobAssembly/index.vue"
import Standards from "../../components/Standards/index.vue";
import {getAssembly} from "@/api/mes/assembly";
import {listUser} from "@/api/wms/warehousingApplication";

export default {
  name: "Sampling",
  dicts: ['mes_inspection_result'],
  components: {
    JobAssembly,
    Standards
  },
  data() {
    let validateQuantity = (rule, value, callback) => {
      if (value > parseInt(this.form.quantity)) {
        callback(new Error('采样数量不能大于生产数量'));
      } else if (value < 1) {
        callback(new Error('采样数量不能小于1'));
      } else {
        callback();
      }
    };
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
      // 生产采样表格数据
      samplingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 检验标准弹出层
      standardsOpen: false,
      // 作业弹出层
      JobAssemblyOpen: false,
      // 作业id时间范围
      daterangeInspectorTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNumber: null,
        planNumber: null,
        jobName: null,
        materialName: null,
        checkItem: null,
        checkUserId: null,
        inspectionResults: null,
        inspectorTime: null,

      },
      standards: null,
      assembly: null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName:[{ required: true, message: "作业名称不能为空", trigger: "blur" }],
        checkItem:[{ required: true, message: "检验标准不能为空", trigger: "blur" }],
        materialId:[{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        samplesNumber:[
          {
            required: true,
            message: "采样数量不能为空",
            trigger: "blur"
          },
          {
            type: 'number',
            message: '采样数量必须为数字值'
          },
          {
            validator: validateQuantity,
            trigger: 'blur'
          }
        ],
        inspectionValue:[
          { required: true, message: "检验值不能为空", trigger: "blur" },
          { type: 'number', message: '检验值必须为数字' },
          { validator: validateQuantity, trigger: 'blur' }
        ],
        inspectionResults:[{ required: true, message: "检验结果不能为空", trigger: "blur" }],
        result: [{required: true, message: "结果不能为空", trigger: "blur"}],
      },
      materialList: [],
      materialId: null,
      userList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.standardsOpen = false;
      this.JobAssemblyOpen = false;
    },
    // 选择质检标准
    openStandardsDialog() {
      if (this.materialId) {
        this.standardsOpen = true;
      } else {
        this.$modal.msgError("请先选择物料")
      }
    },
    // 选择作业
    openJobDialog() {
      this.JobAssemblyOpen = true;
    },
    // 选择作业回调
    selectJob(val) {
      getAssembly(val.id).then(response => {
        this.form.jobId = response.data.id
        this.form.jobName = response.data.jobName
        this.form.planNumber = response.data.planNumber
        this.materialList = response.data.mesJobAssemblyItemList
      });
    },
    selectStandards(val) {
      this.form.upLimit = val.upLimit;
      this.form.lowerLimit = val.lowerLimit;
      this.form.checkItem = val.checkItem;
      this.form.inspectionId = val.id
    },
    // 选择物料回调
    selectMaterial(val) {
      if (val) {
        for (let item of this.materialList) {
          if (item.materialId == val) {
            this.form.quantity = item.usageQuantity;
            this.materialId = item.materialId
            break;
          }
        }
      }
    },
    /** 查询生产采样列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeInspectorTime && '' != this.daterangeInspectorTime) {
        this.queryParams.params["beginInspectorTime"] = this.daterangeInspectorTime[0];
        this.queryParams.params["endInspectorTime"] = this.daterangeInspectorTime[1];
      }
      listSampling(this.queryParams).then(response => {
        this.samplingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser().then(response => {
        this.userList = response.data;
      });
    },
    getMaterialList() {
      listMaterial().then((response) => {
        this.materialList = response.rows;
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
        jobId: null,
        jobName: null,
        checkItem: null,
        inspectionId: null,
        materialId: null,
        samplesNumber: null,
        inspectionValue: null,
        inspectionResults: null,
        planNumber: null,
        quantity:null,
        remark: null,
      };
      this.materialList = []
      this.materialId = null
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
      this.title = "添加生产采样";

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSampling(id).then(response => {
        this.form = response.data;
        this.selectJob({id:response.data.jobId})
        this.materialId = response.data.materialId
        this.open = true;
        this.title = "修改生产采样";

      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSampling(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSampling(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除生产采样编号为"' + ids + '"的数据项？').then(function () {

        return delSampling(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/sampling/export', {
        ...this.queryParams
      }, `sampling_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
