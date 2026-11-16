import { InterviewSetup } from "@/features/interviews/interview-setup";
import { InterviewSession } from "@/features/interviews/interview-session";
import { useInterviews } from "@/features/interviews/use-interviews";
export function InterviewsPage() {
  const data = useInterviews();
  return (
    <div className="mx-auto max-w-4xl space-y-7 px-5 py-8 sm:px-8 sm:py-12">
      {data.storageError && (
        <p role="alert">
          Device storage could not be updated. Keep this page open and check
          Account & sync.
        </p>
      )}
      {data.selected ? (
        <InterviewSession
          key={data.selected.id}
          session={data.selected}
          values={data.values}
          actions={data.actions}
          now={data.now}
        />
      ) : (
        <InterviewSetup
          sessions={data.sessions}
          values={data.values}
          actions={data.actions}
          now={data.now}
        />
      )}
    </div>
  );
}
