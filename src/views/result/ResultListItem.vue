<template>
  <v-layout>
    <v-btn flat icon @click="$emit('clear')">
      <v-icon>clear</v-icon>
    </v-btn>
    <v-text-field
            :label="file"
            :value="text"
            @input="$listeners.input"
            @focus="$listeners.focus"
    />
  </v-layout>
</template>

<script>
export default {
  name: "ResultListItem",
  props: {
    file: String,
    text: String
  }
}
</script>

<style scoped></style>
