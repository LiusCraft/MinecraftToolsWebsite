<template>
  <div>
    <div>
      <el-radio-group v-model="currentDataName" size="medium" @change="changeTableData()">
        <el-radio-button :label="item" v-for="(item,index) in varDataNames" :key="index"></el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="tableData.filter(data => !search || data.key.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%" height="800" >
      <el-table-column label="代码" prop="key">
      </el-table-column>
      <el-table-column label="缩写" prop="abbr">
      </el-table-column>
      <el-table-column label="描述" prop="label">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import localVarData from '../../assets/mythicmobsConfig';
export default {
    data() {
        return {
            currentDataName: "MobsTypeList",
            tableData: localVarData.MobsTypeList,
            search: "",
        };
    },
    computed: {
        varDataNames() {
            let tempNames = Object.keys(localVarData);
            tempNames.splice(tempNames.indexOf("BossBar"), 1);
            return tempNames;
        }
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        changeTableData() {
            this.tableData = localVarData[this.currentDataName];
        }
    },
}
</script>

<style>

</style>