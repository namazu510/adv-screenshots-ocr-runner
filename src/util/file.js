const fs = require("fs").promises
const path = require("path")

const imageExts = [".JPG", ".JPEG", ".PNG", ".BMP"]

export async function getImageFilesFromDir(dir) {
  const files = await fs.readdir(dir)
  return files
    .filter(file => {
      return imageExts.includes(path.extname(file).toUpperCase())
    })
    .map(file => {
      return path.join(dir, file)
    })
}

export function renameFiles(renameFiles) {
  const rename = ({ oldPath, newPath }) => {
    return fs.rename(oldPath, newPath)
  }
  return Promise.all(
    renameFiles.map(rename)
  )
}


export async function loadImageWithBase64(file) {
  const base64 = Buffer.from(await fs.readFile(file)).toString(
    "base64"
  )
  // todo 拡張子対応
  return `data:image/jpg;base64,${base64}`
}
