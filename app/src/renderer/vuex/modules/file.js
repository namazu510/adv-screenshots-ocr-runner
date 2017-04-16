import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  prevIndex: 0,
  fileList: [],
  ocrRes: []
}

const mutations = {
  [types.SET_FILE_LIST] (state, fileList) {
    Vue.set(state, 'fileList', fileList)
  },
  [types.RESET_OCR_RES] (state) {
    state.ocrRes = []
  },
  // Renameでパスが変わると参照エラーとなるので更新する
  [types.UPDATE_FILE_PATH] (state, {oldPath, newPath}) {
    // fileList
    const i = state.fileList.findIndex((p) => p === oldPath)
    if (i === -1) {
      console.log(`${oldPath}のパスを更新しようとしましたが,参照に失敗しました. a`)
      return
    }
    state.fileList[i] = newPath
    // ocrResのpath
    const j = state.ocrRes.findIndex(r => r.path === oldPath)
    if (j === -1) {
      console.log(`${oldPath}のパスを更新しようとしましたが,参照に失敗しました. b`)
      return
    }
    state.ocrRes[j].path = newPath
  },
  [types.ADD_OCR_RES] (state, res) {
    state.ocrRes.push(res)
  }
}

export default {
  state,
  mutations
}

