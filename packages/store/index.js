import Vue from 'vue'
import Vuex from 'vuex'
import { defaultSettings } from '../preset-configuration/editor.config'
import { unObserver } from '@utils/tool'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        model: {},
        editor: { ...defaultSettings },
        bpmn: {}
    },
    getters: {
    //  editor
        getEditor: (state) => state.editor,
        getProcessDef: (state) => ({
            processName: state.editor.processName,
            processId: state.editor.processId
        }),
        getProcessModel: (state) => ({
            processName: state.model.processName,
            processId: state.model.processId,
            processAdmin: state.model.processAdmin
        }),
        getProcessEngine: (state) => state.editor.processEngine,
        getEditorConfig: (state) => {
            return Object.keys(state.editor).reduce((config, key) => {
                if (!['processName', 'processId', 'processEngine'].includes(key)) {
                    config[key] = state.editor[key]
                }
                return config
            }, {})
        },

        // modeler
        getModeler: (state) => state.bpmn._modeler,
        getModeling: (state) => (state.bpmn._modeler ? state.bpmn._modeler.get('modeling') : undefined),
        getActive: (state) => state.bpmn.activeElement
    },
    mutations: {
        // model
        setProcessModel (state, model) {
            state.model = {...state.model, ...model}
        },
        clearProcessModel (state) {
            state.model = {}
        },
        // editor
        setConfiguration (state, conf) {
            state.editor = { ...state.editor, ...conf }
        },

        clearBpmnState (state) {
            state.bpmn = {}
        },
        /**
     * @param state
     * @param modeler { object }
     */
        setModeler (state, modeler) {
            state.bpmn._modeler = unObserver(modeler)
        },
        /**
     * @param state
     * @param key { string }
     * @param module { object }
     */
        // setModules(state, { key, module }) {
        //   // state.bpmn[`_${key}`] = Object.freeze(module);
        // },
        /**
     * @param state
     * @param id { string }
     * @param element { object }
     */
        setElement (state, { element, id }) {
            state.bpmn.activeElement = { element: unObserver(element), id }
        }
    }
})

export default store
