export type UserRole = 'CUSTOMER' | 'SUPPLIER' | 'ADMIN'

export interface AuthSession {
  role: UserRole
  id: number
  name: string
  email: string
}

export interface Car {
  carId: number
  brand: string
  model: string
  pricePerDay: number
  availabilityStatus: boolean
  carType: string
  supplierId: number
  supplierName: string
}

export interface Customer {
  userId: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
}

export interface Supplier {
  supplierId: number
  supplierType: string
  companyName: string
  email: string
  rating: number
  verificationStatus: string
  hiddenAddress: boolean
}

export interface Admin {
  adminId: number
  fullName: string
  email: string
  role: string
}

export interface Booking {
  bookingId: number
  pickupDate: string
  returnDate: string
  totalPrice: number
  bookingStatus: string
  customerId: number
  customerName: string
  cars: { carId: number; brand: string; model: string }[]
  payment: {
    paymentId: number
    amount: number
    paymentMethod: string
    paymentStatus: string
  } | null
}

export interface Review {
  reviewId: number
  rating: number
  comment: string
  reviewDate: string
  customerName: string
}

export interface Payment {
  paymentId: number
  amount: number
  paymentMethod: string
  paymentStatus: string
  transactionId: string
  bookingId: number
  customerName: string
}

export interface Verification {
  verificationId: number
  verificationType: string
  verificationStatus: string
  verifiedAt: string | null
  faceRecognitionResult: string | null
  supplierName: string
  documents: VerificationDocument[]
}

export interface VerificationDocument {
  documentId: number
  documentType: string
  documentURL: string
  uploadDate: string
  expiryDate: string | null
}

export interface Report {
  reportId: number
  reportType: string
  generatedDate: string
  totalRevenue: number
  totalBookings: number
  supplierName: string
}

export interface DashboardStats {
  customerCount: number
  supplierCount: number
  bookingCount: number
  paymentCount: number
}

export interface ApiError {
  message: string
}
