<template>
  <div
    :class="['bpmn-designer', bgClass]"
    ref="designerRef">
  </div>

</template>

<script>
import {debounce} from 'min-dash'
import {mapGetters} from 'vuex'
import {createNewDiagram} from '@utils/xml'
import moduleAndExtensions from './moduleAndExtensions'
import initModeler from './initModeler'
import {loadProcessModel} from '../../api/process'
import {getParamter} from '@utils/request'
import {catchError} from '@utils/printCatch'

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
        },

        reloadProcess: debounce(async function (setting, oldSetting) {
            const modelerModules = moduleAndExtensions(setting)
            let token = getParamter('messageId')
            this.$store.commit('setToken', token)
            this.modelId = getParamter('id')
            await this.getProcessModel()

            await this.$nextTick()
            this.modeler = initModeler(this.$refs.designerRef, modelerModules, this)
            this.elementRegistry = this.modeler.get('elementRegistry')
            this.eventBus = this.modeler.get('eventBus')

            await createNewDiagram(this.modeler, this.xml, setting)

            this.$store.commit('setProcessModel', {
                processAdmin: JSON.stringify(this.processAdminList)
            })
        }, 100)
    },
    watch: {
        getEditor: {
            immediate: true,
            deep: true,
            handler: async function (value, oldValue) {
                try {
                    this.reloadProcess(value, oldValue)
                } catch (e) {
                    catchError(e)
                }
            }
        }
    }
}
</script>
