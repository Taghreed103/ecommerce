import * as z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().nonempty("This field is required").email("Not a valid email"),
  resetCode: z.string().nonempty("Reset code is required").length(6, "Reset code must be 6 digits"),
  newPassword: z.string().nonempty("This field is required").regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
  ),
  confirmPassword: z.string().nonempty("This field is required"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
);

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
