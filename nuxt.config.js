const APP_URL = 'https://bidify-zcwd7.ondigitalocean.app/'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Bidify',
    meta: [
      { charset: 'utf-8' },
      { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'NFT Auction Market (non-fungible tokens)' },
      { hid: 'og:title', property: 'og:title', content: 'Bidify - NFT Auction Market' },
      { hid: 'og:description', property: 'og:description', content: 'NFT Auction Market (non-fungible tokens)' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: APP_URL },
      { hid: 'og:image', property: 'og:image', content: APP_URL + '/seo/og.png' },
      { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
      { hid: 'og:image:height', property: 'og:image:height', content: '800' }
    ],
    link: [
      { rel: 'apple-touch-icon', href: '/icon/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'icon', href: '/icon/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', href: '/icon/favicon-16x16.png', sizes: '16x16' },
      { rel: 'manifest', href: '/icon/site.webmanifest' }
    ],
    script: [

    ]
  },
  dev: process.env.NODE_ENV !== 'production',
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/bootstrap.css',
    '@/assets/css/style.css',
    '@/assets/css/mdi.css',
    '@/assets/css/fl-bigmug-line.css',
    '@/assets/styles/app.styl',
    '@/assets/styles/theme.styl',
    '@/assets/theme/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/bootstrap-vue',
    { src: '@/plugins/bidify', ssr: false, mode: 'client' },
    { src: '@/plugins/browser', ssr: false, mode: 'client' },
    { src: '@/plugins/element-ui' },
    { src: '@/plugins/image-preloader', ssr: false, mode: 'client' },
    { src: '@/plugins/listings', ssr: false, mode: 'client' },
    { src: '@/plugins/mixins', ssr: false, mode: 'client' },
    { src: '@/plugins/opensea', ssr: false, mode: 'client' },
    { src: '@/plugins/wallets', ssr: false, mode: 'client' }
  ],

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://bidify.org',
    infuraURL: process.env.INFURA_URL || 'https://rinkeby.infura.io/v3/96ffec68046b4148872ac3b0453d0b4f',
    openseaURL: process.env.OPENSEA_URL || 'https://rinkeby-api.opensea.io/api/v1/',
    openseaAssetsURL: process.env.OPENSEA_ASSETS_URL || '${openseaURL}assets',
    bidifyAddress: process.env.BIDIFY_ADDRESS || '0x138c81d54cbd016d524757d26bfdbf4addb8f808', //'0x451d44624D29874A0Ba90bD902D2BD95CCD3A48d',
    platformAddress: process.env.BIDIFY_ADDRESS || '0x68cc7260288377d68a32ee3e44defc6f2c6ccbc9', //'0x451d44624D29874A0Ba90bD902D2BD95CCD3A48d',
    nftAddress: process.env.NFT_ADDRESS || '0x22315052952395e072469048330716659b27d857',
    validChains: process.env.VALID_CHAINS || ['0x4', 'rinkeby', 4], // '0x1', 'main', 1,
    chainNames: process.env.CHAIN_NAMES || ['Rinkeby'] // 'Mainnet'
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@aceforth/nuxt-optimized-images',
    '@nuxtjs/svg',
    '@nuxtjs/device',
    '@nuxtjs/google-gtag',
    '@nuxtjs/color-mode'
  ],

  device: {
    refreshOnResize: true
  },
  // 'google-gtag': {
  //   id: 'UA-XXXXXXXX',
  //   config: {
  //     anonymize_ip: true, // anonymize IP
  //     linker: {
  //       domains: ['bidify.org']
  //     }
  //   }
  //   // debug: true, // enable to track in dev mode
  // },
  mode: 'spa',
  styleResources: {
    stylus: [
      './assets/mixins.styl',
      './assets/tokens.styl',
      '@nib'
    ]
  },

  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: true,
    handleImages: ['jpeg', 'png', 'webp', 'gif']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-webfontloader',
    ['nuxt-vuex-localstorage', {
      wallet: {
        provider: null,
        keepDisconnect: false
      }
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  generate: {
    routes: ['error']
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/]
  }
}
