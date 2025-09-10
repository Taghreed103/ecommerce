import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Ecommerce App",
  description: "Reset your password with verification code",
};

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Reset Password</h1>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
