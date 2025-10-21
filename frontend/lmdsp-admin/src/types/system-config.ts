// Extending existing types for System Configuration

export interface SystemConfig {
  business: BusinessConfig;
  pricing: PricingConfig;
  users: UserConfig;
  integrations: IntegrationConfig;
}

export interface BusinessConfig {
  profile: BusinessProfile;
  services: ServiceType[];
  operations: OperationalConfig;
  branding: BrandConfig;
}

export interface BusinessProfile {
  id: string;
  legal_name: string;
  trading_name: string;
  business_type: BusinessType;
  registration_number?: string;
  tax_id?: string;
  contact_email: string;
  contact_phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}

export type BusinessType = 
  | 'individual' 
  | 'partnership' 
  | 'limited_company' 
  | 'corporation';

export interface BrandConfig {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  communication_tone: 'professional' | 'friendly' | 'formal';
  white_label: {
    enabled: boolean;
    app_name?: string;
    domain?: string;
    app_icon?: string;
  };
}

export interface ServiceType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: ServiceCategory;
  delivery_model: DeliveryModel;
  service_tier: ServiceTier;
  is_active: boolean;
  base_price: number;
  pricing_rules: PricingRuleRef[];
  operating_hours: OperatingHours;
  package_limits: PackageLimits;
  special_requirements: string[];
}

export type ServiceCategory = 
  | 'on_demand' 
  | 'outstation' 
  | 'specialized';

export type DeliveryModel = 
  | 'door_to_door' 
  | 'point_to_point' 
  | 'hub_based';

export type ServiceTier = 
  | 'express' 
  | 'standard' 
  | 'economy';

export interface OperationalConfig {
  service_areas: ServiceArea[];
  capacity_limits: CapacityLimits;
  delivery_windows: DeliveryWindow[];
  emergency_protocols: EmergencyProtocol[];
}

export interface ServiceArea {
  id: string;
  name: string;
  type: 'city' | 'state' | 'custom';
  boundaries: GeoBoundary;
  pricing_zone: string;
  is_active: boolean;
  daily_capacity: number;
}

export interface GeoBoundary {
  type: 'polygon';
  coordinates: number[][][];
}

// ... additional types for pricing, users, integrations
