import { Logo, ErrorIcon } from "@beacon/ui";
import Link from "next/link";
import SignInButton from "~/components/signInButton";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function SignIn({ searchParams }: Props) {
  const error = searchParams?.error as string | undefined;

  return (
    <div className="flex h-screen flex-col items-center bg-gray-100 dark:bg-gray-900">
      <div className="my-8 flex items-center text-gray-800 dark:text-gray-200">
        <Logo className="mr-2 h-8 w-8" />
        <h2 className="text-2xl font-bold md:text-3xl">Beacon</h2>
      </div>

      <div className="my-auto flex max-w-lg flex-col items-start gap-3 px-6 md:p-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
          Sign in to Beacon
        </h1>

        <p className="text-base text-gray-500 dark:text-gray-400 md:text-lg">
          Create your account for Beacon. The analytics tool which is just
          created for you in mind.
        </p>

        {error === "access_denied" ? (
          <div className="my-2 flex select-none flex-col gap-2 rounded-xl border border-gray-200 bg-gray-100 py-4 px-6 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-center gap-2">
              <ErrorIcon />
              <span className="text-lg font-semibold">
                Uh oh, you are not allowed in yet
              </span>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">
              We are currently in early access, if you want to get access to
              Beacon, please sign up for the <Link href="/" className="underline underline-offset-4">waitlist</Link>. We
              will send you an invite asap.
            </p>
          </div>
        ) : null}

        <SignInButton />
        <p className="text-base text-gray-500 dark:text-gray-400 md:text-lg">
          By signing in to Beacon, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Sign in to Beacon",
};
