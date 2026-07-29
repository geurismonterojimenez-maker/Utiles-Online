type DataLayerEvent = Record<string, string | number | boolean | undefined>;

function push(event: DataLayerEvent) {
  const win = window as Window & { dataLayer?: DataLayerEvent[] };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(event);
}

export function initializeMeasurement() {
  push({ event: "page_ready", page_path: location.pathname });

  window.addEventListener("error", event => push({
    event: "client_error",
    error_message: event.message.slice(0, 180),
    page_path: location.pathname
  }));

  window.addEventListener("unhandledrejection", event => push({
    event: "client_error",
    error_message: String(event.reason).slice(0, 180),
    page_path: location.pathname
  }));

  if (!("PerformanceObserver" in window)) return;

  try {
    let cls = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value?: number; hadRecentInput?: boolean })[]) {
        if (!entry.hadRecentInput) cls += entry.value || 0;
      }
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) push({ event: "web_vital", metric_name: "LCP", metric_value: Math.round(last.startTime), page_path: location.pathname });
    }).observe({ type: "largest-contentful-paint", buffered: true });

    let inp = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as (PerformanceEntry & { duration: number; interactionId?: number })[]) {
        if (entry.interactionId && entry.duration > inp) inp = entry.duration;
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);

    window.addEventListener("pagehide", () => {
      push({ event: "web_vital", metric_name: "CLS", metric_value: Number(cls.toFixed(4)), page_path: location.pathname });
      if (inp) push({ event: "web_vital", metric_name: "INP", metric_value: Math.round(inp), page_path: location.pathname });
    }, { once: true });
  } catch {
    // Algunos navegadores no exponen todas las métricas.
  }
}
