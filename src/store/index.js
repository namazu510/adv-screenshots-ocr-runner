import Vue from "vue"
import Vuex from "vuex"
import path from "path"
import { renameFiles } from "../util/file"
import { ipcRenderer } from "electron"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    progress: false,
    ocrRes: []
  },
  getters: {
    progress: state => state.progress,
    ocrRes: state => state.ocrRes
  },
  mutations: {
    setProgress(state, progress) {
      state.progress = progress
    },
    setOcrRes(state, { results }) {
      state.ocrRes = results
    },
    addOcrRes(state, { file, text }) {
      state.ocrRes.push({
        file,
        text
      })
    },
    removeOcrRes(state, { index }) {
      state.ocrRes.splice(index, 1)
    },
    updateOcrRes(state, { index, result }) {
      state.ocrRes[index] = {
        ...state.ocrRes[index],
        ...result
      }
    }
  },
  actions: {
    execOcr({ commit }, { files, options }) {
      commit("setProgress", true)
      ipcRenderer.send("ocrRequest", {
        files,
        options
      })
      ipcRenderer.removeAllListeners("ocrReply")
      ipcRenderer.on("ocrReply", (event, type, value) => {
        switch (type) {
          case "progress": {
            commit("addOcrRes", {
              file: value.file,
              text: value.text
            })
            break
          }
          case "exit": {
            commit("setProgress", false)
            break
          }
        }
      })
    },
    async renameAll({ state, commit }, _) {
      const renames = state.ocrRes.map(({ file, text }) => {
        const ext = path.extname(file)
        const newPath = path.join(path.dirname(file), `${text}.${ext}`)
        return {
          oldPath: file,
          newPath
        }
      })
      await renameFiles(renames)
    }
  }
})
