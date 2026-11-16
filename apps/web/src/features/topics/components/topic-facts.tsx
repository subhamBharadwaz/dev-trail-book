import type { Topic } from "../data/content";
export function Facts({ topic }: { topic: Topic }) {
  return (
    <div className="[&>div]:flex [&>div]:items-start [&>div]:gap-[18px] [&>div]:border-b [&>div]:border-line [&>div]:py-[22px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-ink">
      {topic.facts.map((fact, index) => (
        <div key={fact}>
          <span className="pt-0.5 font-mono text-sm text-green">
            0{index + 1}
          </span>
          <p>{fact}</p>
        </div>
      ))}
    </div>
  );
}
