import { ArrowRight, BookOpen } from "lucide-react";
export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-[15px] px-[18px] py-[70px] text-center text-muted-ink [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink [&_p]:text-xs [&_p]:leading-[1.8] pt-[120px] [&_h1]:text-[28px] [&_h1]:tracking-[-1px] [&_h1]:text-ink">
      <BookOpen size={32} />
      <h1>That trail hasn’t been written yet.</h1>
      <p>The topic or category could not be found.</p>
      <a
        className="inline-flex min-h-[35px] items-center justify-center gap-3 whitespace-nowrap rounded px-[13px] py-[9px] text-xs font-medium bg-[#2c684e] text-white hover:bg-[#20513b]"
        href="#/topics"
      >
        Explore all topics
        <ArrowRight size={15} />
      </a>
    </div>
  );
}
