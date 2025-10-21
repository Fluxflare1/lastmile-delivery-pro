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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  Key,
  Building,
  Package,
  DollarSign,
  MapPin,
  BarChart3
} from 'lucide-react';
import { systemConfigAPI, UserRole } from '@/lib/api/system-config';

const userRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  is_system: z.boolean().default(false),
});

type UserRoleFormData = z.infer<typeof userRoleSchema>;

interface RolePermissionManagerProps {
  userRoles?: UserRole[];
  onSave?: (data: UserRoleFormData) => void;
  onUpdate?: (id: string, data: UserRoleFormData) => void;
  onDelete?: (id: string) => void;
}

const PERMISSION_CATEGORIES = [
  {
    category: 'Dashboard',
    icon: BarChart3,
    permissions: [
      { id: 'dashboard:view', name: 'View Dashboard', description: 'Access to main dashboard and analytics' },
      { id: 'dashboard:export', name: 'Export Data', description: 'Export dashboard data and reports' },
    ]
  },
  {
    category: 'Business Management',
    icon: Building,
    permissions: [
      { id: 'business:view', name: 'View Business Info', description: 'View business profile and settings' },
      { id: 'business:edit', name: 'Edit Business Info', description: 'Modify business profile and settings' },
      { id: 'business:config', name: 'Configure Business', description: 'Configure business operations and services' },
    ]
  },
  {
    category: 'Order Management',
    icon: Package,
    permissions: [
      { id: 'orders:view', name: 'View Orders', description: 'View all orders and delivery requests' },
      { id: 'orders:create', name: 'Create Orders', description: 'Create new delivery orders' },
      { id: 'orders:edit', name: 'Edit Orders', description: 'Modify existing orders' },
      { id: 'orders:assign', name: 'Assign Orders', description: 'Assign orders to couriers' },
      { id: 'orders:cancel', name: 'Cancel Orders', description: 'Cancel delivery orders' },
      { id: 'orders:bulk_operations', name: 'Bulk Operations', description: 'Perform bulk order operations' },
    ]
  },
  {
    category: 'Courier Management',
    icon: Users,
    permissions: [
      { id: 'couriers:view', name: 'View Couriers', description: 'View courier profiles and information' },
      { id: 'couriers:create', name: 'Create Couriers', description: 'Add new couriers to the system' },
      { id: 'couriers:edit', name: 'Edit Couriers', description: 'Modify courier profiles and settings' },
      { id: 'couriers:assign', name: 'Assign Tasks', description: 'Assign delivery tasks to couriers' },
      { id: 'couriers:performance', name: 'View Performance', description: 'Access courier performance metrics' },
      { id: 'couriers:payments', name: 'Manage Payments', description: 'Handle courier payments and commissions' },
    ]
  },
  {
    category: 'Customer Management',
    icon: Users,
    permissions: [
      { id: 'customers:view', name: 'View Customers', description: 'View customer profiles and information' },
      { id: 'customers:create', name: 'Create Customers', description: 'Add new customers to the system' },
      { id: 'customers:edit', name: 'Edit Customers', description: 'Modify customer profiles and settings' },
      { id: 'customers:service', name: 'Customer Service', description: 'Access customer service tools' },
      { id: 'customers:feedback', name: 'Manage Feedback', description: 'Handle customer feedback and reviews' },
    ]
  },
  {
    category: 'Financial Management',
    icon: DollarSign,
    permissions: [
      { id: 'financial:view', name: 'View Financial Data', description: 'Access financial reports and data' },
      { id: 'financial:invoicing', name: 'Manage Invoicing', description: 'Create and manage invoices' },
      { id: 'financial:payments', name: 'Process Payments', description: 'Handle payment processing' },
      { id: 'financial:reports', name: 'Generate Reports', description: 'Create financial reports' },
      { id: 'financial:config', name: 'Configure Pricing', description: 'Set up pricing and commission rules' },
    ]
  },
  {
    category: 'Operations Management',
    icon: MapPin,
    permissions: [
      { id: 'operations:view', name: 'View Operations', description: 'Access operational data and metrics' },
      { id: 'operations:config', name: 'Configure Operations', description: 'Set up operational parameters' },
      { id: 'operations:routes', name: 'Manage Routes', description: 'Configure delivery routes and zones' },
      { id: 'operations:capacity', name: 'Capacity Planning', description: 'Manage delivery capacity and resources' },
    ]
  },
  {
    category: 'System Administration',
    icon: Shield,
    permissions: [
      { id: 'system:users', name: 'Manage Users', description: 'Create and manage system users' },
      { id: 'system:roles', name: 'Manage Roles', description: 'Configure user roles and permissions' },
      { id: 'system:config', name: 'System Configuration', description: 'Access system-wide settings' },
      { id: 'system:integrations', name: 'Manage Integrations', description: 'Configure third-party integrations' },
      { id: 'system:audit', name: 'View Audit Logs', description: 'Access system audit trails' },
      { id: 'system:backup', name: 'System Backup', description: 'Perform system backup operations' },
    ]
  }
];

const PRESET_ROLES = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: PERMISSION_CATEGORIES.flatMap(cat => cat.permissions.map(p => p.id)),
    is_system: true
  },
  {
    name: 'Operations Manager',
    description: 'Manages daily operations and courier assignments',
    permissions: [
      'dashboard:view',
      'orders:view', 'orders:create', 'orders:edit', 'orders:assign', 'orders:cancel',
      'couriers:view', 'couriers:edit', 'couriers:assign', 'couriers:performance',
      'customers:view', 'customers:service',
      'operations:view', 'operations:config', 'operations:routes', 'operations:capacity'
    ],
    is_system: false
  },
  {
    name: 'Customer Service',
    description: 'Handles customer inquiries and service issues',
    permissions: [
      'dashboard:view',
      'orders:view',
      'customers:view', 'customers:edit', 'customers:service', 'customers:feedback',
      'orders:cancel'
    ],
    is_system: false
  },
  {
    name: 'Finance Manager',
    description: 'Manages billing, payments, and financial reporting',
    permissions: [
      'dashboard:view',
      'financial:view', 'financial:invoicing', 'financial:payments', 'financial:reports',
      'orders:view',
      'couriers:payments'
    ],
    is_system: false
  }
];

export function RolePermissionManager({ userRoles = [], onSave, onUpdate, onDelete }: RolePermissionManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserRoleFormData>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      permissions: [],
      is_system: false,
    },
  });

  const handleEdit = (role: UserRole) => {
    setEditingRole(role);
    setIsEditing(true);
    setSelectedPermissions(role.permissions || []);
    reset({
      ...role,
      permissions: role.permissions || [],
    });
    setActiveTab('form');
  };

  const handleCreateNew = () => {
    setEditingRole(null);
    setIsEditing(true);
    setSelectedPermissions([]);
    reset({
      name: '',
      description: '',
      permissions: [],
      is_system: false,
    });
    setActiveTab('form');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingRole(null);
    setSelectedPermissions([]);
    setActiveTab('list');
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleAllPermissionsInCategory = (category: typeof PERMISSION_CATEGORIES[0]) => {
    const categoryPermissions = category.permissions.map(p => p.id);
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Remove all permissions from this category
      setSelectedPermissions(prev => prev.filter(p => !categoryPermissions.includes(p)));
    } else {
      // Add all permissions from this category
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  const loadPresetRole = (preset: typeof PRESET_ROLES[0]) => {
    setSelectedPermissions(preset.permissions);
    reset({
      name: preset.name,
      description: preset.description,
      permissions: preset.permissions,
      is_system: preset.is_system,
    });
  };

  const onSubmit = async (data: UserRoleFormData) => {
    try {
      const formData = {
        ...data,
        permissions: selectedPermissions,
      };

      if (editingRole) {
        await systemConfigAPI.updateUserRole(editingRole.id, formData);
        onUpdate?.(editingRole.id, formData);
      } else {
        await systemConfigAPI.createUserRole?.(formData);
        onSave?.(formData);
      }

      handleCancel();
    } catch (error) {
      console.error('Failed to save user role:', error);
    }
  };

  const handleDelete = async (role: UserRole) => {
    if (role.is_system) {
      alert('System roles cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      try {
        onDelete?.(role.id);
      } catch (error) {
        console.error('Failed to delete user role:', error);
      }
    }
  };

  const getPermissionCountByCategory = (category: typeof PERMISSION_CATEGORIES[0]) => {
    const categoryPermissions = category.permissions.map(p => p.id);
    return selectedPermissions.filter(p => categoryPermissions.includes(p)).length;
  };

  const getStatusBadge = (isSystem: boolean) => {
    return isSystem ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        System
      </Badge>
    ) : (
      <Badge variant="outline">Custom</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role & Permission Management</h2>
          <p className="text-muted-foreground">
            Configure user roles and system permissions for access control
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Role
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">User Roles</TabsTrigger>
          <TabsTrigger value="form" disabled={!isEditing}>
            {editingRole ? 'Edit Role' : 'Role Builder'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Manage system roles and their permission sets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div className="font-medium">{role.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-md">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {role.permissions?.length || 0} permissions
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(role.is_system || false)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!role.is_system && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(role)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {userRoles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No user roles configured yet.</p>
                        <Button onClick={handleCreateNew} className="mt-4">
                          Create Your First Role
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
                {editingRole ? 'Edit User Role' : 'Create New User Role'}
              </CardTitle>
              <CardDescription>
                Define role permissions and access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Role Name</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Operations Manager"
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
                        placeholder="Describe the role and its responsibilities..."
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>

                    {!editingRole && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Quick Presets</CardTitle>
                          <CardDescription>
                            Start with a predefined role template
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {PRESET_ROLES.filter(role => !role.is_system).map((preset) => (
                            <Button
                              key={preset.name}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => loadPresetRole(preset)}
                            >
                              <div>
                                <div className="font-medium">{preset.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {preset.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Role Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Total Permissions:</span>
                          <span className="font-medium">{selectedPermissions.length}</span>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Permission Categories:</Label>
                          <div className="space-y-1">
                            {PERMISSION_CATEGORIES.map(category => (
                              <div key={category.category} className="flex justify-between text-xs">
                                <span>{category.category}:</span>
                                <span>
                                  {getPermissionCountByCategory(category)}/{category.permissions.length}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <Label htmlFor="is_system" className="text-sm">
                              System Role
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Protected system role
                            </p>
                          </div>
                          <Switch
                            id="is_system"
                            {...register('is_system')}
                            disabled={editingRole?.is_system}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Permission Configuration</CardTitle>
                    <CardDescription>
                      Select the permissions to grant to this role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {PERMISSION_CATEGORIES.map(category => {
                        const CategoryIcon = category.icon;
                        const selectedCount = getPermissionCountByCategory(category);
                        const totalCount = category.permissions.length;
                        
                        return (
                          <div key={category.category} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4" />
                                <Label className="text-base">{category.category}</Label>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                  {selectedCount}/{totalCount} selected
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAllPermissionsInCategory(category)}
                                >
                                  {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid gap-3 md:grid-cols-2">
                              {category.permissions.map(permission => (
                                <div
                                  key={permission.id}
                                  className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50"
                                >
                                  <Checkbox
                                    id={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                  />
                                  <div className="space-y-1">
                                    <Label
                                      htmlFor={permission.id}
                                      className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                      {permission.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={selectedPermissions.length === 0}>
                    {editingRole ? 'Update Role' : 'Create Role'}
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
