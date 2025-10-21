'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import FinancialOverview from '@/components/financial/financial-overview'
import BillingInvoicing from '@/components/financial/billing-invoicing'
import RevenueManagement from '@/components/financial/revenue-management'
import CostAnalysis from '@/components/financial/cost-analysis'
import ProfitabilityReports from '@/components/financial/profitability-reports'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Plus, RefreshCw, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'

export default function FinancialPage() {
  const { user, tenant } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [financialData, setFinancialData] = useState<any>(null)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true)
      // Mock data - in real app, this would come from API
      const mockData = {
        overview: {
          total_revenue: 1250000,
          revenue_trend: 15.5,
          total_expenses: 890000,
          expense_trend: 8.2,
          net_profit: 360000,
          profit_trend: 25.8,
          outstanding_payments: 145000,
          cash_flow: 'positive'
        },
        recent_invoices: [
          {
            id: 'INV-2024-001',
            customer: 'John Smith',
            amount: 3200,
            status: 'paid',
            due_date: '2024-01-20',
            issued_date: '2024-01-15'
          },
          {
            id: 'INV-2024-002',
            customer: 'Sarah Johnson',
            amount: 8500,
            status: 'pending',
            due_date: '2024-01-25',
            issued_date: '2024-01-16'
          },
          {
            id: 'INV-2024-003',
            customer: 'Mike Davis',
            amount: 2100,
            status: 'overdue',
            due_date: '2024-01-18',
            issued_date: '2024-01-12'
          }
        ],
        revenue_breakdown: {
          on_demand: 650000,
          outstation: 450000,
          subscription: 150000
        },
        expense_categories: {
          courier_payouts: 450000,
          fuel: 120000,
          maintenance: 80000,
          salaries: 150000,
          marketing: 50000,
          overhead: 40000
        }
      }
      setFinancialData(mockData)
      setError('')
    } catch (err: any) {
      setError('Failed to load financial data')
      console.error('Financial data fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600 mt-2">
              Financial overview, billing, and revenue management for {tenant?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchFinancialData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchFinancialData} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Financial Overview */}
            {financialData && <FinancialOverview data={financialData.overview} />}

            {/* Main Content Tabs */}
            <Tabs defaultValue="billing" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="billing">Billing & Invoicing</TabsTrigger>
                <TabsTrigger value="revenue">Revenue Management</TabsTrigger>
                <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                <TabsTrigger value="profitability">Profitability</TabsTrigger>
                <TabsTrigger value="reports">Financial Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="billing" className="space-y-6">
                <BillingInvoicing 
                  invoices={financialData.recent_invoices}
                  overview={financialData.overview}
                />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <RevenueManagement 
                  revenueBreakdown={financialData.revenue_breakdown}
                  overview={financialData.overview}
                />
              </TabsContent>

              <TabsContent value="costs" className="space-y-6">
                <CostAnalysis 
                  expenseCategories={financialData.expense_categories}
                  overview={financialData.overview}
                />
              </TabsContent>

              <TabsContent value="profitability" className="space-y-6">
                <ProfitabilityReports 
                  overview={financialData.overview}
                  revenueBreakdown={financialData.revenue_breakdown}
                  expenseCategories={financialData.expense_categories}
                />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>
                      Generate and download comprehensive financial reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Standard Reports</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Monthly Profit & Loss Statement
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Quarterly Revenue Report
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Annual Financial Summary
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">Custom Reports</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Custom Report
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Performance Analytics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Tax Preparation Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  )
}
