import { Fragment, type ReactNode } from "react";
import { Linking, ScrollView, Text as NativeText, View } from "react-native";
import { router } from "expo-router";
import type { MarkdownNode } from "@trailbook/content/types";
import { Text } from "./text";
import { CodeBlock } from "./code-block";
import { space, useTheme } from "@/theme";
function open(url: string) {
  const internal = url.match(/(?:#\/|^\/)topic\/([a-z0-9-]+)/);
  if (internal) {
    router.push({ pathname: "/topic/[slug]", params: { slug: internal[1] } });
    return;
  }
  if (/^https?:\/\//.test(url)) void Linking.openURL(url);
}
export function Markdown({
  node,
  size = 18,
}: {
  node: MarkdownNode;
  size?: number;
}) {
  const { colors } = useTheme();
  function inline(n: MarkdownNode, key: number): ReactNode {
    const children = n.children?.map(inline);
    if (n.type === "strong")
      return (
        <NativeText key={key} style={{ fontWeight: "700" }}>
          {children}
        </NativeText>
      );
    if (n.type === "emphasis")
      return (
        <NativeText key={key} style={{ fontStyle: "italic" }}>
          {children}
        </NativeText>
      );
    if (n.type === "delete")
      return (
        <NativeText key={key} style={{ textDecorationLine: "line-through" }}>
          {children}
        </NativeText>
      );
    if (n.type === "inlineCode")
      return (
        <NativeText
          key={key}
          style={{
            fontFamily: "monospace",
            backgroundColor: colors.tint,
            color: colors.accent,
          }}
        >
          {n.value}
        </NativeText>
      );
    if (n.type === "link")
      return (
        <NativeText
          key={key}
          accessibilityRole="link"
          onPress={() => open(n.url ?? "")}
          style={{ color: colors.accent, textDecorationLine: "underline" }}
        >
          {children}
        </NativeText>
      );
    if (n.type === "break") return "\n";
    return n.value ?? <Fragment key={key}>{children}</Fragment>;
  }
  const children = node.children?.map((child, i) => (
    <Markdown key={i} node={child} size={size} />
  ));
  if (node.type === "root")
    return <View style={{ gap: space.xl }}>{children}</View>;
  if (node.type === "heading")
    return (
      <Text
        accessibilityRole="header"
        variant={node.depth === 1 ? "title" : "heading"}
        style={{ marginTop: space.md }}
      >
        {node.children?.map(inline)}
      </Text>
    );
  if (node.type === "paragraph")
    return (
      <Text
        selectable
        style={{ fontSize: size, lineHeight: Math.round(size * 1.6) }}
      >
        {node.children?.map(inline)}
      </Text>
    );
  if (node.type === "code")
    return (
      <CodeBlock
        code={node.value ?? ""}
        language={node.lang}
        tokens={
          (
            node as MarkdownNode & {
              tokens?: { content: string; color?: string }[][];
            }
          ).tokens
        }
      />
    );
  if (node.type === "list")
    return (
      <View style={{ gap: space.md }}>
        {node.children?.map((child, i) => (
          <View key={i} style={{ flexDirection: "row", gap: space.md }}>
            <Text style={{ color: colors.accent }}>
              {node.ordered ? `${(node.start ?? 1) + i}.` : "•"}
            </Text>
            <View style={{ flex: 1, gap: space.sm }}>
              <Markdown node={child} size={size} />
            </View>
          </View>
        ))}
      </View>
    );
  if (node.type === "blockquote")
    return (
      <View
        style={{
          borderLeftWidth: 3,
          borderColor: colors.accent,
          paddingLeft: space.lg,
          gap: space.md,
        }}
      >
        {children}
      </View>
    );
  if (node.type === "table")
    return (
      <ScrollView horizontal>
        <View>
          {node.children?.map((row, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: colors.line,
              }}
            >
              {row.children?.map((cell, j) => (
                <View
                  key={j}
                  style={{
                    width: 210,
                    padding: space.md,
                    backgroundColor: i === 0 ? colors.tint : colors.surface,
                  }}
                >
                  <Text
                    variant="small"
                    style={{ fontWeight: i === 0 ? "600" : "400" }}
                  >
                    {cell.children?.map(inline)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  if (node.type === "thematicBreak")
    return <View style={{ height: 1, backgroundColor: colors.line }} />;
  return (
    <View style={{ gap: space.md }}>
      {children ?? (node.value ? <Text selectable>{node.value}</Text> : null)}
    </View>
  );
}
