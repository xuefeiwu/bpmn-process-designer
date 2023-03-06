<template>
  <div class="bpmn-toolbar">
    <el-button-group>
      <bpmn-save/>
      <bpmn-import />
      <bpmn-exports />
      <bpmn-previews />
    </el-button-group>
    <bpmn-aligns />
    <bpmn-scales />
    <bpmn-commands />
    <bpmn-externals />
  </div>
</template>

<script>
import BpmnSave from './tools/Save'
import BpmnImport from './tools/Import'
import BpmnExports from './tools/Exports'
import BpmnPreviews from './tools/Previews'
import BpmnAligns from './tools/Aligns'
import BpmnScales from './tools/Scales'
import BpmnCommands from './tools/Commands'
import BpmnExternals from './tools/Externals'
export default {
    name: 'BpmnToolbar',
    components: { BpmnExternals, BpmnCommands, BpmnSave, BpmnScales, BpmnAligns, BpmnPreviews, BpmnExports, BpmnImport }
}
</script>
