import Image from "next/image";

import insightCards from "~/assets/insight-cards.svg";
import cookieBanner from "~/assets/cookie-banner.svg";
import commandPalette from "~/assets/command-palette.svg";

export default function Features() {
  return (
    <section className="mt-6 grid grid-cols-1 auto-rows-auto auto-cols-auto lg:grid-cols-2 gap-6 px-4 lg:px-0">
      <div className="lg:col-span-2 flex flex-col items-start justify-between gap-6 rounded-2xl border-gray-200 bg-gray-50 p-8 lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-3xl font-semibold md:leading-[3.15rem] leading-auto text-gray-900 md:text-4xl">
            Super simple and easy to understand
          </h2>

          <p className="text-lg leading-7 text-gray-600">
            Our dashboard is super simple and easy to understand even for
            non-tech savvy people, you just don’t need to learn anything new to
            get insights about your traffic.
          </p>
        </div>

        <Image src={insightCards} alt="Insight cards" />
      </div>

      <div className="flex flex-col items-start gap-6 rounded-2xl border-gray-200 bg-gray-50 p-8">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-3xl font-semibold md:leading-[3.15rem] leading-auto text-gray-900 md:text-4xl">
            No annoying cookie banners anymore
          </h2>

          <p className="text-lg leading-7 text-gray-600">
            <span>
              Cookie banners are really annoying, right? We care about user
              experience of your users as much as you do.
            </span>


            <span className="mt-5 block">
              We don’t use cookies for tracking traffic of your website so you can get rid of that ugly
              looking cookie banner from your site.
            </span>
          </p>
        </div>

        <Image src={cookieBanner} alt="Cookie banner" className="w-full shadow-md shadow-gray-100" />
      </div>

      <div className="flex flex-col items-start gap-6 rounded-2xl border-gray-200 bg-gray-50 p-8">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-3xl font-semibold md:leading-[3.15rem] leading-auto text-gray-900 md:text-4xl">
            Do everything, super fast
          </h2>

          <p className="text-lg leading-7 text-gray-600">
            Navigating and searching your websites is just one shortcut far away. Quickly jump to your websites, dashboard and settings with the command palette.
          </p>
        </div>

        <Image src={commandPalette} alt="Command palette" className="w-full shadow-md shadow-gray-100" />
      </div>
    </section>
  );
}
