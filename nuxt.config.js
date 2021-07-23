export default {
  target: "static",

  head: {
    title: "engineer-sns-client",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "engineer-sns-client" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  loading: { color: "#fff" },

  css: [],

  plugins: [
    "~/plugins/uikit.js",
    "~/plugins/api.js"
  ],

  modules: [
    '@nuxt/http'
  ],

  build: {
    extend(config, ctx) {}
  },

  http: {
  }
};
