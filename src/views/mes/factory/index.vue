<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="生产线名称" prop="productionLine">
        <el-input
          v-model="queryParams.productionLine"
          placeholder="请输入生产线名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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

    <el-table v-loading="loading" :data="factoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="生产线名称" align="center" prop="productionLine" />
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

    <!-- 添加或修改工厂建模对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1150px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
        <el-form-item label="生产线名称" prop="productionLine">
          <el-input v-model="form.productionLine" placeholder="请输入生产线名称" />
        </el-form-item>
        <el-form-item label="产品" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请选择" disabled>
            <el-button slot="append" @click="openDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="materialModel" >
          <el-input v-model="form.materialModel" placeholder="请输入产品型号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="产品规格" prop="materialSpecifications" >
          <el-input v-model="form.materialSpecifications" placeholder="请输入产品规格" :disabled="true"/>
        </el-form-item>
        <el-form-item label="描述" prop="factoryDescribe">
          <el-input v-model="form.factoryDescribe" placeholder="请输入描述" />
        </el-form-item>
        <el-divider content-position="center">产品信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddMesFactoryDeviceItem">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteMesFactoryDeviceItem">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="mesFactoryDeviceItemList" :row-class-name="rowMesFactoryDeviceItemIndex" @selection-change="handleMesFactoryDeviceItemSelectionChange" ref="mesFactoryDeviceItem">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="设备" prop="deviceName" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesFactoryDeviceItemList.'+scope.$index+'.deviceId'" :rules="rules.deviceId">
                <el-select v-model="scope.row.deviceId" placeholder="请选择设备" @change="handleAddDevice(scope.row)">
                  <el-option
                    v-for="dict in deviceList"
                    :key="dict.id"
                    :label="dict.deviceName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="编码" prop="deviceCode" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deviceCode" placeholder="请输入编码" readonly />
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="deviceModel" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deviceModel" placeholder="请输入型号" readonly />
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="produceDate" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.produceDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择生产日期" readonly />
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="produceCode" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.produceCode" placeholder="请输入生产批号" readonly />
            </template>
          </el-table-column>
          <el-table-column label="制造商" prop="manufacturer" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.manufacturer" placeholder="请输入制造商" readonly />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联物料弹框 start -->
    <MateriaDialog :open.sync="materialOpen" @fun="handleChange" @close="close"/>
    <!-- 关联物料弹框 end -->

  </div>
</template>

<script>
import { listFactory, getFactory, delFactory, addFactory, updateFactory, listDevice, getDevice } from "@/api/mes/factory";
import MateriaDialog from "../../components/MateriaDialog/index.vue";
export default {
  components: {
    MateriaDialog,
  },
  name: "Factory",
  dicts: ['material_type'],
  data() {
    return {
      // 物料弹出框
      materialOpen: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesFactoryDeviceItem: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工厂建模表格数据
      factoryList: [],
      // 工厂建模设备信息子表格数据
      mesFactoryDeviceItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productionLine: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialName: [
          { required: true, message: "产品不能为空", trigger: "blur" }
        ],
        productionLine: [
          { required: true, message: "生产线名称不能为空", trigger: "blur" }
        ],
        deviceId: [
          { required: true, message: "设备不能为空", trigger: "change" }
        ],
      },
      // 物料列表
      materialList: [],
      // 部门树选项
      classifyOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      materialQuery: {
        classifyId: null
      },
      deviceList: []
    };
  },
  created() {
    this.getList();
  },
  watch: {
    'mesFactoryDeviceItemList': {
      handler(newVal, oldVal) {
        this.form.mesFactoryDeviceItemList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询工厂建模列表 */
    getList() {
      this.loading = true;
      listFactory(this.queryParams).then(response => {
        this.factoryList = response.rows;
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
        materialId: null,
        materialName: null,
        productionLine: null,
        materialModel: null,
        materialSpecifications: null,
        factoryDescribe: null
      };
      this.mesFactoryDeviceItemList = [];
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
      this.title = "添加工厂建模";
      listDevice().then(response => {
        this.deviceList = response.data;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFactory(id).then(response => {
        this.form = response.data;
        this.mesFactoryDeviceItemList = response.data.mesFactoryDeviceItemList;
        this.open = true;
        this.title = "修改工厂建模";
      });
      listDevice().then(response => {
        this.deviceList = response.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.mesFactoryDeviceItemList = this.mesFactoryDeviceItemList;
          if (this.form.id != null) {
            updateFactory(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFactory(this.form).then(response => {
              this.$message.success("新增成功");
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
      this.$confirm('是否确认删除工厂建模编号为"' + ids + '"的数据项？').then(function() {
        return delFactory(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {});
    },
	  /** 工厂建模设备信息子序号 */
    rowMesFactoryDeviceItemIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 工厂建模设备信息子添加按钮操作 */
    handleAddMesFactoryDeviceItem() {
      let obj = {};
      obj.deviceId = "";
      obj.deviceName = "";
      obj.deviceCode = "";
      obj.deviceModel = "";
      obj.produceDate = "";
      obj.produceCode = "";
      obj.manufacturer = "";
      this.mesFactoryDeviceItemList.push(obj);
    },
    /** 工厂建模设备信息子删除按钮操作 */
    handleDeleteMesFactoryDeviceItem() {
      if (this.checkedMesFactoryDeviceItem.length == 0) {
        this.$modal.msgError("请先选择要删除的工厂建模设备信息子数据");
      } else {
        const mesFactoryDeviceItemList = this.mesFactoryDeviceItemList;
        const checkedMesFactoryDeviceItem = this.checkedMesFactoryDeviceItem;
        this.mesFactoryDeviceItemList = mesFactoryDeviceItemList.filter(function(item) {
          return checkedMesFactoryDeviceItem.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleMesFactoryDeviceItemSelectionChange(selection) {
      this.checkedMesFactoryDeviceItem = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/factory/export', {
        ...this.queryParams
      }, `factory_${new Date().getTime()}.xlsx`)
    },
    openDialog() {
      this.materialOpen = true
    },
    close() {
      this.materialOpen = false
    },
    // 选中物料数据
    handleChange(val) {
      this.form.materialId = val.id
      this.form.materialName = val.materialName
      this.form.materialModel = val.materialModel
      this.form.materialSpecifications = val.materialSpecifications
      this.materialOpen = false
    },
    handleAddDevice(row) {
      getDevice(row.deviceId).then(response => {
        this.mesFactoryDeviceItemList[row.index-1].deviceCode = response.data.deviceCode;
        this.mesFactoryDeviceItemList[row.index-1].deviceModel = response.data.deviceModel;
        this.mesFactoryDeviceItemList[row.index-1].produceDate = response.data.produceDate;
        this.mesFactoryDeviceItemList[row.index-1].produceCode = response.data.produceCode;
        this.mesFactoryDeviceItemList[row.index-1].manufacturer = response.data.manufacturer;
      });
    }
  }
};
</script>
