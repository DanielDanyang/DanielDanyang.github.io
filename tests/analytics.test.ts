import { afterEach, expect, it, vi } from "vitest";
import { setupAnalytics } from "../src/scripts/analytics";

const endpoint = "https://example.goatcounter.com/count";

afterEach(() => vi.unstubAllGlobals());

function browser(readyState = "loading") {
  const events = new Map<string, () => void>();
  const idle: (() => void)[] = [];
  const scripts: any[] = [];
  const win: any = {
    addEventListener: (name: string, listener: () => void) => events.set(name, listener),
    requestIdleCallback: (callback: () => void) => idle.push(callback),
  };
  const doc = {
    readyState,
    title: "Home",
    referrer: "https://example.org/profile?private=value#fragment",
    addEventListener: win.addEventListener,
    createElement: () => ({ dataset: {} }),
    head: { appendChild: (script: any) => scripts.push(script) },
  };
  const loc = { hostname: "danieldanyang.github.io", origin: "https://danieldanyang.github.io", pathname: "/", search: "?private=value", hash: "#research" };
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal("location", loc);
  vi.stubGlobal("navigator", { doNotTrack: "0" });
  return { events, idle, scripts, win, doc, loc };
}

it("waits for load and idle, strips private URL details, and counts routed pages once", async () => {
  const b = browser();
  setupAnalytics(endpoint);
  b.events.get("astro:page-load")!();
  expect(b.idle).toHaveLength(0);
  expect(b.scripts).toHaveLength(0);
  b.doc.readyState = "complete";
  b.events.get("load")!();
  expect(b.scripts).toHaveLength(0);
  b.idle.shift()!();
  const script = b.scripts[0];
  expect(script.async).toBe(true);
  expect(script.fetchPriority).toBe("low");
  const count = vi.fn();
  b.win.goatcounter.count = count;
  script.onload();
  await Promise.resolve();
  expect(count).toHaveBeenCalledWith({ path: "/", title: "Home", referrer: "https://example.org" });
  b.events.get("astro:page-load")!();
  b.idle.shift()!();
  await Promise.resolve();
  expect(count).toHaveBeenCalledTimes(1);
  b.events.get("astro:before-swap")!();
  b.loc.pathname = "/personal/";
  b.doc.title = "Personal";
  b.events.get("astro:page-load")!();
  b.idle.shift()!();
  await Promise.resolve();
  expect(count).toHaveBeenLastCalledWith({ path: "/personal/", title: "Personal", referrer: "" });
  expect(b.scripts).toHaveLength(1);
});

it("does nothing until configured, on previews, or when visitors opt out", () => {
  for (const mode of ["unconfigured", "preview", "dnt", "gpc"]) {
    const b = browser("complete");
    if (mode === "preview") b.loc.hostname = "localhost";
    if (mode === "dnt") vi.stubGlobal("navigator", { doNotTrack: "1" });
    if (mode === "gpc") vi.stubGlobal("navigator", { globalPrivacyControl: true });
    setupAnalytics(mode === "unconfigured" ? "" : endpoint);
    expect(b.idle).toHaveLength(0);
    expect(b.scripts).toHaveLength(0);
  }
});

it("leaves page content alone when the statistics script fails to load", async () => {
  const b = browser("complete");
  setupAnalytics(endpoint);
  b.idle.shift()!();
  b.scripts[0].onerror();
  await Promise.resolve();
  expect(b.doc.title).toBe("Home");
  expect(b.win.goatcounter.count).toBeUndefined();
});
