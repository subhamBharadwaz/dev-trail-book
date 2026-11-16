import { useEffect, useRef, useState, type ComponentRef } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/text";
import { Field } from "@/components/field";
import { Action } from "@/components/action";
import { space, radius, useTheme } from "@/theme";
import {
  remainingMs,
  formatRemaining,
  getAnswer,
  interviewPosition,
  interviewStats,
  type Interview,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
import { InterviewReview } from "./review";
export function InterviewSession({
  session: s,
  values,
  actions,
  now,
}: {
  session: Interview;
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
  now: number;
}) {
  const { colors } = useTheme();
  const index = interviewPosition(s, values),
    prompt = s.prompts[index],
    answer = getAnswer(values, s.id, prompt.id),
    remaining = remainingMs(s, now),
    completed = s.state === "completed",
    expired = remaining === 0;
  const [confirm, setConfirm] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [index]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: space.page,
          paddingVertical: space.md,
          gap: space.md,
          borderBottomWidth: 1,
          borderColor: colors.line,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: space.md,
          }}
        >
          <Text variant="small">
            {completed
              ? "Review"
              : s.state === "paused"
                ? "Paused"
                : "Mock interview"}{" "}
            · {index + 1}/{s.prompts.length}
          </Text>
          {!completed && (
            <Text
              accessibilityLabel={`Time remaining ${formatRemaining(remaining)}`}
              variant="title"
            >
              {formatRemaining(remaining)}
            </Text>
          )}
        </View>
        {!completed && !expired && (
          <Action
            secondary
            label={s.state === "paused" ? "Resume timer" : "Pause timer"}
            onPress={() =>
              actions.transition(s.state === "paused" ? "resume" : "pause")
            }
          />
        )}
      </View>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 840,
          alignSelf: "center",
          padding: space.page,
          paddingBottom: space.section,
          gap: space.xl,
        }}
      >
        <Action
          secondary
          label="All mock sessions"
          onPress={() => actions.open(null)}
        />
        {expired && !completed && (
          <Text accessibilityRole="alert">
            Time’s up. Answers are saved and locked. Finish to review your
            approach.
          </Text>
        )}
        {s.state === "paused" && (
          <Text>Timer paused. Resume when you’re ready to answer.</Text>
        )}
        <Text variant="label" style={{ color: colors.accent }}>
          {prompt.kind.toUpperCase()} · {prompt.topicTitle}
        </Text>
        <Text variant="title">{prompt.question}</Text>
        {completed ? (
          <InterviewReview
            session={s}
            prompt={prompt}
            values={values}
            actions={actions}
          />
        ) : (
          <>
            <Field
              key={prompt.id}
              label="Your answer or approach"
              multiline
              editable={s.state === "running" && !expired}
              value={answer.text}
              onChangeText={(text) => actions.answer(prompt.id, { text })}
              maxLength={12000}
              autoCorrect={prompt.kind !== "coding"}
              autoCapitalize={prompt.kind === "coding" ? "none" : "sentences"}
              style={{
                minHeight: prompt.kind === "coding" ? 300 : 200,
                ...(prompt.kind === "coding"
                  ? { fontFamily: "monospace" }
                  : {}),
              }}
            />
            <Text variant="small" muted>
              {prompt.kind === "coding"
                ? "Code scratchpad only; code is not executed. Explain assumptions, complexity, and tests."
                : "Answer out loud, then capture your reasoning and an example."}{" "}
              Answers save as you type.
            </Text>
          </>
        )}
        <Action
          secondary
          label="Previous question"
          disabled={index === 0}
          onPress={() => actions.goTo(index - 1)}
        />
        <Action
          secondary
          label="Next question"
          disabled={index === s.prompts.length - 1}
          onPress={() => actions.goTo(index + 1)}
        />
        {!completed && (
          <View
            style={{
              gap: space.lg,
              padding: space.lg,
              borderRadius: radius.medium,
              backgroundColor: colors.surface,
            }}
          >
            {confirm ? (
              <>
                <Text>
                  Finish this session? {interviewStats(s, values).answered} of{" "}
                  {s.prompts.length} answered. Answers will be locked; you can
                  assess them afterward.
                </Text>
                <Action
                  label="Finish and review"
                  onPress={() => actions.transition("finish")}
                />
                <Action
                  secondary
                  label="Keep working"
                  onPress={() => setConfirm(false)}
                />
              </>
            ) : (
              <Action
                label={expired ? "Review my session" : "Finish session"}
                onPress={() => setConfirm(true)}
              />
            )}
          </View>
        )}
        {completed && !!prompt.topicSlug && (
          <Action
            secondary
            label="Revisit this lesson"
            onPress={() =>
              router.push({
                pathname: "/topic/[slug]",
                params: { slug: prompt.topicSlug },
              })
            }
          />
        )}
      </ScrollView>
    </View>
  );
}
