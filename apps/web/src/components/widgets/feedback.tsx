"use client";

import type { PropsWithChildren } from "react";
import { FeedbackFish } from "@feedback-fish/react";

import { env } from "~/env/client.mjs";

export default function Feedback({ children }: PropsWithChildren) {
  return (
    <FeedbackFish projectId={env.NEXT_PUBLIC_FEEDBACK_FISH}>
      <span>{children}</span>
    </FeedbackFish>
  );
}
