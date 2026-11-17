export const releaseRepository = "subhamBharadwaz/dev-trail-book";
export const releasesUrl = `https://github.com/${releaseRepository}/releases`;
export const releaseFeedUrl = `https://api.github.com/repos/${releaseRepository}/releases?per_page=20`;
export interface ApkRelease {
  version: string;
  build: number;
  notes: string;
  downloadUrl: string;
  pageUrl: string;
  size: number;
}
function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
/** The dedicated tag and asset contract excludes development APKs and web releases. */
export function selectApkRelease(feed: unknown): ApkRelease | null {
  if (!Array.isArray(feed)) throw new Error("Invalid release feed");
  let latest: ApkRelease | null = null;
  for (const entry of feed.slice(0, 20)) {
    const release = object(entry);
    if (!release || release.draft !== false || release.prerelease !== false)
      continue;
    const match =
      typeof release.tag_name === "string"
        ? /^android-v(\d+\.\d+\.\d+)-([1-9]\d*)$/.exec(release.tag_name)
        : null;
    if (!match) continue;
    const [, version, code] = match;
    const build = Number(code);
    if (!Number.isSafeInteger(build) || build > 2100000000) continue;
    const pageUrl = `${releasesUrl}/tag/${release.tag_name}`;
    if (release.html_url !== pageUrl || !Array.isArray(release.assets))
      continue;
    const name = `dev-trailbook-v${version}-${build}.apk`;
    const downloadUrl = `${releasesUrl}/download/${release.tag_name}/${name}`;
    const asset = release.assets
      .map(object)
      .find(
        (a) =>
          a?.name === name &&
          a.state === "uploaded" &&
          a.browser_download_url === downloadUrl &&
          typeof a.size === "number" &&
          a.size > 0 &&
          a.size < 1024 ** 3,
      );
    if (!asset || (latest && latest.build >= build)) continue;
    latest = {
      version,
      build,
      downloadUrl,
      pageUrl,
      size: asset.size as number,
      notes:
        typeof release.body === "string" ? release.body.slice(0, 6000) : "",
    };
  }
  return latest;
}
export function hasNewApk(
  release: ApkRelease | null,
  installedBuild: number | null,
) {
  return (
    installedBuild !== null &&
    Number.isSafeInteger(installedBuild) &&
    installedBuild > 0 &&
    release !== null &&
    release.build > installedBuild
  );
}
export async function fetchApkRelease(
  request: typeof fetch,
  signal: AbortSignal,
) {
  const response = await request(releaseFeedUrl, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok)
    throw new Error(`Release check failed (${response.status})`);
  const text = await response.text();
  if (text.length > 1024 * 1024) throw new Error("Release feed is too large");
  return { feed: JSON.parse(text) as unknown, checkedAt: Date.now() };
}
