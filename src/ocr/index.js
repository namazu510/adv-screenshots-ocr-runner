import { calcRgbDiff, parseRgb } from "../util/color"
import Jimp from "jimp"
import Tesseract from "tesseract.js"

export function execOcr(files, options = {}, progressCallback = null) {
  return concurrentMap(files, options.parallel ? 6 : 1, file => {
    return ocr(file, options).then(text => {
      progressCallback({
        file,
        text
      })
      return text
    })
  })
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
        calcRgbDiff(
          {
            r: this.bitmap.data[idx],
            g: this.bitmap.data[idx + 1],
            b: this.bitmap.data[idx + 2]
          },
          parseRgb(options.fontColor)
        ) >=
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
  img.contain(1980, 400)

  const imgBuff = await img.getBufferAsync(Jimp.MIME_PNG)

  const text = await new Promise((resolve, reject) => {
    Tesseract.recognize(imgBuff, {
      lang: "jpn"
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

async function concurrentMap(array, maxCount, mapper) {
  let semaphore = maxCount
  const queue = new Set()
  const pending = new Set()

  /* eslint-disable no-await-in-loop */
  for (const item of array) {
    // javascript can get away with not having atomics...
    if (semaphore > 0) {
      // if there's a free slot, acquire immediately
      semaphore -= 1
    } else {
      // add self to queue of pending promises
      // eslint-disable-next-line promise/avoid-new
      await new Promise(resolve => {
        queue.add(resolve)
      })
    }
    pending.add(
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          return await mapper(item)
        } finally {
          semaphore += 1
          const [next = undefined] = queue
          if (next !== undefined) {
            queue.delete(next)
            // acquire it on behalf of the next item
            semaphore -= 1
            next()
          }
        }
      })()
    )
  }
  /* eslint-enable no-await-in-loop */

  return Promise.all(pending)
}
