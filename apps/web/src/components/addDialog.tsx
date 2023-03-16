"use client";

import type { Resolver } from "react-hook-form";
import {
  Button,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@beacon/ui";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

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

export default function AddDialog({ isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
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

    setIsFetching(false);

    startTransition(() => {
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add website</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
          <div className="mt-2 flex flex-col gap-2">
            <Label error={errors.name?.message} htmlFor="name">
              Name
            </Label>
            <input
              className={cx(
                "rounded-xl border border-gray-200 bg-white py-2 px-3 transition-all duration-100 dark:border-gray-600 dark:bg-gray-700",
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
                "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-600 dark:bg-gray-700",
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
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="rounded-xl"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={!!isMutating}
              submit
              fullWidth
            >
              Add {getValues().name}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
