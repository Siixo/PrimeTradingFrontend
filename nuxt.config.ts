// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

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

  routeRules: {
    "/api/**": {
      proxy:
        "http://ec2-35-180-31-240.eu-west-3.compute.amazonaws.com:8080/api/**",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
