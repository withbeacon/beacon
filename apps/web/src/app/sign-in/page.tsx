import { Logo } from "@bud/ui";
import SignInButton from "~/components/signInButton";

export default function SignIn() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-gray-100 dark:bg-gray-900">
      <div className="flex max-w-lg flex-col items-start gap-6 px-6 md:p-0">
        <div className="flex items-center text-gray-800 dark:text-gray-200">
          <Logo className="mr-2 h-10 w-10" />
          <h2 className="text-2xl font-bold md:text-3xl">Bud</h2>
        </div>

        <h1 className="text-xl font-medium text-gray-600 dark:text-gray-400 md:text-2xl">
          Analytics should be privacy friendly, fast and simple.{" "}
          <span className="text-gray-800 dark:text-gray-200">
            That&apos;s what we do.
          </span>
        </h1>

        <SignInButton />
        <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
          By signing in to Bud, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    </div>
  );
}
