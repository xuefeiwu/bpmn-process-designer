<template>
  <el-button type="primary" @click="saveBpmn">保 存</el-button>
</template>

<script>

import {getModeler, getProcessAdmin, getProcessModel} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {getDocumentValue} from '@packages/bo-utils/documentationUtil'
import {getNameValue} from '@packages/bo-utils/nameUtil'
import {mapGetters} from 'vuex'
import {saveProcessModel} from '@packages/api/process'

export default {
    name: 'BpmnSave',
    computed: {
        ...mapGetters(['getModeler']),
        modelTitle () {
            return this.codeLanguage === 'xml' ? '预览 XML' : '预览 JSON'
        }
    },
    methods: {
        async saveBpmn () {
            const modeler = getModeler()
            if (!modeler) {
                return
            }

            let processElement = modeler.get('elementRegistry')?.find((el) => el.type === 'bpmn:Process')

            let rootElement = processElement.businessObject.$parent
            rootElement.targetNamespace = processElement.id
            rootElement.modelId = getProcessModel().modeId

            const {xml} = await this.getModeler.saveXML({format: true, preamble: true})
            let desc = getDocumentValue(processElement) || ''
            let name = getNameValue(processElement) || ''
            const body = {
                xml: xml,
                designer: 'A1',
                modelKey: getProcessModel().modelKey,
                modelType: getProcessModel().modelType,
                modelError: 0,
                name: name,
                description: desc,
                modelId: getProcessModel().modeId,
                adminInfo: getProcessAdmin()
            }

            saveProcessModel(body)
        }
    }
}
</script>
