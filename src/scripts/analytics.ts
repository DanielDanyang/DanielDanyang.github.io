export function setupAnalytics(endpoint: string) {
  if (!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(endpoint)) return;
  if (location.hostname !== "danieldanyang.github.io") return;
  if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;

  let generation = 0;
  let lastPath: string | undefined;
  let initialReferrer = "";
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== location.origin) initialReferrer = referrer.origin;
  } catch { /* Direct visits have no referrer. */ }

  function scheduleView() {
    // Never compete with the initial page's fonts, images, or load event.
    if (document.readyState !== "complete") return;
    const currentGeneration = ++generation;
    const record = () => {
      if (currentGeneration !== generation) return;
      const path = location.pathname;
      if (path === lastPath) return;
      const url = new URL(endpoint);
      url.searchParams.set("p", path);
      url.searchParams.set("t", document.title);
      url.searchParams.set("r", lastPath === undefined ? initialReferrer : "");
      url.searchParams.set("rnd", Math.random().toString(36).slice(2));
      if (navigator.webdriver) url.searchParams.set("b", "153");
      try {
        // Official /count GET API: no third-party JS, cookies, query strings,
        // fragments, or full referrer URLs. Failures never affect page use.
        void window.fetch(url.href, {
          mode: "no-cors",
          credentials: "omit",
          referrerPolicy: "no-referrer",
          cache: "no-store",
          keepalive: true,
          priority: "low",
        }).catch(() => {});
        lastPath = path;
      } catch { /* Statistics must never interfere with the website. */ }
    };
    if (window.requestIdleCallback) window.requestIdleCallback(record, { timeout: 2000 });
    else window.setTimeout(record, 1000);
  }

  document.addEventListener("astro:before-swap", () => { generation++; });
  document.addEventListener("astro:page-load", scheduleView);
  if (document.readyState === "complete") scheduleView();
  else window.addEventListener("load", scheduleView, { once: true });
}
