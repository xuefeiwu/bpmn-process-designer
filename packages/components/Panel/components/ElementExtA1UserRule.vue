<template>
  <el-collapse-item name="element_ext_a1_user_rule">
    <template #title>
      <collapse-title title="节点人员">
        <lucide-icon name="Edit"/>
      </collapse-title>
      <number-tag
        :value="userRuleList.length"
        margin-left="12px"/>
    </template>
    <div class="element_ext_a1_user_rule">
      <el-table
        border
        :data="userRuleList"
        style="width: 100%"
        height="200px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          label="处理人类型"
          prop="pluginType"
          width="125"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <template v-for="(pluginType) in pluginTypeList">
              <el-tag v-if="pluginType.value == row.pluginType">{{ pluginType.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="节点人员"
          prop="ruleDisplayName"
          header-align="center"
          align="left"
          width="250"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.pluginType == 'sameNode'">
              <template v-for="(userTask) in allUserTaskList">
                <span v-if="userTask.id == row.pluginVal"> {{ userTask.name }}</span>
              </template>
            </span>
            <span v-else>{{ row.ruleDisplayName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运算类型"
          prop="logicCal"
          width="75"
          header-align="center"
          align="center">
          <template slot-scope="{row}">
            <template v-for="(logicCalType) in logicCalTypeList">
              <el-tag v-if="logicCalType.value == row.logicCal">{{ logicCalType.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="90">
          <template slot-scope="{ row, $index }">
            <el-button type="text" @click="openExtA1UserRuleModel($index,row)" >编辑</el-button>
            <el-button type="text" @click="removeUserRules(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" class="inline-large-button" icon="el-icon-plus" @click="openExtA1UserRuleModel(-1)">添加节点人员</el-button>
    </div>

    <el-dialog
      :visible.sync="modelVisible"
      title="添加节点人员"
      width="600px"
      append-to-body
      destroy-on-close>
      <el-form
        v-if="modelVisible"
        ref="formRef"
        :model="userRule"
        class="need-filled"
        label-width="100px"
        aria-modal="true">
        <el-form-item
          label="处理人类型:"
          prop="pluginType">
          <el-select v-model="userRule.pluginType" placeholder="请选择" @change="changePluginType">
            <el-option
              v-for="item in pluginTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="节点人员:"
          prop="pluginVal">
          <template v-if="showSelect == 0">
            <el-tooltip :content="selectPluginVal" class="item" effect="dark" :disabled="selectPluginVal == ''">
              <el-input v-model="selectPluginVal" readonly>
                <el-button
                  slot="prepend"
                  style="color: #fff;
                background-color: #409eff;
                border-color: #409eff;">请选择</el-button>
              </el-input>
            </el-tooltip>
          </template>
          <template v-else-if="showSelect == 1">
            <el-select v-model="selectPluginVal" placeholder="请选择">
              <el-option
                v-for="item in notActiveNodeUserTaskList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <template v-if="showLogicCal && userRule.logicCal != ''">
          <el-form-item
            label="运算类型:"
            prop="logicCal">
            <el-select v-model="userRule.logicCal" placeholder="请选择">
              <el-option
                v-for="item in logicCalTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1UserRules, removeExtA1UserRules} from '@packages/bo-utils/extA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'
import * as userRuleVars from '@packages/api/UserRuleVars.js'

export default {
    name: 'ElementExtA1UserRule',
    data () {
        return {
            pluginTypeList: [],
            logicCalTypeList: [],
            allUserTaskList: [],
            notActiveNodeUserTaskList: [],
            userRuleList: [],
            modelVisible: false,
            showLogicCal: false,
            // 显示节点人员选择：0-显示选择按钮，1-显示相同节点选择，2-只显示内容
            showSelect: 0,
            selectPluginVal: '',
            userRule: {
                id: '',
                nodeId: '',
                pluginType: '',
                pluginVal: '',
                logicCal: '',
                ruleId: '',
                ruleVal: '',
                ruleDisplayName: '',
                specId: ''
            }
        }
    },
    mounted () {
        this.reloadUserRules()
        EventEmitter.on('element-update', this.reloadUserRules)
    },
    methods: {
        reloadUserRules () {
            this.pluginTypeList = userRuleVars.pluginTypeList
            this.logicCalTypeList = userRuleVars.logicCalTypeList
            this.allUserTaskList = getAllUserTask()
            this.userRuleList = []
            let userRuleList = getExtA1UserRules((index, item) => item.nodeId == getActive().id)
            if (userRuleList && userRuleList.length > 0) {
                this.userRuleList = userRuleList.map((item) => {
                    return {
                        id: item.id,
                        nodeId: item.nodeId,
                        pluginType: item.pluginType,
                        pluginVal: item.pluginVal,
                        ruleId: item.ruleId,
                        ruleVal: item.ruleVal,
                        ruleDisplayName: item.ruleDisplayName,
                        specId: item.specId,
                        logicCal: item.logicCal
                    }
                })
            }
        },
        removeUserRules (row) {
            removeExtA1UserRules(row)
            this.reloadUserRules()
        },
        changePluginType (val) {
            this.selectPluginVal = ''
            this.showUserSelect()
        },
        showUserSelect () {
            this.showSelect = 0
            if (this.userRule) {
                if (this.userRule.pluginType == 'sameNode') {
                    this.showSelect = 1
                } else if (['depHead', 'lastAduitUserHead', 'lastAduitDepartmentHead'].indexOf(this.userRule.pluginType) != -1) {
                    this.showSelect = 2
                }
            }
        },
        async openExtA1UserRuleModel (index, row) {
            this.activeIndex = index
            this.userRule = {}
            console.log(row)
            row && (this.userRule = JSON.parse(JSON.stringify(row)))

            this.notActiveNodeUserTaskList = this.allUserTaskList.filter((item) => item.id != getActive().id)
            this.showLogicCal = this.userRuleList && this.userRuleList.length > 0
            this.selectPluginVal = this.userRule.ruleDisplayName
            this.showUserSelect()
            this.modelVisible = true
            await this.$nextTick()
            this.$refs.formRef && this.$refs.formRef.clearValidate()
        }
    }
}
</script>

<style scoped>

</style>
