import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import type { NativeTopic } from "@trailbook/content/types";
import { Text } from "./text";
import { Icon } from "./icon";
import { space, radius, useTheme } from "@/theme";
import { useProgress } from "@/lib/progress";
export function TopicRow({ topic }: { topic: NativeTopic }) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);
  const { values } = useProgress();
  const read = values[`reading/read/${topic.slug}`] === true;
  return (
    <Link
      href={{ pathname: "/topic/[slug]", params: { slug: topic.slug } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{
          paddingVertical: space.lg,
          paddingHorizontal: space.sm,
          borderBottomWidth: 1,
          borderColor: colors.line,
          borderRadius: radius.small,
          backgroundColor: pressed ? colors.tint : "transparent",
          flexDirection: "row",
          alignItems: "center",
          gap: space.md,
        }}
      >
        <View style={{ flex: 1, gap: space.xs }}>
          <Text variant="body" style={{ fontWeight: "600" }}>
            {topic.title}
          </Text>
          <Text variant="small" muted>
            {topic.minutes} min · {topic.level}
            {read ? " · Completed" : ""}
          </Text>
        </View>
        <Icon
          name={read ? "check-circle-outline" : "arrow-forward"}
          color={read ? colors.success : colors.muted}
          size={22}
        />
      </Pressable>
    </Link>
  );
}
