<template>
  <div class="check-page">
    <template v-if="ocrResults.length > 0">
      <v-layout row>
        <!-- 出力結果 -->
        <v-flex xs8>
          <result-list-item
            v-for="(res, i) in ocrResults"
            :key="i"
            :text="res.text"
            :file="res.file"
          />
        </v-flex>
        <!-- プレビュー -->
        <v-flex xs4>
          <img :src="prevImg" class="prevImage" />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-btn block primary>
          すべてリネームする.
        </v-btn>
      </v-layout>
    </template>
    <template v-if="ocrResults.length === 0">
      <div class="display-1">OCR未実行</div>
    </template>
  </div>
</template>

<script>
import ResultListItem from "./result/ResultListItem"
export default {
  name: "Result",
  components: { ResultListItem },
  computed: {
    ocrResults() {
      return this.$store.getters["ocrRes"]
    }
  },
  methods: {
    renameAll() {},
    removeRes() {}
  }
}
</script>

<style scoped></style>
