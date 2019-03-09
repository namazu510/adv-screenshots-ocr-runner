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
import { debounce } from "../../util/util"
const fs = require("fs").promises
const path = require("path")

export default {
  name: "image-preview",
  props: {
    files: Array,
    page: Number,
    position: Object
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
    }
  },
  created() {
    this.loadImgAndCreatePreview()
  },
  methods: {
    debouncedLoadImgAndCreatePreview: debounce(function () {
      this.loadImgAndCreatePreview()
    }, 250),
    async loadImgAndCreatePreview() {
      if (this.selectedFile === undefined) {
        return
      }

      // プレイビューで表示するイメージを作る.
      const base64 = Buffer.from(await fs.readFile(this.selectedFile)).toString(
        "base64"
      )
      // todo 拡張子対応
      const imgDataURL = `data:image/jpg;base64,${base64}`

      // canvasを引いて.枠線を引く
      const baseImage = new Image()
      baseImage.src = imgDataURL
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      const draw = () => {
        const w = this.position.end.x - this.position.start.x
        const h = this.position.end.y - this.position.start.y

        ctx.strokeStyle = "rgb(255,0,0)"
        ctx.strokeRect(this.position.start.x, this.position.start.y, w, h)
        this.imgWidth = canvas.width
        this.imgHeight = canvas.height
        this.prevImageDataSrc = canvas.toDataURL()
      }

      baseImage.onload = () => {
        canvas.width = baseImage.width
        canvas.height = baseImage.height
        ctx.drawImage(baseImage, 0, 0)
        draw()
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
