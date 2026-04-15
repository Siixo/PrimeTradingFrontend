<script setup>
const cards = ref([
  {
    title: "NuxtJS",
    description:
      "Frontend built with NuxtJS, a powerful Vue.js framework for server-side rendering.",
    icon: "i-catppuccin:nuxt-ignore",
    to: "/docs/getting-started/integrations/icons",
  },
  {
    title: "Go (Golang)",
    description:
      "Backend powered by Go, high-performance programming language designed for concurrency and speed.",
    icon: "i-mdi:language-go",
    to: "/docs/getting-started/integrations/go",
  },
  {
    title: "Lightweight graph library",
    description:
      "LW graph library integration for rendering interactive charts and graphs.",
    icon: "i-lucide-chart-line",
    to: "/docs/getting-started/integrations/graph-library",
  },
  {
    title: "PostgreSQL",
    description:
      "Robust and scalable PostgreSQL database for reliable data storage and management.",
    icon: "i-devicon-plain:postgresql-wordmark",
    to: "/docs/getting-started/integrations/postgresql",
  },
  {
    title: "High Performance",
    description:
      "Low latency data processing ensuring real-time insights for commodity correlations.",
    icon: "i-lucide-zap",
    to: "/docs/getting-started/integrations/performance",
  },
  {
    title: "Nuxt UI",
    description:
      "Beautiful and customizable UI components powered by Nuxt UI library.",
    icon: "i-logos:nuxt-icon",
    to: "/docs/getting-started/integrations/nuxt-ui",
  },
]);
</script>

<template>
  <div>
    <section aria-label="Hero" class="relative h-screen w-full">
      <video
        class="h-full w-full object-cover object-center"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        aria-label="Stock trading hero video background"
      >
        <source src="/277097.mp4" type="video/mp4" />
        <p class="text-center text-gray-500 mt-4">
          Your browser does not support the video tag. Please update your
          browser for the best experience.
        </p>
      </video>
      <div
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-center"
      >
        <h1 class="text-white text-6xl font-bold mb-6 leading-tight">
          Welcome to <br />PrimeTrading
        </h1>
        <NuxtLink
          to="/register"
          class="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition mb-4"
        >
          Get Started
        </NuxtLink>
        <a href="#discover" aria-label="Scroll to discover section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <!-- Icon from IconaMoon by Dariush Habibpour - https://creativecommons.org/licenses/by/4.0/ -->
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="m7 10l5 5m0 0l5-5"
            />
          </svg>
        </a>
      </div>
    </section>
    <section
      id="discover"
      class="discover p-8 max-w-4xl mx-auto flex flex-col items-center text-center gap-4"
    >
      <h2 class="text-2xl font-bold mb-4">Discover</h2>
      <p class="text-gray-600 mb-6">
        Explore the features and benefits of PrimeTrading.
      </p>
      <UPageGrid>
        <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
      </UPageGrid>
    </section>
  </div>
</template>
