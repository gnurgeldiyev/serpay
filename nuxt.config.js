const { base_url, node_env, google_analytics } = require("./config");
const isDevMode = node_env !== "production" ? true : false;
module.exports = {
  telemetry: false,
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: "tk",
    },
    title: "Serpaý – Goşgular Çemeni",
    meta: [
      { charset: "utf-8" },
      { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Türkmen edebiýatyndan goşgular çemeni",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    noscript: [{ innerHTML: "This website requires JavaScript." }],
    // script: [
    //   {
    //     src: `https://www.googletagmanager.com/gtag/js?id=${google_analytics}`,
    //     async: true,
    //   },
    //   {
    //     innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){window.dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${google_analytics}');`,
    //     type: "text/javascript",
    //     defer: true,
    //   },
    // ],
    __dangerouslyDisableSanitizers: ["script"],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#080808" },

  /*
   ** Global CSS
   */
  css: ["element-ui/lib/theme-chalk/index.css", "quill/dist/quill.snow.css"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "@/plugins/element-ui.js" },
    { src: "@/plugins/quill-editor.client.js" },
  ],
  dev: isDevMode,
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    "@nuxtjs/sitemap",
    ["@nuxtjs/component-cache", { maxAge: 1000 * 60 * 60 }],
    [
      "nuxt-social-meta",
      {
        url: "https://serpay.penjire.com",
        title: "Serpaý – Goşgular Çemeni",
        description: "Türkmen edebiýatyndan goşgular çemeni",
        img: "/favicon.png",
        locale: "tk_TM",
        twitter: "@penjire",
        themeColor: "#080808",
      },
    ],
  ],
  // app sitemap
  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://serpay.penjire.com",
    cacheTime: 1000 * 60 * 10,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: ["/@serpay", "/@serpay/**"],
    routes: [
      {
        url: "/p/gurbannazar-ezizow",
        changefreq: "daily",
        priority: 1,
      },
      {
        url: "/p/çary-ýegenmyradow",
        changefreq: "daily",
        priority: 1,
      },
      {
        url: "/p/kerim-gurbannepesow",
        changefreq: "daily",
        priority: 1,
      },
    ],
  },
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.BASE_URL || "http://localhost:4000",
    credentials: true,
    debug: isDevMode,
    retry: {
      retries: 3,
    },
    proxy: true,
  },
  serverMiddleware: ["@/common/cache.js"],
  /*
   * Render (preload & prefetch)
   */
  render: {
    http2: {
      push: true,
    },
    bundleRenderer: {
      shouldPrefetch: (file, type) =>
        ["script", "style", "font"].includes(type) && !file.includes("@admin"),
    },
  },
  /*
   ** Build configuration
   */
  build: {
    // plugins: [
    //   new ProvidePlugin({
    //     "window.Quill": "quill",
    //   }),
    // ],
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
