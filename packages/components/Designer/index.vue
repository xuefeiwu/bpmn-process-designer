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
            xml: '',
            instId: '',
            processInstanceModelId: '',
            token: '',
            modelId: '',
            headParams: {},
            sequenceFlowIds: []
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

            if (this.sequenceFlowIds && this.sequenceFlowIds.length > 0) {
                // 设置已完成的线条颜色
                this.sequenceFlowIds.forEach(value => {
                    const elementRegistry = modeler.get('elementRegistry')
                    const sequenceFlowList = elementRegistry.filter(
                        (item) => item.id == value
                    )

                    const modeling = modeler.get('modeling')
                    modeling.setColor(sequenceFlowList, {
                        stroke: 'limegreen'
                    })
                })
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
            if (this.instId || this.processInstanceModelId) {
                await loadProcessHistory(
                    this.instId,
                    this.processInstanceModelId,
                    this.headParams
                ).then((res) => {
                    if (res.code == '0') {
                        this.xml = res.XML
                        this.sequenceFlowIds = res.sequenceFlowIds
                    }
                }).finally(() => {
                })
            } else if (this.modelId) {
                await loadProcessModel(this.modelId, this.headParams).then((res) => {
                    if (res.code == '0') {
                        this.xml = res.xml
                    }
                }).finally(() => {
                })
            }
        }
    },
    watch: {
        getEditor: {
            immediate: true,
            deep: true,
            handler: async function (value, oldValue) {
                try {
                    this.instId = this.getParamter('instId')
                    this.processInstanceModelId = this.getParamter('processInstanceModelId')
                    this.token = this.getParamter('messageId')
                    this.modelId = this.getParamter('modelId')

                    this.headParams = {
                        headers: {
                            'x-access-token': this.token
                        }
                    }

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
