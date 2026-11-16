import { Alert, View } from "react-native";
import { router } from "expo-router";
import { topics, categories } from "@trailbook/content/native";
import { dueReviews } from "@trailbook/learning/preparation";
import { recordsPreparation } from "@trailbook/learning/preparation-records";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action, IconAction } from "@/components/action";
import { Meter } from "@/components/meter";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icon";
import { useAccount } from "@/lib/account-provider";
import { progress, useProgress } from "@/lib/progress";
import { useToday } from "@/hooks/use-today";
import { space, radius, useTheme } from "@/theme";
export default function Progress() {
  const today = useToday();
  const { colors } = useTheme();
  const { values } = useProgress();
  const { session } = useAccount();
  const prep = recordsPreparation(values);
  const due = dueReviews(prep.entries, today);
  const completed = topics.filter(
    (t) => values[`reading/read/${t.slug}`] === true,
  ).length;
  return (
    <Screen>
      <Action
        secondary
        label="Practice a timed mock interview"
        onPress={() => router.push("/interviews")}
      />
      <View style={{ gap: space.md }}>
        <Text variant="display">Proof you’re growing.</Text>
        <Text muted>
          Understanding takes practice. Here’s the work behind yours.
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
          gap: space.lg,
          backgroundColor: colors.tint,
          borderRadius: radius.large,
        }}
      >
        <Text variant="label" style={{ color: colors.accent }}>
          YOUR LEARNING TRAIL
        </Text>
        <Text variant="display">
          {completed}
          <Text variant="title" muted>
            {" "}
            / {topics.length}
          </Text>
        </Text>
        <Text>lessons explored</Text>
        <Meter value={completed / topics.length} label="Lessons completed" />
        <Text variant="small" muted>
          {prep.entries.length} practice logs · {due.length} reviews due
        </Text>
      </View>
      <Action
        secondary
        label="Open mistake notebook"
        onPress={() => router.push("/mistakes")}
      />
      <Action
        label="Record your practice"
        onPress={() => router.push("/evidence")}
      />
      <View style={{ gap: space.lg }}>
        <SectionHeading
          title="Time for another look"
          detail="Reviews become due after your practice, using the same schedule as the website."
        />
        {due.length ? (
          due.map(({ entry, date }) => (
            <View
              key={`${entry.id}:${date}`}
              style={{
                paddingVertical: space.lg,
                borderBottomWidth: 1,
                borderColor: colors.line,
                gap: space.md,
              }}
            >
              <Text variant="heading">{entry.title}</Text>
              <Text variant="small" muted>
                Due {date} · {entry.kind.toUpperCase()}
              </Text>
              <Action
                secondary
                label="I completed this review"
                onPress={() =>
                  progress.write({
                    [`prep/entry/${entry.id}`]: JSON.parse(
                      JSON.stringify({
                        ...entry,
                        completedReviews: [
                          ...new Set([...entry.completedReviews, date]),
                        ],
                      }),
                    ),
                  })
                }
              />
            </View>
          ))
        ) : (
          <View style={{ gap: space.sm }}>
            <Icon name="check-circle-outline" />
            <Text muted>
              No reviews due. Record a practice attempt to build your review
              schedule.
            </Text>
          </View>
        )}
      </View>
      <View style={{ gap: space.lg }}>
        <SectionHeading title="Across your topics" />
        {categories.map((category) => {
          const items = topics.filter((t) => t.category === category.id);
          const done = items.filter(
            (t) => values[`reading/read/${t.slug}`] === true,
          ).length;
          return (
            <View key={category.id} style={{ gap: space.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: space.lg,
                }}
              >
                <Text variant="small" style={{ flex: 1 }}>
                  {category.name}
                </Text>
                <Text variant="small" muted>
                  {done}/{items.length}
                </Text>
              </View>
              <Meter
                value={done / Math.max(1, items.length)}
                label={`${category.name} lessons completed`}
              />
            </View>
          );
        })}
      </View>
      <View>
        <SectionHeading title="Your practice journal" />
        {prep.entries.length ? (
          [...prep.entries]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((entry) => (
              <View
                key={entry.id}
                style={{
                  flexDirection: "row",
                  paddingVertical: space.lg,
                  borderBottomWidth: 1,
                  borderColor: colors.line,
                  alignItems: "center",
                  gap: space.md,
                }}
              >
                <View style={{ flex: 1, gap: space.sm }}>
                  <Text variant="heading">{entry.title}</Text>
                  <Text variant="small" muted>
                    {entry.date} ·{" "}
                    {entry.independent ? "Independent" : "With support"}
                  </Text>
                  {!!entry.notes && <Text variant="small">{entry.notes}</Text>}
                </View>
                <IconAction
                  name="delete-outline"
                  label={`Delete ${entry.title}`}
                  onPress={() =>
                    Alert.alert(
                      "Delete this practice log?",
                      "This also removes its review schedule.",
                      [
                        { text: "Keep", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () =>
                            progress.write({
                              [`prep/entry/${entry.id}`]: null,
                            }),
                        },
                      ],
                    )
                  }
                />
              </View>
            ))
        ) : (
          <Text muted style={{ marginTop: space.lg }}>
            Your first small proof belongs here. A problem solved, a bug fixed,
            an answer explained.
          </Text>
        )}
      </View>
      {!session && (
        <Action
          secondary
          label="Sign in to keep devices in step"
          onPress={() => router.push("/account")}
        />
      )}
    </Screen>
  );
}
