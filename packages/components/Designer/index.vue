<template>
  <div
    :class="['bpmn-designer', bgClass]"
    ref="designerRef"></div>
</template>

<script>
import { debounce } from 'min-dash'
import { mapGetters } from 'vuex'
import { createNewDiagram } from '@utils/xml'
import { catchError } from '@utils/printCatch'
import moduleAndExtensions from './moduleAndExtensions'
import initModeler from './initModeler'
import {loadProcessHistory, loadProcessModel} from '../../../api/process'

export default {
    name: 'BpmnDesigner',
    data () {
        return {
            xml: undefined
        }
    },
    computed: {
        ...mapGetters(['getEditor', 'getModeler', 'getModeling']),
        bgClass () {
            const bg = this.getEditor.bg
            if (bg === 'grid-image') return 'designer-with-bg'
            if (bg === 'image') return 'designer-with-image'
            return ''
        }
    },
    methods: {
        reloadProcess: debounce(async function (setting, oldSetting) {
            const modelerModules = moduleAndExtensions(setting)
            await this.$nextTick()
            const modeler = initModeler(this.$refs.designerRef, modelerModules, this)
            if (this.xml) {
                await createNewDiagram(modeler, this.xml, setting)
            } else {
                await createNewDiagram(modeler)
            }
        }, 100),

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
        },

        async getProcessHistory () { // 该方法模拟请求后台获取bpmn文件地址
            const instId = this.getParamter('instId')
            const processInstanceModelId = this.getParamter('processInstanceModelId')
            const messageId = this.getParamter('messageId')
            const modelId = this.getParamter('modelId')

            const headParams = {
                headers: {
                    'x-access-token': messageId
                }
            }

            let remoteXML = ''
            if (instId || processInstanceModelId) {
                await loadProcessHistory(
                    instId,
                    processInstanceModelId,
                    headParams
                ).then((res) => {
                    if (res.code == '0') {
                        remoteXML = res.XML
                    }
                }).finally(() => {
                })
            }

            if (modelId) {
                await loadProcessModel(modelId, headParams).then((res) => {
                    if (res.code == '0') {
                        remoteXML = res.xml
                    }
                }).finally(() => {
                })
            }

            this.xml = remoteXML
        }
    },
    watch: {
        getEditor: {
            immediate: true,
            deep: true,
            handler: async function (value, oldValue) {
                try {
                    await this.getProcessHistory()
                    this.reloadProcess(value, oldValue)
                } catch (e) {
                    catchError(e)
                }
            }
        }
    }
}
</script>
