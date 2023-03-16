import Nav from "./components/nav";
import Hero from "./components/hero";
import Features from "./components/features";

import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";
import WindowImage from "./components/hero/windowImage";
import Footer from "./components/footer";

export default async function Page() {
  const session = await getServerSession();
  //if (session) {
  //  redirect("/dashboard");
  //  return null;
  //}

  return (
    <div className="bg-white selection:bg-primary-100 overflow-hidden">
      <main className="mx-auto max-w-xl md:max-w-2xl lg:max-w-7xl mx-4 xl:mx-auto">
        <span className="absolute inset-0 h-1.5 w-screen bg-primary-500" />
        <Nav />
        <Hero />
        <WindowImage />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

Page.theme = "light";
