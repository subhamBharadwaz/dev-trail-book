import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export class PageBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section role="alert" className="mx-auto max-w-xl space-y-4 px-6 py-16">
        <h1 className="text-2xl font-medium text-ink">
          This page couldn’t load.
        </h1>
        <p className="text-sm leading-7 text-muted-ink">
          Reload to try again, or return to the overview and choose another
          note.
        </p>
        <div className="flex items-center gap-5">
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <a
            href="#/"
            className="text-sm text-green underline underline-offset-4"
          >
            Back to overview
          </a>
        </div>
      </section>
    );
  }
}
