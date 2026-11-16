import { View } from "react-native";
import { Text } from "@/components/text";
import { space, radius, useTheme } from "@/theme";
import type { Readiness } from "@trailbook/learning/readiness";
import { ReadinessSection } from "./section";
export function WeeklySummary({ data: d }: { data: Readiness }) {
  const { colors } = useTheme();
  const metrics = [
    {
      label: "Active days",
      value: `${d.activeDays}/7`,
      detail: `Previously ${d.previousActiveDays}/7`,
    },
    {
      label: "Practice logs",
      value: d.logs,
      detail: `Previously ${d.previousLogs}`,
    },
    {
      label: "Mocks completed",
      value: d.mocks,
      detail: `Previously ${d.previousMocks}`,
    },
    {
      label: "Reviews due now",
      value: d.reviews.length,
      detail: `${d.overdue} overdue · ${d.dueToday} today`,
    },
  ];
  return (
    <ReadinessSection title="Your week, recorded.">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.xl }}>
        {metrics.map((m) => (
          <View
            key={m.label}
            style={{ flexBasis: "44%", flexGrow: 1, gap: space.sm }}
          >
            <Text variant="small" muted>
              {m.label}
            </Text>
            <Text variant="display" style={{ color: colors.accent }}>
              {m.value}
            </Text>
            <Text variant="small" muted>
              {m.detail}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="small" muted>
        Compared with the previous seven days.
      </Text>
      <View style={{ flexDirection: "row", gap: space.xs }}>
        {d.days.map((day) => (
          <View
            key={day.date}
            accessible
            accessibilityLabel={`${day.date}: ${day.active ? "Activity recorded" : "No activity recorded"}. ${day.logs} logs, ${day.mocks} completed mocks, ${day.tasks} checklist tasks.`}
            style={{
              flex: 1,
              paddingVertical: space.md,
              alignItems: "center",
              gap: space.sm,
              borderRadius: radius.medium,
              backgroundColor: day.active ? colors.tint : colors.background,
            }}
          >
            <Text variant="small" muted>
              {new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, {
                weekday: "narrow",
              })}
            </Text>
            <Text variant="small">{Number(day.date.slice(-2))}</Text>
            <Text style={{ color: day.active ? colors.accent : colors.muted }}>
              {day.active ? "●" : "○"}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="small" muted>
        An active day has a journal log, a completed mock, or a checked daily
        task. Logs and mocks count separately.
      </Text>
    </ReadinessSection>
  );
}
