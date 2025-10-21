import { api } from '@/lib/api';

export interface BusinessProfile {
  id: string;
  legal_name: string;
  trading_name: string;
  business_type: 'individual' | 'partnership' | 'limited_company' | 'corporation';
  description: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  service_specializations: string[];
  coverage_areas: string[];
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  service_category: 'on_demand' | 'outstation' | 'specialized';
  delivery_model: 'door_to_door' | 'point_to_point';
  service_tier: 'express' | 'standard';
  operating_hours: {
    start: string;
    end: string;
  };
  package_limits: {
    max_weight: number;
    max_dimensions: string;
  };
}

export interface PricingRule {
  id: string;
  name: string;
  type: 'distance' | 'weight' | 'time' | 'surge' | 'zone';
  conditions: PricingCondition[];
  base_amount: number;
  is_active: boolean;
}

export interface PricingCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
  then: {
    type: 'fixed' | 'percentage';
    value: number;
  };
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used?: string;
  expires_at?: string;
  permissions: string[];
}

export const systemConfigAPI = {
  // Business Configuration
  getBusinessProfile: (): Promise<{ data: BusinessProfile }> => 
    api.get('/lmdsp/business-profile'),
  
  updateBusinessProfile: (data: Partial<BusinessProfile>) => 
    api.put('/lmdsp/business-profile', data),
  
  uploadLogo: (formData: FormData) => 
    api.post('/lmdsp/business-profile/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Service Type Management
  getServiceTypes: (): Promise<{ data: ServiceType[] }> => 
    api.get('/lmdsp/service-types'),
  
  createServiceType: (data: Partial<ServiceType>) => 
    api.post('/lmdsp/service-types', data),
  
  updateServiceType: (id: string, data: Partial<ServiceType>) => 
    api.put(`/lmdsp/service-types/${id}`, data),

  // Pricing Management
  getPricingRules: (): Promise<{ data: PricingRule[] }> => 
    api.get('/lmdsp/pricing-rules'),
  
  createPricingRule: (data: Partial<PricingRule>) => 
    api.post('/lmdsp/pricing-rules', data),
  
  updatePricingRule: (id: string, data: Partial<PricingRule>) => 
    api.put(`/lmdsp/pricing-rules/${id}`, data),

  // User Management
  getUserRoles: (): Promise<{ data: UserRole[] }> => 
    api.get('/lmdsp/user-roles'),
  
  updateUserRole: (roleId: string, data: Partial<UserRole>) => 
    api.put(`/lmdsp/user-roles/${roleId}`, data),

  // Integration Settings
  getApiKeys: (): Promise<{ data: ApiKey[] }> => 
    api.get('/lmdsp/api-keys'),
  
  createApiKey: (data: { name: string; permissions: string[] }) => 
    api.post('/lmdsp/api-keys', data),
  
  revokeApiKey: (keyId: string) => 
    api.delete(`/lmdsp/api-keys/${keyId}`)
};
