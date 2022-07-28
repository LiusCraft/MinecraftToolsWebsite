<template>
  <div>
    <el-alert type="info">该编辑器参考了<a href="https://pluginscdtribe.github.io/wiki/mythicmobs/"
        target="_blank">pluginscdtribe翻译的文档</a>、<a href="https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home"
        target="_blank">MythicMobs的文档</a> 如果有看不懂的可查看这里提供的文档！(后期我会为每项内容加上提示)</el-alert>
    <el-container>
      <el-tabs v-model="tabActiveName" style="width: 100%;">
        <el-tab-pane label="基本配置" name="base">
          <el-form label-position="right" label-width="100px" :model="mobsBaseConfig" size="medium">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="全局名称">
                  <el-input v-model="mobsBaseConfig.id">
                    <template slot="append">
                      <el-tooltip content="类似我的世界原版中的生物id,所以必须是唯一性" placement="top">
                        <el-button>?</el-button>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="生物种类">
                  <el-select v-model="mobsBaseConfig.content.Type" placeholder="请选生物种类" style="width: 100%;" filterable>
                    <el-option :label="mobType.label" :value="mobType.key" v-for="(mobType, index) in mobsTypeList"
                      :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="显示名称">
                  <el-input v-model="mobsBaseConfig.content.Display">
                    <template slot="append">
                      <el-tooltip content="在游戏内生物头顶显示的名字" placement="top">
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


                <!-- 装备的页面 -->
                <el-tabs value="Equipment" style="width: 100%;">
                  <el-tab-pane label="[装备]Equipment" name="Equipment">
                    <div class="text item">
                      <el-alert type="warning" style="margin-bottom:5px" show-icon>出生时穿上原版物品或Mythic物品。<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/Equipment.html"
                          target="_blank">查看完整设置</a></el-alert>
                      <el-select @focus="mobsBaseConfig.EquipmentCurrent = mobsBaseConfig.Equipment.length" allow-create
                        default-first-option v-model="mobsBaseConfig.Equipment[mobsBaseConfig.EquipmentCurrent]"
                        @change="handlerEquipment" filterable placeholder="选择要添加的装备(可自行输入添加)" value-key="key"
                        style="width: 100%;margin-bottom: 5px;">
                        <el-option v-for="item in equipment" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                      <el-table :data="mobsBaseConfig.Equipment" border style="width: 100%">
                        <el-table-column label="装备列表">
                          <template slot-scope="scope">
                            <span>{{ scope.row.id }}:{{ scope.row.slot }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="handlerEquipment(scope.$index, 3)" type="text" size="small">删除
                            </el-button>
                            <el-button type="text" size="small" @click="handlerEquipment(scope.$index, 2)">编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-dialog class="noPadding" title="修改装备信息"
                      :visible.sync="mobsBaseConfig.dialog.dialogFormEquipment">

                      <el-form>
                        <el-form-item label="编写时请注意格式">
                          <el-input autocomplete="off" v-model="mobsBaseConfig.EquipmentCurrentObj.id"></el-input>
                        </el-form-item>
                        <el-form-item label="物品位置">
                          <el-radio-group v-model="mobsBaseConfig.EquipmentCurrentObj.slot" size="medium">
                            <el-radio-button :label="0">主手</el-radio-button>
                            <el-radio-button :label="1">靴子槽</el-radio-button>
                            <el-radio-button :label="2">护腿槽</el-radio-button>
                            <el-radio-button :label="3">胸甲槽</el-radio-button>
                            <el-radio-button :label="4">头盔槽</el-radio-button>
                            <el-radio-button :label="5">副手</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handlerEquipment(mobsBaseConfig.EquipmentCurrent, 1)">
                          保存</el-button>
                      </div>
                    </el-dialog>
                  </el-tab-pane>


                  <!-- 掉落的页面 -->
                  <el-tab-pane label="[掉落]Drops" name="Drops">
                    <div class="text item">
                      <el-alert type="warning" style="margin-bottom:5px" show-icon>
                        可以是原版物品，Mythic物品，经验和其他插件的物品（如果支持）或者是自定义的掉落列表，如果使用自定义的条件系统。<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/DropsOverview.html"
                          target="_blank">查看完整设置</a></el-alert>
                      <el-select @focus="mobsBaseConfig.DropsCurrent = mobsBaseConfig.Drops.length" allow-create
                        default-first-option v-model="mobsBaseConfig.Drops[mobsBaseConfig.DropsCurrent]"
                        @change="handlerDrops" filterable placeholder="选择要添加的掉落物品(可自行输入添加)" value-key="key"
                        style="width: 100%;margin-bottom: 5px;">
                        <el-option v-for="item in drops" :key="item.key" :label="item.label" :value="item.key">
                          <span style="float: left">{{ item.label }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.key }}</span>
                        </el-option>
                      </el-select>
                      <el-table :data="mobsBaseConfig.Drops" border style="width: 100%">
                        <el-table-column prop="id" label="掉落物"></el-table-column>
                        <el-table-column prop="amount" label="数量"></el-table-column>
                        <el-table-column prop="chance" label="概率"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="handlerDrops(scope.$index, 3)" type="text" size="small">删除
                            </el-button>
                            <el-button type="text" size="small" @click="handlerDrops(scope.$index, 2)">编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-dialog class="noPadding" title="修改掉落物信息" :visible.sync="mobsBaseConfig.dialog.dialogFormDrops">

                      <el-form>
                        <el-form-item label="编写时请注意格式">
                          <el-input autocomplete="off" v-model="mobsBaseConfig.DropsCurrentObj.id"></el-input>
                        </el-form-item>
                        <el-form-item label="掉落数量">
                          <el-input-number v-model="mobsBaseConfig.DropsCurrentObj.amount" :min="1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="掉落概率">
                          <el-input-number v-model="mobsBaseConfig.DropsCurrentObj.chance" :min="0.001" :max="1"
                            :precision="2"></el-input-number>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handlerDrops(mobsBaseConfig.DropsCurrent, 1)">
                          保存</el-button>
                      </div>
                    </el-dialog>
                  </el-tab-pane>


                  <!-- 高级掉落的页面 -->
                  <el-tab-pane label="[掉落(高级)]DropsPerLevel" name="DropsPerLevel">
                    <div class="text item">
                      <el-alert type="warning" style="margin-bottom:5px" show-icon>
                        可以是原版物品，Mythic物品，经验和其他插件的物品（如果支持）或者是自定义的掉落列表，如果使用自定义的条件系统。<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/DropsOverview.html"
                          target="_blank">查看完整设置</a></el-alert>
                      <el-select @focus="mobsBaseConfig.DropsPerLevelCurrent = mobsBaseConfig.DropsPerLevel.length"
                        allow-create default-first-option
                        v-model="mobsBaseConfig.DropsPerLevel[mobsBaseConfig.DropsPerLevelCurrent]"
                        @change="handlerDropsPerLevel" filterable placeholder="选择要添加的掉落物品(可自行输入添加)" value-key="key"
                        style="width: 100%;margin-bottom: 5px;">
                        <el-option v-for="item in drops" :key="item.key" :label="item.label" :value="item.key">
                          <span style="float: left">{{ item.label }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.key }}</span>
                        </el-option>
                      </el-select>
                      <el-table :data="mobsBaseConfig.DropsPerLevel" border style="width: 100%">
                        <el-table-column prop="id" label="掉落物"></el-table-column>
                        <el-table-column prop="amount" label="数量"></el-table-column>
                        <el-table-column prop="chance" label="概率"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="handlerDropsPerLevel(scope.$index, 3)" type="text" size="small">删除
                            </el-button>
                            <el-button type="text" size="small" @click="handlerDropsPerLevel(scope.$index, 2)">编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-dialog class="noPadding" title="修改掉落物信息"
                      :visible.sync="mobsBaseConfig.dialog.dialogFormDropsPerLevel">
                      <el-form>
                        <el-form-item label="编写时请注意格式">
                          <el-input autocomplete="off" v-model="mobsBaseConfig.DropsPerLevelCurrentObj.id"></el-input>
                        </el-form-item>
                        <el-form-item label="掉落数量">
                          <el-input-number v-model="mobsBaseConfig.DropsPerLevelCurrentObj.amount" :min="1">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="掉落概率">
                          <el-input-number v-model="mobsBaseConfig.DropsPerLevelCurrentObj.chance" :min="0.001" :max="1"
                            :precision="2"></el-input-number>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handlerDropsPerLevel(mobsBaseConfig.DropsPerLevelCurrent, 1)">
                          保存</el-button>
                      </div>
                    </el-dialog>
                  </el-tab-pane>


                  <!-- 伤害修正 -->
                  <el-tab-pane label="[伤害修正]DamageModifiers" name="DamageModifiers">
                    <div class="text item">
                      <el-alert type="warning" style="margin-bottom:5px" show-icon>伤害修正用于添加或减少你的 MythicMobs 收到的伤害量。<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/DamageModifiers.html"
                          target="_blank">查看伤害修正设置</a><br />注意：修正为1时即原本伤害，高于1的数字将造成更多伤害，小于1的数字将造成更少的方块，设置为0则完全关闭伤害。<br />负数值会导致生物从伤害中恢复血量，注意如果生物对此伤害免疫则不能恢复（如铁傀儡免疫掉落伤害，烈焰人免疫火和岩浆伤害）
                      </el-alert>
                      <el-select v-model="mobsBaseConfig.DamageModifiersCurrent" @change="handlerDamageModifiers"
                        filterable placeholder="选择修正项" value-key="key" style="width: 100%;margin-bottom: 5px;">
                        <el-option v-for="item in damageModifiers" :key="item.key" :label="item.label" :value="item">
                          <span style="float: left">{{ item.label }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.key }}</span>
                        </el-option>
                      </el-select>
                      <el-table :data="mobsBaseConfig.DamageModifiers" border style="width: 100%">
                        <el-table-column prop="key" label="修正项">
                        </el-table-column>
                        <el-table-column prop="value" label="修正值">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="handlerDamageModifiers(scope.$index, 3)" type="text" size="small">删除
                            </el-button>
                            <el-button type="text" size="small" @click="handlerDamageModifiers(scope.row, 2)">编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-dialog class="noPadding" :title="'修正值编辑: ' + mobsBaseConfig.DamageModifiersCurrent.key"
                      :visible.sync="mobsBaseConfig.dialog.dialogFormDamageModifiers">

                      <el-form>
                        <el-form-item :label="'描述: ' + mobsBaseConfig.DamageModifiersCurrent.label"></el-form-item>
                        <el-form-item label="修正值">
                          <el-input-number autocomplete="off" v-model="mobsBaseConfig.DamageModifiersCurrent.value">
                          </el-input-number>
                        </el-form-item>
                      </el-form>

                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary"
                          @click="handlerDamageModifiers(mobsBaseConfig.DamageModifiersCurrent, 1)">
                          保存</el-button>
                      </div>
                    </el-dialog>
                  </el-tab-pane>


                  <!-- 自定义死亡信息 -->
                  <el-tab-pane label="[死亡信息]KillMessages" name="KillMessages">
                    <div class="text item">
                      <el-alert type="warning" style="margin-bottom:5px" show-icon>允许在生物击杀玩家以后在控制台显示一条自定义信息。<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/CustomKillMessage.html"
                          target="_blank">查看自定义击杀信息设置</a>，<a
                          href="https://pluginscdtribe.github.io/wiki/mythicmobs/Variables.html"
                          target="_blank">查看可用变量</a></el-alert>
                      <el-select @focus="mobsBaseConfig.KillMessagesCurrent = mobsBaseConfig.KillMessages.length"
                        allow-create default-first-option
                        v-model="mobsBaseConfig.KillMessages[mobsBaseConfig.KillMessagesCurrent]"
                        @change="handlerKillMessages" filterable placeholder="选择要添加的死亡信息(可自行输入添加)" value-key="key"
                        style="width: 100%;margin-bottom: 5px;">
                        <el-option v-for="item in killMessages" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                      <el-table :data="mobsBaseConfig.KillMessages" border style="width: 100%">
                        <el-table-column label="死亡信息">
                          <template slot-scope="scope">
                            <span>{{ scope.row }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="handlerKillMessages(scope.$index, 3)" type="text" size="small">删除
                            </el-button>
                            <el-button type="text" size="small" @click="handlerKillMessages(scope.$index, 2)">编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-dialog class="noPadding" title="修改死亡信息"
                      :visible.sync="mobsBaseConfig.dialog.dialogFormKillMessages">
                      <el-form>
                        <el-form-item label="编写时请注意格式">
                          <el-input autocomplete="off"
                            v-model="mobsBaseConfig.KillMessages[mobsBaseConfig.KillMessagesCurrent]"></el-input>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handlerKillMessages(mobsBaseConfig.KillMessagesCurrent, 1)">
                          保存</el-button>
                      </div>
                    </el-dialog>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
              <el-col :span="12">
                <el-form-item label="威胁表">
                  <el-radio-group v-model="mobsBaseConfig.Modules.ThreatTable">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="免疫表">
                  <el-radio-group v-model="mobsBaseConfig.Modules.ImmunityTable">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生物血量">
                  <el-input-number v-model="mobsBaseConfig.content.Health" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="生物伤害">
                  <el-input-number v-model="mobsBaseConfig.content.Damage" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="生物防御">
                  <el-input-number v-model="mobsBaseConfig.content.Armor" :min="0"></el-input-number>
                </el-form-item>


                <!-- 自定义生物的AI -->
                <el-card shadow="never">
                  <div class="clearfix">
                    <el-tooltip content="AITargetSelectors"><span>自定义生物的AI</span></el-tooltip>
                    <el-button style="float: right; padding: 3px 0" type="text">帮助</el-button>
                  </div>
                  <el-divider></el-divider>
                  <el-tabs value="AIGoalSelectors" style="width: 100%;">
                    <el-tab-pane label="[自己]AIGoalSelectors" name="AIGoalSelectors">
                      <div class="text item">
                        <el-select v-model="mobsBaseConfig.AIGoalSelectorsCurrent" @change="handlerAIGoalSelectors"
                          filterable placeholder="选择AIGoalSelectors" value-key="key"
                          style="width: 100%;margin-bottom: 5px;">
                          <el-option v-for="item in aiGoalSelectors" :key="item.key" :label="item.label" :value="item">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.key }}</span>
                          </el-option>
                        </el-select>
                        <el-table :data="mobsBaseConfig.AIGoalSelectors" border style="width: 100%">
                          <el-table-column label="AI Goal">
                            <template slot-scope="scope">
                              <el-tooltip :content="scope.row.key + ' - ' + scope.row.label"><span>{{ scope.row.value
                                  }}</span>
                              </el-tooltip>
                            </template>
                          </el-table-column>
                          <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                              <el-button @click="handlerAIGoalSelectors(scope.$index, 3)" type="text" size="small">删除
                              </el-button>
                              <el-button type="text" size="small" @click="handlerAIGoalSelectors(scope.row, 2)">编辑
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <el-dialog class="noPadding" :title="'AI Goal编辑项: ' + mobsBaseConfig.AIGoalSelectorsCurrent.key"
                        :visible.sync="mobsBaseConfig.dialog.dialogFormAIGoal">

                        <el-form>
                          <el-form-item :label="'描述: ' + mobsBaseConfig.AIGoalSelectorsCurrent.label">
                            <el-input autocomplete="off" v-model="mobsBaseConfig.AIGoalSelectorsCurrent.value">
                            </el-input>
                          </el-form-item>
                        </el-form>

                        <div slot="footer" class="dialog-footer">
                          <el-button type="primary"
                            @click="handlerAIGoalSelectors(mobsBaseConfig.AIGoalSelectorsCurrent, 1)">
                            保存</el-button>
                        </div>
                      </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="[目标]AITargetSelectors" name="AITargetSelectors">
                      <div class="text item">
                        <el-select v-model="mobsBaseConfig.AITargetSelectorsCurrent" @change="handlerAITargetSelectors"
                          filterable placeholder="选择AITargetSelectors" value-key="key"
                          style="width: 100%;margin-bottom: 5px;">
                          <el-option v-for="item in aiTargetSelectors" :key="item.key" :label="item.label"
                            :value="item">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.key }}</span>
                          </el-option>
                        </el-select>
                        <el-table :data="mobsBaseConfig.AITargetSelectors" border style="width: 100%">
                          <el-table-column label="AI Goal">
                            <template slot-scope="scope">
                              <el-tooltip :content="scope.row.key + ' - ' + scope.row.label"><span>{{ scope.row.value
                                  }}</span>
                              </el-tooltip>
                            </template>
                          </el-table-column>
                          <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                              <el-button @click="handlerAITargetSelectors(scope.$index, 3)" type="text" size="small">删除
                              </el-button>
                              <el-button type="text" size="small" @click="handlerAITargetSelectors(scope.row, 2)">编辑
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <el-dialog class="noPadding"
                        :title="'AI Target编辑项: ' + mobsBaseConfig.AITargetSelectorsCurrent.key"
                        :visible.sync="mobsBaseConfig.dialog.dialogFormAITarget">

                        <el-form>
                          <el-form-item :label="'描述: ' + mobsBaseConfig.AITargetSelectorsCurrent.label">
                            <el-input autocomplete="off" v-model="mobsBaseConfig.AITargetSelectorsCurrent.value">
                            </el-input>
                          </el-form-item>
                        </el-form>

                        <div slot="footer" class="dialog-footer">
                          <el-button type="primary"
                            @click="handlerAITargetSelectors(mobsBaseConfig.AITargetSelectorsCurrent, 1)">
                            保存</el-button>
                        </div>
                      </el-dialog>
                    </el-tab-pane>
                  </el-tabs>
                </el-card>

              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="特殊选项(Options)" name="Options">
          <el-alert style="margin-bottom: 10px;" title="提示" type="warning">特殊设置项的设置这里只加入了全局设置。针对某类型生物设置后期将陆续加入。<a
              href="https://pluginscdtribe.github.io/wiki/mythicmobs/MobOption.html" target="_blank">查看生物的特殊设置项介绍</a>
          </el-alert>
          <el-form label-position="right" label-width="170px" :model="mobsBaseConfig.Options" size="medium">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="显示名称标签">
                  <el-radio-group v-model="mobsBaseConfig.Options.AlwaysShowName">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生物碰撞">
                  <el-radio-group v-model="mobsBaseConfig.Options.Collidable">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="没玩家时删除">
                  <el-radio-group v-model="mobsBaseConfig.Options.Despawn">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生物没有AI">
                  <el-radio-group v-model="mobsBaseConfig.Options.NoAI">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否发光">
                  <el-radio-group v-model="mobsBaseConfig.Options.Glowing">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="对所有伤害无敌">
                  <el-radio-group v-model="mobsBaseConfig.Options.Invincible">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生物有重力">
                  <el-radio-group v-model="mobsBaseConfig.Options.NoGravity">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="mm m killall无效">
                  <el-radio-group v-model="mobsBaseConfig.Options.Persistent">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="防止捡起物品">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventItemPickup">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="防止被栓绳拉住">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventLeashing">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="防止MM击杀后掉落物品">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventMobKillDrops">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="阻止原版掉落的物品">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventOtherDrops">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="阻止生物出生有装备">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventRandomEquipment">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="阻止命名牌重命生物">
                  <el-radio-group v-model="mobsBaseConfig.Options.PreventRenaming">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="血量恢复重新使用技能">
                  <el-radio-group v-model="mobsBaseConfig.Options.RepeatAllSkills">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="显示生命信息">
                  <el-radio-group v-model="mobsBaseConfig.Options.ShowHealth">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="阻止生物发出原版音效">
                  <el-radio-group v-model="mobsBaseConfig.Options.Silent">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生物的攻击速度">
                  <el-input-number v-model="mobsBaseConfig.Options.AttackSpeed"></el-input-number>
                </el-form-item>
                <el-form-item label="生物跟随目标最大距离">
                  <el-input-number v-model="mobsBaseConfig.Options.FollowRange">
                  </el-input-number>
                </el-form-item>
                <el-form-item label="生物的抗击退">
                  <el-input-number v-model="mobsBaseConfig.Options.KnockbackResistance" :min="0" :max="1">
                  </el-input-number>
                </el-form-item>
                <el-form-item label="多远外不能被玩家伤害">
                  <el-input-number v-model="mobsBaseConfig.Options.MaxCombatDistance" :min="0" :max="1">
                  </el-input-number>
                </el-form-item>
                <el-form-item label="生物遭到伤害无敌时间">
                  <el-input-number v-model="mobsBaseConfig.Options.NoDamageTicks">
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="技能|条件(Skills|Conditions)" name="Skills">
          <el-alert style="margin-bottom: 10px;" title="提示" type="info">技能是一个完整的 MythicMobs 特性。所有的生物（如果你安装了
            Artifacts，还可以是物品）都可以有各种各样的，以不同条件触发的，在不同条件下执行的技能。<a
              href="https://pluginscdtribe.github.io/wiki/mythicmobs/SkillOverview.html"
              target="_blank">查看技能的介绍与组成内容</a></el-alert>
          <div class="clearfix">
            <el-tooltip content="使用 el-autocomplete 实现"><span>技能|条件编辑器:</span></el-tooltip>
            <el-button style="float: right;" type="primary" @click="handlerSkills(1, 1)" v-if="skillConfig.editor">关闭编辑
            </el-button>
            <el-dropdown style="float:right;" split-button type="primary" @click="handlerSkills()"
              @command="handlerSkills(1,0,$event)" v-else>
              添加到当前表
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">技能列表</el-dropdown-item>
                <el-dropdown-item command="1">条件列表</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>


            <el-tooltip content="关闭后，输入空格不弹出建议内容，但您可继续输入\q来弹出">
              <el-button style="float: right;margin-right:5px" :type="skillConfig.pq ? 'warning' : 'primary'"
                size="medium" @click="skillConfig.pq = !skillConfig.pq" v-text="skillConfig.pq ? '关闭空格提示' : '开启空格提示'">
              </el-button>
            </el-tooltip>
          </div>
          <el-autocomplete @blur="skillEditorBlur" ref="skillEditorRef" :debounce="100" :trigger-on-focus="false"
            autosize select-when-unmatched highlight-first-item popper-class="my-autocomplete"
            v-model="skillConfig.currentData" :fetch-suggestions="querySearchSkill"
            :placeholder="'请在这里编辑您的技能或条件( 关键词 前面空格可有提示框，也可输入\\q来弹出提示框(若是在内容中间需要 \\q<搜索词>\\q 格式))\n其他提示:\n弹出过滤目标列表: \\qf\n弹出触发器列表: \\qt\n弹出原版目标参数: \\qo\n弹出所有变量列表: \\qv'"
            style="width: 100%;margin: 5px 0;" type="textarea" @select="handlerSkillSelect">
            <i class="el-icon-edit el-input__icon" slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.key }}</div>
              <span class="addr">{{ item.label }}</span>
            </template>
          </el-autocomplete>
          <el-tabs v-model="skillConfig.tabId">
            <el-tab-pane label="技能列表" name="0">
              <el-table :data="mobsBaseConfig.Skills" border style="width: 100%" class="myTabsss">
                <el-table-column label="技能项">
                  <template slot-scope="scope">
                    <span>{{ scope.row.currentData }}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="handlerSkills(scope.$index, 3)" type="text" size="small">删除
                    </el-button>
                    <el-button type="text" size="small" @click="handlerSkills(scope.$index, 2)">编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="条件列表" name="1">
              <el-table :data="mobsBaseConfig.Conditions" border style="width: 100%" class="myTabsss">
                <el-table-column label="条件项">
                  <template slot-scope="scope">
                    <span>{{ scope.row.currentData }}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="handlerSkills(scope.$index, 3)" type="text" size="small">删除
                    </el-button>
                    <el-button type="text" size="small" @click="handlerSkills(scope.$index, 2)">编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>


        </el-tab-pane>

        <el-tab-pane label="血条配置(BossBar)" name="BossBar">
          <el-form label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Boss血条">
                  <el-radio-group v-model="mobsBaseConfig.BossBar.Enabled">
                    <el-radio-button :label="true">启用</el-radio-button>
                    <el-radio-button :label="false">禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="血条标题">
                  <el-input v-model="mobsBaseConfig.BossBar.Title"></el-input>
                </el-form-item>
                <el-form-item label="范围内显示">
                  <el-input-number v-model="mobsBaseConfig.BossBar.Range"></el-input-number>
                </el-form-item>
                <el-form-item label="血条颜色">
                  <el-select v-model="mobsBaseConfig.BossBar.Color">
                    <el-option v-for="(item) in bossBar.Color" :value="item.key" :item="item.key" :label="item.label"
                      :key="item.key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="血条类型">
                  <el-select v-model="mobsBaseConfig.BossBar.Style">
                    <el-option v-for="(item) in bossBar.Style" :value="item.key" :item="item.key" :label="item.label"
                      :key="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-container>

    <el-card class="bjjj" style="margin-top:20px;">
      <div slot="header" class="clearfix">
        <span>当前怪物数据</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="generateYMLData()">生成数据</el-button>

      </div>

      <el-empty v-if="toYmlData == null">
        <el-button type="primary" @click="generateYMLData()">生成数据</el-button>
      </el-empty>
      <div v-else>
        <el-tabs value="yaml" style="width: 100%;" class="myTabsss">
          <el-tab-pane label="YAML数据" name="yaml">
            <el-button style="width: 100%;" type="text" @click="copyHandle(toYmlData)">复制YAML数据</el-button>
            <pre v-html="hljsTo(toYmlData, 'yaml')" v-highlight style="font-size: 16px;"></pre>
          </el-tab-pane>
          <el-tab-pane label="JSON数据" name="json">
            <el-button style="width: 100%;" type="text" @click="copyHandle(toJsonData)">复制JSON数据</el-button>
            <pre v-html="hljsTo(toJsonData, 'json')" v-highlight style="font-size: 16px;"></pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import localVarData from '../../../assets/mythicmobsConfig.js'
export default {
  computed: {
    bossBar() {
      return localVarData.BossBar;
    },
    skill() {
      return localVarData.SkillVar.concat(localVarData.SkillEffectVar).concat(localVarData.SkillTargetVar).concat(localVarData.FilterVar).concat(localVarData.OriginalArgumentsVar).concat(localVarData.TriggerVar).concat(localVarData.VariablesVar).concat(localVarData.ConditionsVar).concat(this.data.skill)
    },
    killMessages() {
      return [].concat(this.data.killMessages)
    },
    damageModifiers() {
      return localVarData.DamageModifiers
    },
    drops() {
      return localVarData.SpecialDrops.concat(this.data.drops)
    },
    equipment() {
      return [].concat(this.data.equipment) // 暂时无装备
    },
    aiGoalSelectors() {
      return localVarData.AIGoalSelectors
    },
    aiTargetSelectors() {
      return localVarData.AITargetSelectors
    },
    mobsTypeList() {
      return localVarData.MobsTypeList
    }
  },
  data() {
    return {
      tabActiveName: "base",
      toYmlData: null,
      toJsonData: null,
      commandList: [
        "\\qf",
        "\\qt",
        "\\qo",
        "\\qv"
      ],
      data: {
        skill: [],
        drops: [],
        equipment: [],
        killMessages: []
      },
      skillConfig: {
        tabId: "0",
        skillEditorStart: 0,
        pq: true,
        currentData: "",
        currentSelect: null,
      },
      mobsBaseConfig: {
        id: "", // 生物全局名称
        content: { // 基础配置
          Type: "", // 生物种类
          Display: "", // 显示名字 <&sq>=单引号
          Health: 20, // 设置生物的最大的血量
          Damage: 5, // 设置生物的基础近战攻击 1 伤害 = 0.5 心
          Armor: undefined, //将会减少受到伤害的数量 1 护甲 = 0.5 心
          Faction: "", // 设置派系名称，可以用于高级的AI设置 必须是字母数字，区分大小写
          Mount: "", // 设置坐骑，必须是另一个 MythicMob. 生成时会自动坐在此生物上
        },
        BossBar: {
          Enabled: false,
          Title: '',
          Range: 20,
          Color: 'PINK', // PINK, BLUE, RED, GREEN, YELLOW, PURPLE, WHITE
          Style: 'SOLID' // SOLID, SEGMENTED_6, SEGMENTED_10, SEGMENTED_12, SEGMENTED_20
        },
        Modules: {
          ThreatTable: false,
          ImmunityTable: false
        },
        Options: {
          AlwaysShowName: false, // 是否总是显示名称标签，即使没有看着生物或穿过方块
          AttackSpeed: undefined, // 设置生物的攻击速度 默认为各个生物默认的攻击速度
          Collidable: true, // 此生物是否可碰撞
          Despawn: true, // 决定生物在附近没有玩家时会不会被删除
          FollowRange: undefined, // 生物跟随目标的最大距离 默认为各个原版生物的默认距离
          Glowing: false,  // 生物是否发光
          Invincible: false,  // 设置是否对所有伤害无敌
          KnockbackResistance: 0,  // 0到1之间的数字决定了生物的抗击退，默认0  0.1 = 10%, 0.5 = 50% 1 = 100%
          MaxCombatDistance: undefined, // 生物在多远以外不能被玩家伤害  将此设置为比技能小的范围将保证它可能伤害玩家，并且不容易被利用
          MovementSpeed: 0.2,  // 生物的移动速度   大于1的数字将让怪物难以/不可能打败，大于3会让服务器跪地
          NoAI: false,  // 决定生物有没有AI，会覆AIGoalSelectors 的设定！
          NoDamageTicks: 10, // 设置生物遭到伤害以后的无敌时间
          NoGravity: false,  // 此生物是否有重力   当为 true 时，这个生物不能有技能:速度。
          Persistent: false,  // 让生物在 mm m kilall 命令下无敌   生物依然能消失，如果 Despawn 设置为 true   生物可以在 mm m kill X 命令或使用 minecraft:kill 命令中杀死
          PreventItemPickup: true,  // 防止生物捡起物品
          PreventLeashing: true,  // 防止被栓绳拉住
          PreventMobKillDrops: false,  // 防止被 MythicMob 击杀后掉落物品
          PreventOtherDrops: false,  // MythicMobs 是否应该阻止原版掉落的物品？
          PreventRandomEquipment: false,  // 是否阻止生物出生时有随机装备
          PreventRenaming: true,  // 阻止使用命名牌重命名生物
          RepeatAllSkills: false,  // 如果生物的血量恢复到技能设置的血量阈值以上，是否可以重新使用此技能
          ShowHealth: false,  // 是否显示生命信息，这个设置在 config.yml 中设置，并可以修改格式。
          Silent: false,  // 是否阻止生物发出原版音效
        },
        Equipment: [],
        EquipmentCurrent: 0,
        EquipmentCurrentObj: {
          id: '',
          slot: 0
        },
        Drops: [],
        DropsCurrent: 0,
        DropsCurrentObj: {
          id: 'exp',
          amount: 1,
          chance: 0.01
        },
        DropsPerLevel: [],
        DropsPerLevelCurrent: 0,
        DropsPerLevelCurrentObj: {
          id: 'exp',
          amount: 1,
          chance: 0.01
        },
        DamageModifiersCurrent: {
          key: "",
          value: 1,
        },
        DamageModifiers: [],
        KillMessages: [],
        KillMessagesCurrent: 0,
        AIGoalSelectorsCurrent: {
          key: ""
        },
        AITargetSelectorsCurrent: {
          key: ""
        },
        AIGoalSelectors: [],
        AITargetSelectors: [],
        Skills: [],
        Conditions: [],
        dialog: {
          dialogFormAIGoal: false,
          dialogFormAITarget: false,
          dialogFormEquipment: false,
          dialogFormDrops: false,
          dialogFormDropsPerLevel: false,
          dialogFormDamageModifiers: false,
          dialogFormKillMessages: false,
        }
      }
    }
  },
  methods: {
    hljsTo(data, lang = null) {
      if (lang == null) {
        return hljs.highlightAuto(data).value
      }
      return hljs.highlight(lang, data).value
    },
    copyHandle(content) {
      let copy = (e) => {
        e.preventDefault()
        e.clipboardData.setData('text/plain', content)
        this.$message.success('内容已复制到剪切板');
        document.removeEventListener('copy', copy)
      }
      document.addEventListener('copy', copy)
      document.execCommand("Copy");
    },
    setSkillEditorStart(add = 0) {
      this.skillConfig.skillEditorStart += add
      this.$refs.skillEditorRef.$el.children[0].children[0].selectionStart = this.skillConfig.skillEditorStart
      this.$refs.skillEditorRef.$el.children[0].children[0].selectionEnd = this.skillConfig.skillEditorStart
    },
    skillEditorBlur() {
      this.skillConfig.skillEditorStart = this.$refs.skillEditorRef.$el.children[0].children[0].selectionStart
    },
    checkValueNull(value) {
      if (typeof value == 'string')
        return value.length == 0 || value == ''
      if (typeof value == 'object')
        return (value == undefined || value == null || value.length == 0)
      return value == undefined || value == null
    },
    generateYMLData() {
      this.toYmlData = null
      this.toJsonData = null
      var jsonData = {}
      if (this.checkValueNull(this.mobsBaseConfig.id)) {
        this.$message.error('请检查您的全局名称是否正确!');
        return;
      }
      if (this.checkValueNull(this.mobsBaseConfig.content.Type)) {
        this.$message.error('请检查您的生物种类是否正确!');
        return;
      }
      if (this.checkValueNull(this.mobsBaseConfig.content.Display)) {
        this.$message.error('请检查您的显示名称是否正确!');
        return;
      }

      jsonData[this.mobsBaseConfig.id] = this.mobsBaseConfig.content

      if (this.mobsBaseConfig.BossBar.Enabled) {
        jsonData[this.mobsBaseConfig.id].BossBar = this.mobsBaseConfig.BossBar
      }

      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Damage))
        delete jsonData[this.mobsBaseConfig.id].Damage

      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Armor))
        delete jsonData[this.mobsBaseConfig.id].Armor

      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Faction))
        delete jsonData[this.mobsBaseConfig.id].Faction

      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Mount))
        delete jsonData[this.mobsBaseConfig.id].Mount
      jsonData[this.mobsBaseConfig.id].Options = this.mobsBaseConfig.Options
      if (jsonData[this.mobsBaseConfig.id].Options.AttackSpeed == null)
        delete jsonData[this.mobsBaseConfig.id].Options.AttackSpeed
      if (jsonData[this.mobsBaseConfig.id].Options.FollowRange == null)
        delete jsonData[this.mobsBaseConfig.id].Options.FollowRange
      if (jsonData[this.mobsBaseConfig.id].Options.MaxCombatDistance == null)
        delete jsonData[this.mobsBaseConfig.id].Options.MaxCombatDistance
      jsonData[this.mobsBaseConfig.id].Modules = this.mobsBaseConfig.Modules
      jsonData[this.mobsBaseConfig.id].Equipment = this.mobsBaseConfig.Equipment.map(obj => {
        return `${obj.id}:${obj.slot}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Equipment))
        delete jsonData[this.mobsBaseConfig.id].Equipment


      jsonData[this.mobsBaseConfig.id].Drops = this.mobsBaseConfig.Drops.map(obj => {
        return `${obj.id} ${obj.amount} ${obj.chance}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Drops))
        delete jsonData[this.mobsBaseConfig.id].Drops


      jsonData[this.mobsBaseConfig.id].DropsPerLevel = this.mobsBaseConfig.DropsPerLevel.map(obj => {
        return `${obj.id} ${obj.amount} ${obj.chance}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].DropsPerLevel))
        delete jsonData[this.mobsBaseConfig.id].DropsPerLevel


      jsonData[this.mobsBaseConfig.id].DamageModifiers = this.mobsBaseConfig.DamageModifiers.map(obj => {
        return `${obj.key} ${obj.value}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].DamageModifiers))
        delete jsonData[this.mobsBaseConfig.id].DamageModifiers


      jsonData[this.mobsBaseConfig.id].AIGoalSelectors = this.mobsBaseConfig.AIGoalSelectors.map(obj => {
        return `${obj.value}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].AIGoalSelectors))
        delete jsonData[this.mobsBaseConfig.id].AIGoalSelectors


      jsonData[this.mobsBaseConfig.id].AITargetSelectors = this.mobsBaseConfig.AITargetSelectors.map(obj => {
        return `${obj.value}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].AITargetSelectors))
        delete jsonData[this.mobsBaseConfig.id].AITargetSelectors


      jsonData[this.mobsBaseConfig.id].KillMessages = this.mobsBaseConfig.KillMessages
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].KillMessages))
        delete jsonData[this.mobsBaseConfig.id].KillMessages

      jsonData[this.mobsBaseConfig.id].Skills = this.mobsBaseConfig.Skills.map(obj => {
        if (obj.currentData[0] == " ")
          obj.currentData = obj.currentData.replace(" ", "")
        return `${obj.currentData}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Skills))
        delete jsonData[this.mobsBaseConfig.id].Skills

      jsonData[this.mobsBaseConfig.id].Conditions = this.mobsBaseConfig.Conditions.map(obj => {
        if (obj.currentData[0] == " ")
          obj.currentData = obj.currentData.replace(" ", "")
        return `${obj.currentData}`
      })
      if (this.checkValueNull(jsonData[this.mobsBaseConfig.id].Conditions))
        delete jsonData[this.mobsBaseConfig.id].Conditions

      if (jsonData) {
        try {
          this.toYmlData = jsyaml.dump(jsonData, { skipInvalid: true })
          // hljs.highlightAuto().value
          // hljs.highlight("json", ).value
          this.toJsonData = JSON.stringify(jsonData, null, 2)
        } catch (e) {
          alert(e)
        }
      }
    },
    handlerAIGoalSelectors(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的AIGoalSelectors
        this.mobsBaseConfig.AIGoalSelectorsCurrent = Object.assign({ value: event.key }, event)
        this.mobsBaseConfig.AIGoalSelectors.push(this.mobsBaseConfig.AIGoalSelectorsCurrent)
        this.mobsBaseConfig.dialog.dialogFormAIGoal = true
      } else if (type == 1) { // 处理编辑对话框保存
        if (this.mobsBaseConfig.AIGoalSelectorsCurrent.value == null || this.mobsBaseConfig.AIGoalSelectorsCurrent.value == undefined)
          this.mobsBaseConfig.AIGoalSelectors.push(event)
        this.mobsBaseConfig.dialog.dialogFormAIGoal = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.AIGoalSelectorsCurrent = event
        this.mobsBaseConfig.dialog.dialogFormAIGoal = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.AIGoalSelectors.splice(event, 1)
      }
    },
    handlerAITargetSelectors(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的AITargetSelectors
        this.mobsBaseConfig.AITargetSelectorsCurrent = Object.assign({ value: event.key }, event)
        this.mobsBaseConfig.AITargetSelectors.push(this.mobsBaseConfig.AITargetSelectorsCurrent)
        this.mobsBaseConfig.dialog.dialogFormAITarget = true
      } else if (type == 1) { // 处理编辑对话框保存
        if (this.mobsBaseConfig.AITargetSelectorsCurrent.value == null || this.mobsBaseConfig.AITargetSelectorsCurrent.value == undefined)
          this.mobsBaseConfig.AITargetSelectors.push(event)
        this.mobsBaseConfig.dialog.dialogFormAITarget = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.AITargetSelectorsCurrent = event
        this.mobsBaseConfig.dialog.dialogFormAITarget = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.AITargetSelectors.splice(event, 1)
      }
    },
    handlerEquipment(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的装备
        const equipmentId = this.mobsBaseConfig.Equipment[this.mobsBaseConfig.EquipmentCurrent];
        if (equipmentId.length > 0 && this.equipment.indexOf(equipmentId) == -1)
          this.data.equipment.push(equipmentId)
        this.mobsBaseConfig.EquipmentCurrentObj = this.mobsBaseConfig.Equipment[this.mobsBaseConfig.EquipmentCurrent] = {
          id: equipmentId,
          slot: 0,
        }
        this.mobsBaseConfig.dialog.dialogFormEquipment = true
      } else if (type == 1) { // 处理编辑对话框保存
        this.mobsBaseConfig.Equipment[event] = this.mobsBaseConfig.EquipmentCurrentObj
        this.mobsBaseConfig.dialog.dialogFormEquipment = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.EquipmentCurrent = event
        this.mobsBaseConfig.EquipmentCurrentObj = this.mobsBaseConfig.Equipment[event]
        this.mobsBaseConfig.dialog.dialogFormEquipment = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.Equipment.splice(event, 1)
      }
    },
    handlerDrops(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的装备
        if (typeof (event) == 'object')
          this.mobsBaseConfig.Drops[this.mobsBaseConfig.DropsCurrent] = Object.assign({}, event)
        var dropsId = this.mobsBaseConfig.Drops[this.mobsBaseConfig.DropsCurrent];
        dropsId = typeof (dropsId) == 'object' ? dropsId.key : dropsId
        if (dropsId.length > 0 && this.drops.filter(drop => {
          if (typeof (drop) == 'object')
            return drop.key.indexOf(dropsId) != -1
          else
            return drop.indexOf(dropsId) != -1
        }).length == 0)
          this.data.drops.push({
            key: dropsId,
            label: dropsId
          })
        this.mobsBaseConfig.DropsCurrentObj = this.mobsBaseConfig.Drops[this.mobsBaseConfig.DropsCurrent] = {
          id: dropsId,
          amount: 1,
          chance: 0.01,
        }
        this.mobsBaseConfig.dialog.dialogFormDrops = true
      } else if (type == 1) { // 处理编辑对话框保存
        this.mobsBaseConfig.Drops[event] = this.mobsBaseConfig.DropsCurrentObj
        this.mobsBaseConfig.dialog.dialogFormDrops = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.DropsCurrent = event
        this.mobsBaseConfig.DropsCurrentObj = this.mobsBaseConfig.Drops[event]
        this.mobsBaseConfig.dialog.dialogFormDrops = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.Drops.splice(event, 1)
      }
    },
    handlerDropsPerLevel(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的装备
        if (typeof (event) == 'object')
          this.mobsBaseConfig.DropsPerLevel[this.mobsBaseConfig.DropsPerLevelCurrent] = Object.assign({}, event)
        var dropsId = this.mobsBaseConfig.DropsPerLevel[this.mobsBaseConfig.DropsPerLevelCurrent];
        dropsId = typeof (dropsId) == 'object' ? dropsId.key : dropsId
        if (dropsId.length > 0 && this.drops.filter(drop => {
          if (typeof (drop) == 'object')
            return drop.key.indexOf(dropsId) != -1
          else
            return drop.indexOf(dropsId) != -1
        }).length == 0)
          this.data.drops.push({
            key: dropsId,
            label: dropsId
          })
        this.mobsBaseConfig.DropsPerLevelCurrentObj = this.mobsBaseConfig.DropsPerLevel[this.mobsBaseConfig.DropsPerLevelCurrent] = {
          id: dropsId,
          amount: 1,
          chance: 0.01,
        }
        this.mobsBaseConfig.dialog.dialogFormDropsPerLevel = true
      } else if (type == 1) { // 处理编辑对话框保存
        this.mobsBaseConfig.DropsPerLevel[event] = this.mobsBaseConfig.DropsPerLevelCurrentObj
        this.mobsBaseConfig.dialog.dialogFormDropsPerLevel = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.DropsPerLevelCurrent = event
        this.mobsBaseConfig.DropsPerLevelCurrentObj = this.mobsBaseConfig.DropsPerLevel[event]
        this.mobsBaseConfig.dialog.dialogFormDropsPerLevel = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.DropsPerLevel.splice(event, 1)
      }
    },
    handlerDamageModifiers(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的DamageModifiers
        this.mobsBaseConfig.DamageModifiersCurrent = Object.assign({ value: 1 }, event)
        this.mobsBaseConfig.DamageModifiers.push(this.mobsBaseConfig.DamageModifiersCurrent)
        this.mobsBaseConfig.dialog.dialogFormDamageModifiers = true
      } else if (type == 1) { // 处理编辑对话框保存
        if (this.mobsBaseConfig.DamageModifiersCurrent.value == null || this.mobsBaseConfig.DamageModifiersCurrent.value == undefined)
          this.mobsBaseConfig.DamageModifiers.push(event)
        this.mobsBaseConfig.dialog.dialogFormDamageModifiers = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.DamageModifiersCurrent = event
        this.mobsBaseConfig.dialog.dialogFormDamageModifiers = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.DamageModifiers.splice(event, 1)
      }
    },
    handlerKillMessages(event, type = 0) {
      if (type == 0) { // 处理从选择框选中的装备
        const killMessagesId = this.mobsBaseConfig.KillMessages[this.mobsBaseConfig.KillMessagesCurrent];
        if (killMessagesId.length > 0 && this.killMessages.indexOf(killMessagesId) == -1)
          this.data.killMessages.push(killMessagesId)
        this.mobsBaseConfig.dialog.dialogFormKillMessages = true
      } else if (type == 1) { // 处理编辑对话框保存
        this.mobsBaseConfig.dialog.dialogFormKillMessages = false
      } else if (type == 2) { // 编辑列表中某一项
        this.mobsBaseConfig.KillMessagesCurrent = event
        this.mobsBaseConfig.dialog.dialogFormKillMessages = true
      } else if (type == 3) { // 删除列表中某一项
        this.mobsBaseConfig.KillMessages.splice(event, 1)
      }
    },
    querySearchSkill(queryString, cb) {
      var skill = Object.assign([], this.skill);
      var results
      var qLen = queryString.indexOf("\\q")
      var qStr = queryString.substring(qLen, qLen + 3)
      var qLenD = queryString.lastIndexOf("\\q")
      qLenD = qLenD == qLen ? -1 : qLenD
      var qStrD = null

      if (qLenD != -1 && qLen < qLenD)
        qStrD = queryString.substring(qLen + 2, qLenD)
      else
        qStrD = queryString.substring(qLen + 2, queryString.length)

      if (qLen != -1) {
        if (this.commandList.indexOf("\\q" + qStrD) == -1) {

          if (!this.checkValueNull(qStrD))
            skill.push({
              key: qStrD,
              label: "您当前输入内容"
            })
          results = qStrD ? skill.filter(this.createFilter(qStrD)).sort((a, b) => { return a.indexLen - b.indexLen }) : skill;
          // 调用 callback 返回建议列表的数据
          cb(results);
          return;
        }
        switch (qStr) {
          case "\\qf": // 弹出过滤目标
            cb(localVarData.FilterVar)
            return;
          case "\\qo": // 弹出原版目标参数
            cb(localVarData.OriginalArgumentsVar)
            return;
          case "\\qt": // 弹出触发器
            cb(localVarData.TriggerVar)
            return;
          case "\\qv": // 弹出触发器
            cb(localVarData.VariablesVar)
            return;
          default:
            cb(skill)
            return;
        }

      }
      if (!this.skillConfig.pq) return cb([]);
      if (this.checkValueNull(queryString)) {
        queryString = ""
      }
      var qS = queryString.split(" ")

      if (qS.length == 0) {
        cb(skill);
        return;
      }
      qS[qS.length - 1] = qS[qS.length - 1].replaceAll("\n", "")
      if (!this.checkValueNull(qS[qS.length - 1]))
        skill.push({
          key: qS[qS.length - 1],
          label: "您当前输入内容"
        })

      queryString = qS[qS.length - 1]
      results = queryString ? skill.filter(this.createFilter(queryString)).sort((a, b) => {

        return a.indexLen - b.indexLen
      }) : skill;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (results) => {
        results.indexLen = results.key.toLowerCase().indexOf(queryString.toLowerCase())
        results.indexLen = results.indexLen == -1 ? results.label.toLowerCase().indexOf(queryString.toLowerCase()) : results.indexLen
        results.indexLen = results.indexLen == -1 ? (this.checkValueNull(results.abbr) ? -1 : (results.abbr.toLowerCase().indexOf(queryString.toLowerCase()))) : results.indexLen
        return results.indexLen != -1;
      };
    },
    handlerSkillSelect(item) {
      this.skillConfig.currentSelect = item.key
      if (this.checkValueNull(item.key))
        return;
      if (this.skill.filter(obj => {
        return obj.key.toLowerCase().indexOf(item.key.toLowerCase()) != -1
      }).length == 0)
        this.skill.push({
          key: item.key,
          label: "您用过的关键字"
        })
    },
    handlerSkills(event, type = 0, tabs= -1) {
      if(tabs==-1) 
        tabs = this.skillConfig.tabId
      else 
        this.skillConfig.tabId = tabs
      const template = {
        tabId: tabs,
        skillEditorStart: 0,
        pq: this.skillConfig.pq,
        editor: false,
        currentData: "",
        currentSelect: null
      }
      tabs = parseInt(tabs)
      
      if (type == 0) { // 添加到列表
        if (this.checkValueNull(this.skillConfig.currentData))
          this.$message.warning('被添加的编辑项没有任何内容!');
          if(tabs==0) 
            this.mobsBaseConfig.Skills.push(Object.assign({ editor: false }, this.skillConfig))
          else  if(tabs==1) 
            this.mobsBaseConfig.Conditions.push(Object.assign({ editor: false }, this.skillConfig))
        this.skillConfig = template
      }
      else if (type == 1) { // 保存
        this.skillConfig.editor = false;
        if (this.checkValueNull(this.skillConfig.currentData))
          this.$message.warning('被关闭的编辑项没有任何内容!');
        this.skillConfig = template
      }
      else if (type == 2) { // 编辑
        this.skillConfig.editor = false
        this.skillConfig = this.mobsBaseConfig.Skills[event];
        this.skillConfig.editor = true;
      }
      else if (type == 3) // 删除
        this.mobsBaseConfig.Skills.splice(event, 1);
    }
  },
  watch: {
    'skillConfig.currentData': {
      handler(newV, oldV) {
        if (this.checkValueNull(newV))
          newV = ""
        if (this.checkValueNull(oldV))
          oldV = newV

        this.skillEditorBlur()
        if (newV.length > 0 && newV.lastIndexOf("{") == newV.length - 1) {
          if (oldV.lastIndexOf("{") == oldV.lastIndexOf("}") - 1) {
            return
          }
          this.skillConfig.currentData += "}"
          this.$nextTick(() => {
            this.setSkillEditorStart()
          })
          return
        } else if (newV.length > 0 && newV.lastIndexOf("}") == newV.length - 1) {
          return;
        }

        if (newV.length > 0 && newV.lastIndexOf("(") == newV.length - 1) {
          if (oldV.lastIndexOf("(") == oldV.lastIndexOf(")") - 1) {
            return
          }
          this.skillConfig.currentData += ")"
          this.$nextTick(() => {
            this.setSkillEditorStart()
          })
          return
        } else if (newV.length > 0 && newV.lastIndexOf("}") == newV.length - 1) {
          return;
        }
        if (!(newV.indexOf("\\q") <= oldV.lastIndexOf("\\q"))) {
          this.skillConfig.currentData = this.skillConfig.currentData.replace("\\q", "\\q\\q")
          this.$nextTick(() => {
            this.setSkillEditorStart()
          })
        }



        if (this.skillConfig.currentSelect == null) {
          if(newV.lastIndexOf("\n")!=-1) this.skillConfig.currentData = oldV
          return;
        }

        var qLen = oldV.indexOf("\\q")
        var qStr = oldV.substring(qLen, qLen + 3)
        var qLenD = oldV.lastIndexOf("\\q")
        qLenD = qLenD == qLen ? -1 : qLenD
        var qStrD = null
        if (qLen != -1 && qLen < qLenD)
          qStrD = oldV.substring(qLen, qLenD + 2)
        else
          qStrD = oldV.substring(qLen, oldV.length)
        var startCC = this.skillConfig.currentSelect.length;
        if (qLen != -1) {

          if (this.commandList.indexOf(qStr) != -1) {
            startCC = +(startCC - 3)
            startCC = startCC == 3 ? 0 : startCC
            this.skillConfig.currentData = oldV.replace(qStr, this.skillConfig.currentSelect)
          } else {
            startCC = +(startCC - qStrD.length)
            startCC = startCC == qStrD.length ? 0 : startCC + 2
            this.skillConfig.currentData = oldV.replace(qStrD, this.skillConfig.currentSelect)
          }
        } else {

          this.skillConfig.currentData = oldV.substring(0, oldV.lastIndexOf(" ")) + " " + this.skillConfig.currentSelect
        }

        this.skillConfig.currentSelect = null
        this.skillConfig.currentData = this.skillConfig.currentData.replace("\\q", "")
        this.$nextTick(() => {

          this.setSkillEditorStart(startCC)

        })


      }
    }
  }
}
</script>

<style>
.el-divider--horizontal {
  margin: 0px;
  margin-top: 10px;
}

.noPadding .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}

.bjjj .el-card__body {
  background-color: #292a44;
  color: white;
}


.el-textarea__inner {
  font-size: 16px;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>

<style lang="less">
.myTabsss {
  .el-tabs__item {
    color: #fefefe
  }

  .el-tabs__item.is-active {
    color: #409EFF;
  }
}

.my-autocomplete {

  font-weight: bold;

  li {
    line-height: normal;
    padding: 7px 15px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .addr {
      font-size: 13px;
      color: rgb(132, 146, 166);
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>