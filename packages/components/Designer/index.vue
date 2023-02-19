<template>
  <div
    :class="['bpmn-designer', bgClass]"
    ref="designerRef">
  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import {createNewDiagram} from '@utils/xml'
import moduleAndExtensions from './moduleAndExtensions'
import initModeler from './initModeler'
import {loadProcessModel} from '../../api/process'

export default {
    name: 'BpmnDesigner',
    data () {
        return {
            modelerModules: {},
            modeler: {},
            elementRegistry: {},
            eventBus: {},
            xml: '',
            token: '',
            modelId: '',
            headParams: {}
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
            await createNewDiagram(this.modeler, this.xml, this.getEditor)
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
         * 加载流程图
         * @returns {Promise<void>}
         */
        async getProcessModel () { // 该方法模拟请求后台获取bpmn文件地址
            if (!this.modelId) {
                return
            }

            await loadProcessModel(this.modelId, this.headParams).then((res) => {
                if (res.code == '0') {
                    this.xml = res.xml
                }
            }).finally(() => {
            })
        }
    },
    async created () {
        this.token = this.getParamter('messageId')
        this.modelId = this.getParamter('modelId')

        this.headParams = {
            headers: {
                'x-access-token': this.token
            }
        }

        await this.getProcessModel()
        this.modelerModules = moduleAndExtensions(this.getEditor)
        this.modeler = initModeler(this.$refs.designerRef, this.modelerModules, this)
        this.elementRegistry = this.modeler.get('elementRegistry')
        this.eventBus = this.modeler.get('eventBus')

        this.modeler.on('shape.added', e=>{
            var shape = e.element ? this.elementRegistry.get(e.element.id) : e.shape
            console.log('shape.added===>', shape)
        })
        await this.reloadProcess()
    }
}
</script>
