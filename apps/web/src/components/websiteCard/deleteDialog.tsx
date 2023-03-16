import {
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@beacon/ui";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

interface Props {
  name: string;
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface FormValues {
  name: string;
}

function resolver(values: FormValues, name: string) {
  if (values.name !== name) {
    return {
      values: {},
      errors: {
        name: {
          type: "invalid",
          message: "Name must be the same as the current name",
        },
      },
    };
  }

  return {
    values: {
      name: values.name,
    },
    errors: {},
  };
}

export default function DeleteDialog({ name, id, isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    resolver: (values) => resolver(values, name),
    mode: "all",
  });

  async function submit() {
    if (getValues("name") !== name) {
      return;
    }

    setIsFetching(true);

    const res = await fetch(`/api/website/${id}`, {
      method: "DELETE",
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {name}</DialogTitle>
          <DialogDescription>
            Are you sure that you want to delete {name}? Note, this action is{" "}
            <span className="font-bold">irreversible.</span> If you are sure,
            please type {name} in the below input.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)}>
          <input
            type="text"
            placeholder={name}
            className={cx(
              "mt-2 mb-4 w-full rounded-lg border bg-gray-100 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 dark:bg-gray-700",
              !!errors.name
                ? "border-gray-300 focus:ring-primary-500 dark:border-gray-600"
                : "border-red-500 focus:ring-red-500 dark:border-red-500"
            )}
            {...register("name")}
          />

          <div className="mt-4 flex gap-4">
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant="outline"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              loading={!!isMutating}
              disabled={!!errors.name}
              submit
              fullWidth
            >
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
