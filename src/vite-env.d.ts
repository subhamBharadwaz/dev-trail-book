/// <reference types="vite/client" />
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const component: ComponentType<{ components?: Record<string, unknown> }>;
  export default component;
  export const searchText: string;
  export const meta: import("./features/topics/data/content").TopicMeta;
}
