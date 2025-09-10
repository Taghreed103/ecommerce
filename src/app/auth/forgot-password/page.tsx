import { Suspense } from "react";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Ecommerce App",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Forgot Password</h1>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
