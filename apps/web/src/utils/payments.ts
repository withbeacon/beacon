import "server-only";

import { z } from "zod";
import { env } from "~/env/server.mjs";

const BASE_URL = "https://api.lemonsqueezy.com/v1";

const customerSchema = z.object({
  jsonapi: z.object({ version: z.literal("1.0") }),
  meta: z.object({
    page: z.object({
      currentPage: z.number(),
      from: z.number(),
      lastPage: z.number(),
      perPage: z.number(),
      to: z.number(),
      total: z.number(),
    }),
  }),
  links: z.object({
    first: z.string(),
    last: z.string(),
  }),
  data: z.array(
    z.object({
      id: z.string(),
      type: z.literal("customers"),
      attributes: z.object({
        store_id: z.number(),
        name: z.string(),
        email: z.string(),
        status: z.string(),
        city: z.string().optional(),
        region: z.string().optional(),
        country: z.string().optional(),
        total_revenue_currency: z.number(),
        mrr: z.number(),
        status_formatted: z.string(),
        country_formatted: z.string(),
        total_revenue_currency_formatted: z.string(),
        mrr_formatted: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        test_mode: z.boolean(),
      }),
      relationships: z.object({
        store: z
          .object({
            links: z.object({
              related: z.string(),
              self: z.string(),
            }),
          })
          .optional(),
        orders: z
          .object({
            links: z.object({
              related: z.string(),
              self: z.string(),
            }),
          })
          .optional(),
        subscriptions: z.object({
          links: z
            .object({
              related: z.string(),
              self: z.string(),
            })
            .optional(),
        }),
        "license-keys": z.object({
          links: z
            .object({
              related: z.string(),
              self: z.string(),
            })
            .optional(),
        }),
      }),
      links: z.object({
        self: z.string(),
      }),
    })
  ),
});

export async function retrieveCustomer({ email }: { email: string }) {
  const resp = await fetch(`${BASE_URL}/customers?filter[email]=${email}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${env.LEMONSQUEEZY_KEY}`,
    },
  });
  const data = await resp.json();
  const parse = customerSchema.safeParse(data);

  if (!parse.success) {
    return {
      error: parse.error,
      success: false,
    } as const;
  }

  return {
    ...parse.data.data.at(0),
    success: true,
  } as const;
}
