import { CreditCardIcon } from "@beacon/ui";
import EarlyAccessForm from "./earlyAccessForm";

export default function Hero() {
  return (
    <header className="mx-auto mt-16 flex w-full max-w-4xl flex-col items-center justify-center gap-7 text-center px-4 lg:px-0">
      <h1 className="bg-landing-title bg-clip-text md:text-6xl text-4xl font-bold text-transparent select-none">
        Analytics, but without all the nonsense.
      </h1>
      <p className="max-w-2xl text-base md:text-lg text-gray-600">
        Blazingly fast, simple, and privacy friendly analytics with the focus of
        delightful user experience in mind.
      </p>
      <EarlyAccessForm />
      <div className="inline-flex flex-col md:flex-row items-center justify-center gap-px text-sm text-gray-600">
        <CreditCardIcon className="h-5 w-5 mr-2" />
        <span>
          Only at 9$ an year for the first 29 customers!
        </span>
      </div>
    </header>
  );
}
