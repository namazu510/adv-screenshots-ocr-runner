<template>
  <div id="#app">
    <v-app top-navbar footer>
      <header>
        <v-navbar class="green">
          <v-navbar-logo class="hidden-sm-and-down">Eroga-SS-OCR-Runner</v-navbar-logo>
          <v-navbar-items>
            <v-navbar-item v-for="item in linkItems" :item="item"></v-navbar-item>
          </v-navbar-items>
        </v-navbar>
      </header>
      <main>
        <v-content>
          <v-container fluid>
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </v-container>
        </v-content>
      </main>
    </v-app>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store,
    data () {
      return {
        linkItems: [
          {
            text: 'Main',
            href: '/',
            router: true
          },
          {
            text: 'Result',
            href: '/result',
            router: true
          },
          {
            text: 'Setting',
            href: '/settings',
            router: true
          },
          {
            text: 'Help',
            href: '/help',
            router: true
          }
        ]
      }
    },
    mounted () {
      this.$vuetify.init()
    }
  }
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }

  #app {
    width: 95vw;
    height: 95vh;
  }
</style>
