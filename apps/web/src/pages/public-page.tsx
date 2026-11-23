import {
  publicPages,
  repository,
  type PublicPageId,
} from "@/features/platform/data/public-pages";
const link =
  "inline-flex min-h-11 items-center text-green underline underline-offset-4";
const section = "space-y-3 border-t border-line pt-6";
export function PublicPage({ page }: { page: PublicPageId }) {
  const info = publicPages[page];
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-5 py-8 text-base leading-8 sm:px-8 sm:py-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_p]:text-muted-ink">
      <header>
        <p className="text-sm font-semibold text-green">
          DEV TRAILBOOK · PUBLIC BETA
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {info.title}
        </h1>
        <p className="mt-4">{info.description}</p>
      </header>
      {page === "start-here" && (
        <>
          <section className={section}>
            <h2>1. Choose a comfortable starting point</h2>
            <p>
              New to frontend development? Begin with semantic HTML, responsive
              layouts and the browser. If you already build interfaces, choose a
              lesson where your explanation still feels shaky.
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a className={link} href="/paths/plan-week-1">
                Start with web foundations
              </a>
              <a className={link} href="/paths">
                Browse learning paths
              </a>
            </div>
          </section>
          <section className={section}>
            <h2>2. Trace it, then try it</h2>
            <p>
              Read one explanation. Step through its visual guide, predict the
              code’s result and run the example in your own environment. Close
              the notes, explain the idea aloud, then attempt the exercise
              before revealing a hint.
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a className={link} href="/topic/event-loop">
                Try the event-loop walkthrough
              </a>
              <a className={link} href="/topic/closures">
                Start with closures
              </a>
            </div>
          </section>
          <section className={section}>
            <h2>3. Keep a useful record</h2>
            <p>
              “Read” means you visited the material. Confidence is your own
              assessment, not a verified mastery score. Save a mistake when you
              miss something, and return to it in a later session.
            </p>
            <a className={link} href="/mistakes">
              Open your mistake notebook
            </a>
          </section>
          <section className={section}>
            <h2>No account needed to begin</h2>
            <p>
              Lessons and practice are open. Guest records stay in this browser
              and can be lost if its storage is cleared. Optional sign-in lets
              your study records sync between devices. Export a backup before
              changing devices or clearing browser data.
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a className={link} href="/account">
                Sign in for cross-device sync
              </a>
              <a className={link} href="/backup">
                Export your study data
              </a>
            </div>
          </section>
        </>
      )}
      {page === "about" && (
        <>
          <section className={section}>
            <h2>A workbook that grew beyond one learner</h2>
            <p>
              Dev Trailbook began as a personal way to revisit development
              topics after a study gap. It is now open to anyone who wants a
              calmer place to learn, build and explain frontend concepts.
            </p>
            <p>
              Created and maintained by{" "}
              <a
                className="text-green underline"
                href="https://github.com/subhamBharadwaz"
                target="_blank"
                rel="noreferrer"
              >
                Subham Bharadwaz
              </a>
              . The project is developed with AI-assisted tooling; explanations
              and examples can contain mistakes, so technical references and
              review notes are part of the learning experience.
            </p>
          </section>
          <section className={section}>
            <h2>Frontend first. At your pace.</h2>
            <p>
              Begin with the web, JavaScript, TypeScript and React. Algorithms,
              backend topics, AI features and interview practice are optional
              extensions. Interactive diagrams, worked examples and recall
              exercises are here to support understanding—not to promise a job
              or certify expertise.
            </p>
          </section>
          <section className={section}>
            <h2>What “public beta” means</h2>
            <p>
              The platform is still evolving. Some explanations are concise,
              technical review is incomplete, and practice is self-assessed.
              Check each lesson’s review notes and source. Report inaccurate
              content or broken behavior so it can improve.
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a className={link} href="/feedback">
                Send a correction
              </a>
              <a
                className={link}
                href={repository}
                target="_blank"
                rel="noreferrer"
              >
                Explore the source
              </a>
            </div>
          </section>
        </>
      )}
      {page === "privacy" && (
        <>
          <section className={section}>
            <h2>Without an account</h2>
            <p>
              Reading progress, saved lessons, practice, mistakes and
              preparation records are stored in this browser. Your theme
              preference is also stored locally. These guest records do not
              automatically follow you to another browser or device.
            </p>
          </section>
          <section className={section}>
            <h2>When you sign in</h2>
            <p>
              Supabase handles authentication and stores study records
              associated with your account. Records can include your saved
              topics, progress, practice results, interview drafts, mistakes and
              journal entries. Sign-in session information is stored on your
              device so you can stay signed in.
            </p>
            <p>
              GitHub sign-in uses an OAuth redirect. This app’s sign-in flow
              does not request repository access. Your GitHub account details,
              such as your name, avatar and email where available, may be used
              for your account.
            </p>
            <p>
              The database is configured to restrict study records to the
              signed-in account. These records are not displayed as public
              profiles. Avoid entering passwords, employer-confidential code or
              other sensitive material in notebooks and drafts.
            </p>
          </section>
          <section className={section}>
            <h2>Hosting and external services</h2>
            <p>
              Cloudflare Pages serves this website and may process request and
              security information as part of hosting. Supabase processes
              account and synced study data. Following a reference or feedback
              link opens another service, which has its own data practices. No
              advertising or visitor-analytics SDK is included in the current
              app code.
            </p>
          </section>
          <section className={section}>
            <h2>Your choices</h2>
            <p>
              Use the site as a guest, export a backup, or sign out from Account
              & sync. Signing out does not delete server records. Clearing
              browser storage removes device-only records and the local session;
              it does not delete synced records. Self-service account deletion
              is not available yet.
            </p>
            <p>
              For account-data removal, contact the maintainer through the
              GitHub profile linked on the About page. Do not put private
              account information, backups, tokens or journal contents into a
              public GitHub issue.
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a className={link} href="/backup">
                Export a backup
              </a>
              <a className={link} href="/account">
                Manage your session
              </a>
              <a className={link} href="/about">
                Find the maintainer
              </a>
            </div>
          </section>
          <p className="text-sm">
            Updated 23 November 2026. This page describes the current
            implementation and will change as features are added.
          </p>
        </>
      )}
      {page === "feedback" && (
        <>
          <section className={section}>
            <h2>Found a bug or an unclear explanation?</h2>
            <p>
              Include the page URL, what you expected, what happened and your
              browser/device. For a content correction, quote the relevant
              sentence or example and include an authoritative reference if you
              have one.
            </p>
            <a
              className={link}
              href={`${repository}/issues/new?template=bug_report.yml`}
              target="_blank"
              rel="noreferrer"
            >
              Report a bug or content correction on GitHub
            </a>
          </section>
          <section className={section}>
            <h2>Have a lesson or feature idea?</h2>
            <p>
              Describe the concept you want to understand, your current level
              and an example that would make it click. Suggestions are welcome;
              there is no promised delivery date.
            </p>
            <a
              className={link}
              href={`${repository}/issues/new?template=feature_request.yml`}
              target="_blank"
              rel="noreferrer"
            >
              Suggest an improvement on GitHub
            </a>
          </section>
          <section className={section}>
            <h2>Keep public reports safe</h2>
            <p>
              GitHub issues are public. Do not include passwords, sign-in links,
              access tokens, account identifiers, study backups or private
              journal entries. To discuss account data, start from the
              maintainer’s profile on the About page instead.
            </p>
          </section>
        </>
      )}
    </article>
  );
}
