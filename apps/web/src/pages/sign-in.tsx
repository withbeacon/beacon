import { Logo, Button } from "@spark/ui";
import { GoogleIcon } from "@spark/ui";

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
    <div className="h-screen w-screen grid place-items-center">
      <animated.div className="flex flex-col max-w-lg px-6 md:p-0 items-start gap-6" style={{ ...containerSprings }}>
        <div className="flex items-center text-gray-800">
          <Logo className="-mx-2 -my-4 w-16 h-16" />
          <h2 className="text-2xl md:text-3xl font-bold">Spark</h2>
        </div>

        <h1 className="text-xl text-gray-600 font-semibold md:text-2xl">
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
        <p className="text-sm md:text-base text-gray-500">
          By signing in to Spark, you agree to our terms of service and privacy
          policy.
        </p>
      </animated.div>
    </div>
  );
}
