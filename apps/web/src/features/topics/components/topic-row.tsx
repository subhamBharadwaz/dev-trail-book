import { Check, ChevronRight } from "lucide-react";
import { categories, type Topic } from "../data/content";
export function TopicRow({
  topic,
  completed,
}: {
  topic: Topic;
  completed: boolean;
}) {
  const category = categories.find((item) => item.id === topic.category)!;
  return (
    <a
      href={`/topic/${topic.slug}`}
      className="group flex min-w-0 items-center gap-3 border-b border-line py-4"
    >
      <span
        className={`grid size-[33px] shrink-0 place-items-center rounded-lg text-sm font-semibold tracking-[-.6px] ${category.color}`}
      >
        {category.symbol}
      </span>
      <div className="min-w-0 [&_strong]:block [&_strong]:text-sm [&_strong]:font-medium [&_strong]:leading-[1.5] group-hover:[&_strong]:text-green [&>span]:mt-1 [&>span]:flex [&>span]:flex-wrap [&>span]:items-center [&>span]:gap-[7px] [&>span]:text-sm [&>span]:text-muted-ink [&_i]:not-italic">
        <strong>{topic.title}</strong>
        <span>
          {category.name}
          <i>·</i>
          {topic.minutes} min read
        </span>
      </div>
      {completed ? (
        <Check className="ml-auto text-green" size={17} aria-label="Read" />
      ) : (
        <span className="ml-auto whitespace-nowrap rounded border border-line bg-surface px-1.5 py-[3px] text-sm text-muted-ink @max-[1050px]:hidden">
          {topic.level}
        </span>
      )}
      <ChevronRight size={16} className="ml-auto text-muted-ink" />
    </a>
  );
}
