import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronRight,
  MapPin,
  CreditCard,
  Package,
  Settings,
  Edit2,
  Plus,
  Trash2,
  Check,
} from 'lucide-react'

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  total: number
  items: number
}

function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  })
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      street: '123 Nordic Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      isDefault: true,
    },
  ])
  const [orders] = useState<Order[]>([
    {
      id: 'SS12345678',
      date: '2026-03-25',
      status: 'delivered',
      total: 478.00,
      items: 3,
    },
    {
      id: 'SS12345679',
      date: '2026-03-20',
      status: 'shipped',
      total: 189.00,
      items: 1,
    },
    {
      id: 'SS12345680',
      date: '2026-03-15',
      status: 'processing',
      total: 299.00,
      items: 1,
    },
  ])
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In a real app, this would save to the backend
  }

  const handleAddAddress = () => {
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    }
    setAddresses([...addresses, address])
    setShowAddAddress(false)
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    })
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-snow">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-charcoal">Socker Studio</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-sage" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                  <p className="text-xs text-slate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate hover:text-charcoal"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate mb-8">
          <button onClick={() => navigate('/')} className="hover:text-nordic-blue transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-charcoal">My Account</span>
        </nav>

        <h1 className="text-3xl font-semibold text-charcoal mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-nordic-blue text-white'
                      : 'text-charcoal hover:bg-frost'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-nordic-blue text-white'
                      : 'text-charcoal hover:bg-frost'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-nordic-blue text-white'
                      : 'text-charcoal hover:bg-frost'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-nordic-blue text-white'
                      : 'text-charcoal hover:bg-frost'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-charcoal">Profile Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-sage" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-charcoal">{user?.name}</h3>
                    <p className="text-slate">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder={isEditing ? 'Enter phone number' : 'Not set'}
                      className="mt-1"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-charcoal">Saved Addresses</h2>
                  <Button onClick={() => setShowAddAddress(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border border-stone-200 rounded-xl relative"
                    >
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-sage text-white text-xs font-medium rounded">
                          Default
                        </span>
                      )}
                      <h3 className="font-medium text-charcoal mb-2">{address.name}</h3>
                      <p className="text-slate text-sm">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                      </p>
                      <div className="flex gap-2 mt-4">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-rose-ash hover:text-rose-ash"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal */}
                {showAddAddress && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                      <h3 className="text-lg font-semibold text-charcoal mb-4">Add New Address</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="addressName">Address Name</Label>
                          <Input
                            id="addressName"
                            value={newAddress.name}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, name: e.target.value })
                            }
                            placeholder="e.g., Home, Office"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={newAddress.street}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, street: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, city: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, state: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={newAddress.zipCode}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, zipCode: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={newAddress.country}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, country: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowAddAddress(false)}
                        >
                          Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleAddAddress}>
                          Add Address
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-6">Order History</h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="p-4 border border-stone-200 rounded-xl hover:border-nordic-blue transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-charcoal">Order #{order.id}</p>
                          <p className="text-sm text-slate">{order.date}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-slate text-sm">{order.items} item(s)</p>
                        <p className="font-semibold text-charcoal">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-charcoal mb-2">No orders yet</h3>
                    <p className="text-slate mb-6">Start shopping to see your orders here.</p>
                    <Button onClick={() => navigate('/')}>Start Shopping</Button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="p-4 border border-stone-200 rounded-xl">
                    <h3 className="font-medium text-charcoal mb-2">Email Notifications</h3>
                    <p className="text-sm text-slate mb-4">
                      Manage your email notification preferences
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-nordic-blue" />
                        <span className="text-sm text-charcoal">Order updates</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-nordic-blue" />
                        <span className="text-sm text-charcoal">Promotional emails</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-nordic-blue" />
                        <span className="text-sm text-charcoal">Newsletter</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-stone-200 rounded-xl">
                    <h3 className="font-medium text-charcoal mb-2">Password</h3>
                    <p className="text-sm text-slate mb-4">Change your account password</p>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="p-4 border border-stone-200 rounded-xl">
                    <h3 className="font-medium text-charcoal mb-2">Delete Account</h3>
                    <p className="text-sm text-slate mb-4">
                      Permanently delete your account and all data
                    </p>
                    <Button variant="outline" className="text-rose-ash hover:text-rose-ash">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile