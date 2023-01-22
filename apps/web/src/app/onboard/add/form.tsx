"use client";

import type { Resolver } from "react-hook-form";
import { Button, Label } from "@beacon/ui";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

interface FormValues {
  name: string;
  url: string;
}

const resolver: Resolver<FormValues> = async ({ url, name }) => {
  if (url.includes("/")) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        url: {
          type: "INVALID_INPUT",
          message: 'Hostname can not contain "/"',
        },
      },
    };
  }

  if (!url.includes(".") && !url.includes(":")) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        url: {
          type: "INVALID_INPUT",
          message: "Invalid hostname",
        },
      },
    };
  }

  if (name.length > 20) {
    return {
      values: {
        url,
        name,
      },
      errors: {
        name: {
          type: "INVALID_INPUT",
          message: "Name can not be longer than 20 characters",
        },
      },
    };
  }

  return {
    values: {
      url,
      name,
    },
    errors: {},
  };
};

export default function Form() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMutating = isFetching || isPending;

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
  });

  async function submit({ name, url }: FormValues) {
    setIsFetching(true);

    const res = await fetch("/api/website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        url,
      }),
    });

    const json: any = await res.json();

    startTransition(() => {
      if (!res.ok) {
        setError(json.error);
        setIsFetching(false);
        
        return;
      }

      router.push("/onboard/snippet");
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
      <div className="mt-2 flex flex-col gap-2">
        <Label error={errors.name?.message} htmlFor="name">
          Name
        </Label>
        <input
          className={cx(
            "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-700 dark:bg-gray-800",
            errors.name && "!ring-red-500 focus:!border-red-500"
          )}
          placeholder="My Example"
          type="text"
          id="name"
          required
          {...register("name", { required: true })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label error={errors.url?.message} htmlFor="url">
          URL (hostname)
        </Label>
        <input
          className={cx(
            "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-700 dark:bg-gray-800",
            errors.url && "!ring-red-500 focus:!border-red-500"
          )}
          placeholder="example.com"
          type="text"
          id="url"
          required
          {...register("url", { required: true })}
        />
      </div>

      <div className="mt-4 flex gap-4">
        <Button
          intent="primary"
          size="sm"
          loading={!!isMutating}
          className="!rounded-xl"
          filled
          submit
          fullWidth
        >
          Add {getValues().name}
        </Button>
      </div>

      {error && <div className="text-sm font-medium text-red-500">{error}</div>}
    </form>
  );
}
