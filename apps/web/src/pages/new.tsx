import type { Resolver } from "react-hook-form";
import { ZapIcon, PlusIcon } from "@bud/ui";
import { Button, Label } from "@bud/ui";
import { Nav } from "~/components";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { trpc } from "~/utils";
import { cx } from "class-variance-authority";

interface Values {
  name: string;
  url: string;
}

const resolver: Resolver<Values> = async ({ url, name }) => {
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
          message: 'Invalid hostname',
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

export default function New() {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver,
  });

  const { mutate, isLoading, isError, error } = trpc.website.add.useMutation({
    onError: (err) => console.warn(err),
    onSuccess: () => push("/"),
  });

  function onSubmit(values: Values) {
    if (errors.name || errors.url) {
      return;
    }

    mutate(values);
  }

  return (
    <div className="h-full w-full items-center">
      <Nav />

      <div className="my-8 flex w-full flex-col items-center gap-6">
        <ZapIcon className="h-10 w-10 fill-gray-800 dark:fill-gray-200" />
        <h1 className="text-3xl font-bold">Add your website</h1>
        <form
          className="flex w-full flex-col gap-5 px-4 md:w-1/2 md:px-0 lg:w-1/3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <Label error={errors.url?.message} htmlFor="url">URL (hostname)</Label>
            <input
              className={cx(
                "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
                errors.url && "focus:!border-red-500 !ring-red-500"
              )}
              placeholder="example.com"
              type="text"
              id="url"
              required
              {...register("url", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label error={errors.name?.message} htmlFor="name">Name</Label>
            <input
              className={cx(
                "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
                errors.name && "focus:!border-red-500 !ring-red-500"
              )}
              placeholder="My Example"
              type="text"
              id="name"
              required
              {...register("name", { required: true })}
            />
          </div>
          <Button
            intent="primary"
            size="lg"
            className="mt-2 !py-2"
            disabled={errors.name || errors.url ? true : false}
            loading={isLoading}
            submit
            filled
          >
            <PlusIcon /> Add
          </Button>
          <Label error={isError ? error.message : undefined}></Label>
        </form>
      </div>
    </div>
  );
}
