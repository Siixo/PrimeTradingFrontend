<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Correlation Analytics</h1>

    <!-- Pair selector -->
    <div class="flex flex-wrap gap-4 mb-6">
      <UButton
        v-for="p in pairs"
        :key="p.key"
        :color="selectedPair.key === p.key ? 'primary' : 'neutral'"
        @click="selectedPair = p"
      >
        {{ p.label }}
      </UButton>

      <USelect v-model="selectedLimit" :items="limitOptions" class="w-32" />
    </div>

    <!-- Summary cards -->
    <div v-if="latest" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <UCard>
        <p class="text-sm text-gray-400">Pearson R</p>
        <p class="text-2xl font-bold">{{ latest.pearson_r.toFixed(4) }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-400">Spearman Rho</p>
        <p class="text-2xl font-bold">{{ latest.spearman_rho.toFixed(4) }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-400">Data Points</p>
        <p class="text-2xl font-bold">{{ latest.data_points }}</p>
      </UCard>
    </div>

    <!-- Chart -->
    <UCard class="mb-6">
      <div v-if="loading" class="flex justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>
      <div v-else-if="error" class="text-red-500 text-center p-8">
        {{ error }}
      </div>
      <div v-else ref="chartContainer" class="w-full h-[400px]"></div>
    </UCard>

    <!-- History table -->
    <UCard v-if="!loading && !error && history.length">
      <UTable :rows="tableRows" :columns="columns" :loading="loading" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import type { Correlation, TimeValue } from "~/composables/useApi";
import { correlationsToChart } from "~/composables/useApi";

definePageMeta({ middleware: "auth" });

const { getCorrelationCurrent, getCorrelationHistory } = useApi();

const pairs = [
  { key: "gold-silver", a: "gold", b: "silver", label: "Gold / Silver" },
  {
    key: "copper-aluminum",
    a: "copper",
    b: "aluminum",
    label: "Copper / Aluminum",
  },
  { key: "copper-brent", a: "copper", b: "brent", label: "Copper / Brent" },
  { key: "gold-copper", a: "gold", b: "copper", label: "Gold / Copper" },
];

const selectedPair = ref(pairs[0]);

const limitOptions = [
  { label: "30 pts", value: "30" },
  { label: "90 pts", value: "90" },
  { label: "180 pts", value: "180" },
  { label: "365 pts", value: "365" },
];
const selectedLimit = ref("100");

const latest = ref<Correlation | null>(null);
const history = ref<Correlation[]>([]);
const loading = ref(false);
const error = ref("");
const chartContainer = ref<HTMLElement | null>(null);

let chart: ReturnType<typeof createChart> | null = null;
let pearsonSeries: any = null;
let spearmanSeries: any = null;

const columns = [
  { id: "date", key: "date", label: "Date", sortable: true },
  { id: "pearson", key: "pearson", label: "Pearson R", sortable: true },
  { id: "spearman", key: "spearman", label: "Spearman Rho", sortable: true },
  { id: "points", key: "points", label: "Data Points" },
];

const tableRows = computed(() =>
  history.value
    .map((c) => ({
      date: c.correlation_date.slice(0, 10),
      pearson: c.pearson_r.toFixed(4),
      spearman: c.spearman_rho.toFixed(4),
      points: c.data_points,
    }))
    .sort((a, b) => b.date.localeCompare(a.date)),
);

const pearsonChart = computed<TimeValue[]>(() =>
  correlationsToChart(history.value, "pearson_r"),
);
const spearmanChart = computed<TimeValue[]>(() =>
  correlationsToChart(history.value, "spearman_rho"),
);

async function fetchData() {
  loading.value = true;
  error.value = "";
  try {
    const pair = selectedPair.value;
    const [latestRes, historyRes] = await Promise.all([
      getCorrelationCurrent(pair.key).catch(() => null),
      getCorrelationHistory(pair.a, pair.b, Number(selectedLimit.value)),
    ]);

    latest.value = latestRes;
    history.value = historyRes;

    await nextTick();
    initChart();
    updateChart();
  } catch (e: any) {
    error.value = e?.message || "Error loading correlation data";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function initChart() {
  if (chart || !chartContainer.value) return;

  chart = createChart(chartContainer.value, {
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: "#9Ca3af",
    },
    grid: {
      vertLines: { color: "#374151" },
      horzLines: { color: "#374151" },
    },
    width: chartContainer.value.clientWidth,
    height: 400,
  });

  pearsonSeries = chart.addSeries(LineSeries, {
    color: "#3b82f6",
    lineWidth: 2,
    title: "Pearson R",
  });

  spearmanSeries = chart.addSeries(LineSeries, {
    color: "#f59e0b",
    lineWidth: 2,
    title: "Spearman Rho",
  });

  const handleResize = () => {
    if (chartContainer.value && chart) {
      chart.applyOptions({ width: chartContainer.value.clientWidth });
    }
  };
  window.addEventListener("resize", handleResize);
}

function updateChart() {
  if (!chart) return;
  pearsonSeries?.setData(pearsonChart.value);
  spearmanSeries?.setData(spearmanChart.value);
  chart.timeScale().fitContent();
}

// Destroy and recreate chart on pair/limit change so the container re-renders
watch([selectedPair, selectedLimit], () => {
  if (chart) {
    chart.remove();
    chart = null;
    pearsonSeries = null;
    spearmanSeries = null;
  }
  fetchData();
});

onMounted(async () => {
  fetchData();
});
</script>
