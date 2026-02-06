'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { LoginRequest, RegisterRequest } from '@/types'

interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password'
  onSubmit: (data: LoginRequest | RegisterRequest) => Promise<void>
  providers?: string[]
  className?: string
  isLoading?: boolean
  error?: string
  onSuccess?: () => void
}

export function AuthForm({
  mode,
  onSubmit,
  providers = [],
  className,
  isLoading = false,
  error,
  onSuccess,
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let data: LoginRequest | RegisterRequest

      if (mode === 'login') {
        data = { email: formData.email, password: formData.password }
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        data = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }
      } else {
        data = { email: formData.email }
      }

      await onSubmit(data)
      onSuccess?.()
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getFormTitle = () => {
    switch (mode) {
      case 'login':
        return 'Welcome Back'
      case 'register':
        return 'Create Account'
      case 'forgot-password':
        return 'Reset Password'
      default:
        return 'Authentication'
    }
  }

  const getFormDescription = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your account'
      case 'register':
        return 'Join us today'
      case 'forgot-password':
        return 'We\'ll send you a link to reset your password'
      default:
        return 'Authentication required'
    }
  }

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'login':
        return 'Sign In'
      case 'register':
        return 'Create Account'
      case 'forgot-password':
        return 'Send Reset Link'
      default:
        return 'Submit'
    }
  }

  return (
    <div className={cn('flex items-center justify-center min-h-screen p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{getFormTitle()}</CardTitle>
          <CardDescription>{getFormDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {mode !== 'login' && mode !== 'forgot-password' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={mode === 'register'}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={mode === 'register'}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                getSubmitButtonText()
              )}
            </Button>
          </form>

          {providers.length > 0 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {providers.map((provider) => (
                  <ProviderButton
                    key={provider}
                    provider={provider}
                    onClick={() => handleProviderClick(provider)}
                  />
                ))}
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          )}

          {mode === 'register' && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ProviderButtonProps {
  provider: string
  onClick: (provider: string) => void
}

function ProviderButton({ provider, onClick }: ProviderButtonProps) {
  const providerConfig = {
    google: {
      icon: '🔍',
      color: 'bg-white hover:bg-gray-50 border-gray-300',
      textColor: 'text-gray-700',
      label: 'Google',
    },
    github: {
      icon: '🐙',
      color: 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900',
      label: 'GitHub',
    },
    facebook: {
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
      label: 'Facebook',
    },
    twitter: {
      icon: '🐦',
      color: 'bg-blue-400 hover:bg-blue-500 text-white border-blue-400',
      label: 'Twitter',
    },
    microsoft: {
      icon: '🪟',
      color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
      label: 'Microsoft',
    },
  }

  const config = providerConfig[provider as keyof typeof providerConfig] || providerConfig.google

  const handleProviderClick = () => {
    // Implement OAuth login
    onClick(provider)
  }

  return (
    <Button
      variant="outline"
      className={cn(
        'flex items-center justify-center gap-2',
        config.color,
        config.textColor,
        'border',
      )}
      onClick={handleProviderClick}
    >
      <span className="text-lg">{config.icon}</span>
      {config.label}
    </Button>
  )
}

// Password strength indicator component
interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = (pwd: string): { score: number; text: string; color: string } => {
    if (!pwd) return { score: 0, text: '', color: '' }

    let score = 0
    const feedback: string[] = []

    // Length check
    if (pwd.length >= 8) {
      score += 1
    } else {
      feedback.push('8+ characters')
    }

    // Character types
    if (/[a-z]/.test(pwd)) score += 1
    else feedback.push('lowercase letter')

    if (/[A-Z]/.test(pwd)) score += 1
    else feedback.push('uppercase letter')

    if (/\d/.test(pwd)) score += 1
    else feedback.push('number')

    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1
    else feedback.push('special character')

    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['text-red-600', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500', 'text-green-600']

    return {
      score,
      text: strengthTexts[score],
      color: colors[score],
    }
  }

  const { score, text, color } = getStrength(password)

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              score === 0 && 'w-0',
              score === 1 && 'w-1/6 bg-red-500',
              score === 2 && 'w-2/6 bg-orange-500',
              score === 3 && 'w-3/6 bg-yellow-500',
              score === 4 && 'w-4/6 bg-blue-500',
              score === 5 && 'w-5/6 bg-green-500',
              score === 6 && 'w-full bg-green-600',
            )}
          />
        </div>
        {password && (
          <span className={cn('text-sm font-medium', color)}>
            {text}
          </span>
        )}
      </div>
      {password && score < 4 && (
        <p className="text-xs text-gray-500">
          Include: {['8+ characters', 'lowercase', 'uppercase', 'number', 'special'].filter(req => !password.match(new RegExp(req.replace(/\s/g, '|')))).join(', ')}
        </p>
      )}
    </div>
  )
}