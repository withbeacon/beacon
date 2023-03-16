"use client";

import { TrashIcon } from "@beacon/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@beacon/ui";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";
import { signOut } from "next-auth/react";

type Props = {
  userId: string;
};

export default function DeleteDialog({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function deleteUser() {
    const res = await fetch(`/api/user/${userId}`, {
      method: "DELETE",
    });

    startTransition(() => {
      if (res.ok) {
        setIsOpen(false);
        signOut();
        router.refresh();
      } else {
        setError(
          "Oops, sorry! Something went wrong at our end. Please try again later."
        );
      }
    });
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogTrigger asChild className="-mt-2">
        <Button size="md" variant="destructive" fullWidth>
          <TrashIcon className="h-5 w-5" />
          Delete my account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure that you want to logout?
          </AlertDialogTitle>
          <AlertDialogDescription>
            NOTE: This action is irreversible. All of your websites will be
            deleted and you will no longer be able to access them.
            {error && (
              <span className="mt-2 text-red-500 dark:text-red-400">
                {error}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-md"
            onClick={() => deleteUser()}
            loading={isPending}
          >
            {isPending ? "Deleting..." : "Yes, delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
