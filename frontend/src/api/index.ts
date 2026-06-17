export { API_BASE_URL } from './baseUrl'

import { apiUrl } from './baseUrl'
import { apiRequest } from './client'
import type {
  Admin,
  AuthSession,
  Booking,
  Car,
  Customer,
  DashboardStats,
  Payment,
  Report,
  Review,
  Supplier,
  Verification,
} from '../types'

export const authApi = {
  session: () => apiRequest<AuthSession | null>('/api/auth/session').catch(() => null),
  logout: () => apiRequest<void>('/api/auth/logout', { method: 'POST' }),
  loginCustomer: (email: string, password: string) =>
    apiRequest<AuthSession>('/api/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerCustomer: (data: Record<string, string>) =>
    apiRequest<Customer>('/api/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginSupplier: (email: string, password: string) =>
    apiRequest<AuthSession>('/api/auth/supplier/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerSupplier: (data: Record<string, string>) =>
    apiRequest<Supplier>('/api/auth/supplier/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginAdmin: (email: string, password: string) =>
    apiRequest<AuthSession>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}

export const carsApi = {
  available: () => apiRequest<Car[]>('/api/cars'),
  search: (keyword?: string, carType?: string) => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (carType) params.set('carType', carType)
    const query = params.toString()
    return apiRequest<Car[]>(`/api/cars/search${query ? `?${query}` : ''}`)
  },
  get: (id: number) => apiRequest<Car>(`/api/cars/${id}`),
  reviews: (id: number) => apiRequest<Review[]>(`/api/cars/${id}/reviews`),
}

export const customerApi = {
  dashboard: () =>
    apiRequest<{ customer: Customer; recentBookings: Booking[] }>('/api/customer/dashboard'),
  profile: () => apiRequest<Customer>('/api/customer/profile'),
  updateProfile: (data: Record<string, string | undefined>) =>
    apiRequest<Customer>('/api/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  bookings: () => apiRequest<Booking[]>('/api/customer/bookings'),
  createBooking: (data: {
    carIds: number[]
    pickupDate: string
    returnDate: string
    paymentMethod: string
  }) =>
    apiRequest<Booking>('/api/customer/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelBooking: (id: number) =>
    apiRequest<Booking>(`/api/customer/bookings/${id}/cancel`, { method: 'POST' }),
  addReview: (data: { carId: number; rating: number; comment: string }) =>
    apiRequest<Review>('/api/customer/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const supplierApi = {
  dashboard: () =>
    apiRequest<{ supplier: Supplier; cars: Car[] }>('/api/supplier/dashboard'),
  cars: () => apiRequest<Car[]>('/api/supplier/cars'),
  uploadCarImage: async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    let response: Response
    try {
      response = await fetch(apiUrl('/api/supplier/cars/upload-image'), {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
    } catch {
      throw new Error(
        'Could not reach the API server. Start the backend locally (cd backend && ./mvnw spring-boot:run) or deploy the latest API with image upload support.'
      )
    }
    if (!response.ok) {
      const message = await response.text().then((t) => {
        try {
          return (JSON.parse(t) as { message?: string }).message
        } catch {
          return response.statusText
        }
      })
      if (response.status === 405) {
        throw new Error(
          'Image upload is not available on this API server. Run the local backend or deploy the latest backend version.'
        )
      }
      throw new Error(message || 'Image upload failed')
    }
    return (await response.json()) as { imageUrl: string }
  },
  addCar: (data: Record<string, unknown>) =>
    apiRequest<Car>('/api/supplier/cars', { method: 'POST', body: JSON.stringify(data) }),
  updateCar: (id: number, data: Record<string, unknown>) =>
    apiRequest<Car>(`/api/supplier/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCar: (id: number) =>
    apiRequest<void>(`/api/supplier/cars/${id}`, { method: 'DELETE' }),
  toggleAvailability: (id: number, available: boolean) =>
    apiRequest<Car>(`/api/supplier/cars/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    }),
  orders: () => apiRequest<Booking[]>('/api/supplier/orders'),
  reports: () => apiRequest<Report[]>('/api/supplier/reports'),
  generateReport: () =>
    apiRequest<Report>('/api/supplier/reports/generate', { method: 'POST' }),
  verification: () => apiRequest<Verification | null>('/api/supplier/verification'),
}

export const adminApi = {
  stats: () => apiRequest<DashboardStats>('/api/admin/dashboard/stats'),
  customers: () => apiRequest<Customer[]>('/api/admin/customers'),
  getCustomer: (id: number) => apiRequest<Customer>(`/api/admin/customers/${id}`),
  createCustomer: (data: Record<string, string | undefined>) =>
    apiRequest<Customer>('/api/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id: number, data: Record<string, string | undefined>) =>
    apiRequest<Customer>(`/api/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id: number) =>
    apiRequest<void>(`/api/admin/customers/${id}`, { method: 'DELETE' }),
  suppliers: () => apiRequest<Supplier[]>('/api/admin/suppliers'),
  deleteSupplier: (id: number) =>
    apiRequest<void>(`/api/admin/suppliers/${id}`, { method: 'DELETE' }),
  verifications: () => apiRequest<Verification[]>('/api/admin/verifications'),
  approveVerification: (id: number) =>
    apiRequest<Verification>(`/api/admin/verifications/${id}/approve`, { method: 'POST' }),
  payments: () => apiRequest<Payment[]>('/api/admin/payments'),
  reports: () => apiRequest<Report[]>('/api/admin/reports'),
  admins: () => apiRequest<Admin[]>('/api/admin/admins'),
  createAdmin: (data: Record<string, string | undefined>) =>
    apiRequest<Admin>('/api/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAdmin: (id: number) =>
    apiRequest<void>(`/api/admin/admins/${id}`, { method: 'DELETE' }),
}
