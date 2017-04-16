import * as types from './mutation-types'

const path = require('path')
const fs = require('fs')

export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}

export const readFileList = ({ commit }, folderPath) => {
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

export const renameFile = ({state, commit}, {index, newName}) => {
  const oldPath = state.file.ocrRes[index].path

  const dirName = path.dirname(oldPath)
  const ext = path.extname(oldPath)
  const newPath = `${dirName}/${newName}${ext}`

  console.log(`try rename ${oldPath} => ${newPath}`)
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(`rename failed \n ${err}`)
      return
    }
    console.log(`renamed ${oldPath}`)

    // 新しいpathに対応させる
    commit(types.UPDATE_FILE_PATH, {oldPath, newPath})
  })
}

export const addOcrRes = ({commit}, res) => {
  commit(types.ADD_OCR_RES, res)
}

export const resetOcrRes = ({commit}) => {
  commit(types.RESET_OCR_RES)
}
