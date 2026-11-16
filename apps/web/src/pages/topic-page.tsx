import { TopicReader } from "@/features/topics/components/topic-reader";
import type { Topic } from "@/features/topics/data/content";
import { useReadingState } from "@/hooks/use-reading-state";
export function TopicPage({ topic }: { topic: Topic }) {
  const { saved, read, toggleSaved, toggleRead } = useReadingState();
  return (
    <TopicReader
      topic={topic}
      saved={saved.includes(topic.slug)}
      completed={read.includes(topic.slug)}
      toggleSaved={() => toggleSaved(topic.slug)}
      toggleCompleted={() => toggleRead(topic.slug)}
    />
  );
}
