<template>
  <div
    class="showBox"
    :style="{left:offsetX,top:offsetY}">
    <div class="showBoxTable">
      <table class="tip-title">
        <tr>
          <td
            style="height: 40px;"
            :colspan="auditHistoryList.length > 0 ? auditHistoryList.length + 1 : 2">
            <span>任务审批详情</span>
          </td>
        </tr>
        <template v-for="(item,headIndex) in tableHead">
          <tr :key="headIndex">
            <!--渲染第一列-->
            <td style="width: 80px;height: 25px;">
              <span style="font-weight:bold;font-size: 13px;">{{ item.title }}</span>
            </td>
            <template v-if="auditHistoryList.length > 0">
              <!--任务名称，合并单元格，只执行一次-->
              <template v-if="item.fieldName == 'taskName'" >
                <td
                  style="width: 120px;"
                  :colspan="auditHistoryList.length"><span style="font-size: 12px;">{{ auditHistoryList[0][item.fieldName] }}</span> </td>
              </template>
              <!--其余的按照数组渲染-->
              <template v-else>
                <template v-for="(data,dataIndex) in auditHistoryList">
                  <td
                    :key="dataIndex"
                    style="width: 120px;"><span style="font-size: 12px;">{{ data[item.fieldName] }}</span> </td>
                </template>
              </template>
            </template>
            <template v-else>
              <td style="width: 120px;"></td>
            </template>
          </tr>
        </template>
      </table>
    </div>

  </div>
</template>

<script>
export default {
    props: [
        'offsetX', 'offsetY', 'currentNodeHistoryList'
    ],
    data () {
        return {
            auditHistoryList: [],
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
    },
    created () {
        console.log('当前选中节点：', this.currentNodeHistoryList)
        if (this.currentNodeHistoryList && this.currentNodeHistoryList.length > 0) {
            this.currentNodeHistoryList.forEach(item=>{
                // 任务名称
                let auditHitory = {}
                auditHitory.taskName = item.nodeName

                // 处理人名称
                if (item.completeTime != null) {
                    // 任务已完成
                    auditHitory.userName = item.auditor
                } else {
                    auditHitory.userName = item.identityLinks
                }

                // 开始时间
                auditHitory.startTime = item.createTime
                // 完成时间
                auditHitory.endTime = item.completeTime

                // 持续时间
                let durationInSecond = item.durationInMillis == null ? '' : item.durationInMillis / 1000
                durationInSecond = this.secondToDate(durationInSecond)
                if (durationInSecond == 0) {
                    if (item.completeTime == null) {
                        durationInSecond = ''
                    } else {
                        durationInSecond += '秒'
                    }
                }
                auditHitory.duration = durationInSecond

                // 状态，意见
                if (item.a1FlowTaskTrajectoryEntity) {
                    auditHitory.status = item.a1FlowTaskTrajectoryEntity.statusVal
                    auditHitory.opinin = item.a1FlowTaskTrajectoryEntity.opinion
                } else if (item.completeTime != null) {
                    auditHitory.status = '结束'
                    auditHitory.opinin = '异常结束'
                } else {
                    auditHitory.status = ''
                    auditHitory.opinin = ''
                }

                this.auditHistoryList.push(auditHitory)
            })
        }
        // this.auditHistoryList = [
        //     {
        //         taskName: '采购审批',
        //         userName: 'daiwei',
        //         startTime: '2023-02-13 14:49:22',
        //         endTime: '2023-02-14 14:49:22',
        //         duration: '50秒',
        //         status: '结束',
        //         opinin: '结束'
        //     },
        //     {
        //         taskName: '采购审批',
        //         userName: 'daiwei2',
        //         startTime: '2023-02-13 14:49:22',
        //         endTime: '2023-02-14 14:49:22',
        //         duration: '50秒',
        //         status: '结束',
        //         opinin: '结束'
        //     },
        //     {
        //         taskName: '采购审批',
        //         userName: 'daiwei3',
        //         startTime: '2023-02-13 14:49:22',
        //         endTime: '2023-02-14 14:49:22',
        //         duration: '50秒',
        //         status: '结束',
        //         opinin: '结32424234242342342423任务名任务名称任务名称任务名称称任务名称任务名称任务名称任务名称任务名称任务名称4束'
        //     }
        // ]
    },
    methods: {
        secondToDate (durationInSecond) {
            if (null != durationInSecond && '' != durationInSecond) {
                if (durationInSecond > 60 && durationInSecond < 60 * 60) {
                    durationInSecond = parseInt(durationInSecond / 60.0) + '分钟' + parseInt((parseFloat(durationInSecond / 60.0) -
                        parseInt(durationInSecond / 60.0)) * 60) + '秒'
                } else if (durationInSecond >= 60 * 60 && durationInSecond < 60 * 60 * 24) {
                    durationInSecond = parseInt(durationInSecond / 3600.0) + '小时' + parseInt((parseFloat(durationInSecond / 3600.0) -
                            parseInt(durationInSecond / 3600.0)) * 60) + '分钟' +
                        parseInt((parseFloat((parseFloat(durationInSecond / 3600.0) - parseInt(durationInSecond / 3600.0)) * 60) -
                            parseInt((parseFloat(durationInSecond / 3600.0) - parseInt(durationInSecond / 3600.0)) * 60)) * 60) + '秒'
                } else if (durationInSecond >= 60 * 60 * 24) {
                    durationInSecond = parseInt(durationInSecond / 3600.0 / 24) + '天' + parseInt((parseFloat(durationInSecond / 3600.0 / 24) -
                            parseInt(durationInSecond / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(durationInSecond / 3600.0) -
                            parseInt(durationInSecond / 3600.0)) * 60) + '分钟' +
                        parseInt((parseFloat((parseFloat(durationInSecond / 3600.0) - parseInt(durationInSecond / 3600.0)) * 60) -
                            parseInt((parseFloat(durationInSecond / 3600.0) - parseInt(durationInSecond / 3600.0)) * 60)) * 60) + '秒'
                } else {
                    durationInSecond = parseInt(durationInSecond) + '秒'
                }
            }
            return durationInSecond
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
.tip-title{
    margin-bottom: 10px;
    margin-top: 10px;
}

div{
    background-color: #fff;
}

.showBox{
    width: auto;
    position: fixed;
    border:1px solid #eae9e9;
    border-radius: 10px;
    z-index:999;
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;
    box-shadow: #666 0px 0px 10px;
}

.showBoxTable{
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
}
</style>
