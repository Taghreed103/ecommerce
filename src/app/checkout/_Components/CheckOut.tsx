"use client"
import { useForm } from "react-hook-form"
import React from 'react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { checkoutOnline } from "../_actions/checkout.action"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutAddressSchema, CheckoutAddressSchemaForm } from "@/schema/addressSchema"
import { useAddresses } from "@/hooks/useAddresses"

export default function CheckOut({cartId}:{cartId:string}) {
  const { addresses } = useAddresses();
  const [selectedAddress, setSelectedAddress] = React.useState<string>("");
  const [useNewAddress, setUseNewAddress] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<CheckoutAddressSchemaForm>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      details: "",
      city: "",
      phone: ""
    }
  })

async function onSubmit(data: CheckoutAddressSchemaForm) {
  setIsProcessing(true);
  setError(null);
  
  try {
    const shippingAddress = data;
    console.log('Submitting checkout with:', { cartId, shippingAddress });
    
    const res = await checkoutOnline(cartId, window.location.origin, shippingAddress);
    
    console.log('Checkout response:', res);
    
    if (res?.status === "success" && res?.session?.url) {
      window.location.href = res.session.url;
    } else {
      throw new Error(res?.message || 'Checkout failed - no payment URL received');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
    setError(errorMessage);
  } finally {
    setIsProcessing(false);
  }
}

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
    const address = addresses.find(addr => addr._id === addressId);
    if (address) {
      form.setValue("details", address.details);
      form.setValue("city", address.city);
      form.setValue("phone", address.phone);
      setUseNewAddress(false);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddress("");
    form.reset();
  };

  return (
    <div className="mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {/* Address Selection */}
      {addresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Shipping Address</h3>
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddress === address._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddressSelect(address._id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{address.name}</h4>
                    <p className="text-sm text-gray-600">{address.details}</p>
                    <p className="text-sm text-gray-600">{address.city}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedAddress === address._id}
                    onChange={() => handleAddressSelect(address._id)}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleUseNewAddress}
              className="w-full"
            >
              Use New Address
            </Button>
          </div>
        </div>
      )}

      {/* Address Form */}
      {(addresses.length === 0 || useNewAddress || !selectedAddress) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {addresses.length === 0 ? 'Shipping Address' : 'New Shipping Address'}
            </h3>
            
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, building, apartment..." {...field} />
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
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>
        </Form>
      )}

      {/* Proceed with selected address */}
      {selectedAddress && !useNewAddress && (
        <Button 
          onClick={() => {
            const address = addresses.find(addr => addr._id === selectedAddress);
            if (address) {
              onSubmit({
                details: address.details,
                city: address.city,
                phone: address.phone
              });
            }
          }}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </Button>
      )}
    </div>
  )
}
