import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import BrowseCars from './pages/BrowseCars'
import CarDetails from './pages/CarDetails'
import CustomerLogin from './pages/customer/Login'
import CustomerRegister from './pages/customer/Register'
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerProfile from './pages/customer/Profile'
import BookCar from './pages/customer/BookCar'
import CustomerBookings from './pages/customer/Bookings'
import WriteReview from './pages/customer/Review'
import SupplierLogin from './pages/supplier/Login'
import SupplierRegister from './pages/supplier/Register'
import SupplierDashboard from './pages/supplier/Dashboard'
import SupplierCars from './pages/supplier/Cars'
import SupplierCarForm from './pages/supplier/CarForm'
import SupplierOrders from './pages/supplier/Orders'
import SupplierReports from './pages/supplier/Reports'
import SupplierVerification from './pages/supplier/Verification'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCustomers from './pages/admin/Customers'
import AdminCustomerForm from './pages/admin/CustomerForm'
import AdminSuppliers from './pages/admin/Suppliers'
import AdminVerifications from './pages/admin/Verifications'
import AdminPayments from './pages/admin/Payments'
import AdminReports from './pages/admin/Reports'
import AdminAdmins from './pages/admin/Admins'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cars" element={<BrowseCars />} />
            <Route path="cars/:id" element={<CarDetails />} />

            <Route path="customer/login" element={<CustomerLogin />} />
            <Route path="customer/register" element={<CustomerRegister />} />
            <Route
              path="customer/dashboard"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="customer/profile"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="customer/book/:carId"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <BookCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="customer/bookings"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <CustomerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="customer/reviews/new"
              element={
                <ProtectedRoute role="CUSTOMER">
                  <WriteReview />
                </ProtectedRoute>
              }
            />

            <Route path="supplier/login" element={<SupplierLogin />} />
            <Route path="supplier/register" element={<SupplierRegister />} />
            <Route
              path="supplier/dashboard"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/cars"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/cars/new"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierCarForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/cars/:id/edit"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierCarForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/orders"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/reports"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="supplier/verification"
              element={
                <ProtectedRoute role="SUPPLIER">
                  <SupplierVerification />
                </ProtectedRoute>
              }
            />

            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/customers"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/customers/new"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminCustomerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/customers/:id/edit"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminCustomerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/suppliers"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminSuppliers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/verifications"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminVerifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/payments"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reports"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/admins"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminAdmins />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
