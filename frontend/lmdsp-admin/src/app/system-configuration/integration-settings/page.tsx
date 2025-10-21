'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Globe, Server, Settings } from 'lucide-react';
import { ApiKeyManagement } from '@/components/system-configuration/integration-settings/ApiKeyManagement';
import { WebhookConfig } from '@/components/system-configuration/integration-settings/WebhookConfig';
import { SystemHealth } from '@/components/system-configuration/integration-settings/SystemHealth';
import { systemConfigAPI, ApiKey } from '@/lib/api/system-config';

export default function IntegrationSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await systemConfigAPI.getApiKeys();
      setApiKeys(response.data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateApiKey = async (data: { name: string; permissions: string[] }) => {
    try {
      // In a real implementation, this would call the API
      const newKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        key_prefix: `lmdsp_${Math.random().toString(36).substr(2, 8)}`,
        permissions: data.permissions,
        last_used: undefined,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      };
      
      setApiKeys(prev => [...prev, newKey]);
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      await systemConfigAPI.revokeApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const handleRegenerateApiKey = async (keyId: string) => {
    try {
      await systemConfigAPI.regenerateApiKey(keyId);
      loadApiKeys(); // Reload to get the new key
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading integration settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Settings</h1>
          <p className="text-muted-foreground">
            Configure API keys, webhooks, and monitor system health
          </p>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="system-health" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <ApiKeyManagement
            apiKeys={apiKeys}
            onGenerate={handleGenerateApiKey}
            onRevoke={handleRevokeApiKey}
            onRegenerate={handleRegenerateApiKey}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <WebhookConfig />
        </TabsContent>

        <TabsContent value="system-health" className="space-y-4">
          <SystemHealth />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>
                System performance and optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced system configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
