<template>
  <div class="check-page">
    <template v-if="ocrRes.length !== 0">
    <v-row>
      <!-- 出力結果　-->
      <v-col xs6>
        <table>
          <thead>
          <tr>
            <th>res</th>
            <th>clear</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(res, index) in ocrRes">
            <tr>
              <td><v-text-input
                :id="`form-${index}`"
                v-model="textFormValues[index]"
                @keyup.enter.native="selectNext(index)"
                @keyup.down.native="selectNext(index)"
                @keyup.tab.native="selectNext(index)"
                @keyup.up.native="selectPrev(index)"
                @foucas.native="previewUpload(index)"
              ></v-text-input></td>
              <td><v-btn
                @click.native="clear(index)"
              ><v-icon>clear</v-icon></v-btn></td>
            </tr>
          </template>
          </tbody>
        </table>
      </v-col>
      <!-- プレビュー -->
      <v-col xs6>
        <img :src="prevImg" class="prevImage">
      </v-col>
    </v-row>
    <v-row>
      <v-btn block primary>ファイルをリネームする.</v-btn>
    </v-row>
    </template>
    <template v-if="ocrRes.length === 0">
      <div class="display-1">先にMainでOCRを掛けてね.</div>
    </template>
  </div>
</template>
<style scoped>
  img {
    max-width: 100%;
  }
</style>
<script>
    const fs = require('fs')
    export default{
      data () {
        // 結果をテキストフォームにいれとく.
        const textFormValues = []
        return {
          textFormValues,
          selectIndex: 0
        }
      },
      mounted () {
        this.ocrRes.forEach(v => {
          this.textFormValues.push(v.res)
        })
      },
      computed: {
        ocrRes () {
          return this.$store.state.file.ocrRes
        },
        selectedFile () {
          return this.ocrRes[this.selectIndex]
        },
        prevImg () {
          if (!this.selectedFile) {
            return ''
          }
          const path = this.selectedFile.path
          const imgDataUrl = new Buffer(fs.readFileSync(path)).toString('base64')
          return `data:image/jpg;base64,${imgDataUrl}`
        }
      },
      methods: {
        clear (index) {
          this.textFormValues[index] = ''
        },
        selectPrev (index) {
          if (index <= 0) {
            return
          }
          console.log(this.$el)
        },
        selectNext (index) {
          if (index >= this.orcRes.length) {
            return
          }
        },
        previewUpload (index) {
          this.selectIndex = index
        }

      }
    }
</script>
