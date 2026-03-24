// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const apiBaseUrl = (
  process.env.NUXT_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  // Explicitly set buildDir to avoid potential path issues
  buildDir: ".nuxt",

  devServer: {
    host: "0.0.0.0",
    port: 3100,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBaseUrl,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
