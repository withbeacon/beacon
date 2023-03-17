import Form from "./form";

import { protect } from "~/utils/auth";

export default async function Page() {
  await protect();

  return (
    <>
      <h1 className="text-2xl font-bold">Add your website</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Just tell us about the name and url of your website, we will handle the rest.
      </p>
      <Form />
    </>
  );
}
