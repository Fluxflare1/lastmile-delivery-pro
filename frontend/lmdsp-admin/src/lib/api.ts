import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, LoginCredentials, AuthResponse } from '@/types'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:8000'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenant_id')
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        config.headers['X-Client-Version'] = '1.0.0'
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for token refresh and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const refreshToken = localStorage.getItem('refresh_token')
            const newToken = await this.refreshToken(refreshToken!)
            
            if (newToken) {
              localStorage.setItem('token', newToken)
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Redirect to login if refresh fails
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('tenant_id')
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      })
      
      return response.data.data.token
    } catch (error) {
      return null
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login',
      credentials
    )
    return response.data.data!
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token')
    if (token) {
      await this.client.post('/api/v1/auth/logout')
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('tenant_id')
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/api/v1/auth/me')
    return response.data.data
  }

  // Order management methods
  async getOrders(params?: any): Promise<any> {
    const response = await this.client.get<ApiResponse>('/api/v1/lmdsp/orders', { params })
    return response.data.data
  }

  async createOrder(orderData: any): Promise<any> {
    const response = await this.client.post<ApiResponse>('/api/v1/lmdsp/orders', orderData)
    return response.data.data
  }

  async assignCourier(orderId: string, courierId: string): Promise<any> {
    const response = await this.client.post<ApiResponse>('/api/v1/lmdsp/couriers/assign', {
      order_id: orderId,
      courier_id: courierId,
      assignment_type: 'manual'
    })
    return response.data.data
  }

  // Courier management methods
  async getCouriers(params?: any): Promise<any> {
    const response = await this.client.get<ApiResponse>('/api/v1/lmdsp/couriers', { params })
    return response.data.data
  }

  // Analytics methods
  async getDashboardMetrics(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/api/v1/analytics/dashboard')
    return response.data.data
  }
}

export const apiClient = new ApiClient()
