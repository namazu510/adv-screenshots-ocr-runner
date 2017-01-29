import * as types from './mutation-types'

export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}

export const readFileList = ({ commit }, folderPath) => {
  const path = require('path')
  const fs = require('fs')

  const find = (target, allowExt) => {
    console.log(target)
    const list = fs.readdirSync(target)
    return list.filter((v) => {
      const testExt = path.extname(v).toUpperCase()
      return allowExt.indexOf(testExt) > -1
    }).map((v) => {
      return path.join(target, v)
    })
  }

  const fileList = find(folderPath, [
    '.JPG',
    '.JPEG',
    '.PNG',
    '.BMP'
  ])
  commit(types.SET_FILE_LIST, fileList)
}

export const addOcrRes = ({commit}, res) => {
  commit(types.ADD_OCR_RES, res)
}

export const resetOcrRes = ({commit}) => {
  commit(types.RESET_OCR_RES)
}
