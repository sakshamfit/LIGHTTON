import { ViewTransition } from "react";

/** Route transitions: a short crossfade with a subtle rise (≈ 560–720ms total). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
