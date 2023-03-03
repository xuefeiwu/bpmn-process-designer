<template>
  <el-collapse-item name="element_ext_a1_event_script">
    <template #title>
      <collapse-title title="事件脚本">
        <lucide-icon name="Command"/>
      </collapse-title>
    </template>
    <div class="element_ext_a1_event_script">
      <edit-item
        label="前置事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="前置事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.previous"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'previous')"
        />
      </edit-item>
      <edit-item
        label="后置事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="后置事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.complete"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'complete')"
        />
      </edit-item>
      <edit-item
        label="作废事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="作废事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.invalid"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'invalid')"
        />
      </edit-item>
      <edit-item
        label="撤销事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="撤销事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.revoke"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'revoke')"
        />
      </edit-item>
      <edit-item
        label="回退事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="回退事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.backToNode"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'backToNode')"
        />
      </edit-item>
      <edit-item
        label="特事特办事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="特事特办事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.transactionUrge"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'transactionUrge')"
        />
      </edit-item>
      <edit-item
        label="删除事件"
        textAlign="center"
        :labelWidth="100">
        <code-editor-model
          title="删除事件脚本设置"
          :code-language="codeLanguage"
          :code-string="eventScript.deleted"
          :readOnly="false"
          @handleSureClick="saveEventScript($event,'deleted')"
        />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script>
import CodeEditorModel from '@packages/components/common/CodeEditorModel'
import {getExtA1CommonScripts, saveExtA1CommonScripts} from '@packages/bo-utils/extA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'

export default {
    name: 'ElementExtA1EventScript',
    components: {CodeEditorModel},
    data () {
        return {
            codeLanguage: 'groovy',
            eventScript: {
                id: '',
                nodeId: '',
                previous: '',
                complete: '',
                invalid: '',
                revoke: '',
                backToNode: '',
                transactionUrge: '',
                deleted: ''
            }
        }
    },
    mounted () {
        this.reloadEventScript()
        EventEmitter.on('element-update', this.reloadEventScript)
    },
    methods: {
        reloadEventScript () {
            this.eventScript = {}
            this.eventScript.nodeId = getActive().id
            let eventScriptList = getExtA1CommonScripts((index, item) => item.nodeId == getActive().id)
            if (eventScriptList && eventScriptList.length > 0) {
                let eventScript = eventScriptList[0]
                this.eventScript.id = eventScript.id
                this.eventScript.previous = eventScript.previous
                this.eventScript.complete = eventScript.complete
                this.eventScript.invalid = eventScript.invalid
                this.eventScript.revoke = eventScript.revoke
                this.eventScript.backToNode = eventScript.backToNode
                this.eventScript.transactionUrge = eventScript.transactionUrge
                this.eventScript.deleted = eventScript.deleted
            }
        },
        saveEventScript (code, fieldName) {
            this.eventScript[fieldName] = code
            this.eventScript.nodeId = getActive().id
            saveExtA1CommonScripts(getActive(), this.eventScript)
            this.reloadEventScript()
        }
    }
}
</script>

<style scoped>

</style>
