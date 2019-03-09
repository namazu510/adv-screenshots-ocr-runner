import Vue from "vue"
import Vuex from "vuex"
import {
  ipcRenderer
} from 'electron'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    progress: false,
    ocrRes: []
  },
  getters: {
    progress: state => state.progress,
    ocrRes: state => state.ocrRes,
  },
  mutations: {
    setProgress(state, progress) {
      state.progress = progress
    },
    addOcrRes(state, { file, text }) {
      state.ocrRes.push({
        file,
        text
      })
    }
  },
  actions: {
    execOcr({ commit }, { files, options }) {
      commit('setProgress', true)
      ipcRenderer.send('ocrRequest', {
        files,
        options,
      })
      ipcRenderer.removeAllListeners('ocrReply')
      ipcRenderer.on('ocrReply', (event, type, value) => {
        switch (type) {
          case 'progress': {
            commit('addOcrRes', {
              file: value.file,
              text: value.text
            })
            break;
          }
          case 'exit': {
            commit('setProgress', false)
            break;
          }
        }
      })
    }
  }
})
