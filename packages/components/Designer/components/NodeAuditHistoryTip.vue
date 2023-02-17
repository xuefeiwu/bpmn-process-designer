<template>
  <div style="position: absolute;top:50%;left:50%;border:1px solid #eae9e9;border-radius: 10px;">
    <div
      class="tip-titlebar">
      <span>任务审批详情</span>
    </div>
    <div style="margin-left: 10px;margin-right: 10px;margin-bottom: 15px;">
      <table>
        <template v-for="(item,headIndex) in tableHead">
          <tr :key="headIndex">
            <!--渲染第一列-->
            <td style="width: 100px;height: 30px;">
              <span style="font-weight:bold">{{ item.title }}</span>
            </td>
            <!--任务名称，合并单元格，只执行一次-->
            <template v-if="item.fieldName == 'taskName'" >
              <td
                style="width: 180px;"
                :colspan="tableData.length">{{ tableData[0][item.fieldName] }} </td>
            </template>
            <!--其余的按照数组渲染-->
            <template v-else>
              <template v-for="(data,dataIndex) in tableData">
                <td
                  :key="dataIndex"
                  style="width: 180px;">{{ data[item.fieldName] }} </td>
              </template>
            </template>
          </tr>
        </template>
      </table>
    </div>

  </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [
                {
                    taskName: '采购审批',
                    userName: 'daiwei',
                    startTime: '2023-02-13 14:49:22',
                    endTime: '2023-02-14 14:49:22',
                    duration: '50秒',
                    status: '结束',
                    opinin: '结束'
                },
                {
                    taskName: '采购审批',
                    userName: 'daiwei2',
                    startTime: '2023-02-13 14:49:22',
                    endTime: '2023-02-14 14:49:22',
                    duration: '50秒',
                    status: '结束',
                    opinin: '结束'
                },
                {
                    taskName: '采购审批',
                    userName: 'daiwei3',
                    startTime: '2023-02-13 14:49:22',
                    endTime: '2023-02-14 14:49:22',
                    duration: '50秒',
                    status: '结束',
                    opinin: '结32424234242342342423任务名任务名称任务名称任务名称称任务名称任务名称任务名称任务名称任务名称任务名称4束'
                }
            ],
            tableHead: [
                {title: '任务名称', fieldName: 'taskName', width: '110', align: 'center'},
                {title: '处理人', fieldName: 'userName', width: '110', align: 'center'},
                {title: '开始时间', fieldName: 'startTime', width: '150', align: 'center'},
                {title: '结束时间', fieldName: 'endTime', width: '150', align: 'center'},
                {title: '审批用时', fieldName: 'duration', width: '100', align: 'center'},
                {title: '状态', fieldName: 'status', width: '200', align: 'center'},
                {title: '意见', fieldName: 'opinin', width: '200', align: 'center'}
            ]
        }
    }
}
</script>

<style scoped>
table{
    border-top: 1px solid #000000;
    border-left: 1px solid #000000;
    border-collapse: collapse; /*设置单元格的边框合并为1*/
}
td{
    border-bottom: 1px solid #000000;
    border-right: 1px solid #000000;
    text-align:center;
    vertical-align:middle;
    white-space:normal;
    word-wrap:break-word;
    word-break:break-all;
}
.tip-titlebar{
    margin-left: 50%;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 16px;
}

div{
    background-color: #fff;
}
</style>
