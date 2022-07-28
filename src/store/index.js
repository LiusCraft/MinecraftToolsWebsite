import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: { },
  state: {
    VarSetting: {
      STORE_URL: "",
      STORE_DATA: [],
    }
  },
  getters: {
    getVarSTORE_DATA({commit, state}){
      var temp = false
      const localData = localStorage.getItem("VARSTORE_DATA")
      if(state.VarSetting.STORE_DATA && state.VarSetting.STORE_DATA.length > 0)
        temp = state.VarSetting.STORE_DATA
      else if(localData && localData.length > 0){
        commit("setVarSTORE_DATA", JSON.parse("VARSTORE_DATA",localData))
        temp = localData
      } else
        
      return temp
    },
    getVarSTORE_URL({state}){
      var temp = false
      const localURL = localStorage.getItem("VARSTORE_URL")
      if(state.VarSetting.STORE_URL && state.VarSetting.STORE_URL.length > 0)
        temp = state.VarSetting.STORE_URL
      else if(localURL && localURL.length > 0)
        temp = localURL
      return temp
    }
  },
  mutations: {
    setVarSTORE_URL({state}, url=""){
      if(url==null)
        url = ""
      state.VarSetting.STORE_URL = url
      localStorage.setItem("VARSTORE_URL", url)
    },
    setVarSTORE_DATA({state}, data=[]) {
      if(data==null)
        data = []
      state.VarSetting.STORE_DATA = data
      localStorage.setItem("VARSTORE_DATA", data)
    }
  },
  actions: {
    pullVarInfo({commit, getters}) {
      if(getters.getVarSTORE_URL) {
        // 有设置VarSTORE_URL...
        commit("setVarSTORE_DATA", [])
      }
    }
  }
})

export default store
