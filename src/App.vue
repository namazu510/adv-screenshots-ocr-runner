<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>AdvScreenshotsOcrRunner</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="$router.push({ name: 'main' })">
        <span class="mr-2">Main</span>
      </v-btn>
      <v-btn flat @click="$router.push({ name: 'result' })">
        <span class="mr-2">Result</span>
      </v-btn>
      <v-btn flat disabled>
        <span class="mr-2">Settings</span>
      </v-btn>
    </v-toolbar>
    <v-content class="ma-2">
      <keep-alive>
        <main-view v-if="$route.name === 'main'" :key="'mainView'"/>
        <router-view v-else :key="'routerView'"/>
      </keep-alive>
    </v-content>
  </v-app>
</template>

<script>
import Main from "./views/Main"
export default {
  name: "App",
  components: {MainView: Main}
}
</script>
