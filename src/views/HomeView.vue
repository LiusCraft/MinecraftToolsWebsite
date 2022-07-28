<template>
  <div class="home">
    <el-alert title="注意" type="warning">
      作者本人接触Mythicmobs是开发该功能时接触（并不完全了解），若有问题请提交到 issue！ 本项目配置项根据 <a
        href="https://pluginscdtribe.github.io/wiki/mythicmobs"
        target="_blank">https://pluginscdtribe.github.io/wiki/mythicmobs</a> 编写
    </el-alert>

    <el-container>
      <el-main>
        <el-card shadow="never" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span>该网站能做什么？</span>
            <el-link style="float: right; padding: 3px 0" type="text" target="_blank"
              href="https://github.com/LiusCraft/MinecraftToolsWebsite/issues">前去GITHUB ISSUES</el-link>
          </div>
          <div>
            <p>目前该网站只能编辑Mythicmobs插件内的MOBS内容<br> 注意: Mobs编辑功能内特殊选项针对部分生物的设置暂时没有放入、原版物品的下拉选择的数据暂时没有录入，我会在空闲时间去添加新的内容。<br>
            本站使用的框架是：vue、element、js-yaml、highlight.js<br>
            （其实最开始开发这功能，是因自己需要。 可能有的人会说网上有这些编辑器了，我看了下好像都是低版本？可能是我无缘没有找到它们吧！）</p>
            点击群号可加入我的世界技术交流群：<a href="https://jq.qq.com/?_wv=1027&k=cq68yS1d" target="_blank">84500807</a> (群内管理不私聊，有问题发群消息或前去GITHUB ISSUES)
          </div>
        </el-card>

        <div class="block" v-if="activities.length > 0">
          <el-timeline>
            <el-timeline-item v-for="(commit, index) in activities" :key="index" :timestamp="commit.commit.author.date"
              placement="top">
              <el-card class="noPadding" shadow="never">
                <h4 v-text="commit.commit.message"></h4>
                <p>{{ commit.commit.author.name }} 提交 <a :href="commit.html_url" target="_blank">前去评论</a></p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-skeleton v-else :rows="6" animated v-loading="true" element-loading-text="正在拼命拉取GitHub Commits"
          element-loading-background="rgba(0, 0, 0, 0.0)" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};
export default {
  name: 'HomeView',
  data() {
    return {
      activities: []
    }
  },
  created() {
    fetch("http://api.github.com/repos/LiusCraft/MinecraftToolsWebsite/commits", requestOptions)
      .then(response => response.text())
      .then(result => this.activities = JSON.parse(result))
      .catch(error => console.log('error', error));
  }

}
</script>
<style>
.noPadding .el-card__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>