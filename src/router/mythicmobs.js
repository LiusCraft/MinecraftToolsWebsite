import MobsEditor from "../views/mythicmobs/mobs/MobsEditor.vue"
import ItemsEditor from '../views/mythicmobs/items/ItemsEditor.vue'
const rootPath = "/mythicmobs/"
function path(name, i=null) {
    return rootPath + (i==null?'':i+"/") + name
}
function pathMob(name) {
    return path(name,"mobs")
}
function pathItems(name) {
    return path(name,"items")
}
const MythicmobsRouter = [
    {
        path: pathMob("editor"),
        name: 'Mythicmobs',
        component: MobsEditor,
        meta: {
            title: "怪物编辑"
        }
    }, 
    {
        path: pathItems("editor"),
        name: 'Mythicmobs',
        component: ItemsEditor,
        meta: {
            title: "物品编辑"
        }
    }
]
export default MythicmobsRouter