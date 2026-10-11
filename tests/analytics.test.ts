import { afterEach, expect, it, vi } from "vitest";
import { setupAnalytics } from "../src/scripts/analytics";

const endpoint = "https://example.goatcounter.com/count";
afterEach(() => vi.unstubAllGlobals());

function browser(readyState = "loading") {
  const events = new Map<string, () => void>();
  const idle: (() => void)[] = [];
  const fetch = vi.fn().mockResolvedValue(undefined);
  const win = {
    fetch,
    addEventListener: (name: string, listener: () => void) => events.set(name, listener),
    requestIdleCallback: (callback: () => void) => idle.push(callback),
  };
  const doc = {
    readyState,
    title: "Home",
    referrer: "https://example.org/profile?private=value#fragment",
    addEventListener: win.addEventListener,
  };
  const loc = { hostname: "danieldanyang.github.io", origin: "https://danieldanyang.github.io", pathname: "/", search: "?private=value", hash: "#research" };
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal("location", loc);
  vi.stubGlobal("navigator", { doNotTrack: "0" });
  return { events, idle, fetch, doc, loc };
}

it("waits for load and idle, strips private URL details, and counts routed pages once", () => {
  const b = browser();
  setupAnalytics(endpoint);
  b.events.get("astro:page-load")!();
  expect(b.idle).toHaveLength(0);
  expect(b.fetch).not.toHaveBeenCalled();
  b.doc.readyState = "complete";
  b.events.get("load")!();
  expect(b.fetch).not.toHaveBeenCalled();
  b.idle.shift()!();
  let url = new URL(b.fetch.mock.calls[0][0]);
  expect(url.searchParams.get("p")).toBe("/");
  expect(url.searchParams.get("r")).toBe("https://example.org");
  expect(url.href).not.toContain("private");
  expect(b.fetch.mock.calls[0][1]).toMatchObject({ credentials: "omit", referrerPolicy: "no-referrer", priority: "low" });
  b.events.get("astro:page-load")!();
  b.idle.shift()!();
  expect(b.fetch).toHaveBeenCalledTimes(1);
  b.events.get("astro:before-swap")!();
  b.loc.pathname = "/personal/";
  b.doc.title = "Personal";
  b.events.get("astro:page-load")!();
  b.idle.shift()!();
  url = new URL(b.fetch.mock.calls[1][0]);
  expect(url.searchParams.get("p")).toBe("/personal/");
  expect(url.searchParams.get("t")).toBe("Personal");
  expect(url.searchParams.get("r")).toBe("");
});

it("does nothing until configured, on previews, or when visitors opt out", () => {
  for (const mode of ["unconfigured", "preview", "dnt", "gpc"]) {
    const b = browser("complete");
    if (mode === "preview") b.loc.hostname = "localhost";
    if (mode === "dnt") vi.stubGlobal("navigator", { doNotTrack: "1" });
    if (mode === "gpc") vi.stubGlobal("navigator", { globalPrivacyControl: true });
    setupAnalytics(mode === "unconfigured" ? "" : endpoint);
    expect(b.idle).toHaveLength(0);
    expect(b.fetch).not.toHaveBeenCalled();
  }
});

it("leaves page content alone when the statistics request fails", async () => {
  const b = browser("complete");
  b.fetch.mockRejectedValue(new Error("blocked"));
  setupAnalytics(endpoint);
  expect(() => b.idle.shift()!()).not.toThrow();
  await Promise.resolve();
  expect(b.doc.title).toBe("Home");
});

it("cancels a stale page count when navigation happens before idle", () => {
  const b = browser("complete");
  setupAnalytics(endpoint);
  b.events.get("astro:before-swap")!();
  b.loc.pathname = "/personal/";
  b.events.get("astro:page-load")!();
  b.idle.shift()!();
  expect(b.fetch).not.toHaveBeenCalled();
  b.idle.shift()!();
  expect(new URL(b.fetch.mock.calls[0][0]).searchParams.get("p")).toBe("/personal/");
});
