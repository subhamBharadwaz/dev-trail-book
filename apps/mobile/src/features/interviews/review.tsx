import { View } from "react-native";
import { Text } from "@/components/text";
import { Field } from "@/components/field";
import { Choice } from "@/components/choice";
import { Action } from "@/components/action";
import { space, radius, useTheme } from "@/theme";
import {
  getAnswer,
  getDebrief,
  interviewStats,
  ratings,
  type Interview,
  type InterviewPrompt,
  type createInterviewActions,
} from "@trailbook/learning/interviews";
import type { Json } from "@trailbook/sync";
export function InterviewReview({
  session,
  prompt,
  values,
  actions,
}: {
  session: Interview;
  prompt: InterviewPrompt;
  values: Record<string, Json>;
  actions: ReturnType<typeof createInterviewActions>;
}) {
  const { colors } = useTheme();
  const answer = getAnswer(values, session.id, prompt.id),
    debrief = getDebrief(values, session.id),
    stats = interviewStats(session, values);
  const added =
    !!values[`practice/mistake/interview-${session.id}-${prompt.id}`];
  return (
    <View style={{ gap: space.xl }}>
      <View
        style={{
          gap: space.md,
          padding: space.lg,
          borderRadius: radius.medium,
          backgroundColor: colors.tint,
        }}
      >
        <Text variant="label">
          {stats.answered}/{stats.total} ANSWERED · {stats.rated}/{stats.total}{" "}
          ASSESSED
        </Text>
        <Text>
          {stats.score === null
            ? "Assess your answers against the checklist."
            : `Self-assessed score: ${stats.score}% across ${stats.rated} rated answers.`}
        </Text>
        <Text variant="small" muted>
          Unrated answers are excluded. This is your reflection, not an
          automated grade.
        </Text>
      </View>
      <Text variant="label">YOUR ANSWER</Text>
      <Text selectable>{answer.text || "No answer recorded."}</Text>
      <Text variant="label">REFERENCE GUIDANCE</Text>
      <Text selectable>{prompt.reference}</Text>
      <Text variant="label">REVIEW CHECKLIST</Text>
      {prompt.criteria.map((c) => (
        <Text key={c}>• {c}</Text>
      ))}
      <Text variant="label">SELF-ASSESSMENT</Text>
      <Choice
        label="Self-assessment"
        value={answer.rating === null ? "" : String(answer.rating)}
        options={ratings}
        onChange={(v) => actions.answer(prompt.id, { rating: Number(v) })}
      />
      <Text variant="small" muted>
        0: could not explain it. 1: major gaps. 2: sound with minor gaps. 3:
        clear, accurate, with examples or tests.
      </Text>
      <Field
        label="What would I improve in this answer?"
        multiline
        maxLength={4000}
        value={answer.reflection}
        onChangeText={(reflection) => actions.answer(prompt.id, { reflection })}
      />
      <Action
        secondary
        disabled={added}
        label={
          added
            ? "Added to mistake notebook"
            : "Save this gap to mistake notebook"
        }
        onPress={() => actions.addMistake(prompt.id)}
      />
      <Text variant="title">Session debrief</Text>
      <Field
        label="What went well?"
        multiline
        maxLength={4000}
        value={debrief.strengths}
        onChangeText={(strengths) => actions.debrief({ strengths })}
      />
      <Field
        label="One concrete next step"
        multiline
        maxLength={4000}
        value={debrief.nextStep}
        onChangeText={(nextStep) => actions.debrief({ nextStep })}
      />
      <Text variant="small" muted>
        Your assessment and debrief save automatically.
      </Text>
    </View>
  );
}
