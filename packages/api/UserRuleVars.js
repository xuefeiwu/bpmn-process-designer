export var logicCalTypeList = [
    {label: '或', value: 'or'},
    {label: '与', value: 'and'},
    {label: '排除', value: 'exclude'}
]

export var pluginTypeList = [
    {label: '用户', value: 'users'},
    {label: '部门', value: 'org'},
    {label: '角色', value: 'role'},
    {label: '人员脚本', value: 'userScript'},
    {label: '相同节点执行人', value: 'sameNode'},
    {label: '变量', value: 'script'},
    {label: '部门负责人', value: 'depHead', tooltip: '前置节点处理人的上级部门负责人'},
    {label: '直属领导', value: 'lastAduitUserHead', tooltip: '前置节点处理人的直接上级'},
    {label: '上级部门负责人', value: 'lastAduitDepartmentHead', tooltip: '前置节点处理人所在部门的上级部门的负责人'},

]
