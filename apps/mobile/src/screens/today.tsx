import { mistakesFromRecords } from "@trailbook/learning/mistakes";
import { View } from "react-native";
import { Checkbox, Host } from "@expo/ui";
import { router } from "expo-router";
import { topics } from "@trailbook/content/native";
import { dailyTasks, type Routine } from "@trailbook/learning/preparation";
import { recordsPreparation } from "@trailbook/learning/preparation-records";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Choice } from "@/components/choice";
import { Meter } from "@/components/meter";
import { TopicRow } from "@/components/topic-row";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { progress, useProgress } from "@/lib/progress";
import { useAccount } from "@/lib/account-provider";
import { useToday } from "@/hooks/use-today";
import { space, radius, useTheme } from "@/theme";
export default function Today() {
  const { colors, mode } = useTheme();
  const { values, phase } = useProgress();
  const { session } = useAccount();
  const date = useToday();
  const mistakesDue = mistakesFromRecords(values).filter(
    (m) => m.status === "open" && m.due <= date,
  ).length;
  const prep = recordsPreparation(values);
  const routine = prep.days[date]?.routine ?? "short";
  const tasks = dailyTasks(routine);
  const completed = tasks.filter(
    (task) => values[`prep/day/${date}/task/${task.id}`] === true,
  ).length;
  const next =
    topics.find(
      (topic) =>
        values[`reading/saved/${topic.slug}`] === true &&
        values[`reading/read/${topic.slug}`] !== true,
    ) ?? topics.find((topic) => values[`reading/read/${topic.slug}`] !== true);
  return (
    <Screen>
      <Action
        secondary
        label="Practice a timed mock interview"
        onPress={() => router.push("/interviews")}
      />
      <Action
        secondary
        label={`Mistake notebook · ${mistakesDue} to retry`}
        onPress={() => router.push("/mistakes")}
      />
      <View style={{ gap: space.md }}>
        <Text variant="label" muted>
          {new Date(`${date}T12:00:00`)
            .toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
            .toUpperCase()}
        </Text>
        <Text variant="display">A little progress,{"\n"}every day.</Text>
        <Text muted>
          Make room for one thing you’ll understand better today.
        </Text>
      </View>
      <Action
        secondary
        label="View weekly readiness"
        onPress={() => router.push("/readiness")}
      />
      <View
        style={{
          padding: space.xl,
          borderRadius: radius.large,
          backgroundColor: colors.tint,
          gap: space.lg,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: space.md }}
        >
          <Icon name="route" />
          <Text variant="label" style={{ color: colors.accent }}>
            YOUR DAILY TRAIL
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Text variant="title">
            {completed} of {tasks.length} steps
          </Text>
          <Text variant="small" muted>
            {tasks.reduce((sum, task) => sum + task.minutes, 0)} min
          </Text>
        </View>
        <Meter
          value={completed / tasks.length}
          label="Today's tasks completed"
        />
        <Text variant="small">
          {completed === tasks.length
            ? "You showed up. Give yourself a little credit."
            : "A plan that fits the time you have."}
        </Text>
      </View>
      <View style={{ gap: space.md }}>
        <SectionHeading title="How much time do you have?" />
        <Choice<Routine>
          value={routine}
          label="Daily study time"
          options={[
            { value: "minimum", label: "20 minutes" },
            { value: "short", label: "2 hours" },
            { value: "full", label: "6 hours" },
          ]}
          onChange={(value) =>
            progress.write({ [`prep/day/${date}/routine`]: value })
          }
        />
      </View>
      <View>
        {tasks.map((task, index) => (
          <View
            key={task.id}
            style={{
              paddingVertical: space.lg,
              gap: space.sm,
              borderBottomWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Text variant="label" muted>
              STEP {index + 1} · {task.minutes} MIN
            </Text>
            <Host
              colorScheme={mode}
              seedColor={colors.accent}
              matchContents={{ vertical: true }}
              style={{ width: "100%" }}
            >
              <Checkbox
                label={task.title}
                value={values[`prep/day/${date}/task/${task.id}`] === true}
                onValueChange={(value) =>
                  progress.write({
                    [`prep/day/${date}/task/${task.id}`]: value,
                  })
                }
              />
            </Host>
            <Text variant="small" muted>
              {task.detail}
            </Text>
            <Action
              secondary
              label={task.action}
              onPress={() => {
                const slug = task.href.match(/^#\/topic\/(.+)$/)?.[1];
                if (slug)
                  router.push({ pathname: "/topic/[slug]", params: { slug } });
                else
                  router.push(
                    task.href === "#/practice"
                      ? "/(tabs)/practice"
                      : task.href === "#/evidence"
                        ? "/evidence"
                        : "/(tabs)/learn",
                  );
              }}
            />
          </View>
        ))}
      </View>
      {next && (
        <View>
          <SectionHeading title="Pick up your next idea" />
          <TopicRow topic={next} />
        </View>
      )}
      <Action
        secondary
        label="Explore your preparation roadmap"
        onPress={() => router.push("/roadmap")}
      />
      <Action
        secondary
        label="Record what you practiced"
        onPress={() => router.push("/evidence")}
      />
      <View
        style={{ flexDirection: "row", gap: space.sm, alignItems: "center" }}
      >
        <Icon
          name={session ? "cloud-done" : "offline-pin"}
          color={colors.muted}
          size={18}
        />
        <Text variant="small" muted>
          {session
            ? phase === "saved"
              ? "Your progress is up to date."
              : "Your progress is saved here. Sync status is in your account."
            : "Lessons work offline. Sign in to sync your progress."}
        </Text>
      </View>
    </Screen>
  );
}
