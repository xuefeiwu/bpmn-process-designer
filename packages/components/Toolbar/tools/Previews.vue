<template>
  <el-button
    v-popover:popover
    type="primary">
    预览文件
    <el-popover
      ref="popover"
      placement="bottom"
      popper-class="button-popover"
      trigger="hover">
      <div class="button-list_column">
        <el-button
          type="primary"
          @click="openXMLPreviewModel">预览 XML</el-button>
        <el-button
          type="primary"
          @click="openJsonPreviewModel">预览 JSON</el-button>
      </div>
    </el-popover>

    <code-editor-model
      v-if="codeModelVisible"
      :title="modelTitle"
      :code-string="codeString"
      :code-language="codeLanguage"
      :show-code-editor.sync="codeModelVisible"
      :disable-input="false"
      :readOnly="true"
      @handlerCancel="handlerCancel"
    />
    <!--<el-dialog-->
    <!--  :title="
      modelTitle"-->
    <!--  :visible.sync="codeModelVisible"-->
    <!--  width="72vw"-->
    <!--  append-to-body-->
    <!--  destroy-on-close>-->
    <!--  <div class="preview-model">-->
    <!--    <highlightjs-->
    <!--      :code="codeString"-->
    <!--      :language="codeLanguage" />-->
    <!--  </div>-->
    <!--</el-dialog>-->

  </el-button>
</template>

<script>
import { mapGetters } from 'vuex'
import { catchError } from '@utils/printCatch'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'

export default {
    name: 'BpmnPreviews',
    components: {CodeEditorModel},
    computed: {
        ...mapGetters(['getModeler']),
        modelTitle () {
            return this.codeLanguage === 'xml' ? '预览 XML' : '预览 JSON'
        }
    },
    data () {
        return {
            codeLanguage: 'xml',
            codeString: '',
            codeModelVisible: false
        }
    },
    methods: {
        async openXMLPreviewModel () {
            try {
                if (!this.getModeler) return this.$message.error('流程图引擎初始化失败')
                this.codeLanguage = 'xml'
                const { xml } = await this.getModeler.saveXML({ format: true, preamble: true })
                this.codeString = xml
                this.codeModelVisible = true
            } catch (e) {
                catchError(e)
            }
        },
        async openJsonPreviewModel () {
            try {
                if (!this.getModeler) return this.$message.error('流程图引擎初始化失败')
                this.codeLanguage = 'json'
                const { xml } = await this.getModeler.saveXML({ format: true, preamble: true })
                const jsonStr = await this.getModeler.get('moddle').fromXML(xml)
                this.codeString = JSON.stringify(jsonStr, null, 2)
                this.codeModelVisible = true
            } catch (e) {
                catchError(e)
            }
        },
        handlerCancel (code) {
            this.codeModelVisible = false
        }
    }
}
</script>
