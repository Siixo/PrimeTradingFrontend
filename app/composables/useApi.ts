// ── Backend response types ──────────────────────────────────────────
export interface Commodity {
  id: number;
  commodity: string; // json:"commodity" (mapped from Name in Go)
  date: string; // ISO timestamp
  price_kg: number;
  unit: string;
  fetched_at?: string;
}

export interface Correlation {
  id: number;
  commodity_a: string;
  commodity_b: string;
  correlation_date: string; // ISO timestamp
  pearson_r: number;
  spearman_rho: number;
  data_points: number;
  created_at?: string;
}

// ── Chart-ready view models ─────────────────────────────────────────
export interface TimeValue {
  time: number; // Unix timestamp for intraday support
  value: number;
}

function normalizeChartData(items: TimeValue[]): TimeValue[] {
  // Sort ascending and dedupe by timestamp so lightweight-charts gets strictly increasing times.
  const sorted = [...items].sort((a, b) => a.time - b.time);
  const byTime = new Map<number, number>();
  for (const item of sorted) {
    byTime.set(item.time, item.value);
  }
  return Array.from(byTime.entries()).map(([time, value]) => ({ time, value }));
}

export function commoditiesToChart(items: Commodity[]): TimeValue[] {
  return normalizeChartData(
    items.map((c) => ({
      time: Math.floor(new Date(c.date).getTime() / 1000),
      value: c.price_kg,
    })),
  );
}

export function correlationsToChart(
  items: Correlation[],
  field: "pearson_r" | "spearman_rho" = "pearson_r",
): TimeValue[] {
  return normalizeChartData(
    items.map((c) => ({
      time: Math.floor(new Date(c.correlation_date).getTime() / 1000),
      value: c[field],
    })),
  );
}

// ── Fetch wrapper with 401 refresh-retry ────────────────────────────
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const csrfToken = useCookie("csrf_token");
  
  const opts: RequestInit = {
    ...init,
    credentials: "include",
    headers: { 
      "Content-Type": "application/json", 
      "X-CSRF-Token": csrfToken.value || "",
      ...init?.headers 
    },
  };

  let res = await fetch(path, opts);

  // If 401, attempt a single token refresh then retry
  if (res.status === 401) {
    const refresh = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (refresh.ok) {
      res = await fetch(path, opts);
    }
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Typed endpoint functions ────────────────────────────────────────
export function useApi() {
  /** Current price for gold/silver only */
  function getCommodityCurrent(type: string) {
    return apiFetch<Commodity>(
      `/api/commodity?type=${encodeURIComponent(type)}`,
    );
  }

  /** Price history for any supported commodity */
  function getCommodityHistory(name: string, limit = 100) {
    return apiFetch<Commodity[]>(
      `/api/commodity/${encodeURIComponent(name)}/history?limit=${limit}`,
    );
  }

  /** Latest correlation for a pair (e.g. "gold-silver") */
  function getCorrelationCurrent(type: string) {
    return apiFetch<Correlation>(
      `/api/correlation?type=${encodeURIComponent(type)}`,
    );
  }

  /** Correlation history for a pair */
  function getCorrelationHistory(a: string, b: string, limit = 100) {
    return apiFetch<Correlation[]>(
      `/api/correlation/history?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&limit=${limit}`,
    );
  }

  return {
    getCommodityCurrent,
    getCommodityHistory,
    getCorrelationCurrent,
    getCorrelationHistory,
  };
}
