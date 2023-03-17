"use client";

import type { FormEvent } from "react";
import { ChevronDownIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cx } from "class-variance-authority";
import { z } from "zod";

export default function EarlyAccessForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);

  // Create inline loading UI
  const isMutating = isFetching || isPending;

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const parse = z.string().email().safeParse(email);

    if (!parse.success) {
      toast.error("Please enter a valid email");
      setIsError(true);
      return;
    }

    setIsFetching(true);

    try {
      const resp = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (resp.ok) {
        toast.success(
          "We've added you to the waiting list, we will send you an invite to try out our early access version asap!"
        );
      } else {
        toast.error(
          "You are already on the waiting list, we'll send you an invite asap!"
        );
      }
    } catch (error) {
      if (error instanceof Error || error instanceof TypeError) {
        toast.error(error.message);
        setIsError(true);
      }
    } finally {
      setIsFetching(false);
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form className="flex flex-col md:flex-row gap-3 px-10" onSubmit={handleSubmit}>
      <div className="relative block">
        <span className="sr-only">Your Email</span>
        <input
          className={cx(
            "block w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pl-4 pr-2 text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 sm:text-sm",
            isError
              ? "border-red-500 ring-red-500"
              : "focus:border-primary-500 focus:ring-primary-500"
          )}
          placeholder="john@gmail.com"
          type="text"
          name="search"
          onChange={(evt) => {
            setIsError(false);
            setEmail(evt.target.value);
          }}
          disabled={isMutating}
        />
      </div>

      <Button
        variant="primary"
        size="md"
        submit={true}
        loading={isMutating}
        disabled={isMutating || isError}
      >
        Get early access
        <ChevronDownIcon className="-ml-1 h-4 w-4 -rotate-90" />
      </Button>
    </form>
  );
}
