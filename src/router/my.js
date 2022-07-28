import VarSetting from "../views/my/VarSetting.vue"
const rootPath = "/my/"
function path(name, i=null) {
    return rootPath + (i==null?'':i+"/") + name
}
const MyRouter = [
    {
    path: path("varsetting"),
        name: 'VarSetting',
        component: VarSetting,
        meta: {
            title: "变量设置"
        }
    }
]
export default MyRouter