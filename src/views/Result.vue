<template>
  <div class="check-page">
    <v-progress-linear
      v-if="progressStatus !== undefined"
      :value="progressStatus"
    />
    <template v-if="ocrResults.length > 0">
      <v-layout row>
        <v-flex xs8>
          <v-layout>
            <v-flex>
              <v-text-field v-model="replaceRegEx" label="RegEx"/>
            </v-flex>
            <v-flex>
              <v-text-field v-model="replaceSubstr" label="Substr"/>
            </v-flex>
            <v-flex>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon @click="replaceResult" v-on="on">
                    <v-icon>cached</v-icon>
                  </v-btn>
                </template>
                <span>正規表現置換します</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <v-btn block color="primary" :disabled="progressStatus !== undefined" @click="renameAll">
            すべてリネーム
          </v-btn>
        </v-flex>

      </v-layout>
      <div class="result-list">
        <result-list-item
          v-for="(res, i) in ocrResults"
          ref="field"
          :key="i"
          :text="res.text"
          :file="res.file"
          @input="updateResult(i, $event)"
          @clear="removeResult(i)"
          @focus="setPreviewImage(i)"
          @next="goNext(i)"
          @prev="goPrev(i)"
        />
      </div>
      <div class="preview-image-container">
        <img v-if="selectedFile" class="preview-image" :src="previewImage" />
      </div>
    </template>
    <template v-if="ocrResults.length === 0">
      <div class="display-1">OCR未実行</div>
    </template>
  </div>
</template>

<script>
import ResultListItem from "./result/ResultListItem"
import { loadImageWithBase64 } from "../util/file"

export default {
  name: "Result",
  components: { ResultListItem },
  data() {
    return {
      selectedFile: null,
      previewImage: null,
      replaceRegEx: '「(.*)」',
      replaceSubstr: '$1'
    }
  },
  computed: {
    ocrResults() {
      return this.$store.getters["ocrRes"]
    },
    progressStatus() {
      const status = this.$store.getters["status"]
      if (!status.inProgress) {
        return undefined
      }
      return Math.ceil(status.status * 100)
    }
  },
  methods: {
    goNext(i) {
      if (i  <= this.ocrResults.length) {
        const form =  this.$refs['field'][i+1]
        form && form.focus();
      }
    },
    goPrev(i) {
      if (i !== 0) {
        const form = this.$refs['field'][i-1];
        form && form.focus();
      }
    },
    async setPreviewImage(index) {
      this.selectedFile = this.ocrResults[index].file
      if (!this.selectedFile) {
        return
      }
      this.previewImage = await loadImageWithBase64(this.selectedFile)
    },
    updateResult(index, text) {
      this.$store.commit("updateOcrRes", {
        index,
        result: {
          text
        }
      })
    },
    removeResult(index) {
      this.$store.commit("removeOcrRes", {
        index
      })
    },
    renameAll() {
      this.$store.dispatch("renameAll", {})
    },
    replaceResult() {
      const test = new RegExp(this.replaceRegEx)
      if (test) {
        this.$store.dispatch('replaceResult', {
          regExp: this.replaceRegEx,
          subStr: this.replaceSubstr
        })
      }
    }
  }
}
</script>

<style scoped>
.result-list {
  max-height: 80vh;
  overflow: scroll;
}

.preview-image-container {
  position: absolute;
  bottom: 0;
  right: 0;
}

.preview-image {
  max-width: 50vw;
  max-height: 40vh;
  object-fit: contain;
}
</style>
