import { ArrowRight, ChevronRight } from "lucide-react";
import { topicCountByCategory, type Category } from "../data/content";
export function CategoryCard({ category }: { category: Category }) {
  const count = topicCountByCategory.get(category.id) ?? 0;
  return (
    <a
      className="rounded-lg border border-line bg-page px-[14px] pt-4 transition-colors hover:border-green hover:bg-surface min-[1201px]:px-[18px] min-[1201px]:pt-[18px] [&_h3]:mt-[17px] [&_h3]:text-[13px] [&_h3]:font-medium min-[701px]:[&_h3]:text-sm [&>p]:mb-[14px] [&>p]:mt-[7px] [&>p]:text-[11px] [&>p]:leading-[1.6] [&>p]:text-muted-ink min-[701px]:[&>p]:mb-5 min-[701px]:[&>p]:text-xs"
      href={`#/category/${category.id}`}
    >
      <div className="flex items-center justify-between [&>svg]:w-[13px] [&>svg]:text-[#9ca69b]">
        <span
          className={`grid size-[33px] shrink-0 place-items-center rounded-lg text-sm font-semibold tracking-[-.6px] ${category.color}`}
        >
          {category.symbol}
        </span>
        <ArrowRight size={16} />
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <div className="flex items-center justify-between gap-[5px] border-t border-line py-3 text-[10px] text-muted-ink [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-[3px] [&>span:last-child]:font-medium [&>span:last-child]:text-green max-[700px]:[&>span:last-child]:hidden">
        <span>
          {count} {count === 1 ? "note" : "notes"}
        </span>
        <span>
          Explore collection
          <ChevronRight size={12} />
        </span>
      </div>
    </a>
  );
}
