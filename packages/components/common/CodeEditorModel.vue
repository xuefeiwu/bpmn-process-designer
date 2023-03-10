<template>
  <div>
    <template v-if="disableInput">
      <!-- 输入框 -->
      <el-tooltip :content="showCode" class="item" effect="dark" :disabled="showCode == ''">
        <el-input
          v-model="showCode"
          :placeholder="placeholder"
          readonly>
          <el-button slot="append" icon="el-icon-edit" @click="editorModalFlag= true" :disabled="disableBtn"></el-button>
        </el-input>
      </el-tooltip>
    </template>
    <el-dialog
      :title="title ? title : '在线代码编辑器'"
      :visible.sync="editorModalFlag"
      ref="codeModel"
      width="60vw"
      append-to-body
      destroy-on-close
      class="code-dialog"
      :before-close="handlerCancel">
      <div class="code-div" v-if="showPropsButton">
        <template v-for="(item) in innerProps">
          <el-button class="code-button" size="mini" type="primary" :icon="item.icon" @click="insertProps(item.value)">{{ item.label }}</el-button>
        </template>
      </div>

      <codemirror
        v-if="editorModalFlag"
        ref="codeMirror"
        v-model="code"
        :options="editorOption"
        @ready="readyCodeMirror"
        @change="changeCodeMirror">
      </codemirror>

      <template #footer v-if="!readOnly">
        <el-button @click="handlerCancel">取 消</el-button>
        <el-button @click="handleSureClick" type="primary">确 认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {codemirror} from 'vue-codemirror'
import * as mirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/css/css'
// 编辑器主题样式，配置里面theme需要设置monokai
import 'codemirror/theme/monokai.css'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/groovy/groovy'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/xml/xml'

// 光标行背景高亮，配置也需要配置styleA
import 'codemirror/addon/selection/active-line'
// sublime编辑器效果
import 'codemirror/keymap/sublime'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/vue/vue'
//下面这几个引入的主要是验证提示类的,配置里的lint需要设置true,gutters: ['CodeMirror-lint-markers']
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/lint/json-lint.js'
import '@packages/components/common/mod/ProcessInnerProps.js'
import '@packages/components/common/help/groovy-hint.js'

//及时自动更新，配置里面也需要设置autoRefresh为true
import 'codemirror/addon/display/autorefresh'

import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'

// 代码段折叠功能
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/comment-fold.js'

export default {
    name: 'CodeEditorModel',
    components: {
        codemirror
    },
    props: {
        // value 必传，并且是字符串
        codeString: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        codeLanguage: {
            type: String,
            default: 'javascript'
        },
        disableInput: {
            type: Boolean,
            default: true
        },
        disableBtn: {
            type: Boolean,
            default: false
        },
        showCodeEditor: {
            type: Boolean,
            default: false
        },
        showPropsButton: {
            type: Boolean,
            default: false
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        codeString: {
            immediate: true,
            handler (val) {
                this.showCode = val ? val : ''
                this.code = this.showCode
            }
        },
        showCodeEditor: {
            immediate: true,
            handler (val) {
                this.editorModalFlag = val ? val : false
            }
        },
        readOnly: {
            immediate: true,
            handler (val) {
                this.editorModalFlag = val ? val : false
            }
        }
    },
    data () {
        return {
            showCode: '',
            code: '',
            editorModalFlag: false,
            customerMode: {
                'processInner': 'text/x-processInner'
            },
            innerProps: [
                {label: '流程标题', value: '${title}', icon: 'el-icon-folder-add'},
                {label: '流程发起时间', value: '${startDate}', icon: 'el-icon-folder-tickets'},
                {label: '流程发起人', value: '${startUserName}', icon: 'el-icon-folder-date'}
            ]
        }
    },
    computed: {
        editorOption () {
            const meta = mirror.findModeByName(this.codeLanguage ? this.codeLanguage : 'javascript')
            let mode = meta? meta.mode : this.customerMode[this.codeLanguage]
            let opt = {
                mode: mode,
                theme: 'monokai',
                indentUnit: 4,
                lint: true,
                tabSize: 2,
                smartIndent: true, // 是否智能缩进
                styleActiveLine: true, // 当前行高亮
                lineNumbers: true, // 显示行号
                lineWrapping: true, // 自动换行
                matchBrackets: true, // 括号匹配显示
                autoCloseBrackets: true, // 输入和退格时成对
                autoCloseTags: true, // auto-close XML tags
                autofocus: true,
                foldGutter: true,
                readOnly: this.readOnly,
                keyMap: 'sublime',
                extraKeys: {
                    'Ctrl': 'autocomplete'
                },
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
                // 代码提示功能
                hintOptions: {
                    // 避免由于提示列表只有一个提示信息时，自动填充
                    completeSingle: false
                }

            }
            let editorOpt = Object.assign({}, opt, this.options)
            return editorOpt
        }
    },
    methods: {
        changeCodeMirror (val) {
            this.code = val
        },
        readyCodeMirror () {
            // 设置代码编辑框宽和高
            this.$refs.codeMirror.codemirror.setSize('-webkit-fill-available', '64vh')
        },
        handlerCancel () {
            this.editorModalFlag = false
            // 关闭清空值
            this.showCode = this.codeString
            this.code = this.codeString
            this.$emit('handlerCancel', this.code)
        },
        handleSureClick () {
            this.editorModalFlag = false
            // 有传入的回写值
            this.$emit('handleSureClick', this.code)
        },
        insertProps (props) {
            let pos1 = this.$refs.codeMirror.codemirror.getCursor()
            let pos2 = {}
            pos2.line = pos1.line
            pos2.ch = pos1.ch
            this.$refs.codeMirror.codemirror.replaceRange(' '+props+' ', pos2)
        }
    }
}
</script>
<style lang="less" scoped>
.code-dialog /deep/ .el-dialog__body {
    padding: 16px;
    padding-top: 2px;
    max-height: 80vh;
    box-sizing: border-box;
    overflow-y: auto;
}

.code-div{
    background-color: #f5f5f5;
    border-color: #ddd;
}
.code-button {
    width: 100px;
    height: 30px;
    margin-top: 2px;
    margin-bottom: 4px;
}
.code-editor-textarea {
    position: relative;
}

.textarea-icon-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer
}

.textarea-icon {
    font-size: 22px;
}
</style>
<style lang="less">
.CodeMirror-hints {
    z-index: 90000;
    width: 200px;
}
</style>
