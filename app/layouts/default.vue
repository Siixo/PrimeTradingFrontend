<script setup lang="js">
import AppHeader from "~/components/common/AppHeader.vue";
import AppFooter from "~/components/common/AppFooter.vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UApp>
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary-500 focus:text-white"
      >
        Skip to main content
      </a>
      <AppHeader />
      <main id="main-content" class="flex-1">
        <slot />
      </main>
      <AppFooter />
    </UApp>
    <SpeedInsights />
    <Analytics />
  </div>
</template>
