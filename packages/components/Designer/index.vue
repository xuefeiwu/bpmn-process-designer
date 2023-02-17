<template>

  <div
    :class="['bpmn-designer', bgClass]"
    ref="designerRef">

    <node-audit-history-tip
      v-if="showNodeAuditHistoryTip"
      :offset-x="offsetX"
      :offset-y="offsetY"/>
  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import {createNewDiagram} from '@utils/xml'
import moduleAndExtensions from './moduleAndExtensions'
import initModeler from './initModeler'
import {loadProcessHistory, loadProcessModel} from '../../../api/process'
import {notEmpty} from '@utils/tool'
import NodeAuditHistoryTip from '@packages/components/Designer/components/NodeAuditHistoryTip'

export default {
    name: 'BpmnDesigner',
    components: {NodeAuditHistoryTip},
    data () {
        return {
            modelerModules: {},
            modeler: {},
            elementRegistry: {},
            eventBus: {},
            xml: '',
            instId: '',
            processInstanceModelId: '',
            token: '',
            modelId: '',
            headParams: {},
            sequenceFlowIds: [],
            auditHistoryList: [],
            showNodeAuditHistoryTip: false,
            offsetX: 0,
            offsetY: 0
        }
    },
    computed: {
        ...mapGetters(['getEditor', 'getModeling']),
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
         * @param
         * @param nodeId
         * @returns {*}
         */
        getElement (nodeId) {
            return this.elementRegistry.filter(
                (item) => item.id == nodeId
            )
        },
        /**
         * 设置节点颜色
         * @param modeling
         * @param color
         */
        setColor (element, color) {
            this.getModeling.setColor(element, {
                stroke: color
            })
        },
        async reloadProcess () {
            if (this.xml) {
                await createNewDiagram(this.modeler, this.xml, this.getEditor)
            } else {
                await createNewDiagram(this.modeler)
            }

            let runningNodeList = new Array()

            // 设置已完成的线条颜色
            if (this.sequenceFlowIds && this.sequenceFlowIds.length > 0) {
                this.sequenceFlowIds.forEach(value => {
                    const _element = this.getElement(value)
                    this.setColor(_element, 'limegreen')
                })
            }
            // 设置已完成和未完成的节点颜色
            if (this.auditHistoryList && this.auditHistoryList.length > 0) {
                this.auditHistoryList.forEach(item => {
                    var _element = this.getElement(item.nodeKey)
                    if (item.type == 'startEvent' || item.type == 'endEvent') {
                        this.setColor(_element, 'rgb(248, 152, 0)')

                    } else if (item.type == 'userTask' || item.type == 'businessRuleTask' || item.type == 'serviceTask') {
                        if (!notEmpty(item.completeTime)) {
                            this.setColor( _element, 'rgb(255, 0, 0)')
                            runningNodeList.push(item.nodeKey)
                        } else {
                            this.setColor(_element, '#3366ff')
                        }
                    }
                })
            }
            // 设置节点滚动
            this.setScroll(runningNodeList)

            // 注册点击事件
            this.registerHoverEvent()
        },
        /**
         * 鼠标焦点事件
         */
        registerHoverEvent () {
            let nodeTypeList = ['bpmn:UserTask', 'bpmn:BusinessRuleTask', 'bpmn:ServiceTask', 'bpmn:StartEvent', 'bpmn:EndEvent']
            const that = this
            this.eventBus.on('element.hover', function (e) {
                const element = e.element
                if (nodeTypeList.indexOf(element.type) != -1) {
                    that.showAuditHistoryTip(element, e.originalEvent.offsetX, element.y)
                }
            })

            this.eventBus.on('element.out', function (e) {
                const element = e.element
                if (nodeTypeList.indexOf(element.type) != -1) {
                    that.showNodeAuditHistoryTip = false
                }
            })
        },
        /**
         * 显示审批历史
         */
        showAuditHistoryTip (element, offsetX, offsetY) {
            if (element.type != 'bpmn:StartEvent' && element.type != 'bpmn:UserTask') {
                return
            }

            if (this.auditHistoryList && this.auditHistoryList.length > 0) {
                let currentNodeHistoryList = this.auditHistoryList.filter(item => item.nodeKey == element.id)
                console.log(currentNodeHistoryList)
                if (currentNodeHistoryList && currentNodeHistoryList.length > 0) {
                    this.offsetX = (offsetX + 90) + 'px'
                    this.offsetY = (offsetY - 90) + 'px'
                    this.showNodeAuditHistoryTip = true
                }
            }
        },
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
        /**
         * 设置节点滚动
         */
        setScroll (runningNodeList) {
            // 当前节点滚动闪烁
            let djsShapeList = document.getElementsByClassName('djs-shape')
            for(let djs of djsShapeList){
                let nodeId = djs.getAttribute('data-element-id')
                if (runningNodeList.indexOf(nodeId) != -1) {
                    let children = djs.firstChild
                    children.classList.add('node')
                    children.firstChild.setAttribute('stroke-dasharray', '4,4')
                }
            }
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
    async created () {
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

        this.modelerModules = moduleAndExtensions(this.getEditor)
        this.modeler = initModeler(this.$refs.designerRef, this.modelerModules, this)
        this.elementRegistry = this.modeler.get('elementRegistry')
        this.eventBus = this.modeler.get('eventBus')
        await this.reloadProcess()
        this.modeler.get('canvas').zoom('fit-viewport', 'auto')//画布自适应居中
    }
}
</script>
