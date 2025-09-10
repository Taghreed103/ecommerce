"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Address, CreateAddressRequest, UpdateAddressRequest } from "@/interfaces/address.interface";

export function useAddresses() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // Fetch addresses
  const { data: addressesData, isLoading, refetch, error } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses");
      if (!res.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const payload = await res.json();
      console.log('useAddresses - Fetch response:', payload);
      return payload;
    },
    enabled: !!session && status === "authenticated",
    retry: 1,
  });

  const addresses: Address[] = addressesData?.data || [];

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (addressData: CreateAddressRequest) => {
      console.log('useAddresses - Adding address:', addressData);
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add address');
      }
      
      const result = await res.json();
      console.log('useAddresses - Add response:', result);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(data?.message || "Address added successfully");
      refetch();
    },
    onError: (error) => {
      console.error('Add address error:', error);
      toast.error(error.message || "Failed to add address");
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, addressData }: { addressId: string; addressData: UpdateAddressRequest }) => {
      console.log('useAddresses - Updating address:', addressId, addressData);
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update address');
      }
      
      const result = await res.json();
      console.log('useAddresses - Update response:', result);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(data?.message || "Address updated successfully");
      refetch();
    },
    onError: (error) => {
      console.error('Update address error:', error);
      toast.error(error.message || "Failed to update address");
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      console.log('useAddresses - Deleting address:', addressId);
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete address');
      }
      
      const result = await res.json();
      console.log('useAddresses - Delete response:', result);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(data?.message || "Address deleted successfully");
      refetch();
    },
    onError: (error) => {
      console.error('Delete address error:', error);
      toast.error(error.message || "Failed to delete address");
    },
  });

  const addAddress = (addressData: CreateAddressRequest) => {
    if (!session) {
      toast.error("Please log in to manage addresses");
      return;
    }
    addAddressMutation.mutate(addressData);
  };

  const updateAddress = (addressId: string, addressData: UpdateAddressRequest) => {
    if (!session) {
      toast.error("Please log in to manage addresses");
      return;
    }
    updateAddressMutation.mutate({ addressId, addressData });
  };

  const deleteAddress = (addressId: string) => {
    if (!session) {
      toast.error("Please log in to manage addresses");
      return;
    }
    deleteAddressMutation.mutate(addressId);
  };

  return {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress: addAddressMutation.isPending,
    isUpdatingAddress: updateAddressMutation.isPending,
    isDeletingAddress: deleteAddressMutation.isPending,
    refetchAddresses: refetch,
  };
}
