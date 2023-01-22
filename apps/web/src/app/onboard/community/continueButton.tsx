"use client";

import { Button } from "@beacon/ui";

import { useRouter } from "next/navigation";

export default function ContinueButton() {
  const router = useRouter();

  return (
    <Button
      intent="primary"
      size="md"
      onClick={() => router.push("/")}
      filled
      fullWidth
    >
      Take me to app
    </Button>
  );
}
