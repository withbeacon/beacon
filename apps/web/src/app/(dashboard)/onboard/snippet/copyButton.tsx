"use client";

import { CheckIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";

import { useState } from "react";

interface Props {
  snippet: string;
}

export default function CopyButton({ snippet }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(snippet);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Button onClick={copy} variant="outline" size="md" fullWidth>
      {isCopied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>Copy</>
      )}
    </Button>
  );
}
