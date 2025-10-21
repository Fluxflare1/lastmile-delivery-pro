'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Cpu, 
  Network, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: string;
  description: string;
}

const SYSTEM_SERVICES: SystemStatus[] = [
  {
    service: 'API Gateway',
    status: 'healthy',
    responseTime: 45,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Main API entry point'
  },
  {
    service: 'Identity Service',
    status: 'healthy',
    responseTime: 23,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Authentication and user management'
  },
  {
    service: 'Order Service',
    status: 'healthy',
    responseTime: 67,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Order processing and management'
  },
  {
    service: 'Tracking Service',
    status: 'degraded',
    responseTime: 234,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Real-time package tracking'
  },
  {
    service: 'Payment Service',
    status: 'healthy',
    responseTime: 89,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Payment processing'
  },
  {
    service: 'Database',
    status: 'healthy',
    responseTime: 12,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Primary database cluster'
  },
  {
    service: 'Redis Cache',
    status: 'healthy',
    responseTime: 5,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Caching and session storage'
  },
  {
    service: 'File Storage',
    status: 'healthy',
    responseTime: 156,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Document and image storage'
  }
];

const EXTERNAL_SERVICES = [
  {
    service: 'Google Maps API',
    status: 'healthy',
    responseTime: 120,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Geocoding and routing'
  },
  {
    service: 'Flutterwave Payments',
    status: 'healthy',
    responseTime: 280,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Payment gateway'
  },
  {
    service: 'Twilio SMS',
    status: 'degraded',
    responseTime: 450,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'SMS notifications'
  },
  {
    service: 'SendGrid Email',
    status: 'healthy',
    responseTime: 190,
    lastChecked: '2024-01-15T10:29:00Z',
    description: 'Email delivery'
  }
];

export function SystemHealth() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'down':
        return <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">Down</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 100) return 'text-green-600';
    if (ms < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastChecked = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Health</h2>
          <p className="text-muted-foreground">
            Monitor system performance and external service status
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Internal Services
            </CardTitle>
            <CardDescription>
              Core platform services and infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SYSTEM_SERVICES.map((service) => (
              <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.service}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(service.status)}
                  <div className={`text-sm font-medium ${getResponseTimeColor(service.responseTime)}`}>
                    {service.responseTime}ms
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatLastChecked(service.lastChecked)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              External Services
            </CardTitle>
            <CardDescription>
              Third-party integrations and APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {EXTERNAL_SERVICES.map((service) => (
              <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.service}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(service.status)}
                  <div className={`text-sm font-medium ${getResponseTimeColor(service.responseTime)}`}>
                    {service.responseTime}ms
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatLastChecked(service.lastChecked)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span className="font-medium text-green-600">24%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span className="font-medium text-yellow-600">68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Disk Usage</span>
                <span className="font-medium text-green-600">42%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Active Connections</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Query Rate</span>
              <span className="font-medium">1.2k/sec</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Replication Lag</span>
              <span className="font-medium text-green-600">0ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cache Hit Rate</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 border rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">High Response Time</div>
                  <div className="text-xs text-muted-foreground">Tracking Service - 10:15 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">All Systems Normal</div>
                  <div className="text-xs text-muted-foreground">Last 24 hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">SMS Delivery Delays</div>
                  <div className="text-xs text-muted-foreground">Twilio - Yesterday</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
