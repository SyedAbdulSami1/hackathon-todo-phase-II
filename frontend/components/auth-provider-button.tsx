'use client'

import React, { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface ProviderConfig {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  textColor: string
}

interface AuthProviderButtonProps {
  provider: string
  onClick: (provider: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  disabled?: boolean
  text?: string
  showLoading?: boolean
  autoTrigger?: boolean
}

// Predefined provider configurations
export const PROVIDERS: Record<string, ProviderConfig> = {
  google: {
    id: 'google',
    name: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    color: 'bg-white',
    hoverColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
    color: 'bg-gray-900',
    hoverColor: 'bg-gray-800',
    textColor: 'text-white',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'bg-blue-600',
    hoverColor: 'bg-blue-700',
    textColor: 'text-white',
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    color: 'bg-blue-400',
    hoverColor: 'bg-blue-500',
    textColor: 'text-white',
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <rect x="0" y="0" width="12" height="12" fill="#F25022"/>
        <rect x="12" y="0" width="12" height="12" fill="#00A4EF"/>
        <rect x="0" y="12" width="12" height="12" fill="#7FBA00"/>
        <rect x="12" y="12" width="12" height="12" fill="#FFB900"/>
      </svg>
    ),
    color: 'bg-gray-100',
    hoverColor: 'bg-gray-200',
    textColor: 'text-gray-700',
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    color: 'bg-black',
    hoverColor: 'bg-gray-900',
    textColor: 'text-white',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'bg-blue-700',
    hoverColor: 'bg-blue-800',
    textColor: 'text-white',
  },
}

export function AuthProviderButton({
  provider,
  onClick,
  className,
  size = 'md',
  variant = 'default',
  disabled = false,
  text,
  showLoading = true,
  autoTrigger = false,
}: AuthProviderButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const providerConfig = PROVIDERS[provider]

  if (!providerConfig) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unknown provider: {provider}
        </AlertDescription>
      </Alert>
    )
  }

  const handleClick = async () => {
    if (disabled) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      onClick(provider)
      setSuccess(true)

      // Auto redirect after success
      if (autoTrigger) {
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  }

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    {
      'default': {
        [providerConfig.color]: !disabled,
        [providerConfig.hoverColor]: !disabled,
        [providerConfig.textColor]: !disabled,
        'focus:ring-offset-gray-900': providerConfig.textColor.includes('white'),
        'focus:ring-offset-white': providerConfig.textColor.includes('gray'),
      },
      'outline': {
        'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
        'focus:ring-offset-white',
      },
      'ghost': {
        'bg-transparent text-gray-700 hover:bg-gray-100',
        'focus:ring-offset-white',
      },
    }[variant],
    className
  )

  return (
    <div className="w-full">
      <Button
        className={baseClasses}
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={variant as any}
      >
        {isLoading && showLoading && (
          <Loader2 className="animate-spin h-4 w-4" />
        )}
        {!isLoading && providerConfig.icon}
        <span>
          {text || `Continue with ${providerConfig.name}`}
        </span>
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-2 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Successfully authenticated with {providerConfig.name}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Group of provider buttons
interface AuthProviderGroupProps {
  providers: string[]
  onProviderClick: (provider: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  layout?: 'horizontal' | 'vertical'
  showLabels?: boolean
}

export function AuthProviderGroup({
  providers,
  onProviderClick,
  className,
  size = 'md',
  variant = 'default',
  layout = 'horizontal',
  showLabels = true,
}: AuthProviderGroupProps) {
  const layoutClasses = {
    horizontal: 'flex flex-col space-y-2',
    vertical: 'flex flex-row space-x-2',
  }

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {providers.map((provider) => (
        <AuthProviderButton
          key={provider}
          provider={provider}
          onClick={onProviderClick}
          size={size}
          variant={variant}
          text={showLabels ? undefined : ''}
        />
      ))}
    </div>
  )
}

// Custom provider support
interface CustomProviderButtonProps extends Omit<AuthProviderButtonProps, 'provider'> {
  provider: {
    id: string
    name: string
    icon: React.ReactNode
    color?: string
    hoverColor?: string
    textColor?: string
  }
}

export function CustomProviderButton({
  provider,
  ...props
}: CustomProviderButtonProps) {
  // Add custom provider to the PROVIDERS object temporarily
  const customConfig: ProviderConfig = {
    id: provider.id,
    name: provider.name,
    icon: provider.icon,
    color: provider.color || 'bg-gray-100',
    hoverColor: provider.hoverColor || 'bg-gray-200',
    textColor: provider.textColor || 'text-gray-700',
  }

  // Temporarily override the provider
  const originalProvider = PROVIDERS[provider.id]
  PROVIDERS[provider.id] = customConfig

  try {
    return (
      <AuthProviderButton
        provider={provider.id}
        {...props}
      />
    )
  } finally {
    // Restore original provider if it existed
    if (originalProvider) {
      PROVIDERS[provider.id] = originalProvider
    } else {
      delete PROVIDERS[provider.id]
    }
  }
}

// Example usage:
/*
// Single provider button
<AuthProviderButton
  provider="google"
  onClick={handleGoogleLogin}
  text="Sign in with Google"
/>

// Multiple providers in a group
<AuthProviderGroup
  providers={['google', 'github', 'facebook']}
  onProviderClick={handleProviderLogin}
  layout="horizontal"
/>

// Custom provider
<CustomProviderButton
  provider={{
    id: 'custom',
    name: 'Custom Login',
    icon: <CustomIcon />,
    color: 'bg-purple-600',
    hoverColor: 'bg-purple-700',
    textColor: 'text-white'
  }}
  onClick={handleCustomLogin}
/>
*/