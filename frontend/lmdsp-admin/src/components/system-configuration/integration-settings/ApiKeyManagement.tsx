'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Key, 
  Eye, 
  EyeOff, 
  Calendar,
  Globe,
  MapPin,
  MessageCircle,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { systemConfigAPI, ApiKey } from '@/lib/api/system-config';

interface ApiKeyManagementProps {
  apiKeys?: ApiKey[];
  onGenerate?: (data: { name: string; permissions: string[] }) => void;
  onRevoke?: (keyId: string) => void;
  onRegenerate?: (keyId: string) => void;
}

const API_KEY_PERMISSIONS = [
  {
    category: 'Orders',
    permissions: [
      { id: 'orders:read', name: 'Read Orders', description: 'Access order information' },
      { id: 'orders:write', name: 'Write Orders', description: 'Create and update orders' },
      { id: 'orders:delete', name: 'Delete Orders', description: 'Remove orders' },
    ]
  },
  {
    category: 'Tracking',
    permissions: [
      { id: 'tracking:read', name: 'Read Tracking', description: 'Access tracking information' },
      { id: 'tracking:write', name: 'Write Tracking', description: 'Update tracking status' },
    ]
  },
  {
    category: 'Customers',
    permissions: [
      { id: 'customers:read', name: 'Read Customers', description: 'Access customer data' },
      { id: 'customers:write', name: 'Write Customers', description: 'Create and update customers' },
    ]
  },
  {
    category: 'Couriers',
    permissions: [
      { id: 'couriers:read', name: 'Read Couriers', description: 'Access courier information' },
      { id: 'couriers:write', name: 'Write Couriers', description: 'Update courier data' },
    ]
  },
  {
    category: 'Analytics',
    permissions: [
      { id: 'analytics:read', name: 'Read Analytics', description: 'Access analytics data' },
    ]
  }
];

const INTEGRATION_TYPES = [
  {
    id: 'ecommerce',
    name: 'E-commerce Platform',
    icon: ShoppingCart,
    description: 'Connect with online stores and marketplaces',
    supported: ['Shopify', 'WooCommerce', 'Magento', 'Custom']
  },
  {
    id: 'payment',
    name: 'Payment Gateway',
    icon: CreditCard,
    description: 'Integrate payment processing systems',
    supported: ['Flutterwave', 'Paystack', 'Stripe', 'PayPal']
  },
  {
    id: 'mapping',
    name: 'Mapping Service',
    icon: MapPin,
    description: 'Connect mapping and geolocation services',
    supported: ['Google Maps', 'Mapbox', 'OpenStreetMap']
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: MessageCircle,
    description: 'SMS, email, and notification services',
    supported: ['Twilio', 'SendGrid', 'Amazon SES', 'Firebase']
  },
  {
    id: 'erp',
    name: 'ERP System',
    icon: Globe,
    description: 'Enterprise resource planning integration',
    supported: ['SAP', 'Oracle', 'Microsoft Dynamics', 'Custom']
  }
];

export function ApiKeyManagement({ apiKeys = [], onGenerate, onRevoke, onRegenerate }: ApiKeyManagementProps) {
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    if (selectedPermissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    try {
      // In a real implementation, this would call the API
      const mockKey = `lmdsp_sk_${Math.random().toString(36).substr(2, 24)}_${Math.random().toString(36).substr(2, 8)}`;
      setGeneratedKey(mockKey);
      setShowNewKey(true);
      
      onGenerate?.({
        name: newKeyName,
        permissions: selectedPermissions
      });

      // Reset form
      setNewKeyName('');
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const isKeyExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getDaysUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Key Management</h2>
          <p className="text-muted-foreground">
            Manage API keys for external integrations and services
          </p>
        </div>
      </div>

      {showNewKey && generatedKey && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Generated Successfully
            </CardTitle>
            <CardDescription className="text-green-700">
              Copy your new API key now. You won't be able to see it again!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Textarea
                value={generatedKey}
                readOnly
                className="font-mono text-sm flex-1"
                rows={2}
              />
              <Button
                onClick={() => copyToClipboard(generatedKey)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Store this key securely. It provides access to your delivery data.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowNewKey(false)}
              className="mt-4"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Key Prefix</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => {
                    const daysUntilExpiry = getDaysUntilExpiry(apiKey.expires_at);
                    const isExpired = isKeyExpired(apiKey.expires_at);
                    
                    return (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {apiKey.key_prefix}...
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {apiKey.permissions.length} permission(s)
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(apiKey.last_used)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {apiKey.expires_at ? (
                            <div className={`text-sm ${isExpired ? 'text-red-600' : daysUntilExpiry && daysUntilExpiry <= 7 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                              {formatDate(apiKey.expires_at)}
                              {daysUntilExpiry && (
                                <div className="text-xs">
                                  {isExpired ? 'Expired' : `${daysUntilExpiry} days left`}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">Never</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isExpired ? (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              Expired
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRegenerate?.(apiKey.id)}
                            >
                              Regenerate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRevoke?.(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No API keys generated yet.</p>
                        <p className="text-sm">Generate your first API key to start integrating.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Key</CardTitle>
              <CardDescription>
                Create a new API key for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {API_KEY_PERMISSIONS.flatMap(category => category.permissions).map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Switch
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <Label htmlFor={permission.id} className="text-sm font-normal cursor-pointer">
                        <div>{permission.name}</div>
                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateApiKey} 
                className="w-full"
                disabled={!newKeyName.trim() || selectedPermissions.length === 0}
              >
                <Key className="h-4 w-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {INTEGRATION_TYPES.map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <integration.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{integration.name}</div>
                      <div className="text-xs text-muted-foreground">{integration.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline">Configure</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
