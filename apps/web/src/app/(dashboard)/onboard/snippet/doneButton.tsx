"use client";

import { Button } from "@beacon/ui";

import { useRouter } from "next/navigation";

export default function DoneButton() {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => router.push("/onboard/community")}
      fullWidth
    >
      Done!
    </Button>
  );
}
