type Counter = {
  no_onload: boolean;
  endpoint: string;
  count?: (view: { path: string; title: string; referrer: string }) => void;
  filter?: () => string | false;
};

export function setupAnalytics(endpoint: string) {
  if (!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(endpoint)) return;
  if (location.hostname !== "danieldanyang.github.io") return;
  if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;

  const counterWindow = window as Window & { goatcounter?: Counter };
  let loaded: Promise<Counter | undefined> | undefined;
  let generation = 0;
  let lastPath: string | undefined;
  let initialReferrer = "";
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== location.origin) initialReferrer = referrer.origin;
  } catch { /* Direct visits have no referrer. */ }

  function loadCounter() {
    if (!loaded) loaded = new Promise<Counter | undefined>((resolve) => {
      counterWindow.goatcounter = { no_onload: true, endpoint };
      const script = document.createElement("script");
      script.src = "https://gc.zgo.at/count.js";
      script.async = true;
      script.fetchPriority = "low";
      script.dataset.goatcounter = endpoint;
      script.onload = () => resolve(counterWindow.goatcounter);
      script.onerror = () => resolve(undefined);
      document.head.appendChild(script);
    });
    return loaded;
  }

  function scheduleView() {
    // Never compete with the initial page's fonts, images, or load event.
    if (document.readyState !== "complete") return;
    const currentGeneration = ++generation;
    const record = async () => {
      if (currentGeneration !== generation) return;
      const counter = await loadCounter();
      if (currentGeneration !== generation || !counter?.count || counter.filter?.()) return;
      const path = location.pathname;
      if (path === lastPath) return;
      try {
        // Exclude query strings, fragments, and full referrer URLs.
        counter.count({ path, title: document.title, referrer: lastPath === undefined ? initialReferrer : "" });
        lastPath = path;
      } catch { /* Statistics must never interfere with the website. */ }
    };
    if (window.requestIdleCallback) window.requestIdleCallback(() => void record(), { timeout: 2000 });
    else window.setTimeout(() => void record(), 1000);
  }

  document.addEventListener("astro:before-swap", () => { generation++; });
  document.addEventListener("astro:page-load", scheduleView);
  if (document.readyState === "complete") scheduleView();
  else window.addEventListener("load", scheduleView, { once: true });
}
