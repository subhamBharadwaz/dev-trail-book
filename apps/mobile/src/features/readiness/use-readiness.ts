import { router } from "expo-router";
import { topics, categories } from "@trailbook/content/native";
import {
  buildReadiness,
  type ReadinessAction,
} from "@trailbook/learning/readiness";
import { currentInterviewKey } from "@trailbook/learning/interviews";
import { progress, useProgress } from "@/lib/progress";
import { useAccount } from "@/lib/account-provider";
import { useToday } from "@/hooks/use-today";
export function useReadiness() {
  const records = useProgress();
  const { session } = useAccount();
  const today = useToday();
  return {
    data: buildReadiness(records.values, topics, categories, today),
    storageError: records.storageError,
    loading: !!session && records.phase === "loading",
  };
}
export function openReadinessAction(action: ReadinessAction) {
  if (action.sessionId)
    progress.write({ [currentInterviewKey]: action.sessionId });
  switch (action.target) {
    case "topic":
      if (action.slug)
        router.push({
          pathname: "/topic/[slug]",
          params: { slug: action.slug },
        });
      break;
    case "mistakes":
      router.push("/mistakes");
      break;
    case "journal":
      router.navigate("/(tabs)/progress");
      break;
    case "evidence":
      router.push("/evidence");
      break;
    case "interviews":
      router.push("/interviews");
      break;
    case "practice":
      router.navigate("/(tabs)/practice");
      break;
  }
}
