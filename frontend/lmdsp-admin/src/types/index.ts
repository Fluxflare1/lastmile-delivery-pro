export interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'lmdsp_admin' | 'courier' | 'customer' | 'platform_admin';
  tenant_id: string | null;
  permissions: string[];
  profile_complete: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  brand_logo: string;
  service_types: string[];
  config: Record<string, any>;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
  tenant: Tenant;
}

export interface LoginCredentials {
  email: string;
  password: string;
  user_type: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
    trace_id: string;
    timestamp: string;
  };
}

export interface Order {
  id: string;
  tracking_number: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  service_type: 'on_demand' | 'outstation';
  pickup_address: Address;
  delivery_address: Address;
  parcel_details: ParcelDetails;
  estimated_cost: number;
  assigned_courier?: Courier;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
  contact_name: string;
  contact_phone: string;
}

export interface ParcelDetails {
  weight_kg: number;
  dimensions: string;
  description: string;
  category: 'document' | 'parcel' | 'fragile';
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  status: 'available' | 'busy' | 'offline';
  current_location?: { lat: number; lng: number };
}
