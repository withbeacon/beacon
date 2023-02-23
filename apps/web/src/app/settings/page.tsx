import Sidebar, { SidebarShimmer } from "~/components/sidebar";
import LogoutDialog from "./logoutDialog";
import DeleteDialog from "./deleteDialog";
import { Suspense } from "react";
import { EmailInput, NameInput } from "./inputs";

import { getServerSession } from "@beacon/auth";
import { prisma } from "@beacon/db";
import { protect } from "~/utils/auth";

export default async function Settings() {
  await protect();

  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
    select: { id: true },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col gap-6 overflow-scroll p-6 pr-2 lg:flex-row">
      <Suspense fallback={<SidebarShimmer />}>
        <Sidebar
          user={{
            name: session?.user?.name || "Cool Person",
            image: session?.user?.image,
          }}
          page="settings"
        />
      </Suspense>
      <main className="ml-2 flex w-full flex-col gap-6 py-1 lg:w-80">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          My Account
        </h1>

        <NameInput defaultName={session?.user?.name || "Cool Person"} />
        <EmailInput defaultEmail={session?.user?.email || ""} />
        <LogoutDialog />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Delete your account
        </h1>
        <DeleteDialog userId={user.id} />
      </main>
    </div>
  );
}
