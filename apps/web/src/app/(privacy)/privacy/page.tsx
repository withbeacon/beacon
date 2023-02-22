import { redirect } from "next/navigation";

export default function Privacy() {
  redirect("https://github.com/withbeacon/beacon/blob/main/PRIVACY.md");
  return null;
}

