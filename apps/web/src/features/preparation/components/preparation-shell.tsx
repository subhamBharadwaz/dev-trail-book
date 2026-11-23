import type { ReactNode } from "react";
export function PreparationShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <p className="text-sm font-medium tracking-wide text-green">
        YOUR PRACTICE SPACE
      </p>
      <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-ink">
        {description}
      </p>
      <nav
        aria-label="Preparation navigation"
        className="mb-8 mt-6 flex flex-wrap gap-3 text-sm"
      >
        <a
          href="/today"
          className="rounded-full border border-line bg-surface px-4 py-3 font-medium text-green"
        >
          Today’s practice
        </a>
        <a
          href="/evidence"
          className="rounded-full border border-line bg-surface px-4 py-3 font-medium text-green"
        >
          Evidence journal
        </a>
      </nav>
      {children}
    </div>
  );
}
