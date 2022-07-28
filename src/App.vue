<template>
  <div id="app">
    <el-container>
      <el-aside id="aside">
        <el-menu router>
          <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          首页</el-menu-item>
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">我的</span>
            </template>
            <el-menu-item index="/my/varsetting">变量配置</el-menu-item>
          </el-submenu>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">Mythicmobs编辑器</span>
            </template>
            
            <el-submenu index="1-1">
              <span slot="title">物品</span>
              <el-menu-item index="/mythicmobs/items/editor">编辑物品</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <span slot="title">怪物</span>
              <el-menu-item index="/mythicmobs/mobs/editor">编辑怪物</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2" disabled>
            <i class="el-icon-menu"></i>
            <span slot="title">BossShop编辑器</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">礼包编辑器</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">没啥了</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="60px" style="line-height: 60px;white-space: nowrap;font-size:25px" v-text="$route.meta.title">
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  mounted(){
    console.log(this.$router.options.routes
)
  }
}
</script>
<style>
body{
  margin: 0px;
}
html,
body,
#app,
.el-container {
  height: 100%;
}
</style>