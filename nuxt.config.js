export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'oscars2021',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/style/index.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  buefy: {
    css: false,
  },

  // Firebase configuration: https://firebase.nuxtjs.org/guide/options
  firebase: {
    config: {
      // REQUIRED: Official config for firebase.initializeApp(config):
      apiKey: process.env.firestoreApiKey,
      authDomain: process.env.firestoreAuthDomain,
      projectId: process.env.firestoreProjectId,
      storageBucket: process.env.firestoreStorageBucket,
      messagingSenderId: process.env.firestoreMessagingSenderId,
      appId: process.env.firestoreAppId,
    },
    services: { firestore: true },
  },
}
