<template>
  <v-layout>
    <v-btn flat icon @click="$emit('clear')">
      <v-icon>clear</v-icon>
    </v-btn>
    <v-text-field
      ref="field"
      :label="file"
      :value="text"
      @input="$listeners.input"
      @focus="$listeners.focus"
      @keyup.up="$emit('prev')"
      @keyup.down="$emit('next')"
    />
  </v-layout>
</template>

<script>
export default {
  name: "ResultListItem",
  props: {
    file: String,
    text: String
  },
  methods: {
    focus() {
      this.$refs["field"].focus()
    }
  }
}
</script>

<style scoped></style>
