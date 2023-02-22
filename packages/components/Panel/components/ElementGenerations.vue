<template>
  <el-collapse-item name="base-info">
    <template #title>
      <collapse-title title="基本信息">
        <lucide-icon name="Info" />
      </collapse-title>
    </template>

    <edit-item :label="isProcess ? '流程Id' : '节点Id'">
      <el-input
        v-model="elementId"
        disabled
        maxlength="32"
        @change="updateElementId" />
    </edit-item>

    <edit-item :label="isProcess ? '流程名称' : '节点名称'">
      <el-input
        v-model="elementName"
        maxlength="20"
        :disabled="isProcess"
        @change="updateElementName" />
    </edit-item>

    <template v-if="isProcess">
      <edit-item
        label="流程描述">
        <el-input
          v-model="elementDoc"
          type="textarea"
          @change="updateElementDoc" />
      </edit-item>
    </template>
  </el-collapse-item>
</template>

<script>
import { catchError } from '@utils/printCatch'
import { getNameValue, setNameValue } from '@packages/bo-utils/nameUtil'
import {
    getProcessExecutable,
    getProcessVersionTag,
    setProcessExecutable,
    setProcessVersionTag
} from '@packages/bo-utils/processUtil'
import { setIdValue } from '@packages/bo-utils/idUtil'
import EventEmitter from '@utils/EventEmitter'
import { getActive } from '@packages/bpmn-utils/BpmnDesignerUtils'
import {getDocumentValue, setDocumentValue} from '@packages/bo-utils/documentationUtil'

export default {
    name: 'ElementGenerations',
    data () {
        return {
            elementId: '',
            elementName: '',
            elementDoc: '',
            elementVersion: '',
            elementExecutable: true,
            isProcess: false
        }
    },

    mounted () {
        this.reloadGenerationData()
        EventEmitter.on('element-update', this.reloadGenerationData)
    },
    methods: {
        reloadGenerationData () {
            this.isProcess = !!getActive() && getActive().type === 'bpmn:Process'
            this.elementId = getActive().id
            this.elementName = getNameValue(getActive()) || ''
            if (this.isProcess) {
                this.elementExecutable = getProcessExecutable(getActive())
                this.elementVersion = getProcessVersionTag(getActive()) || ''
                this.elementDoc = getDocumentValue(getActive()) || ''
            }
        },
        updateElementDoc (value) {
            setDocumentValue(getActive(), value)
        },
        updateElementName (value) {
            setNameValue(getActive(), value)
        },
        updateElementId (value) {
            setIdValue(getActive(), value)
        },
        updateElementVersion (value) {
            const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/
            if (reg.test(value)) {
                setProcessVersionTag(getActive(), value)
            } else {
                catchError('版本号必须符合语义化版本2.0.0 要点')
            }
        },
        updateElementExecutable (value) {
            setProcessExecutable(getActive(), value)
        }
    }
}
</script>
