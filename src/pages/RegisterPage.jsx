import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { register as registerUser, login } from '../store/authSlice'
import toast from 'react-hot-toast'

const schema = yup.object({
  name: yup.string().min(2, 'Min 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm password'),
})

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(s => s.auth?.isAuthenticated)

  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data) => {
    try {
      dispatch(registerUser({ name: data.name, email: data.email, password: data.password }))
      dispatch(login({ email: data.email, password: data.password }))
      toast.success(`Welcome to LUXÉRA, ${data.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ paddingTop: '80px' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1a1a1a' }}>Create Account</h1>
          <p className="text-gray-500 mt-2">Join LUXÉRA for exclusive access</p>
        </div>
        <div className="bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
              <input {...register('name')} placeholder="John Doe" className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email Address</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Password</label>
              <input {...register('password')} type="password" placeholder="Min 6 characters" className="input-field" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="input-field" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 text-sm uppercase tracking-widest text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#c9a84c' }}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Already have an account? <Link to="/login" className="font-medium hover:underline" style={{ color: '#c9a84c' }}>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
