import { expect, test } from "bun:test";
import {
  fetchApkRelease,
  hasNewApk,
  releasesUrl,
  selectApkRelease,
} from "../src/features/updates/apk-release";
function release(build = 4) {
  const tag = `android-v1.2.0-${build}`;
  return {
    tag_name: tag,
    draft: false,
    prerelease: false,
    html_url: `${releasesUrl}/tag/${tag}`,
    body: "New lessons and fixes.",
    assets: [
      {
        name: `dev-trailbook-v1.2.0-${build}.apk`,
        state: "uploaded",
        size: 1048576,
        browser_download_url: `${releasesUrl}/download/${tag}/dev-trailbook-v1.2.0-${build}.apk`,
      },
    ],
  };
}
test("only a higher native build prompts; OTA version changes cannot fake installation", () => {
  const latest = selectApkRelease([release()]);
  expect(hasNewApk(latest, 3)).toBe(true);
  expect(hasNewApk(latest, 4)).toBe(false);
  expect(hasNewApk(latest, 5)).toBe(false);
  expect(hasNewApk(latest, null)).toBe(false);
  expect(hasNewApk(latest, 0)).toBe(false);
  expect(hasNewApk(null, 3)).toBe(false);
});
test("chooses highest native build, regardless of publication order", () => {
  expect(selectApkRelease([release(3), release(5), release(4)])?.build).toBe(5);
});
test("excludes drafts, prereleases, dev clients, missing APKs and source-only releases", () => {
  const good = release();
  expect(
    selectApkRelease([
      { ...good, draft: true },
      { ...good, prerelease: true },
      { ...good, tag_name: "development-v1.2.0-4" },
      { ...good, assets: [] },
      { ...good, assets: [{ ...good.assets[0], name: "dev-client.apk" }] },
    ]),
  ).toBeNull();
  expect(selectApkRelease([])).toBeNull();
});
test("rejects foreign hosts, repositories, query strings and incomplete uploads", () => {
  for (const url of [
    "http://example.com/app.apk",
    "https://evil.example/app.apk",
    release().assets[0].browser_download_url + "?redirect=bad",
    release().assets[0].browser_download_url.replace("dev-trail-book", "other"),
  ]) {
    const item = release();
    item.assets[0].browser_download_url = url;
    expect(selectApkRelease([item])).toBeNull();
  }
  const item = release();
  item.assets[0].state = "new";
  expect(selectApkRelease([item])).toBeNull();
});
test("invalid feed does not masquerade as a successful empty release check", () => {
  expect(() => selectApkRelease({ message: "rate limited" })).toThrow();
  expect(
    selectApkRelease([
      null,
      false,
      {},
      { ...release(), tag_name: "android-v1.2.0-9999999999999999" },
    ]),
  ).toBeNull();
});
test("network errors and invalid responses remain retryable errors", async () => {
  const signal = new AbortController().signal;
  for (const response of [
    new Response("rate limited", { status: 403 }),
    new Response("not json"),
    new Response("x".repeat(1024 * 1024 + 1)),
  ]) {
    await expect(
      fetchApkRelease((async () => response) as typeof fetch, signal),
    ).rejects.toThrow();
  }
  const result = await fetchApkRelease(
    (async (_url, options) => {
      expect(options?.signal).toBe(signal);
      return new Response(JSON.stringify([release()]));
    }) as typeof fetch,
    signal,
  );
  expect(selectApkRelease(result.feed)?.build).toBe(4);
});
