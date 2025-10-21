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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Clock, 
  MapPin, 
  Truck,
  Zap,
  Snowflake,
  Shield
} from 'lucide-react';
import { systemConfigAPI, ServiceType } from '@/lib/api/system-config';

const serviceTypeSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  code: z.string().min(1, 'Service code is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['on_demand', 'outstation', 'specialized']),
  delivery_model: z.enum(['door_to_door', 'point_to_point', 'hub_based']),
  service_tier: z.enum(['express', 'standard', 'economy']),
  is_active: z.boolean(),
  base_price: z.number().min(0, 'Base price must be positive'),
  operating_hours: z.object({
    start: z.string().min(1, 'Start time is required'),
    end: z.string().min(1, 'End time is required'),
  }),
  package_limits: z.object({
    max_weight: z.number().min(0.1, 'Maximum weight must be at least 0.1kg'),
    max_dimensions: z.string().min(1, 'Maximum dimensions are required'),
  }),
  special_requirements: z.array(z.string()),
});

type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;

interface ServiceTypeConfigProps {
  serviceTypes?: ServiceType[];
  onSave?: (data: ServiceTypeFormData) => void;
  onUpdate?: (id: string, data: ServiceTypeFormData) => void;
  onDelete?: (id: string) => void;
}

const SERVICE_CATEGORIES = [
  { value: 'on_demand', label: 'On-Demand Delivery', icon: Zap, description: 'Intra-city same-day services' },
  { value: 'outstation', label: 'Outstation Delivery', icon: MapPin, description: 'Inter-city and inter-state services' },
  { value: 'specialized', label: 'Specialized Delivery', icon: Shield, description: 'Special handling requirements' },
];

const DELIVERY_MODELS = [
  { value: 'door_to_door', label: 'Door-to-Door', description: 'Pickup from sender and delivery to recipient' },
  { value: 'point_to_point', label: 'Point-to-Point', description: 'Hub-based pickup and delivery' },
  { value: 'hub_based', label: 'Hub-Based', description: 'Delivery between designated hubs' },
];

const SERVICE_TIERS = [
  { value: 'express', label: 'Express', description: 'Fastest delivery with premium pricing' },
  { value: 'standard', label: 'Standard', description: 'Regular delivery with standard pricing' },
  { value: 'economy', label: 'Economy', description: 'Budget-friendly with longer delivery times' },
];

const SPECIAL_REQUIREMENTS = [
  'Temperature Controlled',
  'Fragile Handling',
  'High Value Security',
  'Liquid Containment',
  'Perishable Goods',
  'Document Security',
  'Electronic Devices',
  'Medication Handling',
  'Oversized Items',
  'Hazardous Materials',
];

export function ServiceTypeConfig({ serviceTypes = [], onSave, onUpdate, onDelete }: ServiceTypeConfigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [selectedSpecialRequirements, setSelectedSpecialRequirements] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('list');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ServiceTypeFormData>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      category: 'on_demand',
      delivery_model: 'door_to_door',
      service_tier: 'standard',
      is_active: true,
      base_price: 0,
      operating_hours: {
        start: '08:00',
        end: '20:00',
      },
      package_limits: {
        max_weight: 5,
        max_dimensions: '30x30x30',
      },
      special_requirements: [],
    },
  });

  const selectedCategory = watch('category');
  const selectedTier = watch('service_tier');

  const handleEdit = (service: ServiceType) => {
    setEditingService(service);
    setIsEditing(true);
    setSelectedSpecialRequirements(service.special_requirements || []);
    reset({
      ...service,
      operating_hours: service.operating_hours || { start: '08:00', end: '20:00' },
      package_limits: service.package_limits || { max_weight: 5, max_dimensions: '30x30x30' },
    });
    setActiveTab('form');
  };

  const handleCreateNew = () => {
    setEditingService(null);
    setIsEditing(true);
    setSelectedSpecialRequirements([]);
    reset({
      name: '',
      code: '',
      description: '',
      category: 'on_demand',
      delivery_model: 'door_to_door',
      service_tier: 'standard',
      is_active: true,
      base_price: 0,
      operating_hours: {
        start: '08:00',
        end: '20:00',
      },
      package_limits: {
        max_weight: 5,
        max_dimensions: '30x30x30',
      },
      special_requirements: [],
    });
    setActiveTab('form');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingService(null);
    setActiveTab('list');
  };

  const toggleSpecialRequirement = (requirement: string) => {
    setSelectedSpecialRequirements(prev =>
      prev.includes(requirement)
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    );
  };

  const onSubmit = async (data: ServiceTypeFormData) => {
    try {
      const formData = {
        ...data,
        special_requirements: selectedSpecialRequirements,
      };

      if (editingService) {
        await systemConfigAPI.updateServiceType(editingService.id, formData);
        onUpdate?.(editingService.id, formData);
      } else {
        await systemConfigAPI.createServiceType(formData);
        onSave?.(formData);
      }

      // Reset form and go back to list
      handleCancel();
    } catch (error) {
      console.error('Failed to save service type:', error);
    }
  };

  const handleDelete = async (service: ServiceType) => {
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        // Note: We might want to deactivate instead of delete
        await systemConfigAPI.updateServiceType(service.id, { ...service, is_active: false });
        onDelete?.(service.id);
      } catch (error) {
        console.error('Failed to delete service type:', error);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = SERVICE_CATEGORIES.find(c => c.value === category);
    return categoryConfig?.icon || Package;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Type Configuration</h2>
          <p className="text-muted-foreground">
            Manage your delivery service types and configurations
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Service Type
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Service Types</TabsTrigger>
          <TabsTrigger value="form" disabled={!isEditing}>
            {editingService ? 'Edit Service' : 'New Service'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Service Types</CardTitle>
              <CardDescription>
                Manage your delivery service offerings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Delivery Model</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypes.map((service) => {
                    const CategoryIcon = getCategoryIcon(service.category);
                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <CategoryIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.code}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {SERVICE_CATEGORIES.find(c => c.value === service.category)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {DELIVERY_MODELS.find(m => m.value === service.delivery_model)?.label}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {SERVICE_TIERS.find(t => t.value === service.service_tier)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₦{service.base_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(service.is_active)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(service)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {serviceTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No service types configured yet.</p>
                        <Button onClick={handleCreateNew} className="mt-4">
                          Create Your First Service Type
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingService ? 'Edit Service Type' : 'Create New Service Type'}
              </CardTitle>
              <CardDescription>
                Configure the service parameters and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Express Same-Day Delivery"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code">Service Code</Label>
                      <Input
                        id="code"
                        {...register('code')}
                        placeholder="EXPRESS_SAME_DAY"
                      />
                      {errors.code && (
                        <p className="text-sm text-red-500">{errors.code.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Describe this service for customers..."
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Service Category</Label>
                      <Select
                        onValueChange={(value: any) => setValue('category', value)}
                        value={selectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_CATEGORIES.map(category => {
                            const Icon = category.icon;
                            return (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{category.label}</span>
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
                      <Label htmlFor="delivery_model">Delivery Model</Label>
                      <Select
                        onValueChange={(value: any) => setValue('delivery_model', value)}
                        defaultValue="door_to_door"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery model" />
                        </SelectTrigger>
                        <SelectContent>
                          {DELIVERY_MODELS.map(model => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service_tier">Service Tier</Label>
                      <Select
                        onValueChange={(value: any) => setValue('service_tier', value)}
                        value={selectedTier}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TIERS.map(tier => (
                            <SelectItem key={tier.value} value={tier.value}>
                              {tier.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="base_price">Base Price (₦)</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        {...register('base_price', { valueAsNumber: true })}
                        placeholder="0.00"
                      />
                      {errors.base_price && (
                        <p className="text-sm text-red-500">{errors.base_price.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_active" className="text-base">
                          Active Service
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make this service available to customers
                        </p>
                      </div>
                      <Switch
                        id="is_active"
                        {...register('is_active')}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Operating Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_time">Start Time</Label>
                          <Input
                            id="start_time"
                            type="time"
                            {...register('operating_hours.start')}
                          />
                          {errors.operating_hours?.start && (
                            <p className="text-sm text-red-500">{errors.operating_hours.start.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            id="end_time"
                            type="time"
                            {...register('operating_hours.end')}
                          />
                          {errors.operating_hours?.end && (
                            <p className="text-sm text-red-500">{errors.operating_hours.end.message}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Package Limits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max_weight">Maximum Weight (kg)</Label>
                        <Input
                          id="max_weight"
                          type="number"
                          step="0.1"
                          {...register('package_limits.max_weight', { valueAsNumber: true })}
                          placeholder="5.0"
                        />
                        {errors.package_limits?.max_weight && (
                          <p className="text-sm text-red-500">{errors.package_limits.max_weight.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_dimensions">Maximum Dimensions (cm)</Label>
                        <Input
                          id="max_dimensions"
                          {...register('package_limits.max_dimensions')}
                          placeholder="30x30x30"
                        />
                        {errors.package_limits?.max_dimensions && (
                          <p className="text-sm text-red-500">{errors.package_limits.max_dimensions.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Special Requirements
                    </CardTitle>
                    <CardDescription>
                      Select any special handling requirements for this service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {SPECIAL_REQUIREMENTS.map(requirement => (
                        <Badge
                          key={requirement}
                          variant={selectedSpecialRequirements.includes(requirement) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-1"
                          onClick={() => toggleSpecialRequirement(requirement)}
                        >
                          {requirement}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? 'Update Service' : 'Create Service'}
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
