import Seo from "../seo";

import { prisma } from "@bud/db";

interface Props {
  params: { id: string };
}

export default async function Head({ params }: Props) {
  params.id = params.id.replace("%3A", ":");

  const website = await prisma.website.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!website) {
    return (
      <>
        <title>404 - Not found</title>
        <Seo />
      </>
    );
  }

  return (
    <>
      <title>Bud</title>
      <Seo />
    </>
  );
}
