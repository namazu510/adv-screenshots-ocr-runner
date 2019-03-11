<template>
  <div class="check-page">
    <v-progress-linear
      v-if="progressStatus !== undefined"
      :value="progressStatus"
    />
    <template v-if="ocrResults.length > 0">
      <v-layout row>
        <v-btn block primary :disabled="progressStatus !== undefined" @click="renameAll">
          すべてリネーム
        </v-btn>
      </v-layout>
      <div class="result-list">
        <result-list-item
          v-for="(res, i) in ocrResults"
          :key="i"
          :text="res.text"
          :file="res.file"
          @input="updateResult(i, $event)"
          @clear="removeResult(i)"
          @focus="setPreviewImage(i)"
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
      previewImage: null
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
