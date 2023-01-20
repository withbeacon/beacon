"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { PropsWithChildren, ReactNode } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CrossIcon } from "../icons";

import { cx } from "class-variance-authority";

interface Props extends PropsWithChildren {
  title: string;
  description?: ReactNode;
  trigger?: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Dialog({
  children,
  trigger,
  title,
  description,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogPrimitive.Trigger>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal forceMount>
        <Transition.Root show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPrimitive.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-black/50"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300 -transform-y-full"
            enterFrom="opacity-0 translate-y-5 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-5 md:scale-95"
          >
            <DialogPrimitive.Content
              forceMount
              className={cx(
                "fixed z-50",
                "w-screen rounded-t-lg p-4 md:w-[95vw] md:w-full md:max-w-md md:rounded-lg",
                "bottom-0 md:bottom-auto md:top-[50%] md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
              )}
            >
              <DialogPrimitive.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </DialogPrimitive.Title>

              {description && (
                <DialogPrimitive.Description className="my-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                  {description}
                </DialogPrimitive.Description>
              )}

              {children}

              <DialogPrimitive.Close
                className={cx(
                  "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                  "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                )}
              >
                <CrossIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
