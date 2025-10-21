'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Users, TrendingUp, Award } from 'lucide-react';

export function CommissionStructure() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Commission Structure</h2>
          <p className="text-muted-foreground">
            Configure platform commissions and courier compensation
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Commission
            </CardTitle>
            <CardDescription>
              Set your service fees and commission rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service_fee">Service Fee (%)</Label>
              <Input
                id="service_fee"
                type="number"
                step="0.01"
                placeholder="15.0"
                defaultValue="15.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_commission">Minimum Commission (₦)</Label>
              <Input
                id="min_commission"
                type="number"
                step="0.01"
                placeholder="50.00"
                defaultValue="50.00"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tiered_commission" className="text-base">
                  Tiered Commission
                </Label>
                <p className="text-sm text-muted-foreground">
                  Volume-based commission rates
                </p>
              </div>
              <Switch id="tiered_commission" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Courier Compensation
            </CardTitle>
            <CardDescription>
              Configure courier pay rates and incentives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base_pay">Base Pay per Delivery (₦)</Label>
              <Input
                id="base_pay"
                type="number"
                step="0.01"
                placeholder="300.00"
                defaultValue="300.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_type">Commission Type</Label>
              <Select defaultValue="percentage">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage of Fee</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="performance_bonus">Performance Bonus (%)</Label>
              <Input
                id="performance_bonus"
                type="number"
                step="0.01"
                placeholder="10.0"
                defaultValue="10.0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Incentive Programs
          </CardTitle>
          <CardDescription>
            Set up bonus programs and performance incentives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rating_bonus">High Rating Bonus (₦)</Label>
              <Input
                id="rating_bonus"
                type="number"
                step="0.01"
                placeholder="100.00"
                defaultValue="100.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="on_time_bonus">On-Time Bonus (₦)</Label>
              <Input
                id="on_time_bonus"
                type="number"
                step="0.01"
                placeholder="50.00"
                defaultValue="50.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume_bonus">Volume Bonus (₦)</Label>
              <Input
                id="volume_bonus"
                type="number"
                step="0.01"
                placeholder="200.00"
                defaultValue="200.00"
              />
            </div>
          </div>
          <Button>Save Commission Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
