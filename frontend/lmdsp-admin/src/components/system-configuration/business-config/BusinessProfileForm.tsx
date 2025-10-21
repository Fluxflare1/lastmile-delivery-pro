'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Building, Palette, MapPin, Users } from 'lucide-react';
import { systemConfigAPI, BusinessProfile } from '@/lib/api/system-config';

const businessProfileSchema = z.object({
  legal_name: z.string().min(1, 'Legal name is required'),
  trading_name: z.string().min(1, 'Trading name is required'),
  business_type: z.enum(['individual', 'partnership', 'limited_company', 'corporation']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().min(1, 'Phone number is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
  }),
  brand: z.object({
    primary_color: z.string().min(1, 'Primary color is required'),
    secondary_color: z.string().min(1, 'Secondary color is required'),
    accent_color: z.string().min(1, 'Accent color is required'),
    font_family: z.string().min(1, 'Font family is required'),
    communication_tone: z.enum(['professional', 'friendly', 'formal']),
  }),
  service_specializations: z.array(z.string()),
  coverage_areas: z.array(z.string()),
  white_label: z.object({
    enabled: z.boolean(),
    app_name: z.string().optional(),
    domain: z.string().optional(),
  }),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

interface BusinessProfileFormProps {
  initialData?: BusinessProfile;
  onSave?: (data: BusinessProfileFormData) => void;
  onCancel?: () => void;
}

const BUSINESS_TYPES = [
  { value: 'individual', label: 'Individual/Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'limited_company', label: 'Limited Company' },
  { value: 'corporation', label: 'Corporation' },
];

const COMMUNICATION_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
];

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'poppins', label: 'Poppins' },
];

const SERVICE_SPECIALIZATIONS = [
  'Same-Day Delivery',
  'Express Delivery',
  'Document Delivery',
  'E-commerce',
  'Food Delivery',
  'Pharmaceutical',
  'Fragile Items',
  'Temperature Controlled',
  'High-Value Items',
  'Bulk Delivery',
];

const COVERAGE_AREAS = [
  'Lagos Mainland',
  'Lagos Island',
  'Abuja Central',
  'Port Harcourt',
  'Ibadan',
  'Kano',
  'Kaduna',
  'Enugu',
  'Benin City',
  'Warri',
];

export function BusinessProfileForm({ initialData, onSave, onCancel }: BusinessProfileFormProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(initialData?.logo_url || '');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(
    initialData?.service_specializations || []
  );
  const [selectedCoverageAreas, setSelectedCoverageAreas] = useState<string[]>(
    initialData?.coverage_areas || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: initialData || {
      business_type: 'limited_company',
      brand: {
        primary_color: '#2563eb',
        secondary_color: '#16a34a',
        accent_color: '#ea580c',
        font_family: 'inter',
        communication_tone: 'professional',
      },
      white_label: {
        enabled: false,
      },
      service_specializations: [],
      coverage_areas: [],
    },
  });

  const whiteLabelEnabled = watch('white_label.enabled');

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview('');
  };

  const toggleSpecialization = (specialization: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const toggleCoverageArea = (area: string) => {
    setSelectedCoverageAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    setIsLoading(true);
    try {
      // Update service specializations and coverage areas
      const formData = {
        ...data,
        service_specializations: selectedSpecializations,
        coverage_areas: selectedCoverageAreas,
      };

      // Upload logo if changed
      if (logo) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logo);
        await systemConfigAPI.uploadLogo(logoFormData);
      }

      // Update business profile
      await systemConfigAPI.updateBusinessProfile(formData);

      onSave?.(formData);
    } catch (error) {
      console.error('Failed to save business profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Coverage
          </TabsTrigger>
          <TabsTrigger value="white-label" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            White Label
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Configure your legal business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="legal_name">Legal Business Name</Label>
                  <Input
                    id="legal_name"
                    {...register('legal_name')}
                    placeholder="Quick Deliver NG Ltd"
                  />
                  {errors.legal_name && (
                    <p className="text-sm text-red-500">{errors.legal_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trading_name">Trading Name</Label>
                  <Input
                    id="trading_name"
                    {...register('trading_name')}
                    placeholder="Quick Deliver"
                  />
                  {errors.trading_name && (
                    <p className="text-sm text-red-500">{errors.trading_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Select
                  onValueChange={(value: any) => setValue('business_type', value)}
                  defaultValue={initialData?.business_type || 'limited_company'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your delivery services and value proposition..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...register('contact_email')}
                    placeholder="contact@company.com"
                  />
                  {errors.contact_email && (
                    <p className="text-sm text-red-500">{errors.contact_email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    {...register('contact_phone')}
                    placeholder="+234 801 234 5678"
                  />
                  {errors.contact_phone && (
                    <p className="text-sm text-red-500">{errors.contact_phone.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
              <CardDescription>
                Your registered business address for legal and compliance purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  {...register('address.street')}
                  placeholder="123 Business Avenue"
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-500">{errors.address.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register('address.city')}
                    placeholder="Lagos"
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500">{errors.address.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register('address.state')}
                    placeholder="Lagos State"
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500">{errors.address.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register('address.country')}
                    placeholder="Nigeria"
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-red-500">{errors.address.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    {...register('address.postal_code')}
                    placeholder="100001"
                  />
                  {errors.address?.postal_code && (
                    <p className="text-sm text-red-500">{errors.address.postal_code.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Configure your brand appearance and visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Business Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Business logo"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended: 256x256px PNG or JPG, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Brand Colors</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color" className="text-sm">
                      Primary Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        {...register('brand.primary_color')}
                        className="flex-1"
                      />
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: watch('brand.primary_color') }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color" className="text-sm">
                      Secondary Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        {...register('brand.secondary_color')}
                        className="flex-1"
                      />
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: watch('brand.secondary_color') }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent_color" className="text-sm">
                      Accent Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        {...register('brand.accent_color')}
                        className="flex-1"
                      />
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: watch('brand.accent_color') }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font_family">Font Family</Label>
                  <Select
                    onValueChange={(value) => setValue('brand.font_family', value)}
                    defaultValue={initialData?.brand?.font_family || 'inter'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="communication_tone">Communication Tone</Label>
                  <Select
                    onValueChange={(value: any) => setValue('brand.communication_tone', value)}
                    defaultValue={initialData?.brand?.communication_tone || 'professional'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNICATION_TONES.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Specializations</CardTitle>
              <CardDescription>
                Select the types of delivery services you specialize in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SERVICE_SPECIALIZATIONS.map(specialization => (
                  <Badge
                    key={specialization}
                    variant={selectedSpecializations.includes(specialization) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleSpecialization(specialization)}
                  >
                    {specialization}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coverage Areas</CardTitle>
              <CardDescription>
                Select the areas where you provide delivery services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {COVERAGE_AREAS.map(area => (
                  <Badge
                    key={area}
                    variant={selectedCoverageAreas.includes(area) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleCoverageArea(area)}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="white-label" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>White Label Configuration</CardTitle>
              <CardDescription>
                Enable white-label features for your branded customer experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="white-label-enabled" className="text-base">
                    Enable White Label
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Provide branded mobile app and customer experience
                  </p>
                </div>
                <Switch
                  id="white-label-enabled"
                  checked={whiteLabelEnabled}
                  onCheckedChange={(checked) => setValue('white_label.enabled', checked)}
                />
              </div>

              {whiteLabelEnabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="app_name">Custom App Name</Label>
                    <Input
                      id="app_name"
                      {...register('white_label.app_name')}
                      placeholder="My Delivery App"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input
                      id="domain"
                      {...register('white_label.domain')}
                      placeholder="https://delivery.mycompany.com"
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">White Label Features</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Branded mobile app with your logo and colors</li>
                      <li>• Custom app name in app stores</li>
                      <li>• Your own domain for customer access</li>
                      <li>• Branded email and SMS communications</li>
                      <li>• Custom app store listings</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
