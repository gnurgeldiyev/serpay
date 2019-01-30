const webpack = require('webpack')
const { base_url, node_env, google_analytics } = require('./config')
const isDevMode = node_env !== 'production' ? true : false

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Serpaý – Goşgular Çemeni',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Türkmen edebiýatyndan goşgular çemeni' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ],
    noscript: [
      { innerHTML: 'This website requires JavaScript.' }
    ],
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${google_analytics}`, async: true },
      { 
        innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){window.dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${google_analytics}');`, 
        type: 'text/javascript',
        defer: true
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#080808' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'quill/dist/quill.snow.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/quill-editor', ssr: false }
  ],
  dev: isDevMode,
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    [
      "nuxt-imagemin",
      {
        optipng: { optimizationLevel: 5 },
        gifsicle: { optimizationLevel: 2 }
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: base_url,
    credentials: true,
    debug: isDevMode,
    retry: {
      retries: 3
    },
    proxy: true
  },
  // enable caching
  cache: true,
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill'
      })
    ],
    extend(config, { isDev, isClient}) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
