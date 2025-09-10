"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema, ForgotPasswordForm as ForgotPasswordFormType } from "@/schema/forgotPasswordSchema";
import { forgotPassword } from "@/apis/auth.api";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const firstError = Object.keys(form.formState.errors)[0];

  const handleSubmit = async (data: ForgotPasswordFormType) => {
    setIsLoading(true);
    
    try {
      const result = await forgotPassword(data.email);
      
      if (result.message === "Reset code sent to email") {
        setEmailSent(true);
        toast.success("Reset password link sent to your email!", {
          className: "!bg-green-50 !text-green-800 !border-green-200"
        });
      } else {
        toast.error(result.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  const SuccessMessage = () => (
    <div className="text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Check Your Email
        </h2>
        <p className="text-green-600">
          We&apos;ve sent a reset code to your email address. Please check your inbox and follow the instructions.
        </p>
      </div>
      <Button onClick={navigateToLogin} className="w-full">
        Back to Login
      </Button>
    </div>
  );

  const EmailForm = () => (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                />
              </FormControl>
              {firstError === "email" && <FormMessage />}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Code"}
        </Button>

        <div className="text-center">
          <Button type="button" variant="link" onClick={navigateToLogin}>
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );

  return emailSent ? <SuccessMessage /> : <EmailForm />;
}
