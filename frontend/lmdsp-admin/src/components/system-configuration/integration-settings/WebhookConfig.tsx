'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, TestTube, Globe, Package, Users, DollarSign, Bell } from 'lucide-react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  is_active: boolean;
  last_triggered?: string;
  created_at: string;
}

const WEBHOOK_EVENTS = [
  {
    category: 'Orders',
    events: [
      { id: 'order.created', name: 'Order Created', description: 'When a new order is created' },
      { id: 'order.assigned', name: 'Order Assigned', description: 'When an order is assigned to a courier' },
      { id: 'order.picked_up', name: 'Order Picked Up', description: 'When an order is picked up' },
      { id: 'order.delivered', name: 'Order Delivered', description: 'When an order is delivered' },
      { id: 'order.cancelled', name: 'Order Cancelled', description: 'When an order is cancelled' },
    ]
  },
  {
    category: 'Tracking',
    events: [
      { id: 'tracking.updated', name: 'Tracking Updated', description: 'When tracking status changes' },
      { id: 'tracking.location', name: 'Location Updated', description: 'When courier location updates' },
    ]
  },
  {
    category: 'Customers',
    events: [
      { id: 'customer.created', name: 'Customer Created', description: 'When a new customer registers' },
      { id: 'customer.updated', name: 'Customer Updated', description: 'When customer information changes' },
    ]
  },
  {
    category: 'Payments',
    events: [
      { id: 'payment.completed', name: 'Payment Completed', description: 'When payment is successful' },
      { id: 'payment.failed', name: 'Payment Failed', description: 'When payment fails' },
      { id: 'payment.refunded', name: 'Payment Refunded', description: 'When payment is refunded' },
    ]
  },
  {
    category: 'System',
    events: [
      { id: 'system.alert', name: 'System Alert', description: 'System notifications and alerts' },
      { id: 'system.maintenance', name: 'Maintenance', description: 'System maintenance events' },
    ]
  }
];

export function WebhookConfig() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
    is_active: true
  });

  const toggleEvent = (eventId: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const createWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const webhook: Webhook = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWebhook,
      created_at: new Date().toISOString()
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({
      name: '',
      url: '',
      events: [],
      secret: '',
      is_active: true
    });
    setShowCreateForm(false);
  };

  const toggleWebhookStatus = (webhookId: string) => {
    setWebhooks(prev => prev.map(wh => 
      wh.id === webhookId ? { ...wh, is_active: !wh.is_active } : wh
    ));
  };

  const deleteWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== webhookId));
  };

  const testWebhook = (webhook: Webhook) => {
    // Simulate webhook test
    alert(`Testing webhook: ${webhook.name}\nURL: ${webhook.url}`);
  };

  const getEventIcon = (eventId: string) => {
    if (eventId.startsWith('order.')) return Package;
    if (eventId.startsWith('tracking.')) return Globe;
    if (eventId.startsWith('customer.')) return Users;
    if (eventId.startsWith('payment.')) return DollarSign;
    if (eventId.startsWith('system.')) return Bell;
    return Bell;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Webhook Configuration</h2>
          <p className="text-muted-foreground">
            Configure webhooks for real-time event notifications
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Webhook
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Webhook</CardTitle>
            <CardDescription>
              Set up a new webhook endpoint to receive real-time notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="Order Notifications"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://api.yourserver.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
              <Input
                id="webhook-secret"
                placeholder="Enter secret for signature verification"
                value={newWebhook.secret}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Subscribe to Events</Label>
              <div className="space-y-4">
                {WEBHOOK_EVENTS.map(category => (
                  <div key={category.category} className="space-y-2">
                    <Label className="text-sm font-medium">{category.category}</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {category.events.map(event => {
                        const EventIcon = getEventIcon(event.id);
                        return (
                          <div
                            key={event.id}
                            className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer ${
                              newWebhook.events.includes(event.id)
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => toggleEvent(event.id)}
                          >
                            <div className={`h-3 w-3 rounded-full border ${
                              newWebhook.events.includes(event.id)
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <EventIcon className="h-3 w-3 text-muted-foreground" />
                                <Label className="text-sm font-medium leading-none cursor-pointer">
                                  {event.name}
                                </Label>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="webhook-active"
                  checked={newWebhook.is_active}
                  onCheckedChange={(checked) => setNewWebhook(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="webhook-active" className="cursor-pointer">
                  Active Webhook
                </Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={createWebhook}>
                  Create Webhook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configured Webhooks</CardTitle>
          <CardDescription>
            Manage your webhook endpoints and their subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Webhook Name</TableHead>
                <TableHead>Endpoint URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {webhook.url}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 3).map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event.split('.')[1]}
                        </Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {webhook.last_triggered ? formatDate(webhook.last_triggered) : 'Never'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {webhook.is_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(webhook)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWebhookStatus(webhook.id)}
                      >
                        {webhook.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {webhooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No webhooks configured yet.</p>
                    <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                      Create Your First Webhook
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Documentation</CardTitle>
          <CardDescription>
            Technical details for implementing webhook receivers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Payload Format</Label>
              <div className="p-3 bg-muted rounded text-sm font-mono">
                {`{
  "event": "order.created",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Headers</Label>
              <div className="p-3 bg-muted rounded text-sm">
                <div>Content-Type: application/json</div>
                <div>X-Signature: sha256=...</div>
                <div>User-Agent: LastMile-Delivery-Pro/1.0</div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Webhooks will retry failed deliveries up to 3 times with exponential backoff.
              Ensure your endpoint returns 2xx status codes for successful processing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
