'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Car, Users, Calendar, DollarSign, 
  LayoutDashboard, CarFront, CalendarDays, 
  UserCircle, CreditCard, BarChart3,
  Menu, X, ChevronDown, MoreHorizontal,
  TrendingUp, TrendingDown, Eye, Edit, Trash2,
  Plus, Search, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cars, bookings, customers } from '@/lib/data'

type Tab = 'overview' | 'cars' | 'bookings' | 'customers' | 'payments' | 'reports'

const navItems = [
  { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
  { id: 'cars' as Tab, label: 'Manage Cars', icon: CarFront },
  { id: 'bookings' as Tab, label: 'Bookings', icon: CalendarDays },
  { id: 'customers' as Tab, label: 'Customers', icon: UserCircle },
  { id: 'payments' as Tab, label: 'Payments', icon: CreditCard },
  { id: 'reports' as Tab, label: 'Reports', icon: BarChart3 },
]

const stats = [
  { 
    label: 'Total Bookings', 
    value: '1,234', 
    change: '+12%', 
    trend: 'up',
    icon: Calendar,
    color: 'bg-blue-500/10 text-blue-600',
  },
  { 
    label: 'Revenue', 
    value: '$45,678', 
    change: '+8%', 
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500/10 text-green-600',
  },
  { 
    label: 'Available Cars', 
    value: '42', 
    change: '-2', 
    trend: 'down',
    icon: Car,
    color: 'bg-primary/10 text-primary',
  },
  { 
    label: 'Active Customers', 
    value: '856', 
    change: '+24', 
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-600',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DriveEase</span>
            </Link>
            <button 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden" 
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-secondary rounded-lg border-0 focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'cars' && <CarsTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings & Top Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => {
                const car = cars.find((c) => c.id === booking.carId)
                return (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                      {car && (
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                          <Image src={car.image} alt={car.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{car?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${booking.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cars.slice(0, 5).map((car, index) => (
                <div key={car.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                      <Image src={car.image} alt={car.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{car.name}</p>
                      <p className="text-sm text-muted-foreground">{car.reviews} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${car.pricePerDay}/day</p>
                    <p className="text-sm text-muted-foreground">{car.rating} rating</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CarsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search cars..."
              className="w-64 pl-10 pr-4 py-2 bg-secondary rounded-lg border-0 focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Car
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Car</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Price/Day</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Rating</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                          <Image src={car.image} alt={car.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{car.name}</p>
                          <p className="text-sm text-muted-foreground">{car.brand} {car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-secondary rounded-full text-sm">{car.category}</span>
                    </td>
                    <td className="py-4 px-6 font-medium">${car.pricePerDay}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        car.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {car.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{car.rating}/5.0</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg" aria-label="View">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg" aria-label="Edit">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg" aria-label="Delete">
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BookingsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search bookings..."
              className="w-64 pl-10 pr-4 py-2 bg-secondary rounded-lg border-0 focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <select className="px-4 py-2 bg-secondary rounded-lg border-0 text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Booking ID</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Car</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Dates</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const car = cars.find((c) => c.id === booking.carId)
                  return (
                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-4 px-6 font-mono text-sm">{booking.id}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">{car?.name}</td>
                      <td className="py-4 px-6">
                        <p className="text-sm">{booking.pickupDate}</p>
                        <p className="text-sm text-muted-foreground">to {booking.returnDate}</p>
                      </td>
                      <td className="py-4 px-6 font-medium">${booking.totalPrice}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-secondary rounded-lg" aria-label="View">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg" aria-label="More options">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search customers..."
            className="w-64 pl-10 pr-4 py-2 bg-secondary rounded-lg border-0 focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Total Bookings</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{customer.phone}</td>
                    <td className="py-4 px-6">{customer.totalBookings}</td>
                    <td className="py-4 px-6 font-medium">${customer.totalSpent}</td>
                    <td className="py-4 px-6 text-muted-foreground">{customer.joinedAt}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg" aria-label="View">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg" aria-label="Edit">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentsTab() {
  const payments = bookings.map((b) => ({
    ...b,
    car: cars.find((c) => c.id === b.carId),
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">$45,678</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="text-3xl font-bold">$1,234</p>
            <p className="text-sm text-muted-foreground mt-2">3 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Refunds</p>
            <p className="text-3xl font-bold">$567</p>
            <p className="text-sm text-muted-foreground mt-2">2 this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6 font-mono text-sm">TXN-{payment.id}</td>
                    <td className="py-4 px-6">{payment.customerName}</td>
                    <td className="py-4 px-6 font-medium">${payment.totalPrice}</td>
                    <td className="py-4 px-6 text-muted-foreground">{payment.createdAt}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        payment.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        payment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 75, 55, 85, 70, 90, 60, 80, 50, 95, 75].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'SUV', percentage: 35, color: 'bg-primary' },
                { category: 'Luxury', percentage: 28, color: 'bg-blue-500' },
                { category: 'Economy', percentage: 20, color: 'bg-green-500' },
                { category: 'Sports', percentage: 12, color: 'bg-purple-500' },
                { category: 'Compact', percentage: 5, color: 'bg-yellow-500' },
              ].map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Daily Report', description: 'Download daily statistics' },
              { label: 'Weekly Report', description: 'Download weekly statistics' },
              { label: 'Monthly Report', description: 'Download monthly statistics' },
              { label: 'Custom Report', description: 'Generate custom report' },
            ].map((report) => (
              <button
                key={report.label}
                className="p-4 border border-border rounded-xl text-left hover:bg-secondary transition-colors"
              >
                <p className="font-medium mb-1">{report.label}</p>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
