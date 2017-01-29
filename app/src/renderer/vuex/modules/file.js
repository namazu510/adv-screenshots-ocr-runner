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
  [types.ADD_OCR_RES] (state, res) {
    state.ocrRes.push(res)
  }
}

export default {
  state,
  mutations
}

