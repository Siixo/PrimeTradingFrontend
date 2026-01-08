<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Market Data</h1>

    <div class="flex gap-4 mb-6">
      <UButton
        :color="currentType === 'gold' ? 'primary' : 'gray'"
        @click="currentType = 'gold'"
      >
        Gold
      </UButton>
      <UButton
        :color="currentType === 'silver' ? 'primary' : 'gray'"
        @click="currentType = 'silver'"
      >
        Silver
      </UButton>
    </div>

    <UCard>
      <div v-if="loading" class="flex justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <div v-else-if="error" class="text-red-500 text-center p-8">
        {{ error }}
      </div>

      <UTable v-else :rows="sortedData" :columns="columns" :loading="loading" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const { user, fetchUser } = useAuth();

const currentType = ref<"gold" | "silver">("gold");
const data = ref<Record<string, number>>({});
const loading = ref(false);
const error = ref("");

const columns = [
  { key: "date", label: "Date", sortable: true },
  { key: "price", label: "Price (USD)", sortable: true },
];

const sortedData = computed(() => {
  return Object.entries(data.value)
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

async function fetchData(type: string) {
  loading.value = true;
  error.value = "";
  try {
    // Uses the Nuxt Proxy (/api/stock -> EC2)
    const response = await fetch(`/api/stock?type=${type}`, {
      method: "GET",
      credentials: "include", // Uses the proxy-managed cookie
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    data.value = await response.json();
  } catch (e) {
    error.value = "Error loading market data";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// Watch for type changes
watch(currentType, (newType) => {
  fetchData(newType);
});

onMounted(async () => {
  if (!user.value) {
    await fetchUser();
  }
  if (!user.value) {
    router.push("/login");
    return;
  }

  // Initial fetch
  fetchData(currentType.value);
});
</script>
