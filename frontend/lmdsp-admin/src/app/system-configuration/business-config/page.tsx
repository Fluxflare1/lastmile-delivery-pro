'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Package, Map, Shield, Users } from 'lucide-react';

export default function BusinessConfigPage() {
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
              {/* Business Profile Form will be implemented in separate component */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Legal Business Name</label>
                    <p className="text-sm text-muted-foreground">Quick Deliver NG Ltd</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Trading Name</label>
                    <p className="text-sm text-muted-foreground">Quick Deliver</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Business Type</label>
                  <p className="text-sm text-muted-foreground">Limited Liability Company</p>
                </div>
                <Button>Edit Business Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Type Management</CardTitle>
              <CardDescription>
                Configure your delivery services and offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">On-Demand Delivery</h4>
                    <p className="text-sm text-muted-foreground">Intra-city same-day services</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button size="sm">Active</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Outstation Delivery</h4>
                    <p className="text-sm text-muted-foreground">Inter-city and inter-state services</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Inactive</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Configure your brand appearance and white-label settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    QD
                  </div>
                  <div>
                    <h4 className="font-semibold">Current Logo</h4>
                    <p className="text-sm text-muted-foreground">Quick Deliver branding</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-blue-600 rounded"></div>
                    <p className="text-xs text-center">Primary Color</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-green-500 rounded"></div>
                    <p className="text-xs text-center">Secondary Color</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-orange-500 rounded"></div>
                    <p className="text-xs text-center">Accent Color</p>
                  </div>
                </div>
                <Button>Configure Branding</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer-facing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer-Facing Profile</CardTitle>
              <CardDescription>
                Manage how your business appears to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Business Description</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reliable and fast delivery services across major cities in Nigeria. 
                    Specializing in same-day deliveries with real-time tracking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Service Specializations</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      Same-Day Delivery
                    </span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      Document Delivery
                    </span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      E-commerce
                    </span>
                  </div>
                </div>
                <Button>Edit Customer Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
