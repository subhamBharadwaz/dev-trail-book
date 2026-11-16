import { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "@/components/text";
import { Choice } from "@/components/choice";
import { Action } from "@/components/action";
import { space, radius, useTheme } from "@/theme";
import {
  durations,
  focuses,
  formatRemaining,
  remainingMs,
  interviewStats,
  type Duration,
  type Interview,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
export function InterviewSetup({
  sessions,
  values,
  actions,
  now,
}: {
  sessions: Interview[];
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
  now: number;
}) {
  const { colors } = useTheme();
  const [duration, setDuration] = useState<Duration>(15);
  const [focus, setFocus] = useState("all");
  const settings = useRef({ duration: 15 as Duration, focus: "all" });
  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 840,
        alignSelf: "center",
        padding: space.page,
        paddingBottom: space.section,
      }}
      data={sessions}
      keyExtractor={(s) => s.id}
      ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
      ListHeaderComponent={
        <View style={{ gap: space.xl, marginBottom: space.xl }}>
          <Text variant="display">Practice the conversation.</Text>
          <Text muted>
            Think out loud. Write your approach. Build confidence under a clock.
          </Text>
          <Text variant="label">SESSION LENGTH</Text>
          <Choice
            label="Session length"
            value={String(duration)}
            options={durations.map((d) => ({
              value: String(d.value),
              label: d.label,
            }))}
            onChange={(v) => {
              const next = Number(v) as Duration;
              settings.current.duration = next;
              setDuration(next);
            }}
          />
          <Text muted>
            {durations.find((d) => d.value === duration)?.description}
          </Text>
          <Text variant="label">TECHNICAL FOCUS</Text>
          <Choice
            label="Technical focus"
            value={focus}
            options={focuses}
            onChange={(v) => {
              settings.current.focus = v;
              setFocus(v);
            }}
          />
          <Text muted>
            Technical prompts match your focus. Coding tasks prioritize it, then
            include broader frontend problems. Behavioral questions draw on your
            own experience.
          </Text>
          <Action
            label="Start mock interview"
            onPress={() =>
              actions.start(settings.current.duration, settings.current.focus)
            }
          />
          <Text variant="small" muted>
            Answers save as you type. The clock continues when you leave unless
            you pause. Reference guidance appears after finishing. You assess
            your own answers; code is not executed.
          </Text>
          <Text variant="title">Your sessions ({sessions.length})</Text>
        </View>
      }
      ListEmptyComponent={
        <Text muted>
          Your first session is a baseline. Choose one thing to improve after
          it.
        </Text>
      }
      renderItem={({ item: s }) => {
        const stats = interviewStats(s, values);
        return (
          <View
            style={{
              gap: space.md,
              padding: space.xl,
              borderRadius: radius.large,
              backgroundColor: colors.surface,
            }}
          >
            <Text variant="title">{s.duration}-minute mock</Text>
            <Text muted>
              {focuses.find((f) => f.value === s.focus)?.label ?? s.focus} ·{" "}
              {new Date(s.startedAt).toLocaleDateString()}
            </Text>
            <Text muted>
              {stats.answered}/{stats.total} answered ·{" "}
              {s.state === "completed"
                ? `${stats.rated}/${stats.total} assessed`
                : s.state === "paused"
                  ? "Paused"
                  : `${formatRemaining(remainingMs(s, now))} remaining`}
            </Text>
            {s.state === "completed" && stats.score !== null && (
              <Text>Self-assessed: {stats.score}%</Text>
            )}
            <Action
              secondary
              label={
                s.state === "completed" ? "Review session" : "Open session"
              }
              onPress={() => actions.open(s.id)}
            />
          </View>
        );
      }}
    />
  );
}
