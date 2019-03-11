<template>
  <div>
    <div v-if="selectedFile === undefined" class="display-1">
      ファイル未選択
    </div>
    <div
      v-else
      style="display:flex; flex-direction:column; justify-content:center; align-items:center;"
    >
      <img :src="prevImageDataSrc" @click="imgClick" />
      <div>{{ selectedFileName }}</div>
      <div>Width: {{ imgWidth }} px</div>
      <div>Height: {{ imgHeight }} px</div>
      <v-pagination
        :length="files.length"
        :value="page"
        @input="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>
<script>
import { parseRgb, calcRgbDiff } from "../../util/color"
import { loadImageWithBase64 } from "../../util/file"
import { debounce } from "../../util/util"
const path = require("path")

export default {
  name: "image-preview",
  props: {
    files: Array,
    page: Number,
    position: Object,
    fontColor: String,
    fontColorRange: Number
  },
  data() {
    return {
      imgWidth: 0,
      imgHeight: 0,
      prevImageDataSrc: undefined
    }
  },
  computed: {
    selectedFile() {
      return this.files && this.files[this.page - 1]
    },
    selectedFileName() {
      if (this.selectedFile) {
        return path.basename(this.selectedFile)
      }
      return ""
    }
  },
  watch: {
    position() {
      this.debouncedLoadImgAndCreatePreview()
    },
    selectedFile() {
      this.debouncedLoadImgAndCreatePreview()
    },
    fontColor() {
      this.debouncedLoadImgAndCreatePreview()
    },
    fontColorRange() {
      this.debouncedLoadImgAndCreatePreview()
    }
  },
  created() {
    this.loadImgAndCreatePreview()
  },
  methods: {
    debouncedLoadImgAndCreatePreview: debounce(function() {
      this.loadImgAndCreatePreview()
    }, 250),
    async loadImgAndCreatePreview() {
      if (this.selectedFile === undefined) {
        return
      }

      // canvasを引いて.枠線を引く
      const baseImage = new Image()
      baseImage.src = await loadImageWithBase64(this.selectedFile)

      const draw = canvas => {
        const { x, y } = this.position.start
        const w = this.position.end.x - x
        const h = this.position.end.y - y

        if (x === 0 || y === 0 || w === 0 || h === 0) {
          return
        }

        const ctx = canvas.getContext("2d")
        ctx.strokeStyle = "rgb(255,0,0)"
        ctx.strokeRect(x, y, w, h)

        // 二値化処理 preview
        if (this.fontColor && this.fontColorRange !== undefined) {
          const image = ctx.getImageData(x, y, w, h)
          for (let i = 0; i < image.height; i++) {
            for (let j = 0; j < image.width; j++) {
              const dx = (i * image.width + j) * 4
              if (
                calcRgbDiff(
                  {
                    r: image.data[dx],
                    g: image.data[dx + 1],
                    b: image.data[dx + 2]
                  },
                  parseRgb(this.fontColor)
                ) >=
                this.fontColorRange / 100
              ) {
                image.data[dx] = 0
                image.data[dx + 1] = 0
                image.data[dx + 2] = 0
              } else {
                image.data[dx] = 255
                image.data[dx + 1] = 255
                image.data[dx + 2] = 255
              }
            }
          }
          ctx.putImageData(image, x, y)
        }
      }

      baseImage.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = baseImage.width
        canvas.height = baseImage.height
        ctx.drawImage(baseImage, 0, 0)

        draw(canvas)

        this.imgWidth = canvas.width
        this.imgHeight = canvas.height
        this.prevImageDataSrc = canvas.toDataURL()
      }
    },
    imgClick(event) {
      // shiftが押されていれば始点をセット
      // ctrlが押されていれば終点をセット
      let target
      if (event.shiftKey) {
        target = "start"
      }
      if (event.ctrlKey || event.metaKey /* for Mac */) {
        target = "end"
      }
      if (!target) {
        return
      }

      const imageXPos =
        (event.offsetX / event.target.clientWidth) * this.imgWidth
      const imageYPos =
        (event.offsetY / event.target.clientHeight) * this.imgHeight
      this.$emit("update:position", {
        ...this.position,
        [target]: {
          x: Math.ceil(imageXPos),
          y: Math.ceil(imageYPos)
        }
      })
    }
  }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
</style>
