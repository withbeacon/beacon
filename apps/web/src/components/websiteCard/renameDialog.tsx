"use client";

import { Dialog, Button } from "@beacon/ui";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface FormValues {
  name: string;
}

const WebsiteNameSchema = z.object({
  name: z.string().min(1).max(20),
});

export default function RenameDialog({ name, id, isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(WebsiteNameSchema),
    defaultValues: {
      name,
    },
  });

  async function submit({ name }: FormValues) {
    setIsFetching(true);

    const res = await fetch(`/api/website/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
      }),
    });

    setIsFetching(false);

    startTransition(() => {
      if (res.status === 200) {
        setIsOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog title={`Rename ${name}`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(submit)}>
        {errors.name && (
          <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
        )}

        <input
          type="text"
          placeholder="New website name"
          className="mt-2 mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          {...register("name")}
        />

        <div className="mt-4 flex gap-4">
          <Button onClick={() => setIsOpen(false)} intent="outline" fullWidth>
            Cancel
          </Button>
          <Button
            intent="primary"
            size="sm"
            loading={!!isMutating}
            filled
            submit
            fullWidth
          >
            Rename
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
