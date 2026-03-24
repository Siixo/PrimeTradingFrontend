<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { user } = useAuth();
const isMenuOpen = ref(false);

const items = computed<NavigationMenuItem[]>(() => {
  const baseItems = [
    {
      label: "Home",
      to: "/",
      icon: "i-lucide-home",
      active: route.path === "/",
    },
    {
      label: "Graphs",
      to: "/graphs",
      icon: "i-material-symbols:ssid-chart",
      active: route.path.startsWith("/graphs"),
    },
    {
      label: "Predictions",
      to: "/predictions",
      icon: "i-tabler:math-max-min",
      active: route.path.startsWith("/predictions"),
    },
  ];

  if (user.value) {
    baseItems.push({
      label: "Profile",
      to: "/profile",
      icon: "i-heroicons-user-circle-20-solid",
      active: route.path.startsWith("/profile"),
    });
  }

  baseItems.push({
    label: "About",
    to: "/about",
    icon: "i-ic:outline-info",
    active: route.path.startsWith("/about"),
  });

  return baseItems;
});
</script>

<template>
  <UHeader
    v-model:open="isMenuOpen"
    :toggle="{
      color: 'neutral',
      variant: 'ghost',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <AppLogo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <template v-if="!user">
        <UButton color="primary" variant="solid" to="/login" label="Login" />
        <UButton
          color="neutral"
          variant="outline"
          to="/register"
          label="Register"
          class="ml-2 hidden sm:flex"
        />
      </template>
      <template v-else>
        <UButton
          color="neutral"
          variant="ghost"
          to="/profile"
          icon="i-heroicons-user-circle-20-solid"
          class="mr-2"
        />
      </template>

      <UColorModeButton class="ml-2" />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          class="hidden sm:flex ml-2"
        />
      </UTooltip>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 p-4">
        <!-- Prominent Home Link for mobile as requested -->
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          icon="i-lucide-home"
          label="Home"
          class="justify-start -mx-2.5"
          @click="isMenuOpen = false"
        />
        
        <UNavigationMenu 
          :items="items" 
          orientation="vertical" 
          class="-mx-2.5" 
          @click="isMenuOpen = false"
        />
        
        <template v-if="!user">
          <UButton 
            to="/login" 
            label="Login" 
            block 
            @click="isMenuOpen = false" 
          />
          <UButton 
            to="/register" 
            label="Register" 
            variant="outline" 
            block 
            @click="isMenuOpen = false" 
          />
        </template>
      </div>
    </template>
  </UHeader>
</template>
