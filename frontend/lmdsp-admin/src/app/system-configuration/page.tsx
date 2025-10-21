'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  DollarSign, 
  Zap, 
  Shield, 
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ConfigStatus {
  business: 'complete' | 'incomplete' | 'warning';
  pricing: 'complete' | 'incomplete' | 'warning';
  users: 'complete' | 'incomplete' | 'warning';
  integrations: 'complete' | 'incomplete' | 'warning';
}

export default function SystemConfigurationPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    business: 'incomplete',
    pricing: 'incomplete',
    users: 'complete',
    integrations: 'warning'
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'warning':
        return 'Needs Attention';
      default:
        return 'Not Configured';
    }
  };

  const configurationSections = [
    {
      id: 'business',
      title: 'Business Configuration',
      description: 'Business identity, service types, and operational settings',
      icon: Building,
      status: configStatus.business,
      href: '/system-configuration/business-config'
    },
    {
      id: 'pricing',
      title: 'Pricing Management',
      description: 'Dynamic pricing, commissions, and fee structures',
      icon: DollarSign,
      status: configStatus.pricing,
      href: '/system-configuration/pricing-management'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Roles, permissions, and security settings',
      icon: Users,
      status: configStatus.users,
      href: '/system-configuration/user-management'
    },
    {
      id: 'integrations',
      title: 'Integration Settings',
      description: 'API keys, webhooks, and system performance',
      icon: Zap,
      status: configStatus.integrations,
      href: '/system-configuration/integration-settings'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage your business settings, pricing, users, and integrations
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {configurationSections.map((section) => (
          <Card key={section.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
              <section.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                  <div className="flex items-center mt-2">
                    {getStatusIcon(section.status)}
                    <span className="ml-2 text-sm">{getStatusText(section.status)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={section.href}>Configure</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Changes</TabsTrigger>
          <TabsTrigger value="pending">Pending Configuration</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Configuration Changes</CardTitle>
              <CardDescription>
                Track changes made to your system configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">User permissions updated</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="secondary">User Management</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Pricing rules modified</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="secondary">Pricing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Configuration</CardTitle>
              <CardDescription>
                Items that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div>
                    <p className="font-medium">API Keys Near Expiration</p>
                    <p className="text-sm text-muted-foreground">3 API keys will expire in 7 days</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Service Areas Not Configured</p>
                    <p className="text-sm text-muted-foreground">Define your delivery coverage areas</p>
                  </div>
                  <Button size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Monitor the health of your system integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">Connected and operational</p>
                    </div>
                  </div>
                  <Badge variant="outline">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">SMS Service</p>
                      <p className="text-sm text-muted-foreground">High latency detected</p>
                    </div>
                  </div>
                  <Badge variant="outline">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
