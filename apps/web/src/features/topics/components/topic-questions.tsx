import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion";
import { ChevronDown } from "lucide-react";
import type { Topic } from "../data/content";
export function Questions({ topic }: { topic: Topic }) {
  return (
    <Accordion aria-label={`Questions about ${topic.title}`}>
      {topic.questions.map((item, index) => (
        <AccordionItem
          className="border-b border-line"
          key={item.question}
          value={String(index)}
        >
          <AccordionHeader className="m-0">
            <AccordionTrigger className="group flex w-full items-center justify-between gap-4 bg-transparent py-5 text-left text-sm leading-relaxed text-ink">
              <span>{item.question}</span>
              <ChevronDown
                className="group-data-open:rotate-180"
                size={16}
                aria-hidden="true"
              />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="pb-5 pr-6 text-sm leading-loose text-muted-ink">
            <p>{item.answer}</p>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
