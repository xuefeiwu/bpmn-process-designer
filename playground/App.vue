<template>
  <div id="app">
    <!--<bpmn-toolbar v-if="getEditorConfig.toolbar" />-->
    <div class="main-content">
      <bpmn-designer :xml.sync="xmlString"/>
      <!--<bpmn-panel v-if="getEditorConfig.penalMode === 'custom'" />-->
      <!--<div-->
      <!--  v-else-->
      <!--  class="camunda-panel"-->
      <!--  id="camunda-panel"></div>-->
    </div>

    <!--<bpmn-settings />-->
    <!--<bpmn-context-menu />-->
  </div>
</template>

<script>
import BpmnDesigner from '../packages/components/Designer'
import BpmnSettings from '../packages/components/Settings'
import {mapGetters} from 'vuex'
import BpmnToolbar from '../packages/components/Toolbar'
import BpmnContextMenu from '@packages/components/ContextMenu/ContextMenu'
import BpmnPanel from '@packages/components/Panel'
import diagramXML from '@packages/default/newDiagram.bpmn'

export default {
    name: 'App',
    components: {BpmnPanel, BpmnContextMenu, BpmnToolbar, BpmnSettings, BpmnDesigner},
    data () {
        return {
            xmlString: undefined
        }
    },
    computed: {
        ...mapGetters(['getEditorConfig'])
    },
    mounted () {
        const instId = this.getParamter('instId')
        const processInstanceModelId = this.getParamter('processInstanceModelId')
        const messageId = this.getParamter('messageId')
        const modeId = this.getParamter('modeId')

        console.log(instId, processInstanceModelId, messageId, modeId)
        if (diagramXML && !this.xmlString) {
            this.xmlString = diagramXML
        }
        document.body.addEventListener('contextmenu', function (ev) {
            ev.preventDefault()
        })
    },
    methods: {
        /**
         * 获取请求参数
         * @param name
         * @returns {string|null}
         */
        getParamter (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var params = window.location.search.substr(1).match(reg)
            if (params != null) return unescape(params[2])
            return null
        }
    }
}
</script>
