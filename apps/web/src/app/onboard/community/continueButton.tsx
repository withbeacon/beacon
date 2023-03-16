"use client";

import { Button } from "@beacon/ui";

import { useRouter } from "next/navigation";

export default function ContinueButton() {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => router.push("/")}
      fullWidth
    >
      Take me to app
    </Button>
  );
}
