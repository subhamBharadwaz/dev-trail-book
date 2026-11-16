import { useState } from "react";
import { ScrollView, View, Text as NativeText } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Text } from "./text";
import { IconAction } from "./action";
import { radius, space, useTheme } from "@/theme";
type Token = { content: string; color?: string };
export function CodeBlock({
  code,
  language,
  tokens,
}: {
  code: string;
  language?: string;
  tokens?: Token[][];
}) {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await Clipboard.setStringAsync(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <View
      style={{
        backgroundColor: colors.code,
        borderRadius: radius.medium,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingLeft: space.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="label" style={{ color: colors.codeText }}>
          {copied ? "COPIED" : (language ?? "CODE").toUpperCase()}
        </Text>
        <IconAction
          label={copied ? "Code copied" : "Copy code"}
          name={copied ? "check" : "content-copy"}
          onPress={() => void copy()}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          paddingHorizontal: space.lg,
          paddingBottom: space.lg,
        }}
      >
        <NativeText
          selectable
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            lineHeight: 23,
            color: colors.codeText,
          }}
        >
          {tokens
            ? tokens.map((line, i) => (
                <NativeText key={i}>
                  {line.map((token, j) => (
                    <NativeText key={j} style={{ color: token.color }}>
                      {token.content}
                    </NativeText>
                  ))}
                  {i < tokens.length - 1 ? "\n" : ""}
                </NativeText>
              ))
            : code}
        </NativeText>
      </ScrollView>
    </View>
  );
}
