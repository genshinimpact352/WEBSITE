import { pgTable, text, serial, integer, jsonb, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  basePrice: real("base_price").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  total: real("total").notNull(),
  discountCode: text("discount_code"),
  stripePaymentId: text("stripe_payment_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const insertProductSchema = createInsertSchema(products);

export interface OrderItem {
  productId: number;
  quantity: number;
  color: string;
  pattern: string;
  details: string;
}

export interface CartItem extends OrderItem {
  product: Product;
}

export const insertOrderSchema = createInsertSchema(orders);
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const customizationSchema = z.object({
  color: z.string().min(1, "Color is required"),
  pattern: z.string().min(1, "Pattern is required"),
  details: z.string().optional(),
  quantity: z.number().min(1),
});

export type CustomizationForm = z.infer<typeof customizationSchema>;
