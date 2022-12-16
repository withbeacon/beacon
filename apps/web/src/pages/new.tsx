import type { Resolver } from "react-hook-form";
import { ZapIcon, PlusIcon } from "@bud/ui";
import { Button, Label } from "@bud/ui";
import { Nav } from "~/components";

import { config, animated, useSpring } from "@react-spring/web";
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

const baseSprings = {
  from: {
    opacity: 0,
    transform: "translateY(-10px)",
  },

  to: {
    opacity: 1,
    transform: "translateY(0px)",
  },

  config: config.slow,
};

export default function New() {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver,
  });

  const headerSprings = useSpring({ 
    ...baseSprings,
    duration: 100,
  });

  const formSprings = useSpring({
    ...baseSprings,
    duration: 300,
  });

  const { mutateAsync, isError, error } = trpc.website.add.useMutation({
    onError: (err) => console.warn(err),
  });

  async function onSubmit(values: Values) {
    if (errors.name || errors.url) {
      return;
    }

    await mutateAsync(values);

    if (!isError) {
      push(`/dashboard/${values.url}`);
    }
  }

  return (
    <div className="h-full w-full items-center">
      <Nav />

      <div className="my-8 w-full">
        <animated.div
          className="flex flex-col items-center gap-6"
          style={{ ...headerSprings }}
        >
          <ZapIcon className="h-10 w-10 fill-gray-800 dark:fill-gray-200" />
          <h1 className="text-3xl font-bold">Add your website</h1>
        </animated.div>
        <animated.form
          className="mx-auto mt-6 flex w-full flex-col gap-5 px-4 md:w-1/2 md:px-0 lg:w-1/3"
          onSubmit={handleSubmit(onSubmit)}
          style={{ ...formSprings }}
        >
          <div className="flex flex-col gap-2">
            <Label error={errors.url?.message} htmlFor="url">
              URL (hostname)
            </Label>
            <input
              className={cx(
                "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
                errors.url && "!ring-red-500 focus:!border-red-500"
              )}
              placeholder="example.com"
              type="text"
              id="url"
              required
              {...register("url", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label error={errors.name?.message} htmlFor="name">
              Name
            </Label>
            <input
              className={cx(
                "rounded-xl border border-gray-200 bg-white py-2.5 px-3 transition-all duration-100 dark:border-gray-800 dark:bg-gray-900",
                errors.name && "!ring-red-500 focus:!border-red-500"
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
            loading={isSubmitting}
            submit
            filled
          >
            <PlusIcon /> Add
          </Button>
          <Label error={isError ? error.message : undefined}></Label>
        </animated.form>
      </div>
    </div>
  );
}
