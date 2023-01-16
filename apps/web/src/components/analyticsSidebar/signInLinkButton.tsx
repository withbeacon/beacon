"use client";

import { Button } from "@beacon/ui";
import Link from "next/link";

export default function SignInLinkButton() {
  return (
    <Link href="/sign-in">
      <Button size="md" intent="primary" fullWidth filled>
        Sign In
      </Button>
    </Link>
  );
}
