import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  FolderOpen,
  Lightbulb,
  Sprout,
} from "lucide-react";
import { categories, topics } from "@/features/topics/data/content";
import { TopicRow } from "@/features/topics/components/topic-row";
import { CategoryCard } from "@/features/topics/components/category-card";
import { useReadingState } from "@/hooks/use-reading-state";
export function OverviewPage() {
  const { read } = useReadingState();
  const readCount = topics.filter((item) => read.includes(item.slug)).length;
  const featured = topics.find((item) => item.slug === "thinking-in-react")!;
  const continueTopic =
    (!read.includes(featured.slug) ? featured : undefined) ||
    topics.find(
      (item) => !read.includes(item.slug) && item.category === "react",
    ) ||
    topics.find((item) => !read.includes(item.slug)) ||
    featured;
  const questionCount = topics.reduce(
    (sum, item) => sum + item.questions.length,
    0,
  );
  return (
    <div className="mx-auto max-w-[1210px] px-[23px] pt-[31px] min-[701px]:px-[35px] min-[701px]:pt-[38px] min-[1201px]:px-14 min-[1201px]:pt-[49px] min-[1600px]:pt-[65px]">
      <div className="relative overflow-hidden pb-[33px] [&_h1]:my-[17px] [&_h1]:text-[35px] [&_h1]:font-medium [&_h1]:leading-[1.17] [&_h1]:tracking-[-1.8px] min-[701px]:[&_h1]:text-[37px] min-[961px]:[&_h1]:text-[43px] min-[1600px]:[&_h1]:text-[52px] [&_h1>span]:text-green [&>p]:text-sm [&>p]:leading-[1.9] [&>p]:text-muted-ink min-[701px]:[&>p]:text-sm max-[700px]:[&>p]:max-w-[280px] [&>a]:mt-[23px]">
        <div className="flex items-center gap-2 text-sm font-medium tracking-[1.1px] text-green">
          <span className="text-base">✳</span>YOUR DEVELOPER FIELD NOTES
        </div>
        <h1>
          A place for your
          <br />
          <span>next “aha” moment.</span>
        </h1>
        <p>
          The concepts you learn. The questions you ask.
          <br /> The little things you’ll want to remember.
        </p>
        <a
          href="#/topics"
          className="inline-flex items-center gap-2 text-sm font-medium text-green"
        >
          Explore the collection
          <ArrowRight size={15} />
        </a>
        <div
          className="pointer-events-none absolute right-[-48px] top-[14px] size-[200px] scale-[.65] text-green opacity-25 min-[701px]:right-[-30px] min-[701px]:scale-70 min-[701px]:opacity-30 min-[961px]:right-2.5 min-[961px]:scale-85 min-[961px]:opacity-55 min-[1201px]:right-10 min-[1201px]:scale-100 [&>div]:absolute [&>div]:left-[25px] [&>div]:top-5 [&>div]:h-[155px] [&>div]:w-[125px] [&>div]:origin-bottom [&>div]:rounded-t-[70px] [&>div]:rounded-b-lg [&>div]:border [&>div]:border-[#adc1a9] [&>div:first-child]:-rotate-20 [&>div:nth-child(3)]:rotate-20 [&>span]:absolute [&>span]:left-[70px] [&>span]:top-[72px] [&>span]:text-[57px] [&>span]:leading-none [&>span]:text-[#6f9671]"
          aria-hidden="true"
        >
          <div />
          <div />
          <div />
          <span>✳</span>
        </div>
      </div>
      <a
        href="#/today"
        className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 text-sm"
      >
        <span>
          <strong className="font-medium">
            Your next good practice day starts here.
          </strong>
          <span className="mt-2 block text-sm leading-6 text-muted-ink">
            Choose your available time, follow a focused routine, and record
            what you can explain or build independently.
          </span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-green" />
      </a>
      <div className="flex flex-wrap items-center gap-3 border-y border-line py-[15px] text-sm text-muted-ink min-[701px]:gap-[18px] min-[701px]:py-[17px] min-[701px]:text-sm min-[1201px]:gap-[27px] [&>span]:flex [&>span]:items-center [&>span]:gap-[7px] [&_strong]:font-medium [&_strong]:text-ink [&_svg]:text-[#818d80]">
        <span>
          <BookOpen size={15} />
          <strong>{topics.length}</strong> topic notes
        </span>
        <span>
          <FolderOpen size={15} />
          <strong>{categories.length}</strong> categories
        </span>
        <span>
          <CircleHelp size={15} />
          <strong>{questionCount}</strong> answered questions
        </span>
        <span className="ml-auto text-sm max-[960px]:hidden">
          <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#47835c]" />
          Always growing
        </span>
      </div>
      <section className="my-[23px] mb-8 flex flex-wrap items-start gap-3 rounded-lg border border-line bg-green-soft p-4 min-[701px]:my-7 min-[701px]:mb-10 min-[701px]:items-center min-[701px]:p-[18px] min-[961px]:flex-nowrap min-[961px]:gap-4 min-[961px]:p-[23px] [&>div:nth-child(2)]:min-w-[150px] [&>div:nth-child(2)]:flex-1 [&_h2]:my-[7px] [&_h2]:text-[15px] [&_h2]:font-medium [&_h2]:tracking-[-.3px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-muted-ink [&>a]:ml-[59px] min-[961px]:[&>a]:ml-auto">
        <div className="grid size-[42px] shrink-0 place-items-center rounded-[10px] border border-line bg-page text-green min-[961px]:h-[49px] min-[961px]:w-[47px]">
          <Sprout size={25} />
        </div>
        <div>
          <span className="text-sm font-medium tracking-[1.1px] text-muted-ink">
            {readCount ? "KEEP YOUR MOMENTUM" : "A GOOD PLACE TO BEGIN"}
          </span>
          <h2>{continueTopic.title}</h2>
          <p>{continueTopic.description}</p>
        </div>
        <a
          className="inline-flex min-h-[35px] items-center justify-center gap-3 whitespace-nowrap rounded px-[13px] py-[9px] text-sm font-medium bg-[#2c684e] text-white hover:bg-[#20513b]"
          href={`#/topic/${continueTopic.slug}`}
        >
          {readCount ? "Keep exploring" : "Start reading"}
          <ArrowRight size={15} />
        </a>
      </section>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <a
          href="#/paths"
          className="group rounded-xl border border-line p-5 hover:border-green"
        >
          <p className="text-sm uppercase tracking-wider text-green">
            LEARN WITH A LITTLE DIRECTION
          </p>
          <h2 className="mt-3 flex items-center justify-between text-base font-medium">
            Follow a learning path
            <ArrowRight size={16} />
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            Connected topics, ordered steps, and your next unread note.
          </p>
        </a>
        <a
          href="#/practice"
          className="group rounded-xl border border-line p-5 hover:border-green"
        >
          <p className="text-sm uppercase tracking-wider text-green">
            MAKE IT STICK
          </p>
          <h2 className="mt-3 flex items-center justify-between text-base font-medium">
            A few minutes of practice
            <ArrowRight size={16} />
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            Flashcards and quick quizzes to test what you remember.
          </p>
        </a>
      </div>
      <section>
        <div className="mb-5 flex items-center justify-between gap-3 [&_h2]:text-[19px] [&_h2]:font-medium [&_h2]:tracking-[-.5px] [&_span:first-child]:mb-2.5">
          <div>
            <span className="flex items-center gap-2 text-sm font-medium tracking-[1.1px] text-green text-muted-ink">
              FOLLOW YOUR CURIOSITY
            </span>
            <h2>Find your next trail</h2>
          </div>
          <span className="self-end pb-0.5 text-sm text-muted-ink max-[700px]:hidden">
            {categories.length} collections to explore
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[11px] min-[701px]:gap-[13px] min-[961px]:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      <div className="mt-[31px] grid gap-5 min-[701px]:mt-[39px] min-[961px]:grid-cols-[1.45fr_1fr] min-[1201px]:gap-7">
        <section>
          <div className="mb-5 flex items-center justify-between gap-3 [&_h2]:text-[19px] [&_h2]:font-medium [&_h2]:tracking-[-.5px] [&_span:first-child]:mb-2.5">
            <h2>From the notebook</h2>
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-green"
              href="#/topics"
            >
              View all
              <ArrowRight size={13} />
            </a>
          </div>
          <div>
            {["closures", "effects", "discriminated-unions"].map((slug) => (
              <TopicRow
                key={slug}
                topic={topics.find((item) => item.slug === slug)!}
                completed={read.includes(slug)}
              />
            ))}
          </div>
        </section>
        <aside className="relative hidden self-end overflow-hidden rounded-lg border border-line bg-surface p-[23px] min-[961px]:block [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-[22px] [&_h3]:font-medium [&_h3]:leading-[1.25] [&_h3]:tracking-[-.7px] [&_p]:max-w-[230px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-muted-ink [&_a]:mt-5 [&_a]:text-sm">
          <div className="flex items-center gap-2 text-sm font-medium tracking-[1.1px] text-green">
            <Lightbulb size={15} />A DETAIL WORTH KEEPING
          </div>
          <h3>
            Not everything needs
            <br />
            an Effect.
          </h3>
          <p>
            If you can calculate something from existing props or state, do it
            during rendering.
          </p>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-green"
            href="#/topic/effects"
          >
            Understand why
            <ArrowRight size={14} />
          </a>
          <span
            className="pointer-events-none absolute bottom-[-55px] right-3 text-[180px] leading-none text-green opacity-10"
            aria-hidden="true"
          >
            “
          </span>
        </aside>
      </div>
      <footer className="mt-10 flex items-center justify-between gap-3 border-t border-line py-6 text-sm leading-[1.7] text-muted-ink [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-[7px] max-[960px]:[&>span:last-child]:hidden">
        <span>Built for the things you don’t want to forget.</span>
        <span>
          Learn. Connect. Revisit.
          <Sprout size={14} />
        </span>
      </footer>
    </div>
  );
}
