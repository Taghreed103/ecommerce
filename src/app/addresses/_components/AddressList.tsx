"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThreeDots } from "@/components/ui/spinner";
import { useAddresses } from "@/hooks/useAddresses";
import { Address } from "@/interfaces/address.interface";
import AddressForm from "./AddressForm";
import { AddressSchemaForm } from "@/schema/addressSchema";

export default function AddressList() {
  const { data: session, status } = useSession();
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please log in to manage your addresses.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const handleAddAddress = (data: AddressSchemaForm) => {
    addAddress(data);
    setShowAddForm(false);
  };

  const handleEditAddress = (data: AddressSchemaForm) => {
    if (editingAddress) {
      updateAddress(editingAddress._id, data);
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress(addressId);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        {!showAddForm && !editingAddress && (
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={isAddingAddress}
          >
            Add New Address
          </Button>
        )}
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddressForm
            title="Add New Address"
            onSubmit={handleAddAddress}
            onCancel={handleCancelEdit}
            isLoading={isAddingAddress}
          />
        </div>
      )}

      {/* Edit Address Form */}
      {editingAddress && (
        <div className="mb-6">
          <AddressForm
            title="Edit Address"
            address={editingAddress}
            onSubmit={handleEditAddress}
            onCancel={handleCancelEdit}
            isLoading={isUpdatingAddress}
          />
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven&apos;t added any addresses yet.</p>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {address.name}
                </h3>
                <p className="text-gray-600 mb-1">{address.details}</p>
                <p className="text-gray-600 mb-1">{address.city}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAddress(address)}
                  disabled={editingAddress !== null || showAddForm || isUpdatingAddress}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAddress(address._id)}
                  disabled={isDeletingAddress || editingAddress !== null || showAddForm}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isDeletingAddress ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
