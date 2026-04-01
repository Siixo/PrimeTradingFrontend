<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Market Data</h1>

    <!-- Commodity selector -->
    <div class="flex flex-wrap gap-4 mb-6">
      <UButton
        v-for="c in commodities"
        :key="c"
        :color="currentCommodity === c ? 'primary' : 'neutral'"
        @click="currentCommodity = c"
      >
        {{ c.charAt(0).toUpperCase() + c.slice(1) }}
      </UButton>

      <USelect v-model="selectedLimit" :items="limitOptions" class="w-32" />
    </div>

    <UCard class="mb-6">
      <div ref="chartContainer" class="w-full h-[400px]"></div>
    </UCard>

    <UCard>
      <div v-if="loading" class="flex justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <div v-else-if="error" class="text-red-500 text-center p-8">
        {{ error }}
      </div>

      <UTable v-else :data="tableRows" :columns="columns" :loading="loading" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { AreaSeries, createChart, ColorType } from "lightweight-charts";
import type { Commodity, TimeValue } from "~/composables/useApi";
import { commoditiesToChart } from "~/composables/useApi";

definePageMeta({ middleware: "auth" });

const { getCommodityHistory } = useApi();

const commodities = ["gold", "silver", "copper", "brent", "aluminum"] as const;
const currentCommodity = ref<string>("gold");

const limitOptions = [
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "180 days", value: "180" },
  { label: "365 days", value: "365" },
];
const selectedLimit = ref("365");

const rawData = ref<Commodity[]>([]);
const loading = ref(false);
const error = ref("");
const chartContainer = ref<HTMLElement | null>(null);

let chart: ReturnType<typeof createChart> | null = null;
let areaSeries: any = null;

const columns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "price", header: "Price (USD/kg)" },
  { accessorKey: "unit", header: "Unit" },
];

const tableRows = computed(() =>
  rawData.value
    .map((c) => ({
      date: c.date.slice(0, 10),
      price: c.price_kg.toFixed(2),
      unit: c.unit,
    }))
    .sort((a, b) => b.date.localeCompare(a.date)),
);

const chartData = computed<TimeValue[]>(() =>
  commoditiesToChart(rawData.value),
);

async function fetchData() {
  loading.value = true;
  error.value = "";
  try {
    rawData.value = await getCommodityHistory(
      currentCommodity.value,
      Number(selectedLimit.value),
    );
    updateChart();
  } catch (e: any) {
    error.value = e?.message || "Error loading market data";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function updateChart() {
  if (areaSeries && chart) {
    areaSeries.setData(chartData.value);
    chart.timeScale().fitContent();
  }
}

// Re-fetch when commodity or limit changes
watch([currentCommodity, selectedLimit], () => fetchData());

onMounted(async () => {
  if (chartContainer.value) {
    chart = createChart(chartContainer.value, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9Ca3af",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainer.value.clientWidth,
      height: 400,
    });

    areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#22c55e",
      topColor: "#22c55e",
      bottomColor: "rgba(34, 197, 94, 0.28)",
    });

    const handleResize = () => {
      if (chartContainer.value && chart) {
        chart.applyOptions({ width: chartContainer.value.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);
  }

  fetchData();
});
</script>
