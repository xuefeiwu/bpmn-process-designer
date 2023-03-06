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
import {getParamter} from '@utils/request'

export default {
    name: 'BpmnDesigner',
    data () {
        return {
            modelerModules: {},
            modeler: {},
            elementRegistry: {},
            eventBus: {},
            xml: '',
            modelId: '',
            processAdminList: [
                {'id': '1286142373594481852', 'userName': '管理员'},
                {'id': '1387731059465973761', 'userName': '陈梓宏'},
                {'id': '1387731059482750979', 'userName': '陈土强'},
                {'id': '1387731059503722498', 'userName': '李权力'}
            ]
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
        async reloadProcess () {
            await createNewDiagram(this.modeler, this.xml, this.getEditor)
        },
        /**
         * 加载流程图
         * @returns {Promise<void>}
         */
        async getProcessModel () { // 该方法模拟请求后台获取bpmn文件地址
            if (!this.modelId) {
                return
            }

            await loadProcessModel(this.modelId).then((res) => {
                if (res.code == '0') {
                    this.xml = res.xml
                }
            }).finally(() => {
            })
        }
    },
    async created () {
        let token = getParamter('messageId')
        this.$store.commit('setToken', token)

        this.modelId = getParamter('id')

        await this.getProcessModel()
        this.modelerModules = moduleAndExtensions(this.getEditor)
        this.modeler = initModeler(this.$refs.designerRef, this.modelerModules, this)
        this.elementRegistry = this.modeler.get('elementRegistry')
        this.eventBus = this.modeler.get('eventBus')

        await this.reloadProcess()


        this.$store.commit('setProcessModel', {
            processAdmin: JSON.stringify(this.processAdminList)
        })
    }
}
</script>
