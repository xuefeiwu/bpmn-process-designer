<template>
  <el-collapse-item
    name="global-info">
    <template #title>
      <collapse-title title="基本属性配置">
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
        maxlength="32"
        @change="updateSubjectRule"
      />
    </edit-item>
  </el-collapse-item>
</template>

<script>
import EditItem from '@packages/components/common/EditItem'
import {getExtA1Properties, saveExtA1Properties} from '@packages/bo-utils/ExtA1Util'

export default {
    name: 'ElementGlobalProperties',
    components: {EditItem},
    data () {
        return {
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
            console.log('propSkipRules', propSkipRules)
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
        }
    }
}
</script>

<style scoped>
</style>
