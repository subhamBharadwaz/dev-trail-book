import { useState } from "react";
import { Pressable, View } from "react-native";
import { studyWeeks } from "@trailbook/learning/study-plan";
import { topicBySlug } from "@trailbook/content/native";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Meter } from "@/components/meter";
import { Icon } from "@/components/icon";
import { TopicRow } from "@/components/topic-row";
import { useProgress } from "@/lib/progress";
import { space, radius, useTheme } from "@/theme";
export default function Roadmap() {
  const { colors } = useTheme();
  const { values } = useProgress();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Screen>
      <View style={{ gap: space.md }}>
        <Text variant="display">A path through the noise.</Text>
        <Text muted>
          The preparation stages from your uploaded job plan. Dates describe the
          original plan; your progress reflects what you’ve marked complete.
        </Text>
      </View>
      {studyWeeks.map((week) => {
        const done = week.slugs.filter(
          (slug) => values[`reading/read/${slug}`] === true,
        ).length;
        const expanded = open === week.number;
        return (
          <View
            key={week.id}
            style={{
              gap: space.lg,
              paddingBottom: space.xl,
              borderBottomWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Pressable
              accessibilityRole="button"
              aria-expanded={expanded}
              accessibilityState={{ expanded }}
              onPress={() => setOpen(expanded ? null : week.number)}
              style={({ pressed }) => ({
                padding: space.lg,
                borderRadius: radius.medium,
                backgroundColor: pressed ? colors.tint : colors.surface,
                gap: space.md,
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.md,
                }}
              >
                <Text variant="label" style={{ color: colors.accent, flex: 1 }}>
                  STAGE {week.number} · {done}/{week.slugs.length} LESSONS
                </Text>
                <Icon name={expanded ? "expand-less" : "expand-more"} />
              </View>
              <Text variant="title">{week.title}</Text>
              <Text variant="small" muted>
                {week.dates}
              </Text>
              <Meter
                value={done / Math.max(1, week.slugs.length)}
                label={`${week.title} progress`}
              />
            </Pressable>
            {expanded && (
              <>
                <Text>{week.description}</Text>
                <Text variant="heading">Before you move on</Text>
                <Text>{week.gate}</Text>
                {week.tasks.map((task) => (
                  <Text key={task} variant="small" muted>
                    • {task}
                  </Text>
                ))}
                {week.slugs.map((slug) => {
                  const topic = topicBySlug.get(slug);
                  return topic ? <TopicRow key={slug} topic={topic} /> : null;
                })}
              </>
            )}
          </View>
        );
      })}
      <Text variant="small" muted>
        Finishing lessons is one signal. Independent implementations, delayed
        re-solves, and mock interview feedback provide stronger evidence of
        readiness.
      </Text>
    </Screen>
  );
}
