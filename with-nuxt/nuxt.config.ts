export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
  },
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],
  runtimeConfig: {
    // Lakebase connection is handled in server/utils/lakebase.ts via env vars
  },
})