import { useState } from "react";
import { Input } from "@ui-sdk/react/input";
import { ArrowDown, ArrowRight, Bookmark, Code2, Search } from "lucide-react";
import {
  categories,
  filterTopics,
  topics,
} from "@/features/topics/data/content";
import { TopicRow } from "@/features/topics/components/topic-row";
import { Facts } from "@/features/topics/components/topic-facts";
import { Questions } from "@/features/topics/components/topic-questions";
import { useReadingState } from "@/hooks/use-reading-state";
import type { CollectionRoute } from "@/app/routes";
export function CollectionPage({ route }: { route: CollectionRoute }) {
  const { saved, read } = useReadingState();
  const [query, setQuery] = useState("");
  const { category, title } = route;
  const isSaved = route.collection === "saved";
  const isQuestions = route.collection === "questions";
  const isFacts = route.collection === "facts";
  const collection = category
    ? topics.filter((topic) => topic.category === category.id)
    : isSaved
      ? topics.filter((topic) => saved.includes(topic.slug))
      : topics;
  const visible = filterTopics(query, collection);
  return (
    <div className="mx-auto max-w-[1120px] px-[23px] pb-10 pt-7 sm:px-8 lg:px-10 [&>h1]:mb-4 [&>h1]:mt-[18px] [&>h1]:text-[31px] [&>h1]:font-medium [&>h1]:tracking-[-1px] min-[701px]:[&>h1]:text-[37px]">
      <a
        className="mb-[30px] inline-flex items-center gap-2 text-sm text-muted-ink hover:text-green"
        href="#/"
      >
        <ArrowDown size={13} className="rotate-90" />
        Back to overview
      </a>
      <div className="flex items-center gap-2 text-sm font-medium tracking-[1.1px] text-green">
        {category ? "THE COLLECTION" : "YOUR KNOWLEDGE, CONNECTED"}
      </div>
      <h1>{title}</h1>
      <p className="max-w-[650px] text-[15px] leading-[1.8] text-muted-ink">
        {category?.description ||
          (isSaved
            ? "A reading list for your next quiet moment. Saved on this browser."
            : isQuestions
              ? "Practice explaining the why. Open an answer when you’re ready."
              : isFacts
                ? "Small details that make a difference. Revisit them often."
                : "One growing collection of concepts, practical examples, and useful answers.")}
      </p>
      <div className="my-7 flex flex-wrap items-center justify-between gap-3 border-y border-line py-4 text-sm text-muted-ink">
        <span>
          {collection.length} {isSaved ? "saved topics" : "topic notes"}
        </span>
        <div className="flex items-center gap-2 [&_input]:w-[125px] [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-base [&_input]:text-ink min-[701px]:[&_input]:w-[180px]">
          <Search size={15} />
          <Input
            aria-label="Filter this collection"
            value={query}
            onValueChange={setQuery}
            placeholder="Filter topics…"
          />
        </div>
      </div>
      {visible.length ? (
        isQuestions || isFacts ? (
          <div className="[&>section]:mb-10 [&>section]:mt-[30px]">
            {visible.map((item) => (
              <section key={item.slug}>
                <a
                  href={`#/topic/${item.slug}`}
                  className="mb-[17px] flex items-center gap-[11px] [&_h2]:text-base [&_h2]:font-medium [&_h2]:tracking-[-.3px] [&>svg]:ml-auto [&>svg]:text-green"
                >
                  <span className="grid size-[19px] shrink-0 place-items-center rounded text-sm font-semibold tracking-[-.5px]">
                    {categories.find((cat) => cat.id === item.category)?.symbol}
                  </span>
                  <h2>{item.title}</h2>
                  <ArrowRight size={15} />
                </a>
                {isQuestions ? (
                  <Questions topic={item} />
                ) : (
                  <Facts topic={item} />
                )}
              </section>
            ))}
          </div>
        ) : (
          <div>
            {visible.map((item) => (
              <TopicRow
                key={item.slug}
                topic={item}
                completed={read.includes(item.slug)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center gap-[15px] px-[18px] py-[70px] text-center text-muted-ink [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink [&_p]:text-sm [&_p]:leading-[1.8]">
          <Bookmark size={30} />
          <h2>
            {query ? "No topics match that filter" : "A little space for later"}
          </h2>
          <p>
            {query
              ? "Try another word or clear your search."
              : "Open a topic and choose “Save topic” to keep it here."}
          </p>
          <a
            href="#/topics"
            className="inline-flex items-center gap-2 text-sm font-medium text-green"
          >
            Browse all topics
            <ArrowRight size={14} />
          </a>
        </div>
      )}
      <div className="mt-[35px] flex items-center gap-2.5 border-t border-line py-[17px] text-sm leading-[1.7] text-muted-ink">
        <Code2 size={16} />
        <span>
          Notes combine discussion recaps and the study-plan syllabus. Add MDX
          files to keep the collection growing.
        </span>
      </div>
    </div>
  );
}
