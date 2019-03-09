import Vue from 'vue';
import Router from "vue-router";
import MainView from '../views/Main'
import ResultView from '../views/Result'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      name: 'main',
      path: "/",
      component: MainView
    },
    {
      name: 'result',
      path: "/result",
      component: ResultView
    }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});
