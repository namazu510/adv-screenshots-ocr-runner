<template>
    <div id="main-page">
        <div class="headline">対象画像ディレクトリ</div>
        <v-row>
            <v-col xs9="xs9">
                <v-text-input
                        disabled
                        label="FolderPath"
                        v-model="text"
                ></v-text-input>
            </v-col>
            <v-col xs3="xs3">
                <v-btn @click.native="folderSelect">Open</v-btn>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col xs6>
                <div class="display-1">OCR-Rule-Setting</div>
                <div class="headline">台詞領域</div>
                <v-row>
                    <v-col xs4>
                        <div>始点(左上)</div><div>shift押しながら画像クリック</div>
                    </v-col>
                    <v-col xs4>
                        <v-text-input
                                label="x"
                                type=number
                                v-model="position.start.x"
                        ></v-text-input>
                    </v-col>
                    <v-col xs4>
                        <v-text-input
                                label="y"
                                type=number
                                v-model="position.start.y"
                        ></v-text-input>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col xs4>
                        <div>終点(右下)</div><div>ctrl押しながら画像クリック</div>
                    </v-col>
                    <v-col xs4>
                        <v-text-input
                                label="x"
                                type=number
                                v-model="position.end.x"
                        ></v-text-input>
                    </v-col>
                    <v-col xs4>
                        <v-text-input
                                label="y"
                                type=number
                                v-model="position.end.y"
                        ></v-text-input>
                    </v-col>
                </v-row>
                <div class="headline">フォントカラー</div>
                <v-checkbox id="test7" name="test7" label="フォント色を指定する(精度が上がります)" v-model="useFilter" filled></v-checkbox>
                <v-row v-if="useFilter">
                    <v-col xs6>
                        <v-text-input
                                type=color
                                v-model="fontColor"
                                label="color"
                        ></v-text-input>
                    </v-col >
                    <v-col xs6>
                        <v-text-input
                                type=number
                                label="許容差分率0_100"
                                v-model="fontColorRange"
                        ></v-text-input>
                    </v-col>
                </v-row>
                <div class="headline">出力ファイル名フォーマット</div>
                <v-text-input
                        label="output-format"
                        v-model="outputFormat"
                ></v-text-input>
                <v-btn ripple info large @click.native="run" v-tooltip:bottom="{ html: '表示画像に対してOCRをテスト実行します.' }">TestRun</v-btn>
                <v-btn ripple primary large @click.native="runAll" v-tooltip:bottom="{ html: '選択フォルダの画像全体に対し設定したルールを基にOCRを掛けます.' }">Run</v-btn>
                <v-progress-linear v-model="progress.value" :active="progress.show"></v-progress-linear>
            </v-col>
            <v-col xs6>
                <div v-if="!fileSelected" class="display-1"> File Not Found</div>
                <div v-if="fileSelected" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <div class="display-1">Preview</div>
                    <img :src="prevImageSrc" @click="imgClick"></img>
                    <div> {{ selectedFile }} </div>
                    <div>Width: {{ imgWidth }} px </div>
                    <div>Height: {{ imgHeight }} px </div>

                    <v-pagination :length.number="files.length" v-model="page"></v-pagination>
                </div>
            </v-col>
        </v-row>
        <v-row>

        </v-row>
        <v-row>
            <div class="headline">Log</div>
            <v-btn ma-2 @click.native="logClear">clear</v-btn>
        </v-row>
        <div style="overflow:scroll; height:200px; border: solid 1px black; text-align:left;">
            <div v-for="log in logs">{{ log }}</div>
        </div>
    </div>
</template>
<style scoped>
    img {
        max-width: 100%;
    }
</style>
<script>
    const Dialog = require('electron').remote.dialog
    const fs = require('fs')
    export default{
      data () {
        return {
          text: 'input-ss-path',
          page: 1,
          position: {
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 0,
              y: 0
            }
          },
          useFilter: false,
          fontColor: '#FFFFFF',
          fontColorRange: 10,
          prevImageSrc: '',
          outputFormat: '[text]',
          logs: [],
          imgWidth: 0,
          imgHeight: 0,
          progress: {
            value: 60,
            show: true
          }
        }
      },
      computed: {
        files () {
          return this.$store.state.file.fileList
        },
        fileSelected () {
          return this.files && this.files.length > 0
        },
        selectedFile () {
          return this.files[this.page - 1]
        }
      },
      watch: {
        text () {
          this.page = 1
          this._areaResetting = true
          this.prevImageCreate()
        },
        page () {
          this.prevImageCreate()
        }
      },
      mounted () {
        this.$watch('position', () => {
          if (this._timeout) {
            clearTimeout(this._timeout)
          }
          this._timeout = setTimeout(this.prevImageCreate, 300)
        }, {
          deep: true
        })
      },
      methods: {
        folderSelect () {
          Dialog.showOpenDialog(null, {
            properties: ['openDirectory'],
            title: '画像フォルダ',
            defaultPath: '.'
          }, (folderNames) => {
            this.$store.dispatch('readFileList', folderNames[0])
            this.text = folderNames
          })
        },
        imgClick (event) {
          // shiftが押されていれば始点をセット
          // ctrlが押されていれば終点をセット
          // どちらも押されていなければなにもしない
          let target
          if (event.shiftKey) {
            target = this.position.start
          }
          if (event.ctrlKey) {
            target = this.position.end
          }
          if (!target) {
            return
          }

          // offset値と要素サイズ, imgのwidth,heightからimg上での実際にクリックされた座標点を求める
          const realXPos = (event.offsetX / event.target.clientWidth) * this.imgWidth
          const realYPos = (event.offsetY / event.target.clientHeight) * this.imgHeight
          target.x = Math.ceil(realXPos)
          target.y = Math.ceil(realYPos)
        },
        prevImageCreate () {
          if (!this.selectedFile) {
            return
          }

          // プレイビューで表示するイメージを作る.
          const base64 = new Buffer(fs.readFileSync(this.selectedFile)).toString('base64')
          // todo 拡張子対応
          const imgDataURL = `data:image/jpg;base64,${base64}`

          // canvasを引いて.枠線を引く
          const baseImage = new Image()
          baseImage.src = imgDataURL
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const draw = () => {
            const w = this.position.end.x - this.position.start.x
            const h = this.position.end.y - this.position.start.y

            ctx.strokeStyle = 'rgb(255,0,0)'
            ctx.strokeRect(this.position.start.x, this.position.start.y, w, h)
            this.imgWidth = canvas.width
            this.imgHeight = canvas.height
            if (this._areaResetting) {
              this.position.start.x = 0
              this.position.start.y = 0
              this.position.end.x = canvas.width
              this.position.end.y = canvas.height
              this._areaResetting = false
            }
            this.prevImageSrc = canvas.toDataURL()
          }

          baseImage.onload = () => {
            canvas.width = baseImage.width
            canvas.height = baseImage.height
            ctx.drawImage(baseImage, 0, 0)
            draw()
          }
        },
        logClear () {
          this.logs = []
        },
        runAll () {
          this.progress.show = true
          this.progress.value = 0
          this.$store.dispatch('resetOcrRes')
          for (let i = 0; i <= this.files.length; i++) {
            setTimeout(this.run(this.files[i - 1]), 10 * i / 5)
          }
        },
        run (fileName) {
          const loadImg = (fileName) => {
            return new Promise(function (resolve, reject) {
              const base64 = new Buffer(fs.readFileSync(fileName)).toString('base64')
              const img = new Image()
              img.src = `data:image/jpg;base64,${base64}`
              img.onload = () => {
                resolve(img)
              }
            })
          }
          const cutImg = (img, x, y, width, height) => {
            const scall = Math.ceil(400 / height)
            // console.log(`${scall}倍に拡大します.`)
            const canvas = document.createElement('canvas')
            canvas.width = width * scall
            canvas.height = height * scall
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, x, y, width, height, 0, 0, width * scall, height * scall)
            return Promise.resolve(canvas)
          }
          const filter = (canvas) => {
            const ctx = canvas.getContext('2d')
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
            for (var i = 0; i < image.height; i++) {
              for (var j = 0; j < image.width; j++) {
                const rowSize = (i * image.width + j) * 4
                // 真っ白以外を真っ黒にする
                if (image.data[rowSize + 0] <= 230) {
                  image.data[rowSize + 0] = 0
                  image.data[rowSize + 1] = 0
                  image.data[rowSize + 2] = 0
                  continue
                }
                if (image.data[rowSize + 1] <= 230) {
                  image.data[rowSize + 0] = 0
                  image.data[rowSize + 1] = 0
                  image.data[rowSize + 2] = 0
                  continue
                }
                if (image.data[rowSize + 2] <= 230) {
                  image.data[rowSize + 0] = 0
                  image.data[rowSize + 1] = 0
                  image.data[rowSize + 2] = 0
                }
              }
            }
            ctx.putImageData(image, 0, 0)
            return Promise.resolve(canvas)
          }
          const ocr = (canvas) => {
            /* global Tesseract */
            return Tesseract.recognize(canvas, {lang: 'jpn'})
               // .progress(message => console.log(message))
               .catch(err => console.error(err))
          }
          const imgPrev = (canvas) => {
            console.log(canvas)
            return Promise.resolve(canvas)
          }
          const x = this.position.start.x
          const y = this.position.start.y
          const width = this.position.end.x - this.position.start.x
          const height = this.position.end.y - this.position.start.y

          // const target = fileName || this.selectedFile
          // console.log(target)
          loadImg(this.selectedFile)
            .then((img) => cutImg(img, x, y, width, height))
            .then((canvas) => {
              if (!this.useFilter) {
                return Promise.resolve(canvas)
              }
              return filter(canvas)
            })
            .then(imgPrev)
            .then(ocr)
            .then((result) => {
              this.$store.dispatch('addOcrRes', {
                path: this.selectedFile,
                res: result.text
              })
              this.logs.push(`${this.selectedFile} => ${result.text}`)
            })
        }
      }
    }
</script>
