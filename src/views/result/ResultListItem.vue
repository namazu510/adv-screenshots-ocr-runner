<template>
  <div>
    <v-text-field :label="file" :value="text" />
  </div>
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
