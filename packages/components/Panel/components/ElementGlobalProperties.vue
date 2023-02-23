<template>
  <el-collapse-item name="global-info">
    <template #title>
      <collapse-title title="全局属性">
        <lucide-icon name="FolderEdit" />
      </collapse-title>
    </template>

    <edit-item
      label="跳过第一个任务"
      textAlign="center"
      :labelWidth="120">
      <el-switch
        v-model="parameterUserAssign"
        active-value="prop_skipFirstNode"
        @change="updateSkipFirstNode"
      >
      </el-switch>
    </edit-item>
    <edit-item
      label="任务跳过策略"
      textAlign="center"
      :labelWidth="120">
      <el-input
        disabled
        maxlength="32"/>
    </edit-item>
    <edit-item
      label="流程标题"
      textAlign="center"
      :labelWidth="120">
      <el-input
        disabled
        maxlength="32"/>
    </edit-item>
  </el-collapse-item>
</template>

<script>
import EditItem from '@packages/components/common/EditItem'
import {saveSkipFirstNode} from '@packages/bo-utils/ExtPropertiesUtil'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
export default {
    name: 'ElementGlobalProperties',
    components: {EditItem},
    data () {
        return {
            parameterUserAssign: ''
        }
    },
    methods: {
        updateSkipFirstNode (value) {
            saveSkipFirstNode(getActive(), value)
        }
    }
}
</script>

<style scoped>
</style>
