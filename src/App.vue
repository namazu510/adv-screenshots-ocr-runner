<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>AdvScreenshotsOcrRunner</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>
        <span class="mr-2">Main</span>
      </v-btn>
      <v-btn flat>
        <span class="mr-2">Result</span>
      </v-btn>
      <v-btn flat>
        <span class="mr-2">Settings</span>
      </v-btn>
    </v-toolbar>
    <v-content class="ma-2">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
}
</script>
