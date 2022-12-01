import { Logo, Button } from "@bud/ui";
import { GoogleIcon } from "@bud/ui";

import { config, animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const containerSprings = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },

    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },

    config: config.slow,
    delay: 100,
  });

  function handleSignIn() {
    setLoading(true);
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="grid h-screen w-screen place-items-center">
      <animated.div
        className="flex max-w-lg flex-col items-start gap-6 px-6 md:p-0"
        style={{ ...containerSprings }}
      >
        <div className="flex items-center text-gray-800">
          <Logo className="mr-2 h-12 w-12" />
          <h2 className="text-2xl font-bold md:text-3xl">Bud</h2>
        </div>

        <h1 className="text-xl font-semibold text-gray-600 md:text-2xl">
          Analytics should be privacy friendly, fast and simple.{" "}
          <span className="text-gray-800">That&apos;s what we do.</span>
        </h1>

        <Button
          intent="primary"
          size="lg"
          onClick={handleSignIn}
          loading={loading}
          filled
          fullWidth
        >
          <GoogleIcon /> Sign In
        </Button>
        <p className="text-sm text-gray-500 md:text-base">
          By signing in to Bud, you agree to our terms of service and privacy
          policy.
        </p>
      </animated.div>
    </div>
  );
}
