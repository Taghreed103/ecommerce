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
import { resetPasswordSchema, ResetPasswordForm as ResetPasswordFormType } from "@/schema/resetPasswordSchema";
import { verifyResetCode, resetPassword } from "@/apis/auth.api";

type StepType = "verify" | "reset";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<StepType>("verify");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const firstError = Object.keys(form.formState.errors)[0];

  const handleVerifyCode = async (data: { email: string; resetCode: string }) => {
    setIsLoading(true);
    
    try {
      const result = await verifyResetCode(data.email, data.resetCode);
      
      if (result.message === "Success") {
        setEmail(data.email);
        setStep("reset");
        toast.success("Code verified successfully!", {
          className: "!bg-green-50 !text-green-800 !border-green-200"
        });
      } else {
        toast.error(result.message || "Invalid reset code");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormType) => {
    setIsLoading(true);
    
    try {
      const result = await resetPassword(data.email, data.newPassword);
      
      if (result.message === "success") {
        toast.success("Password reset successfully!", {
          className: "!bg-green-50 !text-green-800 !border-green-200"
        });
        router.push("/auth/login");
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  const VerifyForm = () => (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleVerifyCode)}>
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

        <FormField
          name="resetCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset Code</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  maxLength={6} 
                  {...field} 
                />
              </FormControl>
              {firstError === "resetCode" && <FormMessage />}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <Button type="button" variant="link" onClick={navigateToLogin}>
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );

  const PasswordForm = () => (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleResetPassword)}>
        <input type="hidden" {...form.register("email")} value={email} />
        
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter new password" 
                  {...field} 
                />
              </FormControl>
              {firstError === "newPassword" && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  {...field} 
                />
              </FormControl>
              {firstError === "confirmPassword" && <FormMessage />}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center">
          <Button type="button" variant="link" onClick={navigateToLogin}>
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );

  return step === "verify" ? <VerifyForm /> : <PasswordForm />;
}
