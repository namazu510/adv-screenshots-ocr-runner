export default [
  // {
  //   path: '/',
  //   name: 'landing-page',
  //   component: require('components/LandingPageView')
  // },
  {
    path: '/',
    component: require('components/MainPageView')
  },
  {
    path: '/settings',
    component: require('components/SettingPageView')
  },
  {
    path: '/help',
    component: require('components/HelpPageView')
  }
]
