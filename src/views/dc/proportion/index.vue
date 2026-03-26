<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top:60px">
      <el-col :span="12" :offset="4">
        <div>
          <el-form ref="form" :model="form" :rules="rules" label-width="180px">
            <el-form-item label="二氧化碳与碳比值:" prop="co2Ratio">
              <el-input v-model="form.co2Ratio" placeholder="请输入" type="number" />
            </el-form-item>
            <el-form-item label="1度电释放:" prop="electricCo2">
              <el-input v-model="form.electricCo2" placeholder="请输入" type="number">
                <template slot="append">Kg二氧化碳</template>
              </el-input>
            </el-form-item>
            <el-form-item label="1吨水释放:" prop="waterCo2">
              <el-input v-model="form.waterCo2" placeholder="请输入" type="number">
                <template slot="append">Kg二氧化碳</template></el-input>
            </el-form-item>
            <el-form-item label="1KG汽油释放:" prop="oilCoal">
              <el-input v-model="form.oilCoal" placeholder="请输入" type="number">
                <template slot="append">Kg二氧化碳</template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="12" :offset="12">
              <el-button  type="primary" @click="submitForm">确 定</el-button>
              <el-button  style="margin-left:40px" @click="cancel">取 消</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listProportion,
  updateProportion,
} from "@/api/dc/proportion";

export default {
  name: "Proportion",
  components: {},
  data() {
    return {
      // 总条数
      total: 0,
      // 碳中和计算比例表格数据
      neutralityList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        electricCo2: [{
          required: true,
          message: "数值不能为空",
          trigger: "blur"
        }],
        waterCo2: [{
          required: true,
          message: "数值不能为空",
          trigger: "blur"
        }],
        oilCoal: [{
          required: true,
          message: "数值不能为空",
          trigger: "blur"
        }],
        co2Ratio: [{
          required: true,
          message: "数值不能为空",
          trigger: "blur"
        }]
      }
    };
  },
  created() {
    this.getProportion();
  },
  methods: {
    /** 查询碳中和计算比例 */
    getProportion() {
      listProportion(this.queryParams).then(response => {
        this.neutralityList = response.rows;
        this.total = response.total;
        // 如果数据库没有数据
        if (this.total == 0) {
          this.reset();
        } else {
          // 取列表第一个
          this.form = this.neutralityList[0];
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        electricCo2: null,
        waterCo2: null,
        oilCoal: null,
        co2Ratio: null,
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateProportion(this.form).then(response => {
            this.$modal.msgSuccess("提交成功");
          });
        }
      });
    },
    cancel() {
      this.getProportion();
    }
  }
};

</script>
