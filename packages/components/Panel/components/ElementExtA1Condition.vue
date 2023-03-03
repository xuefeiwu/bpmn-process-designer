<template>
  <el-collapse-item name="element_ext_a1_condition">
    <template #title>
      <collapse-title title="分支条件">
        <lucide-icon name="FolderEdit"/>
      </collapse-title>
      <number-tag
        :value="outgoingList.length"
        margin-left="12px"/>
    </template>

    <div class="element_ext_a1_condition">
      <el-table
        border
        :data="outgoingList"
        style="width: 100%"
        height="200px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          label="目标节点"
          prop="targetElementName"
          align="center"
          width="120"
          show-overflow-tooltip/>
        <el-table-column
          label="表达式"
          prop="conditionExpression"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <code-editor-model
              :key="row.id"
              :title="'【' + row.targetElementName + '-'+ row.targetElementId +'】分支条件设置'"
              :code-string="row.conditionExpression"
              :readOnly="false"
              @handleSureClick="saveConditionExpression($event,row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-collapse-item>
</template>

<script>
import EventEmitter from '@utils/EventEmitter'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'
import {setConditionExpressionValue} from '@packages/bo-utils/conditionUtil'
import {getElementById} from '@packages/bo-utils/extA1ElementUtils'

export default {
    name: 'ElementExtA1Condition',
    components: {CodeEditorModel},
    data () {
        return {
            outgoingList: []
        }
    },
    mounted () {
        this.reloadAllOutgoing()
        EventEmitter.on('element-update', this.reloadAllOutgoing)
    },
    methods: {
        reloadAllOutgoing () {
            let element = getActive()
            this.outgoingList = []
            element.outgoing.forEach((item) => {
                if (item.target) {
                    this.outgoingList.push({
                        id: item.id,
                        targetElementName: item.target.businessObject.name,
                        targetElementId: item.target.businessObject.id,
                        conditionExpression: (item.businessObject && item.businessObject.conditionExpression) ? item.businessObject.conditionExpression.body : ''
                    })
                }
            })
        },
        saveConditionExpression (code, row) {
            row.conditionExpression = code
            // 设置表达式
            let sequenceFlow = getElementById(row.id)
            setConditionExpressionValue(sequenceFlow, code)
        }
    }
}
</script>

<style scoped>

</style>
