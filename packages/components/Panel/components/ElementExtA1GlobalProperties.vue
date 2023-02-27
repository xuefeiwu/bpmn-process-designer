<template>
  <el-collapse-item
    name="global-info">
    <template #title>
      <collapse-title title="属性配置">
        <lucide-icon name="FolderEdit"/>
      </collapse-title>
    </template>

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
      <el-input
        v-model="properties.subjectRule"
        @change="updateSubjectRule"
      />
    </edit-item>
    <edit-item
      label="流程管理员"
      textAlign="center"
      :labelWidth="120">
      <el-input
        v-model="showProcessAdminName"
        disabled
      >
        <el-button
          slot="append"
          type="primary"
          icon="el-icon-edit"
          @click="modelVisible = true"/>
      </el-input>
    </edit-item>

    <el-dialog
      :visible.sync="modelVisible"
      title="选择流程管理员"
      width="900px"
      append-to-body
      @opened="openProcessAdminModel"
      destroy-on-close>
      <user-selector
        :show-process-admin-name.sync="showProcessAdminName"
        ref="userSelector"
        :isProcessAdmin="true"/>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button
          @click="saveProcessAdminModel"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import EditItem from '@packages/components/common/EditItem'
import {getExtA1Properties, saveExtA1Properties} from '@packages/bo-utils/ExtA1Util'
import UserSelector from '@packages/components/Panel/components/SubChild/UserSelector'
import {getProcessAdmin} from '@packages/bpmn-utils/BpmnDesignerUtils'

export default {
    name: 'ElementGlobalProperties',
    components: {UserSelector, EditItem},
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
    created () {
        this.init()
    },
    mounted () {
        let processAdmin = getProcessAdmin()
        if (processAdmin) {
            this.showProcessAdminName = JSON.parse(processAdmin).map((item)=>item.userName).join(',')
        }
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

            this.properties.parameterUserAssign = parameterUserAssign
            this.properties.subjectRule = subjectRule
            if (propSkipRules && propSkipRules!='') {
                this.propSkipRulesValue = propSkipRules.split(',')
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
            let skipRules  = ''
            if (value) {
                skipRules = value.join(',')
            }
            this.properties.propSkipRules = skipRules
            saveExtA1Properties(this.properties)
        },
        updateSubjectRule (value) {
            let subjectRule  = '${title}'
            if (value && value!='') {
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
            this.$refs.userSelector.saveProcessAdminModel()
        }
    }
}
</script>

<style scoped>
</style>
