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
