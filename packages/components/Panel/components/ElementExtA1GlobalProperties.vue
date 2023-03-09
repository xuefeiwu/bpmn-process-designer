<template>
  <el-collapse-item
    name="global-info">
    <template #title>
      <collapse-title title="属性配置">
        <lucide-icon name="FolderEdit"/>
      </collapse-title>
    </template>

    <div class="global-info">
      <edit-item
        label="跳过第一个任务"
        textAlign="center"
        :labelWidth="120">
        <el-switch
          v-model="properties.parameterUserAssign"
          active-value="prop_skipFirstNode"
          @change="updateSkipFirstNode"
        >
        </el-switch>
      </edit-item>
      <edit-item
        label="任务跳过策略"
        textAlign="center"
        :labelWidth="120">
        <el-select
          v-model="propSkipRulesValue"
          multiple
          placeholder="请选择"
          @change="updateSkipRules"
        >
          <el-option
            v-for="item in propSkipRulesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </edit-item>
      <edit-item
        label="流程标题"
        textAlign="center"
        :labelWidth="120">
        <!--<el-input-->
        <!--  v-model="properties.subjectRule"-->
        <!--  @change="updateSubjectRule"-->
        <!--/>-->
        <code-editor-model
          title="流程标题设置"
          :code-string="properties.subjectRule"
          code-language="processInner"
          :readOnly="false"
          :show-props-button="true"
          @handleSureClick="updateSubjectRule($event,properties.subjectRule)"
        />
      </edit-item>
      <edit-item
        label="流程管理员"
        textAlign="center"
        :labelWidth="120">
        <el-input
          v-model="showProcessAdminName"
          readonly
        >
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-edit"
            @click="modelVisible = true"/>
        </el-input>
      </edit-item>
    </div>


    <el-dialog
      :visible.sync="modelVisible"
      title="选择流程管理员"
      width="900px"
      append-to-body
      @opened="openProcessAdminModel"
      destroy-on-close>
      <user-selector
        :init="initProcessAdmin"
        :update-show-name="updateShowProcessAdminName"
        ref="userSelector"
        :isProcessAdmin="true"/>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button
          @click="saveProcessAdminModel"
          type="primary">确 认
        </el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import EditItem from '@packages/components/common/EditItem'
import {getExtA1Properties, saveExtA1Properties} from '@packages/bo-utils/extA1Util'
import UserSelector from '@packages/components/Panel/components/SubChild/UserSelector'
import {getProcessAdmin} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'

export default {
    name: 'ElementGlobalProperties',
    components: {UserSelector, EditItem, CodeEditorModel},
    data () {
        return {
            modelVisible: false,
            showProcessAdminName: '',
            propSkipRulesValue: '',
            propSkipRulesOptions: [
                {label: '相同执行人跳过', value: 'sameUser'},
                {label: '处理人为空跳过', value: 'emptyUser'}
            ],
            properties: {
                parameterUserAssign: '',
                subjectRule: '',
                description: '',
                propNotifyType: '',
                propSkipRules: '',
                propDateType: '',
                dateTypeDay: '',
                dateTypeHour: '',
                dateTypeMinute: '',
                startMethod: ''
            }
        }
    },
    mounted () {
        this.init()
        EventEmitter.on('element-update', this.init)
    },
    methods: {
        init () {
            let xmlProperties = getExtA1Properties()
            if (!xmlProperties) {
                return
            }
            let {
                parameterUserAssign,
                subjectRule,
                propSkipRules
            } = xmlProperties

            this.properties.parameterUserAssign = parameterUserAssign || 'prop_skipFirstNode'
            this.properties.subjectRule = subjectRule
            if (propSkipRules && propSkipRules != '') {
                this.propSkipRulesValue = propSkipRules.split(',')
            }

            let processAdmin = getProcessAdmin()
            if (processAdmin) {
                this.showProcessAdminName = processAdmin.map((item) => item.userName).join(',')
            }
        },

        initProcessAdmin () {
            let processAdmin = getProcessAdmin()
            if (processAdmin) {
                return processAdmin
            }
        },
        updateSkipFirstNode (value) {
            if (value != 'prop_skipFirstNode') {
                value = ''
            }
            this.properties.parameterUserAssign = value
            saveExtA1Properties(this.properties)
        },
        updateSkipRules (value) {
            let skipRules = ''
            if (value) {
                skipRules = value.join(',')
            }
            this.properties.propSkipRules = skipRules
            saveExtA1Properties(this.properties)
        },
        updateSubjectRule (value) {
            console.log(value)
            let subjectRule = '${title}'
            if (value && value != '') {
                subjectRule = value
            }
            this.properties.subjectRule = subjectRule
            saveExtA1Properties(this.properties)
        },
        openProcessAdminModel () {
            this.$refs.userSelector.resetSelectRow()
        },
        saveProcessAdminModel () {
            this.modelVisible = false
            this.updateShowProcessAdminName()
            this.$store.commit('setProcessModel', {
                processAdmin: this.$refs.userSelector.selectUserList
            })
        },
        updateShowProcessAdminName () {
            this.showProcessAdminName = this.$refs.userSelector.selectUserList.map((item) => item.userName).join(',')
        }
    }
}
</script>

<style scoped>
</style>
