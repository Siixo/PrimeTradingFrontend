<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  {
    label: "Releases",
    to: "https://github.com/Siixo/PrimeTradingFrontend/releases",
    target: "_blank",
  },
  {
    label: "Legal mentions",
    to: "/legal",
  },
];
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UButton
        icon="i-simple-icons-linkedin"
        color="neutral"
        variant="ghost"
        to="https://www.linkedin.com/in/nicolasknittel31"
        target="_blank"
        aria-label="LinkedIn"
      />
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/Siixo/PrimeTradingFrontend"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
