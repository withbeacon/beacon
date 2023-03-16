"use client";

import { Button } from "@beacon/ui";
import Link from "next/link";

export default function SignInLinkButton() {
  return (
    <Link href="/sign-in">
      <Button size="md" variant="primary" fullWidth>
        Sign In
      </Button>
    </Link>
  );
}
