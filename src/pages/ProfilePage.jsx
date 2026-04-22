import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { User, Package, MapPin, Lock, ChevronRight } from 'lucide-react'
import { updateProfile } from '../store/authSlice'
import toast from 'react-hot-toast'

const formatPrice = (p) => `$${Number(p).toFixed(2)}`
const getOrders = (email) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}')
  return all[email] || []
}

const profileSchema = yup.object({ name: yup.string().min(2).required('Name required'), phone: yup.string().optional() })
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Required'),
  newPassword: yup.string().min(6).required('Min 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required(),
})

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'password', label: 'Password', icon: Lock },
]

export default function ProfilePage() {
  const dispatch = useDispatch()
  const currentUser = useSelector(s => s.auth?.currentUser)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')
  const [orders, setOrders] = useState([])

  useEffect(() => { if (currentUser?.email) setOrders(getOrders(currentUser.email)) }, [currentUser])
  useEffect(() => { const t = searchParams.get('tab'); if (t) setActiveTab(t) }, [searchParams])

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: currentUser?.name || '', phone: currentUser?.phone || '' },
  })

  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: pwdErrors }, reset: resetPwd } = useForm({
    resolver: yupResolver(passwordSchema),
  })

  const onProfileSave = (data) => {
    dispatch(updateProfile(data))
    toast.success('Profile updated!')
  }

  const onPasswordChange = (data) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === currentUser?.email)
    if (!user || user.password !== data.currentPassword) { toast.error('Current password is incorrect'); return }
    const updated = users.map(u => u.email === currentUser.email ? { ...u, password: data.newPassword } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    toast.success('Password changed!')
    resetPwd()
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>{currentUser?.name}</h1>
            <p className="text-gray-500 text-sm">{currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white shadow-sm">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setActiveTab(id); setSearchParams({ tab: id }) }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
                style={{ borderLeft: activeTab === id ? '2px solid #c9a84c' : '2px solid transparent', color: activeTab === id ? '#c9a84c' : '#1a1a1a', backgroundColor: activeTab === id ? '#fdf8f0' : 'transparent' }}>
                <span className="flex items-center gap-2"><Icon size={16} />{label}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white p-6 shadow-sm">
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a' }}>Edit Profile</h2>
                <form onSubmit={handleProfile(onProfileSave)} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                    <input {...regProfile('name')} className="input-field" />
                    {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email</label>
                    <input value={currentUser?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</label>
                    <input {...regProfile('phone')} placeholder="+1 234 567 8900" className="input-field" />
                  </div>
                  <button type="submit" className="px-8 py-3 text-sm uppercase tracking-widest text-white font-medium" style={{ backgroundColor: '#c9a84c' }}>Save Changes</button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a' }}>Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 p-4">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div>
                            <p className="font-mono text-sm font-bold" style={{ color: '#c9a84c' }}>{order.id}</p>
                            <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1">{order.status}</span>
                            <p className="font-bold text-charcoal mt-1">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover" />
                          ))}
                          {order.items?.length > 3 && <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-500">+{order.items.length - 3}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a' }}>Saved Addresses</h2>
                {orders.length > 0 && orders[0].shippingData ? (
                  <div className="border border-gray-200 p-4 max-w-sm">
                    <span className="text-xs text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: '#c9a84c' }}>Default</span>
                    <p className="font-medium text-charcoal">{orders[0].shippingData.name}</p>
                    <p className="text-sm text-gray-500">{orders[0].shippingData.address}</p>
                    <p className="text-sm text-gray-500">{orders[0].shippingData.city}, {orders[0].shippingData.state} {orders[0].shippingData.zip}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No saved addresses. Complete a checkout to save your address.</p>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a1a' }}>Change Password</h2>
                <form onSubmit={handlePwd(onPasswordChange)} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Current Password</label>
                    <input {...regPwd('currentPassword')} type="password" className="input-field" />
                    {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">New Password</label>
                    <input {...regPwd('newPassword')} type="password" className="input-field" />
                    {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Confirm New Password</label>
                    <input {...regPwd('confirmPassword')} type="password" className="input-field" />
                    {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" className="px-8 py-3 text-sm uppercase tracking-widest text-white font-medium" style={{ backgroundColor: '#c9a84c' }}>Update Password</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
