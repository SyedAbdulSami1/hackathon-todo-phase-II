# Authentication Skill

A comprehensive, production-ready authentication system for React/Next.js applications with TypeScript support.

## Features

- 🔐 Multiple authentication providers (Email/Password, OAuth, Social Login)
- 🔐 JWT token management with refresh tokens
- 🔐 Session persistence with automatic refresh
- 🔐 Role-based access control (RBAC)
- 🔐 Protected routes and route guards
- 🔐 Rate limiting and security features
- 🔐 Complete error handling and validation
- 🔐 Mobile-friendly responsive UI
- 🔐 TypeScript support with strict type safety

## Quick Start

```typescript
import { AuthProvider, useAuth, ProtectedRoute } from '@/components/auth'

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  )
}

// Use auth hook
function LoginComponent() {
  const { login, isLoading } = useAuth()
  // ... implement login UI
}

// Protect routes
function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

## Supported Authentication Methods

1. **Email/Password**
   - Registration and login
   - Email verification
   - Password reset
   - Password strength validation

2. **OAuth Providers**
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth
   - Custom OAuth providers

3. **Social Login**
   - Facebook Login
   - Twitter Login
   - LinkedIn Login

4. **Magic Link**
   - Email-based login
   - One-time access links

## Components

### AuthProvider
Main provider component that wraps your application.

```typescript
<AuthProvider
  config={{
    providers: ['email', 'google'],
    storage: 'localStorage',
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
  }}
>
  {children}
</AuthProvider>
```

### AuthForm
Multi-purpose authentication form.

```typescript
<AuthForm
  mode="login" // 'login' | 'register' | 'forgot-password'
  onSubmit={handleAuth}
  providers={['email', 'google']}
  className="auth-form"
/>
```

### ProtectedRoute
Route protection component.

```typescript
<ProtectedRoute
  requiredRole="admin"
  fallback={<Unauthorized />}
>
  <AdminDashboard />
</ProtectedRoute>
```

### AuthProviderButton
Social login buttons.

```typescript
<AuthProviderButton provider="google" onClick={handleGoogleLogin}>
  Continue with Google
</AuthProviderButton>
```

## Hooks

### useAuth
Main auth hook.

```typescript
const {
  user,
  isLoading,
  isAuthenticated,
  login,
  register,
  logout,
  refreshToken,
  updateProfile,
  changePassword,
} = useAuth()
```

### useAuthState
React to auth state changes.

```typescript
const { isAuthenticated, user } = useAuthState()
```

### usePermissions
Check user permissions.

```typescript
const hasPermission = usePermissions('read:posts')
```

## API Integration

### Backend API Response Format

```typescript
// Login response
{
  success: true,
  data: {
    user: {
      id: 'user123',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user'
    },
    tokens: {
      accessToken: 'jwt-token',
      refreshToken: 'refresh-token',
      expiresAt: '2024-12-31T23:59:59Z'
    }
  }
}

// Error response
{
  success: false,
  error: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password'
  }
}
```

### Configure API Client

```typescript
// lib/auth-config.ts
export const authConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
  storage: localStorage,
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  redirectPath: '/dashboard',
  loginPath: '/login',
}
```

## Security Features

### Rate Limiting
```typescript
// Built-in rate limiting for auth endpoints
const rateLimitConfig = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts'
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  }
}
```

### Session Security
- JWT with configurable expiration
- Refresh token rotation
- Automatic token refresh
- Session timeout detection
- Secure cookie options

### Password Security
- bcrypt password hashing
- Password strength validation
- Rate limiting on auth attempts
- Account lockout after failed attempts
- Password reset tokens with expiration

## Customization

### Theme Customization
```typescript
<AuthProvider
  theme={{
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      error: '#EF4444',
    },
    borderRadius: '0.5rem',
  }}
>
  {children}
</AuthProvider>
```

### Custom Providers
```typescript
const customProvider = {
  id: 'custom',
  name: 'Custom Login',
  icon: CustomIcon,
  handler: handleCustomLogin,
}

<AuthProvider providers={[customProvider]} />
```

### Custom Validators
```typescript
const customValidators = {
  email: (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  password: (password: string) => {
    return password.length >= 8
  }
}
```

## Events

The system emits events for reactive updates.

```typescript
// Listen to auth events
auth.on('login', (user) => {
  console.log('User logged in:', user)
})

auth.on('logout', () => {
  console.log('User logged out')
})

auth.on('token-refresh', (tokens) => {
  console.log('Token refreshed:', tokens)
})
```

## Error Handling

### Common Error Codes
- `INVALID_CREDENTIALS` - Invalid username/password
- `EMAIL_VERIFIED` - Email already verified
- `ACCOUNT_LOCKED` - Account temporarily locked
- `TOKEN_EXPIRED` - Access token expired
- `REFRESH_TOKEN_EXPIRED` - Refresh token expired
- `PERMISSION_DENIED` - Insufficient permissions

### Error Boundary
```typescript
<ErrorBoundary fallback={<AuthErrorFallback />}>
  <AuthProvider>
    {children}
  </AuthProvider>
</ErrorBoundary>
```

## Migration Guide

### From Firebase Auth
```typescript
// Replace Firebase auth provider
import { FirebaseProvider } from '@/components/auth/firebase'

// Use built-in provider
<AuthProvider providers={['email', 'google']} />
```

### From Auth0
```typescript
// Replace Auth0 configuration
const authConfig = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Implement rate limiting** on auth endpoints
3. **Use refresh tokens** for better security
4. **Set secure cookies** in production
5. **Validate all input** on client and server
6. **Implement proper error handling**
7. **Use environment variables** for sensitive data
8. **Enable email verification** for new accounts
9. **Monitor auth events** for suspicious activity
10. **Regular security audits**

## Troubleshooting

### Common Issues
- **Token not persisting**: Check storage configuration
- **OAuth callback error**: Verify redirect URIs in provider settings
- **Session timeout**: Adjust refresh threshold settings
- **CORS issues**: Configure CORS on backend

### Debug Mode
```typescript
<AuthProvider debug={process.env.NODE_ENV === 'development'}>
  {children}
</AuthProvider>
```

## Examples

### Complete Login Flow
```typescript
// pages/login.tsx
export default function LoginPage() {
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (data: LoginData) => {
    try {
      await login(data)
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
```

### Protected Route with Role Check
```typescript
// components/admin-route.tsx
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user?.role?.includes('admin')) {
    return <Unauthorized />
  }

  return <>{children}</>
}
```

### Multi-factor Authentication
```typescript
// Enable MFA
const { enableMFA, verifyMFA } = useAuth()

// Setup MFA
await enableMFA({
  method: 'totp',
  secret: mfaSecret,
})

// Verify MFA
await verifyMFA({
  code: userEnteredCode,
})
```

This skill provides everything needed for secure authentication in modern web applications.