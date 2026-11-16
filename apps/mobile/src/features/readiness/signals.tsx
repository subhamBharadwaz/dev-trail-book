import { View } from "react-native";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Meter } from "@/components/meter";
import { space } from "@/theme";
import type { Readiness } from "@trailbook/learning/readiness";
import { ReadinessSection } from "./section";
import { openReadinessAction as open } from "./use-readiness";
export function ReadinessSignals({ data: d }: { data: Readiness }) {
  return (
    <>
      <ReadinessSection title="Reviews waiting for you">
        <Text muted>
          {d.overdue} overdue · {d.dueToday} due today. Each scheduled journal
          retry counts as one review.
        </Text>
        {d.reviews.length ? (
          d.reviews.slice(0, 5).map((review) => (
            <View key={review.id} style={{ gap: space.md }}>
              <Text>{review.title}</Text>
              <Text variant="small" muted>
                Due {review.date} · {review.detail}
              </Text>
              <Action
                secondary
                label="Open review"
                onPress={() =>
                  open({
                    id: review.id,
                    title: review.title,
                    detail: "",
                    target: review.target,
                  })
                }
              />
            </View>
          ))
        ) : (
          <Text muted>
            Nothing is due right now. New mistakes and scheduled journal retries
            will appear here.
          </Text>
        )}
        {d.reviews.length > 5 && (
          <Text variant="small" muted>
            Showing the oldest five of {d.reviews.length} reviews.
          </Text>
        )}
      </ReadinessSection>
      <ReadinessSection title="Your recent mock pattern">
        <Text muted>
          Last five completed sessions, oldest to newest. These are self-ratings
          on different question sets, not matched interview grades.
        </Text>
        {d.trend.length ? (
          d.trend.map((mock, i) => (
            <View key={mock.id} style={{ gap: space.md }}>
              <Text>
                {mock.date} · {mock.duration} min ·{" "}
                {mock.focus === "all" ? "Mixed topics" : mock.focus}
              </Text>
              <Text muted>
                {mock.score === null
                  ? "Not assessed"
                  : `${mock.score}% self-rated`}{" "}
                · {mock.rated}/{mock.total} answers assessed
              </Text>
              {mock.score !== null && (
                <Meter
                  value={mock.score / 100}
                  label={`Mock ${i + 1} self-assessed score`}
                />
              )}
              <Action
                secondary
                label="Review session"
                onPress={() =>
                  open({
                    id: mock.id,
                    title: "Review mock",
                    detail: "",
                    target: "interviews",
                    sessionId: mock.id,
                  })
                }
              />
            </View>
          ))
        ) : (
          <Text muted>
            Finish a timed mock and assess its answers to start seeing your
            pattern.
          </Text>
        )}
      </ReadinessSection>
      <ReadinessSection title="Where to spend another attempt">
        <Text muted>
          Open notebook gaps and your latest rating per prompt in the last 30
          days. Overdue gaps come first.
        </Text>
        {d.weakTopics.length ? (
          d.weakTopics.slice(0, 5).map((t) => (
            <View key={t.id} style={{ gap: space.md }}>
              <Text>{t.title}</Text>
              <Text variant="small" muted>
                {t.mistakes} open gaps · {t.overdue} overdue · {t.lowRatings}{" "}
                low self-ratings
              </Text>
              <Action
                secondary
                label="Revisit this"
                onPress={() =>
                  open({
                    id: t.id,
                    title: t.title,
                    detail: "",
                    target: t.slug
                      ? "topic"
                      : t.mistakes
                        ? "mistakes"
                        : "interviews",
                    sessionId: !t.slug && !t.mistakes ? t.sessionId : undefined,
                    slug: t.slug || undefined,
                  })
                }
              />
            </View>
          ))
        ) : (
          <Text muted>
            No weak-topic signals yet. A mock assessment or an honest mistake
            gives you a better starting point than a guessed score.
          </Text>
        )}
      </ReadinessSection>
      <ReadinessSection title="Reading coverage">
        <Text muted>
          {d.read} of {d.total} lessons marked read. Reading completion tracks
          exposure; recall and problem-solving need separate practice.
        </Text>
        {d.coverage.map((c) => (
          <View key={c.id} style={{ gap: space.md }}>
            <Text variant="small">
              {c.name} · {c.read}/{c.total}
            </Text>
            <Meter
              value={c.read / c.total}
              label={`${c.name} reading coverage`}
            />
          </View>
        ))}
      </ReadinessSection>
    </>
  );
}
