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
            <el-button type="text" @click="openExtA1UserRuleModel($index,row)">编辑</el-button>
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
      <div style="height: 200px;">
        <el-form
          v-if="modelVisible"
          ref="formRef"
          :model="userRule"
          :rules="formRules"
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
            label="用户规则:"
            prop="ruleId">
            <el-select v-model="userRule.ruleId" placeholder="请选择" @change="changeRuleId" :disabled="userRule.pluginType != 'users'">
              <el-option
                v-for="item in userTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="节点人员:"
            prop="pluginVal">
            <template v-if="showSelect < 2">
              <el-tooltip :content="selectPluginVal" class="item" effect="dark" :disabled="selectPluginVal == ''">
                <el-input v-model="selectPluginVal" :disabled="!showPluginVal" readonly>
                  <el-button
                    v-if="showSelect == 0"
                    slot="append"
                    icon="el-icon-edit"
                    :disabled="!showPluginVal"
                    @click="openSelectModel">
                  </el-button>
                </el-input>
              </el-tooltip>
            </template>
            <template v-else-if="showSelect == 2">
              <el-select v-model="userRule.pluginVal" placeholder="请选择" :disabled="!showPluginVal">
                <el-option
                  v-for="item in notActiveNodeUserTaskList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="showSelect == 3">
              <code-editor-model
                title="脚本设置"
                code-language="groovy"
                :code-string="selectPluginVal"
                :disable-btn="!showPluginVal"
                :readOnly="false"
                @handleSureClick="saveScript($event)"
              />
            </template>
          </el-form-item>
          <el-form-item
            label="运算类型:"
            prop="logicCal">
            <el-select v-model="userRule.logicCal" placeholder="请选择" :disabled="!showLogicCal">
              <el-option
                v-for="item in logicCalTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveExtA1UserRules">确 认</el-button>
      </template>
    </el-dialog>

    <!--人员选择器-->
    <el-dialog
      :visible.sync="showSelectDialog"
      :title="selectDialogTitle"
      width="1000px"
      append-to-body
      @opened="openSelectorModel"
      destroy-on-close>
      <user-selector
        v-if="showSelectDialog && userRule.pluginType == 'users'"
        :init="initSelect"
        ref="userSelector"
        :isProcessAdmin="false"/>
      <role-selector
        v-if="showSelectDialog && userRule.pluginType == 'role'"
        :init="initSelect"
        ref="roleSelector"
      />
      <org-selector
        v-if="showSelectDialog && userRule.pluginType == 'org'"
        :init="initSelect"
        ref="orgSelector"
      />

      <script-selector
        v-if="showSelectDialog && userRule.pluginType == 'userScript'"
        :init="initSelect"
        selection-type="Radio"
        ref="scriptSelector"
      />
      <template #footer>
        <el-button @click="showSelectDialog = false">取 消</el-button>
        <el-button
          @click="saveShowSelectModel"
          type="primary">确 认
        </el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1UserRules, removeExtA1UserRules, saveExtA1UserRules} from '@packages/bo-utils/extA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'
import * as userRuleVars from '@packages/api/UserRuleVars.js'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'
import UserSelector from '@packages/components/Panel/components/SubChild/UserSelector'
import RoleSelector from '@packages/components/Panel/components/SubChild/RoleSelector'
import OrgSelector from '@packages/components/Panel/components/SubChild/OrgSelector'
import ScriptSelector from '@packages/components/Panel/components/SubChild/ScriptSelector'

export default {
    name: 'ElementExtA1UserRule',
    components: {CodeEditorModel, UserSelector, RoleSelector, OrgSelector, ScriptSelector},
    data () {
        let checkRuleId = (rule, value, callback) => {
            if (this.userRule.pluginType == 'users') {
                if (!this.userRule.ruleId || this.userRule.ruleId == '')
                    return callback(new Error('用户规则不能为空'))
            }
            return callback()
        }
        let checkLogicCal = (rule, value, callback) => {
            if (this.showLogicCal) {
                if (!this.userRule.logicCal || this.userRule.logicCal == '')
                    return callback(new Error('运算类型不能为空'))
            }
            return callback()

        }

        return {
            pluginTypeList: [],
            logicCalTypeList: [],
            allUserTaskList: [],
            notActiveNodeUserTaskList: [],
            userRuleList: [],
            userTypeList: [
                {label: '当前登录用户', value: 'currentUser'},
                {label: '发起人', value: 'start'},
                {label: '上一步执行人', value: 'prev'},
                {label: '指定用户', value: 'spec'}
            ],
            showSelectDialog: false,
            showSelectDialogType: '',
            modelVisible: false,
            showLogicCal: false,
            showPluginVal: false,
            // 显示节点人员选择：0-显示选择按钮，1-不显示选择按钮，2-显示相同节点选择，3-代码编辑器
            showSelect: 0,
            selectPluginVal: '',
            selectDialogTitle: '',
            // 特殊处理的类型
            specPluginType: ['depHead', 'lastAduitUserHead', 'lastAduitDepartmentHead'],
            userRule: {
                id: '',
                nodeId: '',
                // 用户节点策略
                pluginType: '',
                // 策略为sameNode时，保存节点id ,
                // 策略为script时，保存脚本变量
                pluginVal: '',
                // 逻辑运算符
                logicCal: '',
                // 当节点策略为user时，指定currentUser，start，prev，spec
                ruleId: '',
                ruleVal: '',
                // 前端展示的值
                ruleDisplayName: '',
                // 保存用户、角色等相关id
                specId: ''
            },
            formRules: {
                pluginType: {required: true, trigger: ['blur', 'change'], message: '处理人类型不能为空'},
                ruleId: {required: true, trigger: ['blur', 'change'], validator: checkRuleId},
                logicCal: {required: true, trigger: ['blur', 'change'], validator: checkLogicCal}
                // callNodes: {required: true, trigger: ['blur', 'change'], validator: checkCallNodes}
            }

        }
    },
    mounted () {
        this.reloadUserRules()
        EventEmitter.on('element-update', this.reloadUserRules)
    },
    methods: {
        openSelectModel () {
            this.showSelectDialog = true
            this.showSelectDialogType = this.userRule.pluginType
        },
        initSelect () {
            if (this.userRule.specId) {
                return this.userRule.specId.split(',').map((item) => {
                    return {
                        id: item
                    }
                })
            }

        },
        openSelectorModel () {
            let element = getActive().businessObject
            if (this.userRule.pluginType == 'users') {
                this.selectDialogTitle = `${element.name}（${element.id}）人员选择`
                this.$refs.userSelector.resetSelectRow()
            } else if (this.userRule.pluginType == 'role') {
                this.selectDialogTitle = `${element.name}（${element.id}）角色选择`
                this.$refs.roleSelector.resetSelectRow()
            } else if (this.userRule.pluginType == 'org') {
                this.selectDialogTitle = `${element.name}（${element.id}）部门选择`
                this.$refs.orgSelector.resetSelectRow()
            } else if (this.userRule.pluginType == 'userScript') {
                this.selectDialogTitle = `${element.name}（${element.id}）人员脚本选择`
                this.$refs.scriptSelector.resetSelectRow()
            }
        },
        saveShowSelectModel () {
            this.showSelectDialog = false
            this.showSelectDialogType = ''

            if (this.userRule.pluginType == 'users') {
                let selectUserList = this.$refs.userSelector.selectUserList
                if (selectUserList && selectUserList.length > 0) {
                    this.userRule.specId = selectUserList.map((item) => item.id).join(',')
                    this.setPluginVal(selectUserList.map((item) => item.userName).join(','))
                }
            } else if (this.userRule.pluginType == 'role') {
                let selectRoleList = this.$refs.roleSelector.selectRoleList
                if (selectRoleList && selectRoleList.length > 0) {
                    this.userRule.specId = selectRoleList.map((item) => item.id).join(',')
                    this.setPluginVal(selectRoleList.map((item) => item.name).join(','))
                }
            } else if (this.userRule.pluginType == 'org') {
                let selectOrgList = this.$refs.orgSelector.selectOrgList
                if (selectOrgList && selectOrgList.length > 0) {
                    this.userRule.specId = selectOrgList.map((item) => item.id).join(',')
                    this.setPluginVal(selectOrgList.map((item) => item.deptName).join(','))
                }
            } else if (this.userRule.pluginType == 'userScript') {
                let selectScriptList = this.$refs.scriptSelector.selectScriptList
                if (selectScriptList && selectScriptList.length > 0) {
                    this.userRule.specId = selectScriptList.map((item) => item.id).join(',')
                    this.setPluginVal(selectScriptList.map((item) => item.scriptName).join(','))
                }
            }
        },
        setPluginVal (newVal) {
            this.userRule.ruleDisplayName = newVal
            // 设置回显
            this.selectPluginVal = this.userRule.ruleDisplayName
        },
        async saveExtA1UserRules () {
            await this.$refs.formRef.validate()
            this.userRule.nodeId = getActive().id
            saveExtA1UserRules(getActive(), this.userRule)
            this.reloadUserRules()
        },
        reloadUserRules () {
            this.modelVisible = false

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
            this.showPluginValSelect()
            if (this.specPluginType.indexOf(val) != -1) {
                let selectPluginType = this.pluginTypeList.filter((item) => item.value == val)[0]
                this.setPluginVal(selectPluginType.tooltip)
            }
        },
        changeRuleId (val) {
            if (this.userRule.ruleId != 'spec') {
                this.userRule.ruleDisplayName = this.userTypeList.filter((item) => item.value == val)[0].label
            }
            this.showPluginValSelect()
        },
        showPluginValSelect () {
            this.showPluginVal = this.userRule.pluginType && this.userRule.pluginType != ''
            if (this.userRule.pluginType == 'users') {
                this.showPluginVal = this.userRule.ruleId == 'spec'
            }

        },
        showUserSelect () {
            this.showSelect = 0
            if (this.userRule) {
                if (this.userRule.pluginType == 'sameNode') {
                    this.showSelect = 2
                } else if (this.specPluginType.indexOf(this.userRule.pluginType) != -1) {
                    this.showSelect = 1
                } else if (this.userRule.pluginType == 'script') {
                    this.showSelect = 3
                }
            }
        },
        saveScript (code) {
            this.userRule.pluginVal = code
            this.setPluginVal(code)
        },
        async openExtA1UserRuleModel (index, row) {
            this.activeIndex = index
            this.userRule = {}
            row && (this.userRule = JSON.parse(JSON.stringify(row)))

            this.notActiveNodeUserTaskList = this.allUserTaskList.filter((item) => item.id != getActive().id)
            if (index == -1) {
                this.showLogicCal = this.userRuleList && this.userRuleList.length > 0
            } else {
                this.showLogicCal = this.userRule.logicCal && this.userRule.logicCal != ''
            }

            this.selectPluginVal = this.userRule.ruleDisplayName ? this.userRule.ruleDisplayName : ''
            this.showUserSelect()
            this.showPluginValSelect()
            this.modelVisible = true
            await this.$nextTick()
            this.$refs.formRef && this.$refs.formRef.clearValidate()
        }
    }
}
</script>

<style scoped>

</style>
