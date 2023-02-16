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
import {notEmpty} from '@utils/tool'

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
            sequenceFlowIds: [],
            auditHistoryList: []
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
        /**
         * 获取元素节点
         * @param elementRegistry
         * @param nodeId
         * @returns {*}
         */
        getElement (elementRegistry, nodeId) {
            return elementRegistry.filter(
                (item) => item.id == nodeId
            )
        },
        /**
         * 设置节点颜色
         * @param modeling
         * @param color
         */
        setColor (modeling, element, color) {
            modeling.setColor(element, {
                stroke: color
            })
        },
        reloadProcess: debounce(async function (setting, oldSetting) {
            const modelerModules = moduleAndExtensions(setting)
            await this.$nextTick()
            const modeler = initModeler(this.$refs.designerRef, modelerModules, this)
            if (this.xml) {
                await createNewDiagram(modeler, this.xml, setting)
            } else {
                await createNewDiagram(modeler)
            }

            const elementRegistry = modeler.get('elementRegistry')
            const modeling = modeler.get('modeling')

            // 设置已完成的线条颜色
            if (this.sequenceFlowIds && this.sequenceFlowIds.length > 0) {
                this.sequenceFlowIds.forEach(value => {
                    const _element = this.getElement(elementRegistry, value)
                    this.setColor(modeling, _element, 'limegreen')
                })
            }

            // 设置已完成和未完成的节点颜色
            if (this.auditHistoryList && this.auditHistoryList.length > 0) {
                this.auditHistoryList.forEach(item => {
                    var _element = this.getElement(elementRegistry, item.nodeKey)
                    if (item.type == 'startEvent' || item.type == 'endEvent') {
                        this.setColor(modeling, _element, 'rgb(248, 152, 0)')

                    } else if (item.type == 'userTask' || item.type == 'businessRuleTask' || item.type == 'serviceTask') {
                        if (!notEmpty(item.completeTime)) {
                            this.setColor(modeling, _element, 'rgb(255, 0, 0)')
                        } else {
                            this.setColor(modeling, _element, '#3366ff')
                        }
                    }
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
                        this.auditHistoryList = res.data
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
