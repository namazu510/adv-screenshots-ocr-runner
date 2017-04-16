import Vue from 'vue'
const path = require('path')

Vue.filter('fileName', (fullPath) => {
  if (fullPath) {
    return path.basename(fullPath)
  }
  return fullPath
})
