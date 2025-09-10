import * as z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty("This field is required").email("Not a valid email"),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
