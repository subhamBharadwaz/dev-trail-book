import { lazy, Suspense, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { Search, X } from "lucide-react";

const TopicSearch = lazy(() =>
  import("./topic-search").then((module) => ({ default: module.TopicSearch })),
);
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        shortcut="mod+k"
        aria-label="Search knowledge"
        className="flex min-h-11 min-w-11 justify-center xl:justify-start items-center gap-2.5 border-0 bg-transparent text-sm text-muted-ink [&_kbd]:ml-[5px] [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-line [&_kbd]:px-[5px] [&_kbd]:py-0.5 [&_kbd]:font-sans [&_kbd]:text-sm xl:[&_kbd]:ml-4 max-xl:[&>span]:hidden max-xl:[&_kbd]:hidden"
      >
        <Search size={15} aria-hidden="true" />
        <span>Find a topic or question…</span>
        <DialogShortcut render={<kbd />} />
      </DialogTrigger>
      <DialogContent className="fixed left-1/2 top-[9vh] m-0 max-h-[75vh] w-[min(620px,calc(100vw-30px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-page p-0 text-ink shadow-[0_24px_90px_#0003] min-[701px]:top-[14vh] backdrop:bg-[#18241c65] backdrop:backdrop-blur-[3px]">
        <DialogTitle className="sr-only">Search the trailbook</DialogTitle>
        <DialogDescription className="sr-only">
          Search topics, explanations, code examples, and questions.
        </DialogDescription>
        <Suspense
          fallback={
            <div className="p-7 text-sm text-muted-ink" role="status">
              Loading search…
            </div>
          }
        >
          <TopicSearch
            onSelect={() => setOpen(false)}
            closeButton={
              <DialogClose
                aria-label="Close search"
                className="grid size-11 place-items-center rounded border-0 bg-transparent text-muted-ink hover:bg-surface-hover hover:text-ink"
              >
                <X size={18} />
              </DialogClose>
            }
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
