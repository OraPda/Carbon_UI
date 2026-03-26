<template>
  <div class="app-container">
    <el-dialog title="选择生产计划" :visible="open" width="1000px"  @close="close" append-to-body>
        <el-table :data="planList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="计划号" align="center" prop="planNumber"/>
          <el-table-column label="物料" align="center" prop="materialName"/>
          <el-table-column label="型号" align="center" prop="materialModel"/>
          <el-table-column label="规格" align="center" prop="materialSpecifications"/>
          <el-table-column label="单位" align="center" prop="materialUnit"/>
          <el-table-column label="生产数量" align="center" prop="quantity"/>
          <el-table-column label="生产日期" align="center" prop="manufacture"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="submitForm(scope.row)"
              >选择
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


    </el-dialog>
  </div>
</template>

<script>
import { getPlanItemList} from "@/api/mes/production";
export default {
  name: "PlanDilog",
  props: {
    open: {
      type: Boolean,
      default: false
    }

  },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 计划表格数据
      planList: [],
      // 弹出层标题
      title: "",

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialName: null
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询生产计划表 */
    getList() {
      this.loading = true;
      getPlanItemList(this.queryParams).then(response => {
        this.planList = response.rows
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
    close() {
      this.$emit("close");
    },
    /** 提交按钮 */
    submitForm(row) {
      this.$emit('fun', row);
      this.close()
    },
  },
};
</script>
