'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Key, Clock, Building } from 'lucide-react';
import { RolePermissionManager } from '@/components/system-configuration/user-management/RolePermissionManager';
import { UserAccessControl } from '@/components/system-configuration/user-management/UserAccessControl';
import { systemConfigAPI, UserRole } from '@/lib/api/system-config';

export default function UserManagementPage() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      setIsLoading(true);
      const response = await systemConfigAPI.getUserRoles();
      setUserRoles(response.data);
    } catch (error) {
      console.error('Failed to load user roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRoleSave = (data: any) => {
    loadUserRoles(); // Reload user roles
  };

  const handleUserRoleUpdate = (id: string, data: any) => {
    loadUserRoles(); // Reload user roles
  };

  const handleUserRoleDelete = (id: string) => {
    setUserRoles(prev => prev.filter(role => role.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading user management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Configure user roles, permissions, and access control
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <RolePermissionManager
            userRoles={userRoles}
            onSave={handleUserRoleSave}
            onUpdate={handleUserRoleUpdate}
            onDelete={handleUserRoleDelete}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserAccessControl userRoles={userRoles} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure authentication and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Security configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Monitor system activity and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Audit logs and monitoring coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
