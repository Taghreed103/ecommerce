"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addressSchema, AddressSchemaForm } from "@/schema/addressSchema";
import { Address } from "@/interfaces/address.interface";

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: AddressSchemaForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
}

export default function AddressForm({ 
  address, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  title 
}: AddressFormProps) {
  const form = useForm<AddressSchemaForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || "",
      details: address?.details || "",
      city: address?.city || "",
      phone: address?.phone || "",
    },
  });

  // Update form when address prop changes
  useEffect(() => {
    if (address) {
      form.reset({
        name: address.name,
        details: address.details,
        city: address.city,
        phone: address.phone,
      });
    }
  }, [address, form]);

  const handleSubmit = (data: AddressSchemaForm) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Home, Work, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Details</FormLabel>
                <FormControl>
                  <Input placeholder="Street, building, apartment..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Save Address"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
