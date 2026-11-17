import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const mobile = join(root, "apps/mobile");
const repo = "subhamBharadwaz/dev-trail-book";
const args = process.argv.slice(2);
const buildId = args[args.indexOf("--build") + 1];
const notesPath = args[args.indexOf("--notes") + 1];
if (
  !args.includes("--build") ||
  !args.includes("--notes") ||
  !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/.test(buildId ?? "") ||
  !notesPath
) {
  throw new Error(
    "Usage: bun run release:android --build EAS_BUILD_ID --notes path/to/notes.md [--publish]",
  );
}
function run(command: string, argv: string[], cwd = root) {
  return execFileSync(command, argv, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    maxBuffer: 8 * 1024 * 1024,
  }).trim();
}
const notes = readFileSync(resolve(notesPath), "utf8").trim();
if (!notes || notes.length > 5000)
  throw new Error("Provide release notes between 1 and 5,000 characters.");
const build = JSON.parse(
  run("bunx", ["eas-cli@latest", "build:view", buildId, "--json"], mobile),
);
if (
  build.status !== "FINISHED" ||
  build.platform !== "ANDROID" ||
  build.buildProfile !== "preview" ||
  build.appIdentifier !== "com.devtrailbook.app" ||
  build.app?.id !== "97e5d560-7f64-4962-be56-be80f2633843" ||
  build.updateChannel?.name !== "personal"
) {
  throw new Error(
    "Only a finished standalone preview APK from the personal Trailbook project can be released.",
  );
}
const version = String(build.appVersion),
  code = Number(build.appBuildVersion);
if (
  !/^\d+\.\d+\.\d+$/.test(version) ||
  !Number.isSafeInteger(code) ||
  code < 1 ||
  code > 2100000000
)
  throw new Error("Invalid Android version metadata.");
const tag = `android-v${version}-${code}`;
const file = `dev-trailbook-v${version}-${code}.apk`;
const { path: downloadPath } = JSON.parse(
  run(
    "bunx",
    [
      "eas-cli@latest",
      "build:download",
      "--build-id",
      buildId,
      "--json",
      "--non-interactive",
    ],
    mobile,
  ),
);
if (typeof downloadPath !== "string" || !downloadPath.endsWith(".apk"))
  throw new Error("EAS did not return an APK.");
run("unzip", ["-tqq", downloadPath]);
const archive = run("unzip", ["-Z1", downloadPath]);
if (!archive.split("\n").includes("AndroidManifest.xml"))
  throw new Error("Missing Android manifest.");
const target = run("git", ["rev-parse", "HEAD"]);
const directory = mkdtempSync(join(tmpdir(), "trailbook-release-"));
try {
  copyFileSync(downloadPath, join(directory, file));
  const sha = createHash("sha256")
    .update(readFileSync(downloadPath))
    .digest("hex");
  writeFileSync(join(directory, "SHA256SUMS"), `${sha}  ${file}\n`);
  writeFileSync(
    join(directory, "notes.md"),
    `${notes}\n\nStandalone Android APK · version ${version} · build ${code}.\n\nInstall over the existing Dev Trailbook app to retain its data. Android asks you to approve installation. This is not the development launcher.\n\nEAS build: https://expo.dev/accounts/webhashiras-team/projects/dev-trailbook/builds/${buildId}\n`,
  );
  run("gh", [
    "release",
    "create",
    tag,
    "--repo",
    repo,
    "--target",
    target,
    "--draft",
    "--title",
    `Dev Trailbook ${version} (Android build ${code})`,
    "--notes-file",
    join(directory, "notes.md"),
  ]);
  run("gh", [
    "release",
    "upload",
    tag,
    join(directory, file),
    join(directory, "SHA256SUMS"),
    "--repo",
    repo,
  ]);
  if (args.includes("--publish"))
    run("gh", [
      "release",
      "edit",
      tag,
      "--repo",
      repo,
      "--draft=false",
      "--latest",
    ]);
  console.log(
    `${args.includes("--publish") ? "Published" : "Draft ready"}: https://github.com/${repo}/releases/tag/${tag}`,
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
