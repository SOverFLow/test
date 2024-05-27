import * as z from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(3, "product lable must be at least 3 characters")
    .max(50, "product lable must be at most 50 characters"),
  quantity: z.number().min(0, "quantity must be at least 0").optional(),
  sell_price: z
    .number()
    .min(0, "sell price must be at least 0 euro")
    .max(1000000, "sell price must be at most 1000000 euro")
    .optional(),
  buy_price: z
    .number()
    .min(0, "buy price must be at least 0 euro")
    .max(1000000, "buy price must be at most 1000000 euro")
    .optional(),
  entry_date: z.date().optional(),
  exit_date: z.date().optional(),
  expiration_date: z.date().optional(),
  payment_method: z
    .string()
    .max(50, "payment_method must be at most 50 characters")
    .optional(),
  status_sale: z.string().optional(),
  status_purchase: z.string().optional(),
  serial_number: z.string().optional(),
  stock_limit_for_alert: z.number().min(0).optional(),
  desired_stock: z.number().min(0).optional(),
  notes: z.string().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  area: z.number().optional(),
  volume: z.number().optional(),
  country_of_origin: z.string().optional(),
  state_province_of_origin: z.string().optional(),
  nature_of_product: z.string().optional(),
}).refine(data => {
  return data.sell_price === undefined || data.buy_price === undefined || data.sell_price > data.buy_price;
}, {
  message: "sell price must be greater than buy price",
  path: ["sell_price"],
});


export type ProductSchema = z.infer<typeof ProductSchema>;
