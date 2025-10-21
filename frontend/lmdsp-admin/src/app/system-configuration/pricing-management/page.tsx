'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Users, TrendingUp, Zap } from 'lucide-react';
import { PricingRuleBuilder } from '@/components/system-configuration/pricing-management/PricingRuleBuilder';
import { CommissionStructure } from '@/components/system-configuration/pricing-management/CommissionStructure';
import { systemConfigAPI, PricingRule } from '@/lib/api/system-config';

export default function PricingManagementPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPricingRules();
  }, []);

  const loadPricingRules = async () => {
    try {
      setIsLoading(true);
      const response = await systemConfigAPI.getPricingRules();
      setPricingRules(response.data);
    } catch (error) {
      console.error('Failed to load pricing rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePricingRuleSave = (data: any) => {
    loadPricingRules(); // Reload pricing rules
  };

  const handlePricingRuleUpdate = (id: string, data: any) => {
    loadPricingRules(); // Reload pricing rules
  };

  const handlePricingRuleDelete = (id: string) => {
    setPricingRules(prev => prev.filter(rule => rule.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pricing configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Management</h1>
          <p className="text-muted-foreground">
            Configure dynamic pricing, commissions, and fee structures
          </p>
        </div>
      </div>

      <Tabs defaultValue="pricing-rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing-rules" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Fees & Taxes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing-rules" className="space-y-4">
          <PricingRuleBuilder
            pricingRules={pricingRules}
            onSave={handlePricingRuleSave}
            onUpdate={handlePricingRuleUpdate}
            onDelete={handlePricingRuleDelete}
          />
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <CommissionStructure />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Tax Configuration</CardTitle>
              <CardDescription>
                Manage service fees, transaction fees, and tax settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fees and tax configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analytics</CardTitle>
              <CardDescription>
                Analyze pricing performance and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Pricing analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
