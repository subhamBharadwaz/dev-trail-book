import type { ConfigContext, ExpoConfig } from "expo/config";

export default function appConfig({ config }: ConfigContext): ExpoConfig {
  const development =
    process.env.APP_VARIANT !== "preview" &&
    process.env.APP_VARIANT !== "production";
  return {
    ...config,
    name: development ? "Dev Trailbook Dev" : "Dev Trailbook",
    slug: "dev-trailbook",
    scheme: development ? "devtrailbook-dev" : "devtrailbook",
    plugins: [
      ...(config.plugins ?? []),
      ["expo-dev-client", { addGeneratedScheme: development }],
    ],
    android: {
      ...config.android,
      package: development
        ? "com.devtrailbook.app.dev"
        : "com.devtrailbook.app",
    },
    ios: {
      ...config.ios,
      bundleIdentifier: development
        ? "com.devtrailbook.app.dev"
        : "com.devtrailbook.app",
    },
  };
}
