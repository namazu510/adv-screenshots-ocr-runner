<template>
  <div class="check-page">
    <template v-if="ocrResults.length > 0">
      <v-layout row>
        <result-list-item
          v-for="(res, i) in ocrResults"
          :key="i"
          :text="res.text"
          :file="res.file"
          @input="updateResult(i, $event)"
          @clear="removeResult(i)"
        />
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
    updateResult(index, text) {
      this.$store.commit("updateOcrRes", {
        index,
        result: {
          text
        }
      })
    },
    removeResult(index) {
      this.$store.commit('removeOcrRes', {
        index
      })
    },
    renameAll() {
      this.$store.dispatch('renameAll', {

      })
    },
  }
}
</script>

<style scoped></style>
