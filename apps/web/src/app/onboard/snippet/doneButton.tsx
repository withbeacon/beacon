"use client";

import { Button } from "@beacon/ui";

import { useRouter } from "next/navigation";

export default function DoneButton() {
  const router = useRouter();

  return (
    <Button
      intent="primary"
      size="md"
      onClick={() => router.push("/onboard/community")}
      filled
      fullWidth
    >
      Done!
    </Button>
  );
}
