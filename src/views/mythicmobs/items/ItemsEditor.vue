<template>
  <div>
    <el-alert type="info">该编辑器参考了<a href="https://pluginscdtribe.github.io/wiki/mythicmobs/"
        target="_blank">pluginscdtribe翻译的文档</a>、<a href="https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home"
        target="_blank">MythicMobs的文档</a>
      如果有看不懂的可查看这里提供的文档！(后期我会为每项内容加上提示)</el-alert>
    <el-container>
      <el-tabs v-model="tabActiveName" style="width: 100%;">
        <el-tab-pane label="基本配置" name="base">
          <el-form label-position="right" label-width="100px" :model="itemsBaseConfig" size="medium">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="全局名称">
                  <el-input v-model="itemsBaseConfig.id">
                    <template slot="append">
                      <el-tooltip content="类似我的世界原版中的物品id,所以必须是唯一性" placement="top">
                        <el-button>?</el-button>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="物品种类">
                  <el-select v-model="itemsBaseConfig.content.id" placeholder="请选物品种类" style="width: 100%;" filterable>
                    <el-option :label="itemId.label" :value="itemId.key" v-for="(itemId, index) in itemIdList"
                      :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="显示名称">
                  <el-input v-model="mobsBaseConfig.content.Display">
                    <template slot="append">
                      <el-tooltip content="在游戏内物品显示的名字" placement="top">
                        <el-button>?</el-button>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="派系名称">
                  <el-input v-model="mobsBaseConfig.content.Faction">
                    <template slot="append">
                      <el-tooltip content="设置派系名称，可以用于高级的AI设置(必须是字母数字，区分大小写)" placement="top">
                        <el-button>?</el-button>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="设置坐骑">
                  <el-input v-model="mobsBaseConfig.content.Mount">
                    <template slot="append">
                      <el-tooltip content="设置坐骑，必须是另一个 MythicMob的全局名称.(生成时会自动坐在此生物上)" placement="top">
                        <el-button>?</el-button>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
export default {
    data() {
        return {
            itemsBaseConfig: {
                id: "",
                content: {
                    Id: "",
                    Data: "",
                    Display: "",
                    Amount: null,
                }
            }
        }
    }

}
</script>

<style>

</style>