export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface UpdateAddressRequest {
  name?: string;
  details?: string;
  phone?: string;
  city?: string;
}

export interface AddressResponse {
  status: string;
  data: Address[];
  message?: string;
}
