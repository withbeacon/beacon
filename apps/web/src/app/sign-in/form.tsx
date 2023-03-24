"use client";

import { Label, Button } from "@beacon/ui";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { cx } from "class-variance-authority";
import { signIn } from "next-auth/react";

type FormValues = {
  email: string;
};

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>();

  async function onSubmit({ email }: FormValues) {
    setIsFetching(true);
    await signIn("email", { email, redirect: false });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-3"
    >
      <div className="mt-2 flex w-full flex-col gap-2">
        <Label error={errors.email?.message} htmlFor="email">
          Email
        </Label>
        <input
          className={cx(
            "w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-700 dark:bg-gray-800",
            errors.email && "!ring-red-500 focus:!border-red-500"
          )}
          placeholder="hello@world.com"
          type="email"
          id="email"
          disabled={!!errors.email || isMutating}
          required
          {...register("email", { required: true })}
        />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="my-2"
        loading={isSubmitting}
        fullWidth
      >
        {isSubmitSuccessful ? "Magic Link Sent!" : "Sign In"}
      </Button>
    </form>
  );
}
