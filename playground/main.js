import Vue from 'vue'
import App from './App.vue'
import store from '../packages/store'

import '@packages/bpmn-icons'

// 加载基础ElementUI
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'small' })
import '../packages/theme/element-variables.scss'

// 导入highlight
import { vuePlugin } from '../packages/highlight'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
Vue.use(vuePlugin)

import Common from '@packages/components/common'
Vue.use(Common)

import ResetPopover from '../utils/resetPopover'
Vue.directive('r-popover', ResetPopover)

import '../packages/theme/index.scss'

new Vue({
    store,
    render: (h) => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this; // 安装全局事件总线，将$bus指定为vm。
    }
}).$mount('#app')
