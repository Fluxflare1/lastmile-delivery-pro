'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload, Download, FileText } from 'lucide-react'

interface BulkOperationsModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function BulkOperationsModal({ onClose, onSuccess }: BulkOperationsModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'templates'>('import')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Processing file:', selectedFile.name)
      onSuccess()
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    // Create and download CSV template
    const template = `service_type,pickup_contact_name,pickup_contact_phone,pickup_street,pickup_city,pickup_state,delivery_contact_name,delivery_contact_phone,delivery_street,delivery_city,delivery_state,weight_kg,description,category
on_demand,John Doe,+2348012345678,123 Main St,Lagos,Lagos,Jane Smith,+2348098765432,456 Delivery Ave,Lagos,Lagos,2.5,Important documents,document
outstation,Mike Johnson,+2348022334455,789 Business Rd,Lagos,Lagos,Sarah Wilson,+2348077665544,321 Receipt St,Abuja,FCT,5.0,Product samples,parcel`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lmdsp-order-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Bulk Order Operations</h2>
            <p className="text-sm text-gray-600">Import or export multiple orders at once</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'import'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('import')}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Import Orders
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'export'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('export')}
            >
              <Download className="h-4 w-4 inline mr-2" />
              Export Orders
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Templates
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFile ? selectedFile.name : 'Drag and drop your CSV file here, or click to browse'}
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose File
                </Button>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-900">{selectedFile.name}</div>
                      <div className="text-sm text-blue-700">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <strong>Import Guidelines:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Use the provided CSV template for correct formatting</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
                    <li>• Orders will be validated before creation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Export your orders to CSV or Excel format for external analysis or reporting
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline" onClick={() => {/* Export CSV */}}>
                    Export as CSV
                  </Button>
                  <Button variant="outline" onClick={() => {/* Export Excel */}}>
                    Export as Excel
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Export Filters
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                  <select className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Download templates for bulk order operations
                </p>
                
                <div className="space-y-3 max-w-md mx-auto">
                  <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Order Import Template (CSV)
                  </Button>
                  <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Order Import Template (Excel)
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <strong>Template Instructions:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Use the exact column names provided in the template</li>
                    <li>• Required fields: contact names, phone numbers, addresses</li>
                    <li>• Phone numbers should include country code (+234 for Nigeria)</li>
                    <li>• Weight must be in kilograms (kg)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === 'import' && selectedFile && (
            <Button onClick={handleImport} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Import Orders'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
