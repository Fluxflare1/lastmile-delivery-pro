'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Zap, 
  MapPin, 
  Clock,
  Users,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { systemConfigAPI, PricingRule, PricingCondition } from '@/lib/api/system-config';

const pricingRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  type: z.enum(['distance', 'weight', 'time', 'surge', 'zone', 'customer_tier']),
  description: z.string().optional(),
  base_amount: z.number().min(0, 'Base amount must be positive'),
  is_active: z.boolean(),
  conditions: z.array(z.object({
    field: z.string().min(1, 'Field is required'),
    operator: z.enum(['eq', 'gt', 'lt', 'gte', 'lte', 'in']),
    value: z.any(),
    then: z.object({
      type: z.enum(['fixed', 'percentage']),
      value: z.number().min(0, 'Value must be positive'),
    }),
  })),
});

type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;

interface PricingRuleBuilderProps {
  pricingRules?: PricingRule[];
  onSave?: (data: PricingRuleFormData) => void;
  onUpdate?: (id: string, data: PricingRuleFormData) => void;
  onDelete?: (id: string) => void;
}

const PRICING_RULE_TYPES = [
  { 
    value: 'distance', 
    label: 'Distance-Based', 
    icon: MapPin, 
    description: 'Pricing based on delivery distance',
    fields: ['distance_km', 'distance_miles']
  },
  { 
    value: 'weight', 
    label: 'Weight-Based', 
    icon: TrendingUp, 
    description: 'Pricing based on package weight',
    fields: ['weight_kg', 'weight_lbs']
  },
  { 
    value: 'time', 
    label: 'Time-Based', 
    icon: Clock, 
    description: 'Pricing based on time of day or urgency',
    fields: ['time_of_day', 'delivery_urgency', 'day_of_week']
  },
  { 
    value: 'surge', 
    label: 'Surge Pricing', 
    icon: Zap, 
    description: 'Dynamic pricing during high demand',
    fields: ['demand_level', 'order_volume', 'courier_availability']
  },
  { 
    value: 'zone', 
    label: 'Zone-Based', 
    icon: MapPin, 
    description: 'Pricing based on geographic zones',
    fields: ['delivery_zone', 'area_type', 'city']
  },
  { 
    value: 'customer_tier', 
    label: 'Customer Tier', 
    icon: Users, 
    description: 'Pricing based on customer type or loyalty',
    fields: ['customer_tier', 'order_frequency', 'loyalty_level']
  },
];

const OPERATORS = [
  { value: 'eq', label: 'Equals', types: ['string', 'number', 'boolean'] },
  { value: 'gt', label: 'Greater Than', types: ['number'] },
  { value: 'lt', label: 'Less Than', types: ['number'] },
  { value: 'gte', label: 'Greater Than or Equal', types: ['number'] },
  { value: 'lte', label: 'Less Than or Equal', types: ['number'] },
  { value: 'in', label: 'In List', types: ['array'] },
];

const FIELD_TYPES = {
  distance_km: { type: 'number', label: 'Distance (km)' },
  distance_miles: { type: 'number', label: 'Distance (miles)' },
  weight_kg: { type: 'number', label: 'Weight (kg)' },
  weight_lbs: { type: 'number', label: 'Weight (lbs)' },
  time_of_day: { type: 'string', label: 'Time of Day', options: ['morning', 'afternoon', 'evening', 'night'] },
  delivery_urgency: { type: 'string', label: 'Delivery Urgency', options: ['standard', 'express', 'urgent'] },
  day_of_week: { type: 'string', label: 'Day of Week', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
  demand_level: { type: 'string', label: 'Demand Level', options: ['low', 'medium', 'high', 'very_high'] },
  order_volume: { type: 'number', label: 'Order Volume' },
  courier_availability: { type: 'number', label: 'Courier Availability (%)' },
  delivery_zone: { type: 'string', label: 'Delivery Zone' },
  area_type: { type: 'string', label: 'Area Type', options: ['urban', 'suburban', 'rural'] },
  city: { type: 'string', label: 'City' },
  customer_tier: { type: 'string', label: 'Customer Tier', options: ['standard', 'preferred', 'enterprise'] },
  order_frequency: { type: 'number', label: 'Order Frequency' },
  loyalty_level: { type: 'string', label: 'Loyalty Level', options: ['new', 'regular', 'vip'] },
};

export function PricingRuleBuilder({ pricingRules = [], onSave, onUpdate, onDelete }: PricingRuleBuilderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [conditions, setConditions] = useState<PricingCondition[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      type: 'distance',
      is_active: true,
      base_amount: 0,
      conditions: [],
    },
  });

  const selectedRuleType = watch('type');
  const selectedFields = PRICING_RULE_TYPES.find(type => type.value === selectedRuleType)?.fields || [];

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setIsEditing(true);
    setConditions(rule.conditions || []);
    reset({
      ...rule,
      conditions: rule.conditions || [],
    });
    setActiveTab('builder');
  };

  const handleCreateNew = () => {
    setEditingRule(null);
    setIsEditing(true);
    setConditions([]);
    reset({
      name: '',
      description: '',
      type: 'distance',
      base_amount: 0,
      is_active: true,
      conditions: [],
    });
    setActiveTab('builder');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingRule(null);
    setConditions([]);
    setActiveTab('list');
  };

  const addCondition = () => {
    const newCondition: PricingCondition = {
      field: selectedFields[0] || '',
      operator: 'eq',
      value: '',
      then: {
        type: 'fixed',
        value: 0,
      },
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    setConditions(updatedConditions);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const getFieldType = (field: string) => {
    return FIELD_TYPES[field as keyof typeof FIELD_TYPES]?.type || 'string';
  };

  const getFieldOptions = (field: string) => {
    return FIELD_TYPES[field as keyof typeof FIELD_TYPES]?.options || [];
  };

  const renderValueInput = (condition: PricingCondition, index: number) => {
    const fieldType = getFieldType(condition.field);
    const options = getFieldOptions(condition.field);

    if (options.length > 0) {
      return (
        <Select
          value={condition.value}
          onValueChange={(value) => updateCondition(index, 'value', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>
                {option.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (fieldType === 'number') {
      return (
        <Input
          type="number"
          step="0.01"
          value={condition.value}
          onChange={(e) => updateCondition(index, 'value', parseFloat(e.target.value) || 0)}
          placeholder="Enter value"
        />
      );
    }

    return (
      <Input
        value={condition.value}
        onChange={(e) => updateCondition(index, 'value', e.target.value)}
        placeholder="Enter value"
      />
    );
  };

  const onSubmit = async (data: PricingRuleFormData) => {
    try {
      const formData = {
        ...data,
        conditions: conditions,
      };

      if (editingRule) {
        await systemConfigAPI.updatePricingRule(editingRule.id, formData);
        onUpdate?.(editingRule.id, formData);
      } else {
        await systemConfigAPI.createPricingRule(formData);
        onSave?.(formData);
      }

      handleCancel();
    } catch (error) {
      console.error('Failed to save pricing rule:', error);
    }
  };

  const handleDelete = async (rule: PricingRule) => {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      try {
        await systemConfigAPI.updatePricingRule(rule.id, { ...rule, is_active: false });
        onDelete?.(rule.id);
      } catch (error) {
        console.error('Failed to delete pricing rule:', error);
      }
    }
  };

  const getRuleTypeIcon = (type: string) => {
    const ruleType = PRICING_RULE_TYPES.find(t => t.value === type);
    return ruleType?.icon || DollarSign;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">
        Inactive
      </Badge>
    );
  };

  const calculateExamplePrice = (rule: PricingRule) => {
    // Simple example calculation for display
    let price = rule.base_amount;
    rule.conditions?.forEach(condition => {
      if (condition.then.type === 'fixed') {
        price += condition.then.value;
      } else {
        price += (rule.base_amount * condition.then.value) / 100;
      }
    });
    return price;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pricing Rule Builder</h2>
          <p className="text-muted-foreground">
            Create and manage dynamic pricing rules for your delivery services
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Pricing Rule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Pricing Rules</TabsTrigger>
          <TabsTrigger value="builder" disabled={!isEditing}>
            {editingRule ? 'Edit Rule' : 'Rule Builder'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Pricing Rules</CardTitle>
              <CardDescription>
                Manage your dynamic pricing rules and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Base Amount</TableHead>
                    <TableHead>Conditions</TableHead>
                    <TableHead>Example Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => {
                    const RuleIcon = getRuleTypeIcon(rule.type);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <RuleIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{rule.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {PRICING_RULE_TYPES.find(t => t.value === rule.type)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₦{rule.base_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {rule.conditions?.length || 0} condition(s)
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          ₦{calculateExamplePrice(rule).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(rule.is_active)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(rule)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {pricingRules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pricing rules configured yet.</p>
                        <Button onClick={handleCreateNew} className="mt-4">
                          Create Your First Pricing Rule
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingRule ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}
              </CardTitle>
              <CardDescription>
                Build dynamic pricing rules with conditions and calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Rule Name</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Urban Area Surcharge"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Describe this pricing rule..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Rule Type</Label>
                      <Select
                        onValueChange={(value: any) => setValue('type', value)}
                        value={selectedRuleType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rule type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRICING_RULE_TYPES.map(type => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <div>
                                    <div>{type.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {type.description}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_amount">Base Amount (₦)</Label>
                      <Input
                        id="base_amount"
                        type="number"
                        step="0.01"
                        {...register('base_amount', { valueAsNumber: true })}
                        placeholder="0.00"
                      />
                      {errors.base_amount && (
                        <p className="text-sm text-red-500">{errors.base_amount.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_active" className="text-base">
                          Active Rule
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enable this pricing rule
                        </p>
                      </div>
                      <Switch
                        id="is_active"
                        {...register('is_active')}
                      />
                    </div>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Rule Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>₦{watch('base_amount')?.toLocaleString() || '0'}</span>
                          </div>
                          {conditions.map((condition, index) => (
                            <div key={index} className="flex justify-between text-green-600">
                              <span>+ Condition {index + 1}:</span>
                              <span>
                                {condition.then.type === 'fixed' 
                                  ? `₦${condition.then.value}` 
                                  : `${condition.then.value}%`
                                }
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t pt-2 font-medium">
                            <span>Estimated Total:</span>
                            <span>
                              ₦{calculateExamplePrice({
                                ...watch(),
                                conditions: conditions
                              }).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Pricing Conditions</span>
                      <Button type="button" onClick={addCondition} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Define conditions that trigger price adjustments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {conditions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No conditions added yet.</p>
                        <p className="text-sm">Add conditions to create dynamic pricing rules.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conditions.map((condition, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <Label>Field</Label>
                                  <Select
                                    value={condition.field}
                                    onValueChange={(value) => updateCondition(index, 'field', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedFields.map(field => (
                                        <SelectItem key={field} value={field}>
                                          {FIELD_TYPES[field as keyof typeof FIELD_TYPES]?.label || field}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Operator</Label>
                                  <Select
                                    value={condition.operator}
                                    onValueChange={(value: any) => updateCondition(index, 'operator', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {OPERATORS
                                        .filter(op => op.types.includes(getFieldType(condition.field)))
                                        .map(operator => (
                                          <SelectItem key={operator.value} value={operator.value}>
                                            {operator.label}
                                          </SelectItem>
                                        ))
                                      }
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Value</Label>
                                  {renderValueInput(condition, index)}
                                </div>

                                <div className="space-y-2">
                                  <Label>Then Add</Label>
                                  <div className="flex gap-2">
                                    <Select
                                      value={condition.then.type}
                                      onValueChange={(value: any) => 
                                        updateCondition(index, 'then', { ...condition.then, type: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="fixed">Fixed ₦</SelectItem>
                                        <SelectItem value="percentage">Percentage %</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={condition.then.value}
                                      onChange={(e) => 
                                        updateCondition(index, 'then', { 
                                          ...condition.then, 
                                          value: parseFloat(e.target.value) || 0 
                                        })
                                      }
                                      className="w-20"
                                    />
                                  </div>
                                </div>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeCondition(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
