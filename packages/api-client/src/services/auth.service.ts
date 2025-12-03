import { ApiClient } from '../client'
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types'

export class AuthService {
  constructor(private client: ApiClient) {}

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', data)
    this.client.setToken(response.accessToken)
    return response
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', data)
    this.client.setToken(response.accessToken)
    return response
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout')
    this.client.clearToken()
  }

  async getProfile(): Promise<User> {
    return this.client.get<User>('/api/auth/profile')
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/refresh', { refreshToken })
    this.client.setToken(response.accessToken)
    return response
  }

  async initDevice(): Promise<{ deviceId: string }> {
    return this.client.post('/api/device/init')
  }
}
