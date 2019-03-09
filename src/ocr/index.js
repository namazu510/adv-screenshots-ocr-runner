import { calcRgbDiff, parseRgb } from "../util/color"
import Jimp from "jimp"
import Tesseract from "tesseract.js"

export function execOcr(files, options = {}, progressCallback = null) {
  if (options.parallel === false) {
    return Promise.all(files.map(file => {
      return ocr(file, options).then(text => {
        progressCallback({
          file,
          text
        })
        return text;
      })
    }))
  } else {
    throw new Error("TODO: implement")
  }
}

function convertPositionToVector(position) {
  return {
    x: position.start.x,
    y: position.start.y,
    width: position.end.x - position.start.x,
    height: position.end.y - position.start.y
  }
}

async function ocr(file, options) {
  let img = await Jimp.read(file)

  if (options.position) {
    const { x, y, width, height } = convertPositionToVector(options.position)
    img.crop(x, y, width, height)
  }

  if (options.fontColor && options.fontColorRange !== undefined) {
    img.scan(0, 0, img.getWidth(), img.getHeight(), function(x, y, idx) {
      if (
        calcRgbDiff({
          r: this.bitmap.data[idx],
          g: this.bitmap.data[idx + 1],
          b:  this.bitmap.data[idx + 2],
        }, parseRgb(options.fontColor)) >=
        options.fontColorRange / 100
      ) {
        this.bitmap.data[idx] = 255
        this.bitmap.data[idx + 1] = 255
        this.bitmap.data[idx + 2] = 255
      } else {
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx + 1] = 0
        this.bitmap.data[idx + 2] = 0
      }
    })
  }
  // img.contain(1980, 400)

  await img.writeAsync('test.png')

  const imgBuff = await img.getBufferAsync(Jimp.MIME_PNG)

  const text = await new Promise((resolve, reject) => {
    Tesseract.recognize(imgBuff, {
      lang: "jpn"
    })
      .progress(p => {
        console.log(p)
      })
      .then(res => {
        console.log(res.text)
        resolve(res.text)
      })
      .catch(err => {
        reject(err)
      })
  })

  return text
}
