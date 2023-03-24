"use client";

import { GoogleIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function GoogleOAuthSignInButton() {
  const [loading, setLoading] = useState(false);

  function handleSignIn() {
    setLoading(true);
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <Button
      variant="outline"
      size="md"
      className="my-2 bg-white dark:bg-gray-800"
      onClick={handleSignIn}
      loading={loading}
      fullWidth
    >
      <GoogleIcon className="w-5 h-5 fill-gray-700 dark:fill-gray-200" /> Sign in with Google
    </Button>
  );
}
