import { jwtDecode } from 'jwt-decode'
import { User } from '@/types'

interface JwtPayload {
  user_id: string
  tenant_id: string
  user_type: string
  permissions: string[]
  exp: number
  iat: number
}

export class AuthService {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken)
  }

  static setTenantId(tenantId: string): void {
    localStorage.setItem('tenant_id', tenantId)
  }

  static clearTokens(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('tenant_id')
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      
      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  }

  static getUserFromToken(): User | null {
    const token = this.getToken()
    if (!token) return null

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      
      return {
        id: decoded.user_id,
        email: '', // Email not in JWT
        name: '', // Name not in JWT
        user_type: decoded.user_type as any,
        tenant_id: decoded.tenant_id,
        permissions: decoded.permissions,
        profile_complete: true // Would need to check from user profile
      }
    } catch (error) {
      return null
    }
  }

  static hasPermission(permission: string): boolean {
    const user = this.getUserFromToken()
    return user ? user.permissions.includes(permission) : false
  }
}
