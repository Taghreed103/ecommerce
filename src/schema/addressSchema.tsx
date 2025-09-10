import * as z from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  details: z.string().min(5, "Address details must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Phone number must contain only numbers, +, -, spaces, and parentheses")
});

export type AddressSchemaForm = z.infer<typeof addressSchema>;

// For checkout (simplified version)
export const checkoutAddressSchema = z.object({
  details: z.string().min(5, "Address details must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Phone number must contain only numbers, +, -, spaces, and parentheses")
});

export type CheckoutAddressSchemaForm = z.infer<typeof checkoutAddressSchema>;