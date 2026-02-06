import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/components/auth-provider'
import { AuthForm, PasswordStrengthIndicator } from '@/components/auth-form'
import { AuthProviderGroup } from '@/components/auth-provider-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { validateForm, emailSchema, passwordSchema } from '@/lib/validations'

// This is the actual login page component
export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!loginData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailSchema.safeParse(loginData.email).success) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!loginData.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordSchema.safeParse(loginData.password).success) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await login(loginData)
      setShowSuccess(true)

      // Redirect after successful login
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error: any) {
      setErrors({
        form: error.message || 'Login failed. Please check your credentials.'
      })
    }
  }

  const handleProviderLogin = async (provider: string) => {
    // Implement OAuth login
    console.log('Logging in with:', provider)
    // Redirect to OAuth provider
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Message */}
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Login successful! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      const input = document.getElementById('password') as HTMLInputElement
                      input.type = input.type === 'password' ? 'text' : 'password'
                    }}
                  >
                    {document.getElementById('password')?.getAttribute('type') === 'password' ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Form Error */}
              {errors.form && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.form}</AlertDescription>
                </Alert>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <AuthProviderGroup
              providers={['google', 'github', 'facebook']}
              onProviderClick={handleProviderLogin}
              size="md"
              className="space-y-2"
            />

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}

// Wrap the page with AuthProvider
LoginPage.layout = function Layout(page: React.ReactElement) {
  return (
    <AuthProvider>
      {page}
    </AuthProvider>
  )
}