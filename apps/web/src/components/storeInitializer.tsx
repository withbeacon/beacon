"use client";

import type { Website as WebsiteType } from "~/store/website";

import { useRef } from "react";
import useWebsiteStore from "~/store/website";

interface Website extends Omit<WebsiteType, "createdAt"> {
  createdAt: number | string;
}

export default function StoreInitializer({
  createdAt,
  ...state
}: Website) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useWebsiteStore.setState({
      createdAt: new Date(createdAt),
      ...state,
    });

    initialized.current = true;
  }

  return null;
}
