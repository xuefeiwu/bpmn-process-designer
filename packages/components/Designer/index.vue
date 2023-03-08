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
            modelKey: '',
            modelType: '',
            processAdminList: []
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
                    this.processAdminList = []
                    if (res.data.adminInfo && res.data.adminInfo != '') {
                        let adminInfoObject = JSON.parse(res.data.adminInfo)
                        if (this.isFunction(adminInfoObject)) {
                            this.processAdminList = [adminInfoObject]
                        } else if (this.isArray(adminInfoObject)) {
                            this.processAdminList = adminInfoObject
                        }
                    }
                    this.modelKey = res.data.modelKey
                    this.modelType = res.data.modelType
                } else {
                    this.$message.error(res.message)
                }
            }).finally(() => {
            })
        },
        isFunction (object) {
            return Object.prototype.toString.call(object) === '[object Function]'
        },
        isArray (object) {
            return Object.prototype.toString.call(object) === '[object Array]'
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
                modelKey: this.modelKey,
                modelType: this.modelType,
                modeId: this.modelId,
                processAdmin: this.processAdminList
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
