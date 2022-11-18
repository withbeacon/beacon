import { useEffect, useState } from "react";

export function useActiveWebsite(): [string | null, (id: string) => void] {
  const [activeWebsite, setActiveWebsite] = useState<string | null>(() => {
    const activeWebsite = localStorage.getItem("active-website");
    return activeWebsite ? JSON.parse(activeWebsite) : null;
  });

  useEffect(() => {
    localStorage.setItem("active-website", JSON.stringify(activeWebsite));
  }, []);

  return [activeWebsite, setActiveWebsite];
}
