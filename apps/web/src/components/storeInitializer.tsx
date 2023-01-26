"use client";

import type { Website } from "~/store/website";

import { useRef } from "react";
import useWebsiteStore from "~/store/website";

export default function StoreInitializer(props: Website) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useWebsiteStore.setState({ ...props });
    initialized.current = true;
  }

  return null;
}

