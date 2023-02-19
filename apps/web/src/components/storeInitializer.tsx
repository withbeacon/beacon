"use client";

import type { Website as WebsiteType } from "~/store/website";

import { useRef } from "react";
import useWebsiteStore from "~/store/website";

interface Website extends Omit<WebsiteType, "createdAt" | "minDate"> {
  createdAt: number | string;
  minDate: number | string;
}

export default function StoreInitializer({
  createdAt,
  minDate,
  ...state
}: Website) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useWebsiteStore.setState({
      createdAt: new Date(createdAt),
      minDate: new Date(minDate),
      ...state,
    });

    initialized.current = true;
  }

  return null;
}
