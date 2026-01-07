<script setup lang="js">
import AppHeader from "~/components/common/AppHeader.vue";
import AppFooter from "~/components/common/AppFooter.vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UApp>
      <AppHeader />
      <main class="flex-1">
        <NuxtPage />
      </main>
      <AppFooter />
    </UApp>
    <SpeedInsights />
  </div>
</template>
