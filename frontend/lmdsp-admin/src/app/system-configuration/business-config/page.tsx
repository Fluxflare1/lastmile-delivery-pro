'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Package, Map, Shield, Users } from 'lucide-react';
import { BusinessProfileForm } from '@/components/system-configuration/business-config/BusinessProfileForm';
import { ServiceTypeConfig } from '@/components/system-configuration/business-config/ServiceTypeConfig';
import { systemConfigAPI, BusinessProfile, ServiceType } from '@/lib/api/system-config';

export default function BusinessConfigPage() {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, servicesResponse] = await Promise.all([
        systemConfigAPI.getBusinessProfile(),
        systemConfigAPI.getServiceTypes(),
      ]);
      setBusinessProfile(profileResponse.data);
      setServiceTypes(servicesResponse.data);
    } catch (error) {
      console.error('Failed to load business configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessProfileSave = (data: any) => {
    setBusinessProfile(data);
    loadData(); // Reload to get updated data
  };

  const handleServiceTypeSave = (data: any) => {
    loadData(); // Reload service types
  };

  const handleServiceTypeUpdate = (id: string, data: any) => {
    loadData(); // Reload service types
  };

  const handleServiceTypeDelete = (id: string) => {
    setServiceTypes(prev => prev.filter(service => service.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Configuration</h1>
          <p className="text-muted-foreground">
            Manage your business identity, services, and operational settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Service Types
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Brand Identity
          </TabsTrigger>
          <TabsTrigger value="customer-facing" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Configure your business identity and legal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessProfileForm 
                initialData={businessProfile || undefined}
                onSave={handleBusinessProfileSave}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServiceTypeConfig
            serviceTypes={serviceTypes}
            onSave={handleServiceTypeSave}
            onUpdate={handleServiceTypeUpdate}
            onDelete={handleServiceTypeDelete}
          />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Configuration</CardTitle>
              <CardDescription>
                Manage service areas, capacity, and operational parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Service Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-xs text-muted-foreground">Active zones</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Daily Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">500</p>
                      <p className="text-xs text-muted-foreground">Max deliveries/day</p>
                    </CardContent>
                  </Card>
                </div>
                <Button>Manage Operations</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          {/* Branding content will be implemented separately */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Configure your brand appearance and white-label settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Brand identity configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer-facing" className="space-y-4">
          {/* Customer-facing content will be implemented separately */}
          <Card>
            <CardHeader>
              <CardTitle>Customer-Facing Profile</CardTitle>
              <CardDescription>
                Manage how your business appears to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Customer profile configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
