import Vue from "vue"
import Vuex from "vuex"
import path from "path"
import { renameFiles } from "../util/file"
import { ipcRenderer } from "electron"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: {
      inProgress: false,
      status: 0
    },
    ocrRes: []
  },
  getters: {
    status: state => state.status,
    ocrRes: state => state.ocrRes
  },
  mutations: {
    setStatus(state, { inProgress, status }) {
      state.status = {
        inProgress,
        status
      }
    },
    setOcrRes(state, { results }) {
      state.ocrRes = results
    },
    addOcrRes(state, { file, text }) {
      const test = state.ocrRes.findIndex(r => r.file === file)
      if (test !== -1) {
        state.ocrRes.splice(test, 1)
      }
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
    execOcr({ commit, state }, { files, options }) {
      if (state.status.inProgress) {
        throw new Error("already runnning ocr")
      }
      commit("setStatus", {
        inProgress: true,
        status: 0
      })
      ipcRenderer.send("ocrRequest", {
        files,
        options
      })
      ipcRenderer.removeAllListeners("ocrReply")
      let count = 0
      ipcRenderer.on("ocrReply", (event, type, value) => {
        switch (type) {
          case "progress": {

            // OCR結果からゴミを除く
            // eslint-disable-next-line
            const sanitizedText = value.text.replace(/[\n\r]/g, '').replace(/[\s 　]+/, '')

            commit("addOcrRes", {
              file: value.file,
              text: sanitizedText
            })
            count++
            commit("setStatus", {
              inProgress: true,
              status: count / files.length
            })
            break
          }
          case "exit": {
            commit("setStatus", {
              inProgress: false,
              status: 0
            })
            break
          }
        }
      })
    },
    replaceResult({ state, commit }, { regExp, subStr }) {
      const results = state.ocrRes.map((r) => {
        r.text = r.text.replace(new RegExp(regExp), subStr);
        return r;
      })
      commit('setOcrRes', {
        results
      })
    },
    async renameAll({ state, commit }) {
      const renames = state.ocrRes.map(({ file, text }) => {
        const ext = path.extname(file)
        const newPath = path.join(path.dirname(file), `${text}.${ext}`)
        return {
          oldPath: file,
          newPath
        }
      })
      commit('setOcrRes', {
        results: []
      })
      await renameFiles(renames)
    }
  }
})
