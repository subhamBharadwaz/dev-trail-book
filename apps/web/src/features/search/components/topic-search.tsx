import { useState, type ReactNode } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
} from "@ui-sdk/react/command";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { navigateToTopic, topicHref } from "@/app/routes";
import { filterTopics, matchesTopic } from "@/features/topics/data/content";
import {
  searchTopics as topics,
  searchTopicBySlug as topicBySlug,
} from "../data/search-index";
interface TopicSearchProps {
  onSelect: () => void;
  closeButton?: ReactNode;
}
export function TopicSearch({ onSelect, closeButton }: TopicSearchProps) {
  const [query, setQuery] = useState("");
  const results = filterTopics(query, topics);
  return (
    <Command
      aria-label="Topic search"
      query={query}
      onQueryChange={setQuery}
      filter={(item, text) => {
        const topic = topicBySlug.get(item.value);
        return topic ? matchesTopic(topic, text) : false;
      }}
      onAction={(slug) => {
        navigateToTopic(slug);
        onSelect();
      }}
    >
      <div className="flex items-center gap-2 border-b border-line px-[14px] py-[17px] text-muted-ink min-[701px]:gap-[13px] min-[701px]:p-5 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-base [&_input]:text-ink [&_input]:outline-offset-[5px] min-[701px]:[&_input]:text-base">
        <Search size={20} aria-hidden="true" />
        <CommandInput
          autoFocus
          aria-label="Search topics"
          placeholder="A concept, a question, a piece of code…"
        />
        {closeButton}
      </div>
      <div className="max-h-[52vh] overflow-auto px-3 py-[17px] [&>[hidden]]:hidden">
        <span className="text-sm font-medium tracking-[1.1px] text-muted-ink">
          {query.trim()
            ? `${results.length} ${results.length === 1 ? "RESULT" : "RESULTS"}`
            : "EXPLORE YOUR KNOWLEDGE"}
        </span>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-[15px] px-[18px] py-[70px] text-center text-muted-ink [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink [&_p]:text-sm [&_p]:leading-[1.8]">
            <Search size={24} aria-hidden="true" />
            <h3>No matching notes yet</h3>
            <p>Try a broader term, such as “state”, “React”, or “HTTP”.</p>
          </div>
        </CommandEmpty>
        <CommandList aria-label="Matching topics">
          {topics.map((topic) => (
            <CommandItem
              key={topic.slug}
              value={topic.slug}
              label={topic.title}
              keywords={[topic.searchText]}
              className="flex cursor-pointer items-center gap-[13px] rounded-md px-2.5 py-[13px] text-muted-ink hover:bg-green-soft hover:text-green data-highlighted:bg-green-soft data-highlighted:text-green data-highlighted:outline data-highlighted:outline-green data-highlighted:-outline-offset-1 [&>svg:last-child]:ml-auto [&_strong]:block [&_strong]:text-sm [&_strong]:font-medium [&_strong]:text-ink [&_span]:mt-1.5 [&_span]:block [&_span]:text-sm [&_span]:leading-[1.6] [&_[data-slot=command-item-icon]]:mt-0 [&_[data-slot=command-item-icon]]:flex"
              render={<a href={topicHref(topic.slug)} />}
            >
              <CommandItemIcon>
                <BookOpen size={17} />
              </CommandItemIcon>
              <div className="min-w-0 break-words">
                <strong>{topic.title}</strong>
                <span>{topic.description}</span>
              </div>
              <ArrowRight size={15} aria-hidden="true" />
            </CommandItem>
          ))}
        </CommandList>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-line px-5 py-[13px] text-sm text-muted-ink [&_span]:whitespace-nowrap">
        <span>↑ ↓ to navigate · Enter to open</span>
        <span>{query ? "Esc to clear" : "Esc to close"}</span>
      </div>
    </Command>
  );
}
