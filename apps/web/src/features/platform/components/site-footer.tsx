import { repository } from "../data/public-pages";
export function SiteFooter() {
  return (
    <footer className="mx-5 mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line py-6 text-sm leading-7 text-muted-ink sm:mx-8">
      <p>Dev Trailbook · Public beta · Built for steady progress.</p>
      <nav
        aria-label="About and support"
        className="flex flex-wrap gap-x-5 gap-y-2 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:text-green [&_a:hover]:underline"
      >
        <a href="/start-here">Start here</a>
        <a href="/about">About</a>
        <a href="/privacy">Privacy & data</a>
        <a href="/feedback">Feedback</a>
        <a href={repository} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </footer>
  );
}
